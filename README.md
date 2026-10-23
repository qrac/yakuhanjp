# Yaku Han JP

## Site & Documentation

- https://yakuhanjp.qranoko.jp

## About

Yaku Han JP（ヤクハンジェイピー）は、日本語テキストに含まれる約物を半角にするフォントです。

このブラウザ版は font-family（CSS）のフォールバック機能を利用し、文字幅を調整した「約物だけの Web フォント」を優先的適応させます。1 フォントが 4〜5KB と軽量なのが特長で、CMS 出力などの動的コンテンツへの利用に向いています。

マージ版は、元の日本語フォントにYaku Han JPの約物を組み込み、1つのフォントにまとめたものです。CSSのフォールバック機能を使わずに約物を半角にできるため、画像生成やゲーム、デザインツールなどで利用できます。TTF・OTF形式を提供しています。

## Packages

- [yakuhanjp](https://github.com/qrac/yakuhanjp/tree/main/packages/yakuhanjp) - ブラウザ向けのCSSと約物だけのWebフォント（WOFF2）
- [core](https://github.com/qrac/yakuhanjp/tree/main/packages/core) - 約物だけのフォント（TTF・OTF・WOFF2）と編集用データ
- [merged](https://github.com/qrac/yakuhanjp/tree/main/packages/merged) - 元の日本語フォントに約物を組み込んだマージ版（TTF・OTF）
- [unicode](https://github.com/qrac/yakuhanjp/tree/main/packages/unicode) - 収録文字のUnicode情報を生成するスクリプト

## Media

- [OG画像の約物を詰める - YakuHanJP v4](https://zenn.dev/qrac/articles/791fd61483a989)
- [HTML5 Conference 2016 LT "Yaku Han JP" by Qrac // Speaker Deck](https://speakerdeck.com/qrac/html5-conference-2016-lt-yaku-han-jp-by-qrac)

## License

- Yaku Han JP : SIL OFL 1.1 AND MIT
- Gothic fonts : Based on [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) licensed under the SIL OFL 1.1
- Mincho fonts : Based on [Noto Serif JP](https://fonts.google.com/noto/specimen/Noto+Serif+JP) licensed under the SIL OFL 1.1
- Round Gothic fonts : Based on [M PLUS Rounded 1c](https://fonts.google.com/specimen/M+PLUS+Rounded+1c) licensed under the SIL OFL 1.1

## Credit

- Author: [Qrac](https://qrac.jp)
- Organization: [QRANOKO](https://qranoko.jp)
