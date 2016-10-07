# Yaku Han JP

[> Demo Page](https://qrac.github.io/yakuhanjp)

## About

"Yaku Han JP"は、Web上の日本語テキストに含まれる約物を半角にする「約物半角専用Webフォント」です。GoogleのNoto Sans Japaneseをベースにしており、7ウェイト対応が可能となっています。

特に、個別にテキストを調整できない動的なサイト（WordPressなど）の見出しや長文に効果的です。静的なサイトの場合でも、CSSやJSを使った文字間調整の工数を大幅に削減できます。

7ウェイトをwoffタイプですべて読み込んでも、FontとCSSの合計容量が57KBという軽さなので、表示速度やパフォーマンスを重視するサイトでの使用にも安心です。

## Update

- 16/10/07 IE10/11のみ「text-overflow: ellipsis;」の「…」が文字化けする問題に対応（1.3）
- 16/09/28 CDNサービス「[jsDelivr](https://www.jsdelivr.com/projects/yakuhanjp)」に登録
- 16/09/27 .min.cssファイルを追加
- 16/06/12 YakuHanJPsリリース（1.2）
- 16/06/12 npm公開
- 16/06/11 編集用ファイル追加
- 16/06/11 文字の追加「！？〈〉」＆余白の調整「、。」（1.1）
- 16/06/04 YakuHanJPリリース（1.0）

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

また、バージョン1.2以降、カッコだけを半角にするSmall版（少量版）の「YakuHanJPs」を追加しました。文章中に息継ぎが必要だと感じた場合はこちらを適応ください。最小限のフォントでカッコの隙間のみを詰められます。

### Full版：約物すべて

- stylesheet="yakuhanjp.min.css"
- font-family="YakuHanJP"

```
// Include Fonts
、。！？〈〉《》「」『』【】〔〕・（）：；［］｛｝…
```

### Small版：カッコのみ

- stylesheet="yakuhanjp_s.min.css"
- font-family="YakuHanJPs"

```
// Include Fonts
〈〉《》「」『』【】〔〕（）［］｛｝…
```

## How to use

### CDN ([jsDelivr](https://www.jsdelivr.com/projects/yakuhanjp))

```
// Full
<link rel="stylesheet" href="https://cdn.jsdelivr.net/yakuhanjp/1.2.3/css/yakuhanjp.min.css">

// Small
<link rel="stylesheet" href="https://cdn.jsdelivr.net/yakuhanjp/1.2.3/css/yakuhanjp_s.min.css">
```

### npm

```
npm install yakuhanjp
```

### Local

1. データをダウンロード
2. distフォルダ以下「css」「fonts」を制作サイトに配置
3. headでCSSを読み込む
  - Full版：約物すべてを使う場合は「yakuhanjp.min.css」
  - Small版：カッコだけを使う場合は「yakuhanjp_s.min.css」
4. 適応させたいCSSのfont-familyの頭に以下を追加
  - Full版：約物すべてを使う場合は「YakuHanJP」
  - Small版：カッコだけを使う場合は「YakuHanJPs」

```
// Full
<link rel="stylesheet" href="dist/css/yakuhanjp.min.css">

// Small
<link rel="stylesheet" href="dist/css/yakuhanjp_s.min.css">
```

```
// Full
* {
  font-family: "YakuHanJP", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
}

// Small
* {
  font-family: "YakuHanJPs", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
}
```

## Media

- [YakuHanJPをCDNサービス「jsDelivr」で公開 – Qrac.JP](https://qrac.jp/archives/311)
- [YakuHanJPを作ったときの話 – Qrac.JP](https://qrac.jp/archives/296)
- [HTML5 Conference 2016のLT大会に出てしまった – Qrac.JP](https://qrac.jp/archives/279)
- [HTML5 Conference 2016 LT "Yaku Han JP" by Qrac // Speaker Deck](https://speakerdeck.com/qrac/html5-conference-2016-lt-yaku-han-jp-by-qrac)

## Library

["Noto Sans CJK JP"](https://www.google.com/get/noto/#/) licensed under the SIL Open Font License

## License

SIL Open Font License

Author: [Qrac](https://twitter.com/Qrac_jp)
