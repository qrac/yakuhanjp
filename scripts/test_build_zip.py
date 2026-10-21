"""Check the release archive contract without rebuilding fonts."""

from contextlib import redirect_stdout
from io import StringIO
import json
from pathlib import Path
import shutil
import tempfile
import unittest
from zipfile import ZipFile

from build_zip import ROOT, BASE_FONTS, build_zip


class BuildZipTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        shutil.copytree(ROOT / "scripts/zip", self.root / "scripts/zip")
        for family in BASE_FONTS:
            destination = self.root / "resource" / family
            destination.mkdir(parents=True)
            shutil.copyfile(ROOT / "resource" / family / "OFL.txt", destination / "OFL.txt")
        package_dir = self.root / "packages/yakuhanjp"
        package_dir.mkdir(parents=True)
        (package_dir / "package.json").write_text('{"version": "9.8.7"}')
        shutil.copyfile(ROOT / "packages/yakuhanjp/project.json", package_dir / "project.json")
        project = json.loads((package_dir / "project.json").read_text())
        for font in project["fonts"]:
            for target, prefix in (("core", ""), ("merged", "Merged")):
                for style in font["weights"].values():
                    for extension in ("ttf", "otf"):
                        path = self.root / "packages" / target / font["file"] / extension
                        path.mkdir(parents=True, exist_ok=True)
                        (path / f"{prefix}{font['file']}-{style}.{extension}").write_bytes(b"font fixture")

    def build(self):
        with redirect_stdout(StringIO()):
            return build_zip(self.root)

    def test_release_contents_and_rebuild(self):
        core = self.root / "packages/core/YakuHanJP"
        for relative in ("ttf/Obsolete.ttf", "woff2/YakuHanJP-Regular.woff2", "sources/Regular.json"):
            path = core / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(b"excluded")
        output = self.build()
        self.assertEqual(output.name, "YakuHanJP_v9.8.7.zip")
        output.write_bytes(b"old archive")
        self.build()
        with ZipFile(output) as archive:
            self.assertIsNone(archive.testzip())
            names = archive.namelist()
            self.assertEqual(len(names), len(set(names)))
            self.assertEqual(len(names), 189)  # 184 fonts + README + four licenses
            self.assertTrue(all(name.startswith("YakuHanJP_v9.8.7/") for name in names))
            fonts = [name for name in names if name.endswith((".ttf", ".otf"))]
            self.assertEqual(len(fonts), 184)
            self.assertTrue(all(archive.read(name) == b"font fixture" for name in fonts))
            self.assertFalse(any("Obsolete" in name or "/sources/" in name or "/woff2/" in name for name in names))
            readme = archive.read("YakuHanJP_v9.8.7/README.md").decode()
            self.assertIn("v9.8.7", readme)
            self.assertNotIn("{{VERSION}}", readme)
            for family in BASE_FONTS:
                self.assertEqual(archive.read(f"YakuHanJP_v9.8.7/LICENSES/{family}/OFL.txt"),
                                 (ROOT / "resource" / family / "OFL.txt").read_bytes())

    def test_missing_or_empty_input_removes_old_archive(self):
        for relative in ("packages/core/YakuHanJP/ttf/YakuHanJP-Regular.ttf",
                         "packages/merged/YakuHanJP/otf/MergedYakuHanJP-Regular.otf",
                         "resource/Noto_Sans_JP/OFL.txt"):
            for empty in (False, True):
                with self.subTest(relative=relative, empty=empty):
                    output = self.build()
                    source = self.root / relative
                    original = source.read_bytes()
                    if empty:
                        source.write_bytes(b"")
                    else:
                        source.unlink()
                    with self.assertRaises(FileNotFoundError):
                        self.build()
                    self.assertFalse(output.exists())
                    self.assertEqual(list(output.parent.glob(".zip-*")), [])
                    source.write_bytes(original)
