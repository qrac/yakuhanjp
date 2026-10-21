"""Offline, reproducible subset experiments; never updates distribution fonts."""

import argparse
from collections import Counter
import csv
from fractions import Fraction
import hashlib
import json
import logging
import lzma
from pathlib import Path
import unicodedata

from fontTools import __version__ as fonttools_version
from fontTools import subset
from fontTools.ttLib import TTFont
import uharfbuzz as hb

ROOT = Path(__file__).resolve().parents[1]
REVISION = "7cb5fb36add76b83a266d1967536e1a1d3faa513"
DATA_SHA256 = "83982f99f9320ecb7dbfb3e1e796c24623aacb3c447f1b4ab0f01a1bad59300f"
DATA_PATH = "frequencies/alternative-normalizations/tubelex-ja_no-normalization.tsv.xz"
SPECIAL = {"[ __ ]", "<num>", "<cc_desc>", "<email>", "<web>", "<handle>", "<censored>"}
SIZES = (2000, 3000, 4500)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def is_kanji(character):
    name = unicodedata.name(character, "")
    return name.startswith(("CJK UNIFIED IDEOGRAPH-", "CJK COMPATIBILITY IDEOGRAPH-"))


def read_counts(path):
    if digest(path) != DATA_SHA256:
        raise ValueError("TUBELEX input does not match the pinned SHA-256")
    counts = {name: Counter() for name in ("all", "gaming", "news")}
    rows, tokens, excluded = 0, 0, 0
    total = None
    with lzma.open(path, "rt", encoding="utf-8") as stream:
        # Quotes are literal token characters in this TSV, not CSV escaping.
        reader = csv.DictReader(stream, delimiter="\t", quoting=csv.QUOTE_NONE)
        for row in reader:
            word = row["word"]
            if word == "[TOTAL]":
                if total is not None:
                    raise ValueError("Duplicate total row")
                total = int(row["count"])
                continue
            rows += 1
            count = int(row["count"])
            tokens += count
            if word in SPECIAL:
                excluded += count
                continue
            for name, column in (("all", "count"), ("gaming", "count:gaming"), ("news", "count:news")):
                weight = int(row[column])
                for char, occurrences in Counter(word).items():
                    counts[name][char] += weight * occurrences
    if total is None or tokens != total:
        raise ValueError(f"Token total mismatch: {tokens} != {total}")
    return counts, {"word_rows": rows, "token_count": tokens, "excluded_special_token_count": excluded}


def base_characters():
    groups = {
        "ascii": "".join(chr(c) for c in range(0x20, 0x7F)),
        "kana": "".join(chr(c) for a, b in ((0x3041, 0x3096), (0x3099, 0x309F), (0x30A0, 0x30FF))
                        for c in range(a, b + 1) if unicodedata.category(chr(c)) != "Cn"),
        "width_forms": "".join(chr(c) for c in range(0xFF01, 0xFFA0)),
        "japanese_marks": "　、。々〆〇〈〉《》「」『』【】〔〕〜〝〞〟〻〓",
        "spacing_currency": "\u00a0¥¢£€©®°±×÷−‐‑–—―‘’“”…‥‰′″℃℉№™",
        "ui_symbols": "←↑→↓↔↕⇒⇔⇐⇑⇓○●◎◇◆□■△▲▽▼☆★♡♥♠♣♦♪♫✓✔✕✖",
        "numbers_units": "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ㎡㎥㎜㎝㎞㎎㎏㏄㌔㍍㍑㍻㋿",
    }
    core = set()
    for path in sorted((ROOT / "packages/core").glob("*/sources/*.json")):
        for glyph in json.loads(path.read_text())["glyphs"].values():
            core.update(glyph.get("characters", ""))
    groups["core_punctuation"] = "".join(sorted(core))
    return groups


def coverage(characters, counts):
    total = sum(counts.values())
    return round(sum(n for c, n in counts.items() if c in characters) / total * 100, 6) if total else None


def encoded(characters):
    return [f"U+{ord(c):04X}" for c in sorted(characters)]


def shape(hb_font, font, text, direction, features, aliases=None):
    buffer = hb.Buffer()
    buffer.add_str(text)
    buffer.guess_segment_properties()
    buffer.direction = direction
    buffer.language = "ja"
    hb.shape(hb_font, buffer, features)
    order = font.getGlyphOrder()
    aliases = aliases or {}
    return [(aliases.get(order[i.codepoint], order[i.codepoint]), p.x_advance, p.y_advance, p.x_offset, p.y_offset)
            for i, p in zip(buffer.glyph_infos, buffer.glyph_positions)]


def uvs(font, allowed):
    return {(selector, base, glyph) for table in font["cmap"].tables if table.format == 14
            for selector, entries in table.uvsDict.items() for base, glyph in entries if base in allowed}


def measure_font(path, characters, output):
    options = subset.Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.name_legacy = True
    options.glyph_names = True
    options.notdef_outline = True
    # Make extra cmap entries explicit rather than silently adding bidi mirrors.
    options.bidi_closure = False
    with TTFont(path, recalcTimestamp=False) as font:
        allowed = {ord(c) for c in characters} & set(font.getBestCmap())
        expected_uvs = uvs(font, allowed)
        selectors = {s for s, _, _ in expected_uvs}
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=allowed | selectors)
        subsetter.subset(font)
        retained_order = font.getGlyphOrder()[:]
        output.parent.mkdir(parents=True, exist_ok=True)
        font.save(output)
    with TTFont(path) as full, TTFont(output) as reduced:
        # post format 3 fonts acquire new synthetic names after GIDs change.
        aliases = dict(zip(reduced.getGlyphOrder(), retained_order))
        actual_uvs = {(s, b, aliases.get(g, g)) for s, b, g in uvs(reduced, allowed)}
        if set(reduced.getBestCmap()) != allowed or actual_uvs != expected_uvs:
            raise AssertionError(f"cmap/UVS mismatch: {output}")
        for codepoint, glyph in reduced.getBestCmap().items():
            original = full.getBestCmap()[codepoint]
            if aliases[glyph] != original:
                raise AssertionError(f"cmap glyph changed: {output} U+{codepoint:04X}")
            for tag in ("hmtx", "vmtx"):
                if full[tag][original] != reduced[tag][glyph]:
                    raise AssertionError(f"Glyph metrics changed: {output} U+{codepoint:04X}")
        for tag, attrs in (("hhea", ("ascent", "descent", "lineGap")),
                           ("OS/2", ("sTypoAscender", "sTypoDescender", "sTypoLineGap", "usWinAscent", "usWinDescent"))):
            for attr in attrs:
                if getattr(full[tag], attr) != getattr(reduced[tag], attr):
                    raise AssertionError(f"Line metrics changed: {output} {tag}.{attr}")
        full_data, reduced_data = path.read_bytes(), output.read_bytes()
        full_hb, reduced_hb = hb.Font(hb.Face(full_data)), hb.Font(hb.Face(reduced_data))
        text = "".join(c for c in "ABC012あいうガか\u3099ぱパﾊﾟ漢字「」（）！？、。…〜龍剣魔闇絆" if ord(c) in allowed)
        samples = [text] + [chr(b) + chr(s) for s, b, _ in sorted(expected_uvs)]
        checks = 0
        for sample in samples:
            for direction in ("ltr", "ttb"):
                for features in (None, {"palt": True, "halt": True, "vpal": True, "vhal": True}):
                    if shape(full_hb, full, sample, direction, features) != shape(reduced_hb, reduced, sample, direction, features, aliases):
                        raise AssertionError(f"Shaping mismatch: {output} {sample!r}")
                    checks += 1
        return {"source": str(path.relative_to(ROOT)), "source_sha256": digest(path),
                "full_bytes": path.stat().st_size, "subset_bytes": output.stat().st_size,
                "reduction_percent": round((1 - output.stat().st_size / path.stat().st_size) * 100, 2),
                "codepoints": len(allowed), "glyphs": len(reduced.getGlyphOrder()),
                "uvs_sequences": len(expected_uvs), "shaping_checks": checks}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--font-output", type=Path, help="Optional experimental Regular fonts (not for distribution)")
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    if args.font_output and not args.font_output.resolve().is_relative_to(ROOT / "build"):
        parser.error("Experimental fonts must be written below build/")
    logging.getLogger("fontTools.subset").setLevel(logging.ERROR)
    counts, totals = read_counts(args.input)
    kanji = {name: Counter({c: n for c, n in values.items() if is_kanji(c) and n}) for name, values in counts.items()}
    ranking = sorted(kanji["all"], key=lambda c: (-kanji["all"][c], ord(c)))
    # A separate experiment weights the general and gaming distributions equally.
    general_total, gaming_total = sum(kanji["all"].values()), sum(kanji["gaming"].values())
    balanced = sorted(ranking, key=lambda c: (-(Fraction(kanji["all"][c], general_total)
                                              + Fraction(kanji["gaming"][c], gaming_total)), ord(c)))
    groups = base_characters()
    base = set("".join(groups.values()))
    write_json(args.output / "base-groups.json", groups)
    # Preserve the full ranking, including chars unavailable in the source fonts.
    with (args.output / "kanji-ranking.tsv").open("w") as stream:
        stream.write("rank\tcodepoint\tcharacter\tall\tgaming\tnews\n")
        for i, char in enumerate(ranking, 1):
            stream.write(f"{i}\tU+{ord(char):04X}\t{char}\t{kanji['all'][char]}\t{kanji['gaming'][char]}\t{kanji['news'][char]}\n")
    report = {"source_revision": REVISION, "source_path": DATA_PATH, "source_sha256": DATA_SHA256,
              "unicode_version": unicodedata.unidata_version, "fonttools_version": fonttools_version,
              "totals": totals, "base_characters": len(base), "kanji_types": len(ranking),
              "weighted_character_totals": {k: sum(v.values()) for k, v in counts.items()},
              "weighted_kanji_totals": {k: sum(v.values()) for k, v in kanji.items()}, "candidates": {}}
    project = json.loads((ROOT / "packages/yakuhanjp/project.json").read_text())
    font_cmaps = {}
    report["font_inventory"] = {}
    for item in project["fonts"]:
        for style in item["weights"].values():
            path = ROOT / f"packages/merged/{item['file']}/ttf/Merged{item['file']}-{style}.ttf"
            with TTFont(path) as font:
                key = f"{item['file']}/{style}"
                font_cmaps[key] = set(font.getBestCmap())
                report["font_inventory"][key] = {
                    "codepoints": len(font_cmaps[key]), "source_sha256": digest(path),
                    "cmap_sha256": hashlib.sha256(json.dumps(sorted(font_cmaps[key])).encode()).hexdigest(),
                }
    for mode, ordered in (("general", ranking), ("general-gaming", balanced)):
        previous = set()
        for size in SIZES:
            key = f"{mode}-{size}"
            selected = set(ordered[:size])
            characters = base | selected
            if not previous <= characters:
                raise AssertionError("Candidates must be nested")
            previous = characters
            (args.output / f"{key}.txt").write_text("".join(sorted(characters)) + "\n", encoding="utf-8")
            candidate = {"requested_characters": len(characters), "kanji": len(selected),
                         "kanji_coverage_percent": {k: coverage(selected, v) for k, v in kanji.items()},
                         "token_character_coverage_percent": {k: coverage(characters, v) for k, v in counts.items()},
                         "missing_by_family": {}}
            for item in project["fonts"]:
                family = item["file"]
                grouped = {}
                for style in item["weights"].values():
                    missing = tuple(encoded({c for c in characters if ord(c) not in font_cmaps[f"{family}/{style}"]}))
                    grouped.setdefault(missing, []).append(style)
                candidate["missing_by_family"][family] = [
                    {"styles": styles, "missing": list(missing)} for missing, styles in grouped.items()]
            candidate["regular_support"] = {}
            for family in ("YakuHanJP", "YakuHanMP", "YakuHanRP"):
                available = font_cmaps[f"{family}/Regular"]
                supported = {c for c in characters if ord(c) in available}
                candidate["regular_support"][family] = {
                    "missing_base": encoded({c for c in base if ord(c) not in available}),
                    "missing_kanji": encoded({c for c in selected if ord(c) not in available}),
                    "actual_kanji_coverage_percent": {k: coverage(supported, v) for k, v in kanji.items()},
                }
            if args.font_output and mode == "general":
                candidate["fonts"] = []
                for family in ("YakuHanJP", "YakuHanMP", "YakuHanRP"):
                    for ext in ("ttf", "otf"):
                        path = ROOT / f"packages/merged/{family}/{ext}/Merged{family}-Regular.{ext}"
                        output = args.font_output / key / f"{family}-Regular.{ext}"
                        candidate["fonts"].append(measure_font(path, characters, output))
            report["candidates"][key] = candidate
            print(key, candidate["requested_characters"], candidate["kanji_coverage_percent"], flush=True)
    write_json(args.output / "report.json", report)


def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
