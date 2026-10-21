"""Build a punctuation font from editable spacing recipes and outline snapshots."""

import json
from pathlib import Path

from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools.fontBuilder import FontBuilder
from fontTools.misc.roundTools import otRound
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.recordingPen import DecomposingRecordingPen, replayRecording
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables.O_S_2f_2 import Panose

ROOT = Path(__file__).resolve().parents[1]


def core_font(source):
    recipe = json.loads(source.read_text())
    metadata = recipe["metadata"]
    outlines = json.loads((source.parent / recipe["outlines"]).read_text())
    base = None
    glyphs, horizontal, vertical, cmap, substitutions = {}, {}, {}, {}, {}
    for name, entry in recipe["glyphs"].items():
        pen = TTGlyphPen(None)
        if "source" in entry:
            if base is None:
                base = TTFont(ROOT / "resource" / recipe["baseFont"])
            origin = entry["source"]
            source_name = origin.get("glyph")
            if source_name is None:
                character = origin["character"]
                if len(character) != 1:
                    raise ValueError(f"{source}: {name}: source.character must be one character")
                source_name = base.getBestCmap()[ord(character)]
            if origin.get("vertical"):
                from build_fonts import vertical_mapping
                source_name = vertical_mapping(base).get(source_name, source_name)
            glyph_set = base.getGlyphSet()
            recording = DecomposingRecordingPen(glyph_set)
            glyph_set[source_name].draw(recording)
            recording.replay(Cu2QuPen(pen, max_err=1.0, reverse_direction="CFF " in base))
        else:
            commands = [(op, tuple(tuple(p) if p is not None else None for p in points))
                        for op, points in outlines[entry.get("outline", name)]]
            replayRecording(commands, pen)
        glyph = pen.glyph()
        glyph.recalcBounds(None)
        xmin, xmax = getattr(glyph, "xMin", 0), getattr(glyph, "xMax", 0)
        left, right = entry.get("left", 0), entry.get("right", 0)
        positioned = TTGlyphPen(None)
        glyph.draw(TransformPen(positioned, (1, 0, 0, 1, left - xmin, entry.get("offsetY", 0))), None)
        glyph = positioned.glyph()
        glyph.recalcBounds(None)
        glyphs[name] = glyph
        width = entry.get("advanceWidth", left + xmax - xmin + right)
        horizontal[name] = (otRound(width), otRound(left))
        height = entry.get("advanceHeight", metadata["unitsPerEm"])
        origin = entry.get("verticalOrigin", metadata["os2"]["sTypoAscender"])
        vertical[name] = (otRound(height), otRound(origin - getattr(glyph, "yMax", 0)))
        for character in entry.get("characters", ""):
            if ord(character) in cmap:
                raise ValueError(f"{source}: duplicate character {character!r}")
            cmap[ord(character)] = name
        if "verticalGlyph" in entry:
            substitutions[name] = entry["verticalGlyph"]

    if next(iter(glyphs), None) != ".notdef":
        raise ValueError(f"{source}: first glyph must be .notdef")
    for target in substitutions.values():
        if target not in glyphs:
            raise ValueError(f"{source}: missing verticalGlyph {target}")
    builder = FontBuilder(metadata["unitsPerEm"], isTTF=True)
    builder.setupGlyphOrder(list(glyphs))
    builder.setupCharacterMap(cmap)
    builder.setupGlyf(glyphs)
    builder.setupHorizontalMetrics(horizontal)
    builder.setupHorizontalHeader(**metadata["hhea"])
    builder.setupVerticalMetrics(vertical)
    builder.setupVerticalHeader(**metadata["vhea"])
    builder.setupNameTable({})
    for record in metadata["names"]:
        builder.font["name"].setName(record["value"], record["nameID"], record["platformID"], record["platEncID"], record["langID"])
    os2 = metadata["os2"].copy()
    panose = Panose()
    panose.__dict__.update(os2["panose"])
    os2["panose"] = panose
    builder.setupOS2(**os2)
    builder.setupPost(**metadata["post"])
    builder.setupHead(**metadata["head"])
    if substitutions:
        rules = "\n".join(f"sub {a} by {b};" for a, b in substitutions.items())
        features = ("languagesystem DFLT dflt;\n"
                    "feature aalt { feature vert; feature vrt2; } aalt;\n"
                    f"feature vert {{ {rules} }} vert;\n"
                    f"feature vrt2 {{ {rules} }} vrt2;")
        addOpenTypeFeaturesFromString(builder.font, features)
    if base:
        base.close()
    return builder.font
