"""Build core and merged fonts without Glyphs.app, using checked-in sources."""

import argparse
from copy import deepcopy
import hashlib
import json
import logging
from pathlib import Path
from shutil import copyfile
from time import perf_counter

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont
from font_sources import core_font

ROOT = Path(__file__).resolve().parents[1]
EPOCH = 3786912000  # 2024-01-01, OpenType epoch (1904)


def vertical_mapping(font):
    mapping = {}
    if "GSUB" not in font:
        return mapping
    table = font["GSUB"].table
    for record in table.FeatureList.FeatureRecord:
        if record.FeatureTag not in ("vert", "vrt2"):
            continue
        for index in record.Feature.LookupListIndex:
            for subtable in table.LookupList.Lookup[index].SubTable:
                subtable = getattr(subtable, "ExtSubTable", subtable)
                mapping.update(getattr(subtable, "mapping", {}))
    return mapping


def replace_glyph(base, target, core, source):
    glyphs = core.getGlyphSet()
    if "glyf" in base:
        pen = TTGlyphPen(glyphs)
        glyphs[source].draw(pen)
        outline = pen.glyph()
        outline.recalcBounds(base["glyf"])
        base["glyf"][target] = outline
        for key, value in (("maxPoints", len(outline.coordinates)), ("maxContours", outline.numberOfContours)):
            setattr(base["maxp"], key, max(getattr(base["maxp"], key), value))
    else:
        strings = base["CFF "].cff.topDictIndex[0].CharStrings
        original = strings[target]
        width = core["hmtx"][source][0] - original.private.nominalWidthX
        pen = T2CharStringPen(width, glyphs)
        glyphs[source].draw(pen)
        strings[target] = pen.getCharString(original.private, original.globalSubrs)
    base["hmtx"][target] = core["hmtx"][source]
    if "vmtx" in base and "vmtx" in core:
        base["vmtx"][target] = core["vmtx"][source]
    # Unchanged glyphs keep their compiled outlines and bounding boxes. Expand
    # global bounds for replacements instead of decoding every CJK glyph again.
    outline = core["glyf"][source]
    xmin, ymin, xmax, ymax = [getattr(outline, key, 0) for key in ("xMin", "yMin", "xMax", "yMax")]
    for key, value, operation in (("xMin", xmin, min), ("yMin", ymin, min), ("xMax", xmax, max), ("yMax", ymax, max)):
        setattr(base["head"], key, operation(getattr(base["head"], key), value))
    width, left = core["hmtx"][source]
    header = base["hhea"]
    header.advanceWidthMax = max(header.advanceWidthMax, width)
    header.minLeftSideBearing = min(header.minLeftSideBearing, left)
    header.minRightSideBearing = min(header.minRightSideBearing, width - left - (xmax - xmin))
    header.xMaxExtent = max(header.xMaxExtent, left + xmax - xmin)
    if "vhea" in base and "vmtx" in core:
        height, top = core["vmtx"][source]
        header = base["vhea"]
        header.advanceHeightMax = max(header.advanceHeightMax, height)
        header.minTopSideBearing = min(header.minTopSideBearing, top)
        header.minBottomSideBearing = min(header.minBottomSideBearing, height - top - (ymax - ymin))
        header.yMaxExtent = max(header.yMaxExtent, top + ymax - ymin)
        if "VORG" in base:
            origins = base["VORG"]
            origins[target] = ymax + top
    if "CFF " in base:
        top = base["CFF "].cff.topDictIndex[0]
        a, b, c, d = top.FontBBox
        top.FontBBox = [min(a, xmin), min(b, ymin), max(c, xmax), max(d, ymax)]


def remove_spacing_adjustments(font, replaced):
    """Already narrowed punctuation must not receive base-font palt/half-width offsets."""
    if "GPOS" not in font:
        return
    table = font["GPOS"].table
    indices = {index for record in table.FeatureList.FeatureRecord
               if record.FeatureTag in ("palt", "halt", "vpal", "vhal")
               for index in record.Feature.LookupListIndex}
    for index in indices:
        for subtable in table.LookupList.Lookup[index].SubTable:
            subtable = getattr(subtable, "ExtSubTable", subtable)
            if not hasattr(subtable, "ValueFormat"):
                raise ValueError("Unsupported spacing adjustment lookup")
            keep = [i for i, name in enumerate(subtable.Coverage.glyphs) if name not in replaced]
            subtable.Coverage.glyphs = [subtable.Coverage.glyphs[i] for i in keep]
            if subtable.Format == 2:
                subtable.Value = [subtable.Value[i] for i in keep]
                subtable.ValueCount = len(keep)


def merged_font(path, core, family, style):
    base = TTFont(path, recalcTimestamp=False)
    if base["head"].unitsPerEm != core["head"].unitsPerEm:
        raise ValueError(f"Incompatible unitsPerEm: {path}")
    cmap = base.getBestCmap()
    base_vert, core_vert = vertical_mapping(base), vertical_mapping(core)
    replaced = set()
    for codepoint, source in core.getBestCmap().items():
        target = cmap[codepoint]
        replace_glyph(base, target, core, source)
        replaced.add(target)
        if source in core_vert:
            if target not in base_vert:
                raise ValueError(f"Missing vertical glyph: {path} U+{codepoint:04X}")
            replace_glyph(base, base_vert[target], core, core_vert[source])
            replaced.add(base_vert[target])
    remove_spacing_adjustments(base, replaced)
    base.recalcBBoxes = False
    names = base["name"]
    ps_name = f"Merged{family}-{style}"
    core_names = core["name"]
    family_name = "Merged " + (core_names.getDebugName(16) or core_names.getDebugName(1))
    legacy_family = "Merged " + core_names.getDebugName(1)
    for record in list(names.names):
        value = {1: legacy_family, 2: core_names.getDebugName(2), 3: ps_name, 4: f"{family_name} {style}",
                 6: ps_name, 16: family_name, 17: style}.get(record.nameID)
        if value is not None:
            names.setName(value, record.nameID, record.platformID, record.platEncID, record.langID)
    if "CFF " in base:
        cff = base["CFF "].cff
        cff.fontNames = [ps_name]
        cff.topDictIndex[0].FamilyName = family_name
        cff.topDictIndex[0].FullName = f"{family_name} {style}"
    return base


def convert(font, extension):
    if (extension == "ttf" and "glyf" in font) or (extension == "otf" and "CFF " in font):
        return font
    font = deepcopy(font)
    font.recalcBBoxes = True
    glyphs = font.getGlyphSet()
    if extension == "otf" and "glyf" in font:
        strings = {}
        for name in font.getGlyphOrder():
            pen = T2CharStringPen(font["hmtx"][name][0], glyphs)
            glyphs[name].draw(pen)
            strings[name] = pen.getCharString()
        for tag in ("glyf", "loca", "fpgm", "prep", "cvt ", "gasp"):
            if tag in font:
                del font[tag]
        builder = FontBuilder(font=font, isTTF=False)
        builder.setupCFF(font["name"].getDebugName(6), {}, strings, {})
        builder.setupMaxp()
        font["post"].formatType = 3.0
    elif extension == "ttf" and "CFF " in font:
        outlines = {}
        for name in font.getGlyphOrder():
            pen = TTGlyphPen(glyphs)
            glyphs[name].draw(Cu2QuPen(pen, max_err=1.0, reverse_direction=True))
            outlines[name] = pen.glyph()
        del font["CFF "]
        if "VORG" in font:
            del font["VORG"]
        font.sfntVersion = "\x00\x01\x00\x00"
        builder = FontBuilder(font=font, isTTF=True)
        builder.isTTF = True
        builder.setupGlyf(outlines)
        builder.setupMaxp()
        font["post"].formatType = 3.0
    return font


def save(font, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    font.recalcTimestamp = False
    font["head"].created = font["head"].modified = EPOCH
    font.save(path)


def file_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def build(output, families=None, weights=None, target="all", merged_format="native", force=False, *, cache_root=None):
    project = json.loads((ROOT / "packages/yakuhanjp/project.json").read_text())
    output = output.resolve()
    cache_root = (cache_root or ROOT / "build/fonts").resolve()
    cache_root.mkdir(parents=True, exist_ok=True)
    cache_path = cache_root / ".font-build-cache.json"
    cache = json.loads(cache_path.read_text()) if cache_path.exists() else {}
    tool_hashes = [file_hash(Path(__file__)), file_hash(ROOT / "scripts/font_sources.py"), file_hash(ROOT / "uv.lock")]
    built, skipped, copied = 0, 0, 0
    started = perf_counter()
    for item in project["fonts"]:
        family = item["file"]
        if families and family not in families:
            continue
        for weight, style in item["weights"].items():
            if weights and weight not in weights:
                continue
            source = ROOT / f"packages/core/{family}/sources/{style}.json"
            recipe = json.loads(source.read_text())
            base_path = ROOT / "resource" / recipe["baseFont"]
            native_extension = base_path.suffix[1:]
            extensions = ("ttf", "otf") if merged_format == "both" else (native_extension if merged_format == "native" else merged_format,)
            tasks = [name for name in ("core", "merged") if target in ("all", name)]
            core = None
            for name in tasks:
                formats = ("ttf", "otf", "woff2") if name == "core" else extensions
                prefix = "" if name == "core" else "Merged"
                inputs = tool_hashes + [file_hash(source), file_hash(source.parent / recipe["outlines"])]
                if name == "merged" or any("source" in entry for entry in recipe["glyphs"].values()):
                    inputs.append(file_hash(base_path))
                fingerprint = hashlib.sha256(json.dumps(inputs).encode()).hexdigest()
                merged = None
                for extension in formats:
                    relative = Path(f"{name}/{family}/{extension}/{prefix}{family}-{style}.{extension}")
                    path = cache_root / relative
                    key = relative.as_posix()
                    previous = cache.get(key, {})
                    valid = (not force and previous.get("input") == fingerprint and path.exists()
                             and previous.get("output") == file_hash(path))
                    if valid:
                        print(f"Skipped {name} {family} {style} {extension} (unchanged)", flush=True)
                        skipped += 1
                    else:
                        stage_started = perf_counter()
                        if core is None:
                            core = core_font(source)
                        if name == "core":
                            font = convert(core, "ttf" if extension == "woff2" else extension)
                            font.flavor = "woff2" if extension == "woff2" else None
                        else:
                            if merged is None:
                                merged = merged_font(base_path, core, family, style)
                            font = convert(merged, extension)
                        save(font, path)
                        font.flavor = None
                        cache[key] = {"input": fingerprint, "output": file_hash(path)}
                        built += 1
                        print(f"Built {name} {family} {style} {extension} ({perf_counter() - stage_started:.2f}s)", flush=True)
                    destination = output / relative
                    if output != cache_root and (not destination.exists() or file_hash(destination) != cache[key]["output"]):
                        destination.parent.mkdir(parents=True, exist_ok=True)
                        copyfile(path, destination)
                        copied += 1
                        print(f"Copied {relative.as_posix()}", flush=True)
                if merged is not None:
                    merged.close()
    cache_path.write_text(json.dumps(cache, indent=2) + "\n")
    print(f"Done: {built} built, {skipped} skipped, {copied} copied ({perf_counter() - started:.2f}s)")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "build/fonts", help="Copy verified artifacts here; build/cache stays in build/fonts")
    parser.add_argument("--family", action="append", choices=["YakuHanJP", "YakuHanJPs", "YakuHanMP", "YakuHanMPs", "YakuHanRP", "YakuHanRPs"])
    parser.add_argument("--weight", action="append", choices=[str(n) for n in range(100, 1000, 100)])
    parser.add_argument("--target", choices=["all", "core", "merged"], default="all")
    parser.add_argument("--merged-format", choices=["native", "both", "ttf", "otf"], default="native")
    parser.add_argument("--force", action="store_true", help="Rebuild even when inputs and outputs are unchanged")
    args = parser.parse_args()
    logging.basicConfig(level=logging.ERROR)
    build(args.output.resolve(), args.family, args.weight, args.target, args.merged_format, args.force)


if __name__ == "__main__":
    main()
