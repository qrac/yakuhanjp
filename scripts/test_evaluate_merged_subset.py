"""Ensure evaluation counts rendered translations rather than source/metadata."""

from collections import Counter
import unittest

from evaluate_merged_subset import evaluate, po_strings, rpy_strings, visible_text


class TranslationEvaluationTests(unittest.TestCase):
    def test_po_excludes_headers_fuzzy_untranslated_and_source_text(self):
        text = '''msgid ""
msgstr "Language: ja\\n"

msgid "Save"
msgstr "保存"
"します"

#, fuzzy, c-format
msgid "Open"
msgstr "開く"

msgid "Empty"
msgstr ""

#~ msgid "Obsolete"
#~ msgstr "古い"

msgid "File"
msgid_plural "Files"
msgstr[0] "ファイル"
'''
        self.assertEqual(po_strings(text), ["保存します", "ファイル"])

    def test_renpy_excludes_comments_and_old_and_keeps_translation(self):
        text = '''# s "Original"
translate japanese example:
    s "こんにちは"
    "地の文"
    old "Original"
    new "翻訳"
    s "選択前の会話" nointeract
'''
        self.assertEqual(rpy_strings(text), ["こんにちは", "地の文", "翻訳", "選択前の会話"])
        with self.assertRaises(ValueError):
            rpy_strings('s "unsupported" with dissolve')

    def test_control_markup_and_variables_are_not_visible_characters(self):
        self.assertEqual(visible_text('[b]保存[/b] %s\n', 'po'), '保存 ')
        self.assertEqual(visible_text('{b}名前{/b}[player]\u200e', 'rpy'), '名前')

    def test_character_rate_and_complete_string_rate_are_different(self):
        strings = ['漢字', '漢A']
        result = evaluate(strings, set('漢字'), Counter(''.join(strings)))
        self.assertEqual(result['character_coverage_percent'], 75)
        self.assertEqual(result['complete_string_percent'], 50)
        self.assertEqual(result['kanji_coverage_percent'], 100)


if __name__ == '__main__':
    unittest.main()
