"""Check corpus counting assumptions independently of the downloaded data."""

import lzma
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from research_merged_subset import DATA_SHA256, is_kanji, read_counts


class ResearchCountingTests(unittest.TestCase):
    def fixture(self, directory, total=10):
        path = Path(directory) / "frequency.tsv.xz"
        with lzma.open(path, "wt", encoding="utf-8") as stream:
            stream.write("word\tcount\tcount:gaming\tcount:news\n")
            stream.write('時時\t3\t1\t2\n﨑\t2\t0\t2\n"\t1\t1\t0\n')
            stream.write(f"[ __ ]\t4\t4\t0\n[TOTAL]\t{total}\t6\t4\n")
        return path

    def test_repeated_characters_literal_quotes_and_original_spelling(self):
        with tempfile.TemporaryDirectory() as directory, patch("research_merged_subset.digest", return_value=DATA_SHA256):
            counts, totals = read_counts(self.fixture(directory))
        self.assertEqual(dict(counts["all"]), {"時": 6, "﨑": 2, '"': 1})
        self.assertEqual(dict(counts["gaming"]), {"時": 2, "﨑": 0, '"': 1})
        self.assertEqual(totals["token_count"], 10)
        self.assertEqual(totals["excluded_special_token_count"], 4)
        self.assertNotIn("崎", counts["all"])

    def test_wrong_totals_fail(self):
        with tempfile.TemporaryDirectory() as directory, patch("research_merged_subset.digest", return_value=DATA_SHA256):
            with self.assertRaisesRegex(ValueError, "Token total mismatch"):
                read_counts(self.fixture(directory, total=11))

    def test_unpinned_input_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(ValueError, "SHA-256"):
                read_counts(self.fixture(directory))

    def test_supplementary_and_compatibility_kanji_are_not_lost(self):
        for char in "漢﨑𠮷":
            self.assertTrue(is_kanji(char))
        for char in "あアA①":
            self.assertFalse(is_kanji(char))


if __name__ == "__main__":
    unittest.main()
