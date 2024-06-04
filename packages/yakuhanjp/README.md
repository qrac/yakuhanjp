# Yaku Han JP

## Site & Documentation

https://yakuhanjp.qranoko.jp

## About

Yaku Han JP（ヤクハンジェイピー）は、日本語テキストに含まれる約物を半角にするフォントです。

このブラウザ版は font-family（CSS）のフォールバック機能を利用し、文字幅を調整した「約物だけの Web フォント」を優先的適応させます。1 フォントが 4〜5KB と軽量なのが特長で、CMS 出力などの動的コンテンツへの利用に向いています。

## Font Family

ゴシック体（Noto Sans JP）・明朝体（Noto Serif JP）・丸ゴシック（M PLUS Rounded 1c）を使用可能。フォント名末尾に s が付いているものはカッコだけを半角にします。

|  フォント名  |  スタイル  |  半角対象  | 内包文字                                             |
| :----------: | :--------: | :--------: | ---------------------------------------------------- |
| `YakuHanJP`  | ゴシック体 | 約物すべて | `、。！？〈〉《》「」『』【】〔〕・（）：；［］｛｝` |
| `YakuHanJPs` | ゴシック体 | カッコのみ | `〈〉《》「」『』【】〔〕（）［］｛｝`               |
| `YakuHanMP`  |   明朝体   | 約物すべて | `、。！？〈〉《》「」『』【】〔〕・（）：；［］｛｝` |
| `YakuHanMPs` |   明朝体   | カッコのみ | `〈〉《》「」『』【】〔〕（）［］｛｝`               |
| `YakuHanRP`  | 丸ゴシック | 約物すべて | `、。！？〈〉《》「」『』【】〔〕・（）：；［］｛｝` |
| `YakuHanRPs` | 丸ゴシック | カッコのみ | `〈〉《》「」『』【】〔〕（）［］｛｝`               |

## Font Weight

|  フォント名  | W100 |    W200    | W300  |  W400   |  W500  |   W600   | W700 |   W800    | W900  |
| :----------: | :--: | :--------: | :---: | :-----: | :----: | :------: | :--: | :-------: | :---: |
| `YakuHanJP`  | Thin | ExtraLight | Light | Regular | Medium | SemiBold | Bold | ExtraBold | Black |
| `YakuHanJPs` | Thin | ExtraLight | Light | Regular | Medium | SemiBold | Bold | ExtraBold | Black |
| `YakuHanMP`  |  -   | ExtraLight | Light | Regular | Medium | SemiBold | Bold |     -     | Black |
| `YakuHanMPs` |  -   | ExtraLight | Light | Regular | Medium | SemiBold | Bold |     -     | Black |
| `YakuHanRP`  | Thin |     -      | Light | Regular | Medium |    -     | Bold | ExtraBold | Black |
| `YakuHanRPs` | Thin |     -      | Light | Regular | Medium |    -     | Bold | ExtraBold | Black |

## How To Use

フォントを呼び出す CSS ファイルを読み込んで、font-family の先頭にフォント名を追記します。※以下は `YakuHanJP`（ゴシック体・約物すべて）を使った場合の例

```html
<link rel="stylesheet" href="path/to/yakuhanjp.css" />
```

```css
.example {
  font-family: YakuHanJP, sans-serif;
}
```

## CDN

- https://cdn.jsdelivr.net/npm/yakuhanjp/

1. [シミュレーター](https://yakuhanjp.qranoko.jp/#simulator)で使用するフォントの種類を選択
2. 表示された `<link>` タグをサイトの `<head>` タグ内に配置
3. CSS を記述：`font-family` の日本語フォントより前に `YakuHanJP` などを優先指定

## npm

- https://www.npmjs.com/package/yakuhanjp

1. npm でパッケージをインストール

```sh
$ npm install yakuhanjp
```

2. 使用する CSS ファイルへのパスを記述

|  フォント名  | JavaScript に書く `import` 文                 |
| :----------: | --------------------------------------------- |
| `YakuHanJP`  | `import "yakuhanjp"`                          |
| `YakuHanJPs` | `import "yakuhanjp/dist/css/yakuhanjp_s.css"` |
| `YakuHanMP`  | `import "yakuhanjp/dist/css/yakuhanmp.css"`   |
| `YakuHanMPs` | `import "yakuhanjp/dist/css/yakuhanmp_s.css"` |
| `YakuHanRP`  | `import "yakuhanjp/dist/css/yakuhanrp.css"`   |
| `YakuHanRPs` | `import "yakuhanjp/dist/css/yakuhanrp_s.css"` |

## License

- Yaku Han JP : SIL OFL 1.1 AND MIT
- Gothic fonts : Based on [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) licensed under the SIL OFL 1.1
- Mincho fonts : Based on [Noto Serif JP](https://fonts.google.com/noto/specimen/Noto+Serif+JP) licensed under the SIL OFL 1.1
- Round Gothic fonts : Based on [M PLUS Rounded 1c](https://fonts.google.com/specimen/M+PLUS+Rounded+1c) licensed under the SIL OFL 1.1

## Credit

- Author: [Qrac](https://qrac.jp)
- Organization: [QRANOKO](https://qranoko.jp)
