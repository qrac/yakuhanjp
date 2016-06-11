# Yaku Han JP

[![NPM](https://nodei.co/npm/yakuhanjp.png?downloads=true)](https://nodei.co/npm/yakuhanjp/)

[> Demo Page](https://qrac.github.io/yakuhanjp)

## About

"Yaku Han JP"は、Web上の日本語テキストに含まれる約物を半角にする「約物半角専用Webフォント」です。GoogleのNoto Sans Japaneseをベースにしており、7ウェイト対応が可能となっています。

FontとCSSの合計容量が164KBという軽さなので、表示速度やパフォーマンスを重視するサイトでの使用にも安心です。

特に、個別にテキストを調整できない動的なサイト（WordPressなど）のの見出しや長文に効果的です。静的なサイトの場合でも、CSSやJSを使った文字間調整の工数を大幅に削減できます。

IllustratorやPhotoshopで「約物半角」機能を活用してきたデザイナーが、より理想的なWebデザインを作れるようになってくれれば幸いです。

## Detail

仕組みは日本語サイトの英語に欧文フォントを当てる場合と同じで、文字幅を調整した約物のみで構成されたフォントをデバイスフォントの前に優先適応させるというシンプルなものです。

ウェイトは7段階あり、CSSでは以下のfont-weightで指定できます。

- Thin ( font-weight: 100 )
- Light ( font-weight: 200 )
- DemiLight ( font-weight: 300 )
- Regular ( font-weight: 400 )
- Medium ( font-weight: 500 )
- Bold ( font-weight: 700 )
- Black ( font-weight: 900 )

## How to use

### CDN

```
<link rel="stylesheet" href="https://cdn.rawgit.com/qrac/yakuhanjp/master/dist/css/yakuhanjp.css">
```

### npm

```
npm install yakuhanjp
```

### Local

1. データをダウンロード。
2. distフォルダ以下「css」「fonts」を制作サイトに配置。
3. headで「yakuhanjp.css」を読み込む。
4. 適応させたいCSSのfont-familyの頭に「YakuHanJP」を追加。

```
<link rel="stylesheet" href="dist/css/yakuhanjp.css">
```

```
* {
  font-family: "YakuHanJP",
  "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3",
  "Meiryo UI", Meiryo, メイリオ, Osaka,
  "ＭＳ Ｐゴシック", "MS PGothic",
  arial, sans-serif;
}
```

## Library

["Noto Sans CJK JP"](https://www.google.com/get/noto/#/) licensed under the SIL Open Font License

## License

SIL Open Font License

Author: [Qrac](https://twitter.com/Qrac_jp)
