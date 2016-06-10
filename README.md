# Yaku Han JP

Web上の日本語テキストに含まれる約物を半角にする「約物半角専用Webフォント」です。

GoogleのNoto Sans Japaneseをベースにしており、7ウェイト対応が可能となっています。

- Thin ( font-weight: 100 )
- Light ( font-weight: 200 )
- DemiLight ( font-weight: 300 )
- Regular ( font-weight: 400 )
- Medium ( font-weight: 500 )
- Bold ( font-weight: 700 )
- Black ( font-weight: 900 )

[Demo](https://qrac.github.io/yakuhanjp)

## Now Test

ダウンロード無しで、今すぐにWebサイトで試してもらえるよう、CDNサービスにアップロードしました。

※CDNサービスの状態に依存しますので、サイトリリース時はCDNでは無く自サーバーにファイルを置いて参照するのをおすすめします。

1. 以下のCDNサービスリンクをサイトheadに記入。
2. 適応させたいCSSのfont-familyの頭に「YakuHanJP」を追加する。

```
<link rel="stylesheet" href="https://cdn.rawgit.com/qrac/yakuhanjp/master/dist/css/yakuhanjp.css">
・・・
<style>
* {
  font-family: "YakuHanJP",
  "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3",
  "Meiryo UI", Meiryo, メイリオ, Osaka,
  "ＭＳ Ｐゴシック", "MS PGothic",
  arial, sans-serif;
}
</style>
```

## How to use

1. データをダウンロードまたはクローン。
2. distフォルダ以下「css」「fonts」をコピー。
3. headで「yakuhanjp.css」を読み込む。
4. 適応させたいCSSのfont-familyの頭に「YakuHanJP」を追加する。

```
<link rel="stylesheet" href="dist/css/yakuhanjp.css">
・・・
<style>
* {
  font-family: "YakuHanJP",
  "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3",
  "Meiryo UI", Meiryo, メイリオ, Osaka,
  "ＭＳ Ｐゴシック", "MS PGothic",
  arial, sans-serif;
}
</style>
```

## Library

["Noto Sans CJK JP"](https://www.google.com/get/noto/#/) licensed under the SIL Open Font License

## License

SIL

Author: [Qrac](https://twitter.com/Qrac_jp)
