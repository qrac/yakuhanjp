"""Package the generated desktop fonts for GitHub Releases."""

import json
from pathlib import Path
import tempfile
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
BASE_FONTS = ("Noto_Sans_JP", "Noto_Serif_JP", "M_PLUS_Rounded_1c")


def build_zip(root=ROOT):
    package = json.loads((root / "packages/yakuhanjp/package.json").read_text())
    name = f"YakuHanJP_v{package['version']}"
    output_dir = root / "build/zip"
    output_dir.mkdir(parents=True, exist_ok=True)
    output = output_dir / f"{name}.zip"
    # A failed rebuild must not leave a previous release archive at this path.
    output.unlink(missing_ok=True)

    project = json.loads((root / "packages/yakuhanjp/project.json").read_text())
    files = []
    for target in ("core", "merged"):
        for font in project["fonts"]:
            family = font["file"]
            prefix = "Merged" if target == "merged" else ""
            for style in font["weights"].values():
                for extension in ("otf", "ttf"):
                    relative = Path(target, family, extension, f"{prefix}{family}-{style}.{extension}")
                    files.append((root / "packages" / relative, relative))

    font_count = len(files)
    files.append((root / "scripts/zip/LICENSES/MIT.txt", Path("LICENSES/MIT.txt")))
    for family in BASE_FONTS:
        files.append((root / "resource" / family / "OFL.txt", Path("LICENSES", family, "OFL.txt")))

    readme = (root / "scripts/zip/README.md").read_text(encoding="utf-8")
    readme = readme.replace("{{VERSION}}", package["version"])
    for source, _ in files:
        if not source.is_file() or source.stat().st_size == 0:
            raise FileNotFoundError(f"配布ファイルがありません（または空です）: {source}")

    # Build beside the destination, then publish only the completed archive.
    with tempfile.TemporaryDirectory(prefix=".zip-", dir=output_dir) as temporary:
        archive_path = Path(temporary) / output.name
        with ZipFile(archive_path, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
            archive.writestr(f"{name}/README.md", readme)
            for source, relative in files:
                archive.write(source, f"{name}/{relative.as_posix()}")
        archive_path.replace(output)

    print(f"{output} ({font_count} fonts, {output.stat().st_size:,} bytes)")
    return output


if __name__ == "__main__":
    build_zip()
