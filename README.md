# Yaku Han JP

## Site

- https://yakuhanjp.qranoko.jp

## About

Yaku Han JP（ヤクハンジェイピー）は、Web 上の日本語テキストに含まれる約物を半角にする「約物半角専用 Web フォント」です。

## Detail

font-family（CSS）のフォールバック機能を利用し、文字幅を調整した「約物だけのフォント」を優先的適応させます。レガシーブラウザ対応・動的コンテンツへの利用に向いている他、1 つのフォントが 4〜5KB と軽量なのが特長。

## How To Use

フォントを呼び出す CSS ファイルを読み込んで、font-family の先頭にフォント名を追記。※以下は `YakuHanJP`（ゴシック体・約物すべて）を使った場合の例

```html
<link rel="stylesheet" href="dist/css/yakuhanjp.min.css" />
```

```scss
.example {
  font-family: YakuHanJP, "Hiragino Sans" sans-serif;
}
```

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

ウェイトは各 7 段階。ベースフォント毎にウェイト・ファイル名が若干異なるため、当ライブラリ内のファイル名も各ベースフォントに準じています。

|  フォント名  |    W100    | W200  |   W300    |  W400   |   W500   | W600 | W700 |   W800    | W900  |
| :----------: | :--------: | :---: | :-------: | :-----: | :------: | :--: | :--: | :-------: | :---: |
| `YakuHanJP`  |    Thin    | Light | DemiLight | Regular |  Medium  |  -   | Bold |     -     | Black |
| `YakuHanJPs` |    Thin    | Light | DemiLight | Regular |  Medium  |  -   | Bold |     -     | Black |
| `YakuHanMP`  | ExtraLight | Light |  Regular  | Medium  | SemiBold |  -   | Bold |     -     | Black |
| `YakuHanMPs` | ExtraLight | Light |  Regular  | Medium  | SemiBold |  -   | Bold |     -     | Black |
| `YakuHanRP`  |    Thin    |   -   |   Light   | Regular |  Medium  |  -   | Bold | ExtraBold | Black |
| `YakuHanRPs` |    Thin    |   -   |   Light   | Regular |  Medium  |  -   | Bold | ExtraBold | Black |

## CDN

- https://cdn.jsdelivr.net/npm/yakuhanjp/

jsDelivr で配信している CSS ファイルへのリンクを HTML 内に記述するだけで全ウェイトのフォントを利用できます。

|  フォント名  | HTML に貼る CDN リンクタグ                                                                                 |
| :----------: | ---------------------------------------------------------------------------------------------------------- |
| `YakuHanJP`  | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.2.0/dist/css/yakuhanjp.min.css">`   |
| `YakuHanJPs` | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.2.0/dist/css/yakuhanjp_s.min.css">` |
| `YakuHanMP`  | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.2.0/dist/css/yakuhanmp.min.css">`   |
| `YakuHanMPs` | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.2.0/dist/css/yakuhanmp_s.min.css">` |
| `YakuHanRP`  | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.2.0/dist/css/yakuhanrp.min.css">`   |
| `YakuHanRPs` | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.2.0/dist/css/yakuhanrp_s.min.css">` |

## npm

- https://www.npmjs.com/package/yakuhanjp

npm コマンドで任意のプロジェクトにインストールできます。

```
npm install yakuhanjp
```

### SCSS

SCSS を使ったカスタマイズを強化しました。`npm install` 後、任意の SCSS ファイルで使用する YakuHanJP の SCSS ファイルを import します。変数をオーバーライドすれば、CSS から CDN のフォントファイルへダイレクトにリンクを貼ったり、EOT 形式を省いたりできます。

```scss
$yakuhanjp-eot-use: false;
$yakuhanjp-cdn-use: true;

@import "yakuhanjp/src/scss/yakuhanjp.scss";
```

## Specific Edition

### For Noto

2018 年 9 月 7 日、Google Fonts 本家に Noto Sans JP・Noto Serif JP が加わりました。日本語のサブセット配信機能がとても優秀です。ただ、通常の YakuHanJP とはウェイトが多少異なります。

そこで、専用のウェイト調整を行った CSS ファイルを用意しました。以下の CDN 配信ファイル（もしくはローカルの CSS ファイル）を読み込めば、Google Fonts 本家の Noto Sans JP・Noto Serif JP に YakuHanJP のウェイトが揃います。

|    フォント名     | HTML に貼る CDN リンクタグ                                                                                      |
| :---------------: | --------------------------------------------------------------------------------------------------------------- |
| `YakuHanJP_Noto`  | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.2.0/dist/css/yakuhanjp-noto.min.css">`   |
| `YakuHanJPs_Noto` | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.2.0/dist/css/yakuhanjp_s-noto.min.css">` |
| `YakuHanMP_Noto`  | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.2.0/dist/css/yakuhanmp-noto.min.css">`   |
| `YakuHanMPs_Noto` | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.2.0/dist/css/yakuhanmp_s-noto.min.css">` |

- [Noto Sans JP・Noto Serif JP 専用の CSS ファイルを追加 · Issue #23 · qrac/yakuhanjp](https://github.com/qrac/yakuhanjp/issues/23)

### For Narrow

macOS 10.13・iOS11 以降の Safari では、`font-family` に `-apple-system` を指定すると Sanfrancisco に加えて小ぶりのヒラギノ角ゴシックが出力されます。通常の YakuHanJP を被せると約物だけ太く大きく見えてしまいます。これは全体的に細い游ゴシックでも同様の現象がおきます。

そこで、細身のウェイト調整を行った CSS ファイルを用意しました。以下の CDN 配信ファイル（もしくはローカルの CSS ファイル）を読み込めばウェイトが自然になります。約物は細い分には気になりにくいため、対象のブラウザ以外で他のフォントと組み合わさっても影響が小さいです。

|     フォント名      | HTML に貼る CDN リンクタグ                                                                                        |
| :-----------------: | ----------------------------------------------------------------------------------------------------------------- |
| `YakuHanJP_Narrow`  | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.2.0/dist/css/yakuhanjp-narrow.min.css">`   |
| `YakuHanJPs_Narrow` | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.2.0/dist/css/yakuhanjp_s-narrow.min.css">` |

- [macOS・iOS Safari の細字を考慮した CSS ファイルを追加 · Issue #27 · qrac/yakuhanjp](https://github.com/qrac/yakuhanjp/issues/27)

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
