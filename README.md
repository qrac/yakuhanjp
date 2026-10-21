# Yaku Han JP

## Site & Documentation

- https://yakuhanjp.qranoko.jp

## About

Yaku Han JP（ヤクハンジェイピー）は、日本語テキストに含まれる約物を半角にするフォントです。

## Packages

- [yakuhanjp](https://github.com/qrac/yakuhanjp/tree/main/packages/yakuhanjp) — ブラウザで使用する YakuHanJP
- [core](https://github.com/qrac/yakuhanjp/tree/main/packages/core) — YakuHanJP のフォントデータ
- [merged](https://github.com/qrac/yakuhanjp/tree/main/packages/merged) — YakuHanJP を元フォントにマージしたデータ
- [unicode](https://github.com/qrac/yakuhanjp/tree/main/packages/unicode) — 内包文字の unicode を生成するスクリプト

## Development

`npm run build` で配布用のCSSとWOFF2を `packages/yakuhanjp/dist` に生成します。
`packages/yakuhanjp/project.json` のフォント情報と `packages/core` のWOFF2を元に、
`src/build.ts` が通常版CSS・jsDelivr向けCSS・ライセンスバナーを生成します。
フォントやウェイト、収録文字を変更するときは `project.json` を編集してください。

`npm run play` は配布用ファイルを生成してからplaygroundを起動します。
フォント情報を変更した後は、再度 `npm run build` を実行してください。

## Media

- [OG 画像の約物を詰める - YakuHanJP v4](https://zenn.dev/qrac/articles/791fd61483a989)
- [HTML5 Conference 2016 LT "Yaku Han JP" by Qrac // Speaker Deck](https://speakerdeck.com/qrac/html5-conference-2016-lt-yaku-han-jp-by-qrac)

## License

- Yaku Han JP : SIL OFL 1.1 AND MIT
- Gothic fonts : Based on [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) licensed under the SIL OFL 1.1
- Mincho fonts : Based on [Noto Serif JP](https://fonts.google.com/noto/specimen/Noto+Serif+JP) licensed under the SIL OFL 1.1
- Round Gothic fonts : Based on [M PLUS Rounded 1c](https://fonts.google.com/specimen/M+PLUS+Rounded+1c) licensed under the SIL OFL 1.1

## Credit

- Author: [Qrac](https://qrac.jp)
- Organization: [QRANOKO](https://qranoko.jp)
