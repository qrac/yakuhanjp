"""Evaluate frozen candidate lists on pinned UI/game translations, without training."""

import argparse
import ast
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import unicodedata

from fontTools.ttLib import TTFont
from research_merged_subset import ROOT, coverage, is_kanji, measure_font, write_json

DATA = ROOT / "context/merged-subset-experiment"


def po_strings(text):
    """Read non-fuzzy translated strings; ignore source, headers and obsolete entries."""
    result = []
    for block in re.split(r"\n\s*\n", text):
        if any(line.startswith("#~") or (line.startswith("#,") and "fuzzy" in {v.strip() for v in line.split(",")})
               for line in block.splitlines()):
            continue
        fields, active = {}, None
        for line in block.splitlines():
            match = re.match(r'(msgid|msgid_plural|msgctxt|msgstr(?:\[\d+\])?)\s+(".*")$', line)
            if match:
                active = match[1]
                fields[active] = ast.literal_eval(match[2])
            elif line.startswith('"') and active:
                fields[active] += ast.literal_eval(line)
        if not fields.get("msgid"):
            continue
        result.extend(value for key, value in fields.items() if key.startswith("msgstr") and value)
    return result


def rpy_strings(text):
    """Restricted parser for the pinned translation: say/narration/new strings only."""
    result = []
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith(("#", "old ", "translate ")):
            continue
        match = re.fullmatch(r'(?:new\s+|[A-Za-z_]\w*\s+)?("(?:[^"\\]|\\.)*")(?:\s+nointeract)?', stripped)
        if match:
            value = ast.literal_eval(match[1])
            if value:
                result.append(value)
        elif '"' in stripped:
            # Fail rather than silently skip a new statement syntax on updated inputs.
            raise ValueError(f"Unsupported RenPy translation line: {stripped[:60]}")
    return result


def visible_text(text, kind):
    if kind == "po":
        text = re.sub(r'\[/?(?:b|i|u|s|code|kbd|url|color|font|img|center|right|left|br)(?:=[^\]]*)?\]', '', text)
        text = re.sub(r'%(?:\([^)]+\))?[-+#0 ]*\d*(?:\.\d+)?[sdifouxXeEgGc]', '', text)
    else:
        text = re.sub(r'\{[^{}]*\}', '', text)
        text = re.sub(r'\[[^\[\]]+\]', '', text)
    return ''.join(c for c in text if unicodedata.category(c) not in {'Cc', 'Cf'}
                   and not (0xFE00 <= ord(c) <= 0xFE0F or 0xE0100 <= ord(c) <= 0xE01EF))


def character_record(char, count):
    return {"character": char, "codepoint": f"U+{ord(char):04X}", "count": count,
            "name": unicodedata.name(char, "UNNAMED")}


def evaluate(strings, characters, counts):
    kanji = Counter({c: n for c, n in counts.items() if is_kanji(c)})
    missing = counts.keys() - characters
    return {"character_coverage_percent": coverage(characters, counts),
            "character_type_coverage_percent": round(len(counts.keys() & characters) / len(counts) * 100, 6),
            "kanji_coverage_percent": coverage(characters, kanji),
            "complete_strings": sum(set(text) <= characters for text in strings),
            "complete_string_percent": round(sum(set(text) <= characters for text in strings) / len(strings) * 100, 6),
            "missing": [character_record(c, counts[c]) for c in sorted(missing, key=lambda c: (-counts[c], ord(c)))]}


def omission_manifest(candidate_id, characters, report):
    records = []
    project = json.loads((ROOT / "packages/yakuhanjp/project.json").read_text())
    for item in project["fonts"]:
        for style in item["weights"].values():
            for ext in ("ttf", "otf"):
                path = ROOT / f"packages/merged/{item['file']}/{ext}/Merged{item['file']}-{style}.{ext}"
                with TTFont(path) as font:
                    available = set(map(chr, font.getBestCmap()))
                missing = sorted(characters - available)
                records.append({"candidate": candidate_id, "family": item["file"], "style": style, "format": ext,
                                "source": str(path.relative_to(ROOT)),
                                "source_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                                "requested_count": len(characters), "included_count": len(characters & available),
                                "omitted_count": len(missing), "reason": "元フォント未収録",
                                "omitted": [{"character": c, "codepoint": f"U+{ord(c):04X}"} for c in missing]})
    write_json(report, records)


def base_proposal(output):
    original = json.loads((DATA / 'base-groups.json').read_text())
    reasons = {
        'ascii': ('foundation', '英数字と基本記号'),
        'kana': ('foundation', 'かな・小書き・結合濁点等の日本語表記'),
        'width_forms': ('input_compatibility', '全角英数字と半角カナの入力互換'),
        'japanese_marks': ('foundation', '日本語の約物と繰り返し記号'),
        'spacing_currency': ('ui_text', '空白・通貨・引用符・数値表記'),
        'ui_symbols': ('ui_symbols', '方向・状態等のUI表示'),
        'numbers_units': ('compatibility_symbols', '囲み数字・単位・元号の互換表記'),
        'core_punctuation': ('core_preservation', 'coreの符号化文字を保持。縦書き字形の閉包とは別'),
    }
    extra = {
        'greek_letters': ''.join(chr(c) for a, b in ((0x391, 0x3A9), (0x3B1, 0x3C9))
                                for c in range(a, b + 1) if unicodedata.category(chr(c)) != 'Cn'),
        'math_symbols': '∞≠≒≈≤≥≦≧√∑∏∫∂∆∇∈∉∩∪⊂⊃⊆⊇∀∃∧∨¬',
    }
    reasons.update({'greek_letters': ('ui_math_proposal', 'UIで不足したπ ε τ φだけを列挙せず、大小文字の組で検討'),
                    'math_symbols': ('ui_math_proposal', '数値・範囲・集合等のUI表示を補助。用途からの提案で頻度順ではない')})
    groups = {**original, **extra}
    proposal = {'status': 'proposal_not_approved',
                'scope': 'Original 602 base characters retained; no pruning for font availability.',
                'groups': {key: {'role': reasons[key][0], 'reason': reasons[key][1], 'characters': chars,
                                 'count': len(set(chars))} for key, chars in groups.items()},
                'original_count': len(set(''.join(original.values()))),
                'proposed_count': len(set(''.join(groups.values())))}
    write_json(output / 'base-policy-proposal.json', proposal)
    selected = set((DATA / 'general-3000.txt').read_text().rstrip('\n'))
    selected.update(''.join(extra.values()))
    path = output / 'general-3000-ui-math-draft.txt'
    path.write_text(''.join(sorted(selected)) + '\n')
    return path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--font-output", type=Path, help="Optional draft Regular fonts below build/")
    args = parser.parse_args()
    if args.font_output and not args.font_output.resolve().is_relative_to(ROOT / 'build'):
        parser.error('Experimental fonts must be written below build/')
    args.output.mkdir(parents=True, exist_ok=True)
    draft = base_proposal(args.output)
    manifest = json.loads((DATA / "validation-sources.json").read_text())
    corpus = {}
    for item in manifest["sources"]:
        path = args.source_root / item["local_path"]
        data = path.read_bytes()
        if hashlib.sha256(data).hexdigest() != item["sha256"]:
            raise ValueError(f"Source hash mismatch: {item['local_path']}")
        if item["kind"] == "license":
            continue
        parse = po_strings if item["kind"] == "po" else rpy_strings
        strings = [visible_text(s, item["kind"]) for s in parse(data.decode("utf-8-sig"))]
        corpus[item["dataset"]] = [s for s in strings if s.strip()]
    families = {}
    for family in ("YakuHanJP", "YakuHanMP", "YakuHanRP"):
        with TTFont(ROOT / f"packages/merged/{family}/ttf/Merged{family}-Regular.ttf") as font:
            families[family] = set(map(chr, font.getBestCmap()))
    results = {"sources_manifest_sha256": hashlib.sha256((DATA / "validation-sources.json").read_bytes()).hexdigest(),
               "evaluation_script_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(), "datasets": {}}
    for name, strings in corpus.items():
        counts = Counter(''.join(strings))
        current = {"strings": len(strings), "characters": sum(counts.values()), "character_types": len(counts),
                   "full_fonts": {family: evaluate(strings, available, counts) for family, available in families.items()},
                   "candidates": {}}
        for path in [*sorted(DATA.glob("general-*.txt")), draft]:
            selected = set(path.read_text().rstrip('\n'))
            result = {"candidate_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                      "evaluation_role": "diagnostic_after_inspection" if path == draft else "frozen_candidate_evaluation",
                      "requested": evaluate(strings, selected, counts),
                      "fonts": {family: evaluate(strings, selected & available, counts) for family, available in families.items()}}
            for family, available in families.items():
                eligible = Counter({c: n for c, n in counts.items() if c in available})
                result['fonts'][family]['source_supported_character_coverage_percent'] = coverage(selected & available, eligible)
            current["candidates"][path.stem] = result
        results["datasets"][name] = current
        print(name, len(strings), sum(counts.values()), flush=True)
    write_json(args.output / "validation-report.json", results)
    # A reviewable example of the agreed omission record, for every format/style.
    selected = set((DATA / 'general-3000.txt').read_text().rstrip('\n'))
    omission_manifest("general-3000", selected, args.output / "general-3000-omissions.json")
    selected = set(draft.read_text().rstrip('\n'))
    omission_manifest(draft.stem, selected, args.output / f'{draft.stem}-omissions.json')
    if args.font_output:
        measurements = []
        for family in families:
            for ext in ('ttf', 'otf'):
                path = ROOT / f'packages/merged/{family}/{ext}/Merged{family}-Regular.{ext}'
                measurements.append(measure_font(path, selected, args.font_output / f'{family}-Regular.{ext}'))
        write_json(args.output / 'draft-font-measurements.json', measurements)


if __name__ == "__main__":
    main()
