"""Regression checks against the checked-in fonts and original base fonts."""

from io import BytesIO
from functools import cache
import json
import logging
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from contextlib import redirect_stdout
from io import StringIO

from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont
import uharfbuzz as hb

from build_fonts import ROOT, build, convert, core_font, merged_font, save, vertical_mapping


@cache
def font_bytes(font):
    stream = BytesIO()
    font.save(stream)
    return stream.getvalue()


def shape(font, text, direction, features=None):
    buffer = hb.Buffer()
    buffer.add_str(text)
    buffer.guess_segment_properties()
    buffer.direction = direction
    hb.shape(hb.Font(hb.Face(font_bytes(font))), buffer, features)
    return [(p.x_advance, p.y_advance, p.x_offset, p.y_offset) for p in buffer.glyph_positions]


def bounds(font, name, glyphs=None):
    glyphs = glyphs if glyphs is not None else font.getGlyphSet()
    pen = BoundsPen(glyphs)
    glyphs[name].draw(pen)
    return pen.bounds


class FontBuildTests(unittest.TestCase):
    def test_exported_names_and_weight_metadata(self):
        weights = {"Thin": 250, "ExtraLight": 250, "Light": 300, "Regular": 400,
                   "Medium": 500, "SemiBold": 600, "Bold": 700, "ExtraBold": 800, "Black": 900}
        for source in (ROOT / "packages/core").glob("*/sources/*.json"):
            family, style = source.parents[1].name, source.stem
            with self.subTest(family=family, style=style):
                font = core_font(source)
                self.assertEqual(font["name"].getDebugName(6), f"{family}-{style}")
                self.assertEqual(font["name"].getDebugName(3).split(";")[-1], f"{family}-{style}")
                self.assertEqual(font["OS/2"].usWeightClass, weights[style])
                self.assertEqual(font["OS/2"].fsSelection, 160 if style == "Bold" else 192)

    def test_all_sources_preserve_core_metrics_and_shaping(self):
        logging.basicConfig(level=logging.ERROR)
        project = json.loads((ROOT / "packages/yakuhanjp/project.json").read_text())
        for item in project["fonts"]:
            family = item["file"]
            for style in item["weights"].values():
                with self.subTest(family=family, style=style):
                    core = core_font(ROOT / f"packages/core/{family}/sources/{style}.json")
                    old = TTFont(ROOT / f"packages/core/{family}/ttf/{family}-{style}.ttf")
                    self.assertEqual(set(core.getBestCmap()), set(old.getBestCmap()))
                    for codepoint, name in core.getBestCmap().items():
                        old_name = old.getBestCmap()[codepoint]
                        self.assertEqual(core["hmtx"][name], old["hmtx"][old_name])
                        self.assertEqual(core["vmtx"][name], old["vmtx"][old_name])
                    for direction in ("ltr", "ttb"):
                        self.assertEqual(shape(core, item["glyphs"], direction), shape(old, item["glyphs"], direction))

    def test_merges_keep_base_text_and_replace_horizontal_and_vertical_glyphs(self):
        project = json.loads((ROOT / "packages/yakuhanjp/project.json").read_text())
        for item in project["fonts"]:
            family = item["file"]
            with self.subTest(family=family):
                core = core_font(ROOT / f"packages/core/{family}/sources/Regular.json")
                recipe = json.loads((ROOT / f"packages/core/{family}/sources/Regular.json").read_text())
                path = ROOT / "resource" / recipe["baseFont"]
                extension = path.suffix[1:]
                base = TTFont(path)
                merged = merged_font(path, core, family, "Regular")
                self.assertEqual(base.getBestCmap(), merged.getBestCmap())
                self.assertEqual(shape(base, "ABCあいう漢字", "ltr"), shape(merged, "ABCあいう漢字", "ltr"))
                for direction, tags in (("ltr", ("palt", "halt")), ("ttb", ("vpal", "vhal"))):
                    for tag in tags:
                        self.assertEqual(shape(merged, item["glyphs"], direction),
                                         shape(merged, item["glyphs"], direction, {tag: True}))
                core_vert, merged_vert = vertical_mapping(core), vertical_mapping(merged)
                core_glyphs, merged_glyphs = core.getGlyphSet(), merged.getGlyphSet()
                for codepoint, source in core.getBestCmap().items():
                    target = merged.getBestCmap()[codepoint]
                    pairs = [(source, target)]
                    if source in core_vert:
                        pairs.append((core_vert[source], merged_vert[target]))
                    for source_name, target_name in pairs:
                        self.assertEqual(core["hmtx"][source_name], merged["hmtx"][target_name])
                        self.assertEqual(core["vmtx"][source_name], merged["vmtx"][target_name])
                        self.assertEqual(bounds(core, source_name, core_glyphs), bounds(merged, target_name, merged_glyphs))
                with tempfile.TemporaryDirectory() as temp:
                    output = Path(temp) / f"font.{extension}"
                    save(merged, output)
                    reloaded = TTFont(output)
                    self.assertEqual(reloaded.getBestCmap(), base.getBestCmap())
                    self.assertEqual(reloaded["name"].getDebugName(6), f"Merged{family}-Regular")
                    if "CFF " in reloaded:
                        strings = reloaded["CFF "].cff.topDictIndex[0].CharStrings
                        reloaded_glyphs = reloaded.getGlyphSet()
                        for name in {reloaded.getBestCmap()[c] for c in core.getBestCmap()}:
                            bounds(reloaded, name, reloaded_glyphs)  # Decode the CharString width.
                            self.assertEqual(strings[name].width, reloaded["hmtx"][name][0])

    def test_formats_and_reproducible_output(self):
        core = core_font(ROOT / "packages/core/YakuHanJP/sources/Regular.json")
        with tempfile.TemporaryDirectory() as temp:
            for extension in ("ttf", "otf", "woff2"):
                font = convert(core, "ttf" if extension == "woff2" else extension)
                if extension == "woff2":
                    font.flavor = "woff2"
                first, second = Path(temp) / f"a.{extension}", Path(temp) / f"b.{extension}"
                save(font, first)
                save(font, second)
                self.assertEqual(first.read_bytes(), second.read_bytes())
                loaded = TTFont(first)
                self.assertEqual(set(loaded.getBestCmap()), set(core.getBestCmap()))
                self.assertEqual("CFF " in loaded, extension == "otf")

    def test_merged_style_linking(self):
        core = core_font(ROOT / "packages/core/YakuHanJP/sources/SemiBold.json")
        font = merged_font(ROOT / "resource/Noto_Sans_JP/static/NotoSansJP-SemiBold.ttf", core, "YakuHanJP", "SemiBold")
        names = font["name"]
        self.assertEqual(names.getDebugName(1), "Merged Yaku Han JP SemiBold")
        self.assertEqual(names.getDebugName(2), "Regular")
        self.assertEqual(names.getDebugName(16), "Merged Yaku Han JP")
        self.assertEqual(names.getDebugName(17), "SemiBold")

    def test_editing_spacing_and_adding_a_base_glyph(self):
        source = ROOT / "packages/core/YakuHanJP/sources/Regular.json"
        recipe = json.loads(source.read_text())
        original = core_font(source)
        recipe["outlines"] = str((source.parent / recipe["outlines"]).resolve())
        recipe["glyphs"]["uni300C"]["left"] += 20
        recipe["glyphs"]["uni300C"]["right"] += 10
        recipe["glyphs"]["uni2026"] = {
            "characters": "…", "source": {"character": "…"}, "left": 80, "right": 80,
            "advanceHeight": 1000, "verticalOrigin": 880,
        }
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "Regular.json"
            path.write_text(json.dumps(recipe))
            edited = core_font(path)
        name = original.getBestCmap()[ord("「")]
        self.assertEqual(edited["hmtx"][name][0], original["hmtx"][name][0] + 30)
        self.assertEqual(edited["hmtx"][name][1], original["hmtx"][name][1] + 20)
        self.assertEqual(bounds(edited, name)[0], bounds(original, name)[0] + 20)
        self.assertIn(ord("…"), edited.getBestCmap())
        self.assertEqual(edited["hmtx"]["uni2026"][1], 80)

    def test_cache_skips_unchanged_and_repairs_modified_output(self):
        with tempfile.TemporaryDirectory() as temp, redirect_stdout(StringIO()) as log:
            output, cache = Path(temp) / "output", Path(temp) / "cache"
            build(output, ["YakuHanJP"], ["400"], "core", cache_root=cache)
            path = output / "core/YakuHanJP/ttf/YakuHanJP-Regular.ttf"
            expected, modified = path.read_bytes(), path.stat().st_mtime_ns
            build(output, ["YakuHanJP"], ["400"], "core", cache_root=cache)
            self.assertEqual(path.stat().st_mtime_ns, modified)
            self.assertIn("Skipped core YakuHanJP Regular", log.getvalue())
            path.write_bytes(b"invalid font")
            with patch("build_fonts.core_font", side_effect=AssertionError("Unexpected rebuild")):
                build(output, ["YakuHanJP"], ["400"], "core", cache_root=cache)
            self.assertEqual(path.read_bytes(), expected)
            cached = cache / path.relative_to(output)
            cached.write_bytes(b"invalid cached font")
            build(output, ["YakuHanJP"], ["400"], "core", cache_root=cache)
            self.assertEqual(cached.read_bytes(), expected)

    def test_changing_output_copies_cached_fonts_without_rebuilding(self):
        with tempfile.TemporaryDirectory() as temp, redirect_stdout(StringIO()) as log:
            cache, output = Path(temp) / "cache", Path(temp) / "packages"
            build(cache, ["YakuHanJP"], ["400"], "core", cache_root=cache)
            source_json = output / "core/YakuHanJP/sources/Regular.json"
            source_json.parent.mkdir(parents=True)
            source_json.write_text("keep edited source")
            log.seek(0)
            log.truncate()
            with patch("build_fonts.core_font", side_effect=AssertionError("Unexpected rebuild")):
                build(output, ["YakuHanJP"], ["400"], "core", cache_root=cache)
            self.assertIn("0 built, 3 skipped, 3 copied", log.getvalue())
            for extension in ("ttf", "otf", "woff2"):
                relative = Path(f"core/YakuHanJP/{extension}/YakuHanJP-Regular.{extension}")
                self.assertEqual((cache / relative).read_bytes(), (output / relative).read_bytes())
            self.assertEqual(source_json.read_text(), "keep edited source")

    def test_adding_merged_format_only_builds_the_missing_format(self):
        source = ROOT / "packages/core/YakuHanJP/sources/Regular.json"
        # A real subset font keeps this cache test independent of full CJK conversion cost.
        with tempfile.TemporaryDirectory() as temp, redirect_stdout(StringIO()) as log, patch(
            "build_fonts.merged_font", side_effect=lambda *args: core_font(source)
        ):
            cache = Path(temp)
            build(cache, ["YakuHanJP"], ["400"], "merged", cache_root=cache)
            native = cache / "merged/YakuHanJP/ttf/MergedYakuHanJP-Regular.ttf"
            modified = native.stat().st_mtime_ns
            log.seek(0)
            log.truncate()
            with patch("build_fonts.convert", wraps=convert) as conversions:
                build(cache, ["YakuHanJP"], ["400"], "merged", "both", cache_root=cache)
            self.assertEqual([call.args[1] for call in conversions.call_args_list], ["otf"])
            self.assertEqual(native.stat().st_mtime_ns, modified)
            self.assertIn("1 built, 1 skipped, 0 copied", log.getvalue())

    def test_changed_bounds_and_vertical_origin_survive_native_merge(self):
        for family, extension in (("YakuHanJP", "ttf"), ("YakuHanMP", "otf")):
            with self.subTest(family=family), tempfile.TemporaryDirectory() as temp:
                source = ROOT / f"packages/core/{family}/sources/Regular.json"
                recipe = json.loads(source.read_text())
                recipe["outlines"] = str((source.parent / recipe["outlines"]).resolve())
                recipe["glyphs"]["uni300C"].update(left=5000, right=40, offsetY=5000, verticalOrigin=7000, advanceHeight=8000)
                path = Path(temp) / "Regular.json"
                path.write_text(json.dumps(recipe))
                core = core_font(path)
                merged = merged_font(ROOT / "resource" / recipe["baseFont"], core, family, "Regular")
                output = Path(temp) / f"merged.{extension}"
                save(merged, output)
                loaded = TTFont(output)
                target = loaded.getBestCmap()[ord("「")]
                self.assertEqual(loaded["hmtx"][target], core["hmtx"]["uni300C"])
                bbox = bounds(loaded, target)
                self.assertGreaterEqual(loaded["head"].xMax, bbox[2])
                self.assertGreaterEqual(loaded["head"].yMax, bbox[3])
                self.assertGreaterEqual(loaded["hhea"].advanceWidthMax, core["hmtx"]["uni300C"][0])
                self.assertGreaterEqual(loaded["vhea"].advanceHeightMax, 8000)
                if extension == "otf":
                    self.assertEqual(loaded["VORG"][target], 7000)


if __name__ == "__main__":
    unittest.main()
