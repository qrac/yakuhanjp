# Yaku Han JP

## Demo

- [Demo Page][link-demo]

## About

"Yaku Han JP"は、Web上の日本語テキストに含まれる約物を半角にする「約物半角専用Webフォント」です。Googleの"Noto Sans CJK JP（源ノ角ゴシック）"と"Noto Serif CJK JP（源ノ明朝）"、丸ゴシックの"Rounded M+ 1c"をベースにしており、ゴシック体・明朝体・丸ゴシックでそれぞれ7ウェイト対応できます。

## Detail

仕組みは、文字幅を調整した「約物だけのフォント」をデバイスフォントよりも前に優先的適応することです。font-family（CSS）のフォールバック機能を利用しています。旧ブラウザ対応に優れ、動的コンテンツへの利用に最適。1つのフォントが4〜5KBと軽量なので、表示速度やパフォーマンスを重視するサイトへの使用も安心です。

## Valuation

### Include Fonts

6種類のフォントを用意しています。ゴシック体・明朝体・丸ゴシックを使い分けられる他、カッコだけを半角にするSmall Amount（少量版）が使えます。

- YakuHanJP : ゴシック体 All Include（全部入り版 : 約物すべて）
- YakuHanJPs : ゴシック体 Small Amount（少量版 : カッコのみ）
- YakuHanMP : 明朝体 All Include（全部入り版 : 約物すべて）
- YakuHanMPs : 明朝体 Small Amount（少量版 : カッコのみ）
- YakuHanRP : 丸ゴシック All Include（全部入り版 : 約物すべて）
- YakuHanRPs : 丸ゴシック体 Small Amount（少量版 : カッコのみ）

内包する文字はそれぞれ以下の通りです。

```
// YakuHanJP
、。！？〈〉《》「」『』【】〔〕・（）：；［］｛｝

// YakuHanJPs
〈〉《》「」『』【】〔〕（）［］｛｝

// YakuHanMP
、。！？《》「」『』【】〔〕・（）：；［］｛｝

// YakuHanMPs
《》「」『』【】〔〕（）［］｛｝

// YakuHanRP
、。！？〈〉《》「」『』【】〔〕・（）：；［］｛｝

// YakuHanRPs
〈〉《》「」『』【】〔〕（）［］｛｝
```

※バグ回避のため、全てのフォントに `.notdef` `space` `ellipsis` が含まれています

### Font Weight

ウェイトは7段階。付属のCSSでは以下のfont-weightで指定できます。ベースフォント毎にウエイト・ファイル名が若干異なるため、当ライブラリ内のファイル名もそれぞれのベースフォントに準じています。

#### YakuHanJP & YakuHanJPs

- font-weight: 100; // Thin
- font-weight: 200; // Light
- font-weight: 300; // DemiLight
- font-weight: 400; // Regular
- font-weight: 500; // Medium
- font-weight: 700; // Bold
- font-weight: 900; // Black

#### YakuHanMP & YakuHanMPs

- font-weight: 100; // ExtraLight
- font-weight: 200; // Light
- font-weight: 300; // Regular
- font-weight: 400; // Medium
- font-weight: 500; // SemiBold
- font-weight: 700; // Bold
- font-weight: 900; // Black

#### YakuHanRP & YakuHanRPs

- font-weight: 100; // Thin
- font-weight: 300; // Light
- font-weight: 400; // Regular
- font-weight: 500; // Medium
- font-weight: 700; // Bold
- font-weight: 800; // ExtraBold
- font-weight: 900; // Black

## Use

### [CDN][link-jsdelivr]

jsDelivrで配信しているCSSファイルへのリンクをHTML内に記述するだけで全ウェイトのフォントを利用できます。

```html
// YakuHanJP：ゴシック体（約物全部入り）
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/css/yakuhanjp.min.css">

// YakuHanJPs：ゴシック体（カッコのみ）
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/css/yakuhanjp_s.min.css">

// YakuHanMP：明朝体（約物全部入り）
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/css/yakuhanmp.min.css">

// YakuHanMPs：明朝体（カッコのみ）
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/css/yakuhanmp_s.min.css">

// YakuHanRP：丸ゴシック（約物全部入り）
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/css/yakuhanrp.min.css">

// YakuHanRPs：丸ゴシック（カッコのみ）
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/css/yakuhanrp_s.min.css">
```

### [npm][link-npm]

npmコマンドで任意のプロジェクトにインストールできます。

```
npm install yakuhanjp
```

### Download

1. データを[ダウンロード][link-download]
2. distフォルダ内の「css」「fonts」を制作サイトに配置
3. HTML内でCSSを読み込む
  - ゴシック体
    - 約物すべてを使う場合は「yakuhanjp.min.css」
    - カッコだけを使う場合は「yakuhanjp_s.min.css」
  - 明朝体
    - 約物すべてを使う場合は「yakuhanmp.min.css」
    - カッコだけを使う場合は「yakuhanmp_s.min.css」
  - 丸ゴシック
    - 約物すべてを使う場合は「yakuhanrp.min.css」
    - カッコだけを使う場合は「yakuhanrp_s.min.css」
4. CSSでフォントを適応
  - ゴシック体
    - 約物すべてを使う場合は「YakuHanJP」
    - カッコだけを使う場合は「YakuHanJPs」
  - 明朝体
    - 約物すべてを使う場合は「YakuHanMP」
    - カッコだけを使う場合は「YakuHanMPs」
  - 丸ゴシック
    - 約物すべてを使う場合は「YakuHanRP」
    - カッコだけを使う場合は「YakuHanRPs」

```html
// YakuHanJP：ゴシック体（約物全部入り）
<link rel="stylesheet" href="dist/css/yakuhanjp.min.css">

// YakuHanJPs：ゴシック体（カッコのみ）
<link rel="stylesheet" href="dist/css/yakuhanjp_s.min.css">

// YakuHanMP：明朝体（約物全部入り）
<link rel="stylesheet" href="dist/css/yakuhanmp.min.css">

// YakuHanMPs：明朝体（カッコのみ）
<link rel="stylesheet" href="dist/css/yakuhanmp_s.min.css">

// YakuHanRP：丸ゴシック（約物全部入り）
<link rel="stylesheet" href="dist/css/yakuhanrp.min.css">

// YakuHanRPs：丸ゴシック（カッコのみ）
<link rel="stylesheet" href="dist/css/yakuhanrp_s.min.css">
```

```css
// YakuHanJP：ゴシック体（約物全部入り）
.yakuhanjp {
  font-family: YakuHanJP, "Hiragino Sans", Meiryo, "Yu Gothic Medium", sans-serif;
}

// YakuHanJPs：ゴシック体（カッコのみ）
.yakuhanjps {
  font-family: YakuHanJPs, "Hiragino Sans", Meiryo, "Yu Gothic Medium", sans-serif;
}

// YakuHanMP：明朝体（約物全部入り）
.yakuhanmp {
  font-family: YakuHanMP, "Hiragino Mincho ProN", "Yu Mincho", YuMincho, serif;
}

// YakuHanMPs：明朝体（カッコのみ）
.yakuhanmps {
  font-family: YakuHanMPs, "Hiragino Mincho ProN", "Yu Mincho", YuMincho, serif;
}

// YakuHanRP：丸ゴシック（約物全部入り）
.yakuhanrp {
  font-family: YakuHanRP, "Rounded Mplus 1c", sans-serif;
}

// YakuHanRPs：丸ゴシック（カッコのみ）
.yakuhanrps {
  font-family: YakuHanRPs, "Rounded Mplus 1c", sans-serif;
}
```

## Custom

### Font face

1. 利用するフォントファイルへのリンクを個別に取得（CDNの場合）
  - [YakuHanJP](https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/fonts/YakuHanJP/)
  - [YakuHanJPs](https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/fonts/YakuHanJPs/)
  - [YakuHanMP](https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/fonts/YakuHanMP/)
  - [YakuHanMPs](https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/fonts/YakuHanMPs/)
  - [YakuHanRP](https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/fonts/YakuHanRP/)
  - [YakuHanRPs](https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/fonts/YakuHanRPs/)
2. CSS内にfont-faceを記述（以下はYakuHanJPで300のウェイトを細くしfont-displayを適応した例）

```css
// Demi Light > Light
@font-face {
  font-family: "YakuHanJP";
  font-style: normal;
  font-weight: 300;
  src: url("https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/fonts/YakuHanJP/YakuHanJP-Light.eot");
  src: url("https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/fonts/YakuHanJP/YakuHanJP-Light.woff2") format("woff2"),
  url("https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/fonts/YakuHanJP/YakuHanJP-Light.woff") format("woff");
  font-display: swap;
}
```

## Support

| Chrome | Firefox | IE | Ege | Opera | Safari(Mac) |
|:------:|:------:|:------:|:------:|:------:|:------:|
| 55~ | 50~ | 9~ | 14~ | 36~ | 6~ |

| Safari(iOS) | Chrome(Android) | Browser(Android) |
|:------------:|:------------:|:------------:|
| 7~ | 51~ | 4.4~ |

## Media

- [HTML5 Conference 2016 LT "Yaku Han JP" by Qrac // Speaker Deck](https://speakerdeck.com/qrac/html5-conference-2016-lt-yaku-han-jp-by-qrac)

## License

- Yaku Han JP : SIL OFL 1.1
- Author : [Qrac][link-twitter]
- Author Group: [QRANOKO][link-qranoko]
- Gothic fonts : Based on ["Noto Sans CJK JP"][link-notosans] licensed under the SIL OFL 1.1
- Mincho fonts : Based on ["Noto Serif CJK JP"][link-notoserif] licensed under the SIL OFL 1.1
- Round Gothic fonts : Based on ["Rounded M+ 1c"][link-notoserif] licensed under the M+ FONTS LICENSE

[link-demo]:https://qrac.github.io/yakuhanjp
[link-download]:https://github.com/qrac/yakuhanjp/archive/master.zip
[link-npm]:https://www.npmjs.com/package/yakuhanjp
[link-jsdelivr]:https://cdn.jsdelivr.net/npm/yakuhanjp/
[link-notosans]:https://www.google.com/get/noto/#sans-jpan
[link-notoserif]:https://www.google.com/get/noto/#serif-jpan
[link-roundedmplus1c]:http://jikasei.me/font/rounded-mplus/
[link-twitter]:https://twitter.com/Qrac_JP
[link-qranoko]:https://qranoko.jp