<p align="center">
  <img width="180" src="https://i.gyazo.com/0f8c0feca913c44be8b07eec127a8946.png" alt="Yaku Han JP Logo">
</p>

# Yaku Han JP

<p>
  <a aria-label="Made by QRANOKO" href="https://qranoko.jp">
    <img src="https://img.shields.io/badge/MADE%20BY%20QRANOKO-212121.svg?style=for-the-badge&labelColor=212121">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/yakuhanjp">
    <img alt="" src="https://img.shields.io/npm/v/yakuhanjp.svg?style=for-the-badge&labelColor=212121">
  </a>
  <a aria-label="License" href="https://github.com/qrac/yakuhanjp/blob/master/LICENSE">
    <img alt="" src="https://img.shields.io/npm/l/yakuhanjp.svg?style=for-the-badge&labelColor=212121">
  </a>
</p>

## Site & Documentation

https://yakuhanjp.qranoko.jp

## About

![Image from Gyazo](https://i.gyazo.com/3b544650334bf561161cf61ad3dfbef8.png)

Yaku Han JP（ヤクハンジェイピー）は、Web 上の日本語テキストに含まれる約物を半角にする「約物半角専用 Web フォント」です。

font-family（CSS）のフォールバック機能を利用し、文字幅を調整した「約物だけのフォント」を優先的適応させます。レガシーブラウザ対応・動的コンテンツへの利用に向いている他、1 フォントが 4〜5KB と軽量なのが特長。

## Font Family

ゴシック体（Noto Sans CJK JP）・明朝体（Noto Serif CJK JP）・丸ゴシック（Rounded M+ 1c）を使用可能。フォント名に s が付いているフォントはカッコだけを半角にします。

|  フォント名  |  スタイル  |  半角対象  | 内包文字                                             |
| :----------: | :--------: | :--------: | ---------------------------------------------------- |
| `YakuHanJP`  | ゴシック体 | 約物すべて | `、。！？〈〉《》「」『』【】〔〕・（）：；［］｛｝` |
| `YakuHanJPs` | ゴシック体 | カッコのみ | `〈〉《》「」『』【】〔〕（）［］｛｝`               |
| `YakuHanMP`  |   明朝体   | 約物すべて | `、。！？《》「」『』【】〔〕・（）：；［］｛｝`     |
| `YakuHanMPs` |   明朝体   | カッコのみ | `《》「」『』【】〔〕（）［］｛｝`                   |
| `YakuHanRP`  | 丸ゴシック | 約物すべて | `、。！？〈〉《》「」『』【】〔〕・（）：；［］｛｝` |
| `YakuHanRPs` | 丸ゴシック | カッコのみ | `〈〉《》「」『』【】〔〕（）［］｛｝`               |

※バグ回避のため、すべてのフォントに `.notdef` `space` `ellipsis` が含まれています

## Font Weight

|  フォント名  |    W100    | W200  |   W300    |  W400   |   W500   | W600 | W700 |   W800    | W900  |
| :----------: | :--------: | :---: | :-------: | :-----: | :------: | :--: | :--: | :-------: | :---: |
| `YakuHanJP`  |    Thin    | Light | DemiLight | Regular |  Medium  |  -   | Bold |     -     | Black |
| `YakuHanJPs` |    Thin    | Light | DemiLight | Regular |  Medium  |  -   | Bold |     -     | Black |
| `YakuHanMP`  | ExtraLight | Light |  Regular  | Medium  | SemiBold |  -   | Bold |     -     | Black |
| `YakuHanMPs` | ExtraLight | Light |  Regular  | Medium  | SemiBold |  -   | Bold |     -     | Black |
| `YakuHanRP`  |    Thin    |   -   |   Light   | Regular |  Medium  |  -   | Bold | ExtraBold | Black |
| `YakuHanRPs` |    Thin    |   -   |   Light   | Regular |  Medium  |  -   | Bold | ExtraBold | Black |

## How To Use

フォントを呼び出す CSS ファイルを読み込んで、font-family の先頭にフォント名を追記します。※以下は `YakuHanJP`（ゴシック体・約物すべて）を使った場合の例

```html
<link rel="stylesheet" href="dist/css/yakuhanjp.min.css" />
```

```scss
.example {
  font-family: YakuHanJP, "Hiragino Sans" sans-serif;
}
```

## [CDN](https://cdn.jsdelivr.net/npm/yakuhanjp/)

|  フォント名  | HTML に貼る CDN リンクタグ                                                                                 |
| :----------: | ---------------------------------------------------------------------------------------------------------- |
| `YakuHanJP`  | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanjp.min.css">`   |
| `YakuHanJPs` | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanjp_s.min.css">` |
| `YakuHanMP`  | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanmp.min.css">`   |
| `YakuHanMPs` | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanmp_s.min.css">` |
| `YakuHanRP`  | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanrp.min.css">`   |
| `YakuHanRPs` | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanrp_s.min.css">` |

## [npm](https://www.npmjs.com/package/yakuhanjp)

```bash
$ npm i yakuhanjp
```

### CSS

|  フォント名  | JavaScript に書く `import` 文                 |
| :----------: | --------------------------------------------- |
| `YakuHanJP`  | `import "yakuhanjp"`                          |
| `YakuHanJPs` | `import "yakuhanjp/dist/css/yakuhanjp_s.css"` |
| `YakuHanMP`  | `import "yakuhanjp/dist/css/yakuhanmp.css"`   |
| `YakuHanMPs` | `import "yakuhanjp/dist/css/yakuhanmp_s.css"` |
| `YakuHanRP`  | `import "yakuhanjp/dist/css/yakuhanrp.css"`   |
| `YakuHanRPs` | `import "yakuhanjp/dist/css/yakuhanrp_s.css"` |

### SCSS

|  フォント名  | SCSS に書く `@use` 文（または `@import`） |
| :----------: | ----------------------------------------- |
| `YakuHanJP`  | `@use "yakuhanjp/dist/scss/yakuhanjp"`    |
| `YakuHanJPs` | `@use "yakuhanjp/dist/scss/yakuhanjp_s"`  |
| `YakuHanMP`  | `@use "yakuhanjp/dist/scss/yakuhanmp"`    |
| `YakuHanMPs` | `@use "yakuhanjp/dist/scss/yakuhanmp_s"`  |
| `YakuHanRP`  | `@use "yakuhanjp/dist/scss/yakuhanrp"`    |
| `YakuHanRPs` | `@use "yakuhanjp/dist/scss/yakuhanrp_s"`  |

| オプション（変数名はフォントによる） | タイプ    | デフォルト                         |
| ------------------------------------ | --------- | ---------------------------------- |
| `$yakuhanjp-font-family`             | `string`  | `YakuHanJP` etc.                   |
| `$yakuhanjp-font-file`               | `string`  | `YakuHanJP` etc.                   |
| `$yakuhanjp-font-dir`                | `string`  | `../fonts`                         |
| `$yakuhanjp-swap-use`                | `boolean` | `true`                             |
| `$yakuhanjp-eot-use`                 | `boolean` | `true`                             |
| `$yakuhanjp-cdn-use`                 | `boolean` | `false`                            |
| `$yakuhanjp-cdn-version`             | `string`  | `3.4.1`                            |
| `$yakuhanjp-unicode-range-use`       | `boolean` | `true`                             |
| `$yakuhanjp-unicode`                 | `array`   | `U+3001, U+3002...` etc.           |
| `$yakuhanjp-weight`                  | `object`  | `100:"Thin", 200:"Light" ...` etc. |

```scss
// Dart Sass Example: YakuHanRPs Use CDN
@use "yakuhanjp/dist/scss/yakuhanrp" with (
  $yakuhanrp-eot-use: false,
  $yakuhanrp-cdn-use: true
);
```

## Specific Edition

### For Noto

2018 年 9 月 7 日、Google Fonts 本家に Noto Sans JP・Noto Serif JP が加わりました。日本語のサブセット配信機能がとても優秀です。ただ、通常の YakuHanJP とはウェイトが多少異なります。

そこで、専用のウェイト調整を行った CSS ファイルを用意しました [#23](https://github.com/qrac/yakuhanjp/issues/23)。以下の CDN 配信ファイル（もしくはローカルの CSS ファイル）を読み込めば、Google Fonts 本家の Noto Sans JP・Noto Serif JP に YakuHanJP のウェイトが揃います。

|    フォント名     | HTML に貼る CDN リンクタグ                                                                                      |
| :---------------: | --------------------------------------------------------------------------------------------------------------- |
| `YakuHanJP_Noto`  | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanjp-noto.min.css">`   |
| `YakuHanJPs_Noto` | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanjp_s-noto.min.css">` |
| `YakuHanMP_Noto`  | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanmp-noto.min.css">`   |
| `YakuHanMPs_Noto` | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanmp_s-noto.min.css">` |

|    フォント名     | JavaScript に書く `import` 文                      |
| :---------------: | -------------------------------------------------- |
| `YakuHanJP_Noto`  | `import "yakuhanjp-noto"`                          |
| `YakuHanJPs_Noto` | `import "yakuhanjp/dist/css/yakuhanjp_s-noto.css"` |
| `YakuHanMP_Noto`  | `import "yakuhanjp/dist/css/yakuhanmp-noto.css"`   |
| `YakuHanMPs_Noto` | `import "yakuhanjp/dist/css/yakuhanmp_s-noto.css"` |

|    フォント名     | SCSS に書く `@use` 文（または `@import`）     |
| :---------------: | --------------------------------------------- |
| `YakuHanJP_Noto`  | `@use "yakuhanjp/dist/scss/yakuhanjp-noto"`   |
| `YakuHanJPs_Noto` | `@use "yakuhanjp/dist/scss/yakuhanjp_s-noto"` |
| `YakuHanMP_Noto`  | `@use "yakuhanjp/dist/scss/yakuhanmp-noto"`   |
| `YakuHanMPs_Noto` | `@use "yakuhanjp/dist/scss/yakuhanmp_s-noto"` |

### For Narrow

macOS 10.13・iOS11 以降の Safari では、`font-family` に `-apple-system` を指定すると Sanfrancisco に加えて小ぶりのヒラギノ角ゴシックが出力されます。通常の YakuHanJP を被せると約物だけ太く大きく見えてしまいます。これは全体的に細い游ゴシックでも同様の現象がおきます。

そこで、細身のウェイト調整を行った CSS ファイルを用意しました [#27](https://github.com/qrac/yakuhanjp/issues/27)。以下の CDN 配信ファイル（もしくはローカルの CSS ファイル）を読み込めばウェイトが自然になります。約物は細い分には気になりにくいため、対象のブラウザ以外で他のフォントと組み合わさっても影響が小さいです。

|     フォント名      | HTML に貼る CDN リンクタグ                                                                                        |
| :-----------------: | ----------------------------------------------------------------------------------------------------------------- |
| `YakuHanJP_Narrow`  | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanjp-narrow.min.css">`   |
| `YakuHanJPs_Narrow` | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanjp_s-narrow.min.css">` |

|     フォント名      | JavaScript に書く `import` 文                        |
| :-----------------: | ---------------------------------------------------- |
| `YakuHanJP_Narrow`  | `import "yakuhanjp-narrow"`                          |
| `YakuHanJPs_Narrow` | `import "yakuhanjp/dist/css/yakuhanjp_s-narrow.css"` |

|     フォント名      | SCSS に書く `@use` 文（または `@import`）       |
| :-----------------: | ----------------------------------------------- |
| `YakuHanJP_Narrow`  | `@use "yakuhanjp/dist/scss/yakuhanjp-narrow"`   |
| `YakuHanJPs_Narrow` | `@use "yakuhanjp/dist/scss/yakuhanjp_s-narrow"` |

## Support

| Chrome | Firefox | IE  | Ege | Opera | Safari(Mac) |
| :----: | :-----: | :-: | :-: | :---: | :---------: |
|  55~   |   50~   | 9~  | 14~ |  36~  |     6~      |

| Safari(iOS) | Chrome(Android) | Browser(Android) |
| :---------: | :-------------: | :--------------: |
|     7~      |       51~       |       4.4~       |

## Media

- [HTML5 Conference 2016 LT "Yaku Han JP" by Qrac // Speaker Deck](https://speakerdeck.com/qrac/html5-conference-2016-lt-yaku-han-jp-by-qrac)

## License

- Yaku Han JP : SIL OFL 1.1
- Gothic fonts : Based on [Noto Sans CJK JP](https://www.google.com/get/noto/#sans-jpan) licensed under the SIL OFL 1.1
- Mincho fonts : Based on [Noto Serif CJK JP](https://www.google.com/get/noto/#serif-jpan) licensed under the SIL OFL 1.1
- Round Gothic fonts : Based on [Rounded M+ 1c](http://jikasei.me/font/rounded-mplus/) licensed under the M+ FONTS LICENSE

## Credit

- Author: [Qrac](https://qrac.jp)
- Organization: [QRANOKO](https://qranoko.jp)
