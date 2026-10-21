# フォントの字形と余白の設定

Glyphsアプリや`.glyphs`ファイルは不要です。
各ファミリーの`./YakuHanJP/sources/Regular.json`などが、文字と調整値の編集場所です。
輪郭は対応する`outlines/Regular.json`に分離しています。
既存の46スタイルの輪郭と数値は、従来のGlyphsソースから移行しました。

## 余白・幅を調整する

`YakuHanJP/sources/Regular.json`の例です。数値はフォント内部の単位で、1000が1emです。

```json
"uni300C": {
  "characters": "「",
  "left": 200,
  "right": 34,
  "advanceHeight": 1000,
  "verticalOrigin": 880,
  "verticalGlyph": "uniFE41"
}
```

| 設定 | 意味 |
| --- | --- |
| `characters` | この字形を割り当てる文字。複数文字を同じ字形に割り当てることも可能 |
| `left` | 左余白。輪郭をこの位置に移動する |
| `right` | 右余白。送り幅は`left + 輪郭の境界幅 + right` |
| `advanceWidth` | 任意の固定送り幅。指定時は右余白による幅計算より優先する |
| `offsetY` | 任意の輪郭の上下移動量。正の値で上へ移動する |
| `advanceHeight` | 縦書きの送り幅。省略時は1000 |
| `verticalOrigin` | 縦書きの原点のY座標。省略時はメタデータの`sTypoAscender` |
| `verticalGlyph` | 縦書き時に置き換える字形名。置き換え先も`glyphs`に定義する |
| `outline` | 任意の輪郭参照名。省略時はこのエントリーのキー名 |
| `source` | 保存済み輪郭の代わりに元フォントの字形を使う指定（後述） |

境界幅はTrueTypeの制御点を含む境界から計算します。
空白文字は輪郭の幅が0なので、`right`または`advanceWidth`で幅を設定します。
余白を変えても輪郭そのものの形・大きさは変わりません。
横書きと縦書きの字形は別のエントリーなので、それぞれ調整できます。
値はスタイルごとに独立しています。全ウェイトで変更する場合は各JSONを更新します。

## 元フォントから文字を追加する

`glyphs`に新しいエントリーを追加します。元フォントは同じJSONの`baseFont`で指定しています。
`source.character`で文字を指定すれば、輪郭を手書きする必要はありません。

```json
"uni2026": {
  "characters": "…",
  "source": { "character": "…" },
  "left": 80,
  "right": 80,
  "advanceHeight": 1000,
  "verticalOrigin": 880
}
```

`source`には文字の代わりに`{"glyph": "字形名"}`も指定できます。
縦書き用の字形を元フォントから取り出す場合は、`"vertical": true`を追加します。
自作の輪郭を使う場合は`outlines`に追加し、`source`を省略してください。
輪郭ファイルはFontToolsのペン命令（`moveTo`、`lineTo`、`qCurveTo`、`closePath`）と座標の配列です。
既存字形のコピーは、同じ`outline`名を指定して別の余白を設定できます。

配布する収録文字を増やす場合は、対象の各スタイルに追加し、
`packages/yakuhanjp/project.json`の該当ファミリーの`glyphs`にも追加してください。
こちらはサイトと配布CSSの収録文字情報に使われます。

## 確認とビルド

リポジトリルートで実行します。

```sh
# 編集したスタイルだけ確認する
npm run build:fonts -- --family YakuHanJP --weight 400

# 約物フォントだけを全スタイル生成する（マージ処理を省略）
npm run build:fonts -- --target core

# 元フォントと異なる形式も必要な場合に、TTFとOTFの両方を生成する
npm run build:fonts -- --merged-format both

# キャッシュを使わず再生成する
npm run build:fonts -- --force

# 公開前に配布元を全形式で更新してCSSも生成する
npm run build:fonts -- --merged-format both --output packages
npm run build
```

標準のマージ版は、元フォントの形式（JP/RPはTTF、MPはOTF）を維持します。
異なる形式への全字形の変換を省略するため、高速で未変更の字形のヒンティングも維持できます。
変更のないスタイルは、入力と出力のハッシュを確認してスキップします。
生成とキャッシュは常に`build/fonts`で行います。
`--output packages`など別の出力先を指定した場合は、生成済みのファイルを検証してコピーします。
入力と形式が同じなら、出力先を変えても再ビルドしません。
形式ごとにキャッシュするため、通常ビルドの後に`--merged-format both`を指定すると不足する形式だけを生成します。
コピー先に同じファイルがある場合はコピーもスキップします。`sources`と`outlines`はコピー対象に含みません。
キャッシュ情報は`build/fonts/.font-build-cache.json`で、削除しても再生成できます。
別の形式で過去に生成したファイルは自動では削除しません。
公開時に両形式を配布する場合は`--merged-format both`を指定して全形式を更新します。

`npm run test:fonts`には既存版との数値比較が含まれています。
意図的に余白や収録文字を変えた場合は、比較対象のフォントも更新したうえで再確認してください。
`metadata`はフォント名・ライセンス・行の高さなどの情報で、通常の余白調整には編集不要です。
