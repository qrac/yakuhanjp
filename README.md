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

v4.1.1から開発中のv5.0.0への変更点は[context](context/README.md)にまとめています。

### フォントの生成（Glyphsアプリ不要）

Python 3.12以上と[uv](https://docs.astral.sh/uv/)を用意し、リポジトリのルートで実行します。
依存関係は`uv.lock`に固定しています。元フォントは`resource`、約物の文字・余白・縦書き設定は
`packages/core/*/sources/*.json`、輪郭は`packages/core/*/outlines/*.json`から読み込みます。
生成にはFontToolsを使い、Glyphs形式のデータや専用アプリは使用しません。
調整値の意味と文字追加の手順は[coreのREADME](packages/core/README.md)を参照してください。

```sh
# 全6ファミリー・46ウェイトをbuild/fontsに生成（既存の配布ファイルは上書きしません）
npm run build:fonts

# ファミリー・ウェイトを限定して試す
npm run build:fonts -- --family YakuHanJP --weight 400

# 約物フォントだけ生成
npm run build:fonts -- --target core

# マージ版をTTFとOTFの両方で生成（全字形の形式変換が必要なため低速）
npm run build:fonts -- --merged-format both

# 公開前に全形式でpackages/coreとpackages/mergedを更新
npm run build:fonts -- --merged-format both --output packages

# 生成処理と既存フォントとの互換性を検証
npm run test:fonts
```

`core`にはTTF・OTF・WOFF2、`merged`には元フォントと同じ形式（JP/RPはTTF、MPはOTF）を生成します。
変更のないスタイルはスキップします。`--force`で全て作り直せます。
生成・キャッシュは常に`build/fonts`で行い、`--output packages`は検証済みの生成物をコピーします。
同じ入力と形式で生成済みなら、出力先を変えても再ビルドせず、不足する形式だけ生成します。
マージは元フォントの収録文字とOpenType機能を維持し、約物と縦書き用の代替字形を置き換えます。
置き換えた約物には`palt`・`halt`・`vpal`・`vhal`による追加の詰め処理を適用しません。
ルートの`npm run build`もPythonとuvを使用し、全形式のフォント更新から配布ファイルの生成まで実行します。
`npm run build -w core`と`npm run build -w merge`は各パッケージのフォントを直接更新します。

バイナリの完全一致は保証しません。Glyphsとコンパイラが異なるため、ヒンティングや曲線変換、
内部テーブルに差が出ます。公開前にはplaygroundで表示も確認してください。
また、既存のマージ版には約物ソースと幅が異なる文字があります（例：YakuHanJP Regularの`！`）。
新しいマージ版は約物ソースの幅を採用するため、既存のマージ版から文字送りが変わる場合があります。

### 配布物の一括ビルド

ルートの`npm run build`は次の順番で実行します。途中で失敗した場合は、後続の処理を実行しません。

1. `build:fonts:packages`：全形式のフォントを生成・検証し、`packages/core`と`packages/merged`に反映
2. `build:unicode`：`packages/unicode/dist/data.json`を更新
3. `build:main`：最新のcoreフォントからCSSとWOFF2を`packages/yakuhanjp/dist`に生成
4. `build:zip`：core・mergedのTTFとOTFを`build/zip/YakuHanJP_v<version>.zip`に梱包

Unicodeと配布用の`dist`は削除してから生成するため、古い成果物は残りません。
`packages/yakuhanjp`の`prepublishOnly`もルートの`build`を実行し、公開前に同じ更新を行います。
フォントの入力・形式が変わっていなければ、キャッシュを再利用します。
CSSだけを作り直す場合は`npm run build:main`を実行してください。

### ダウンロード版ZIP

`npm run build`でWeb用配布物とダウンロード版ZIPをまとめて生成します。
ZIP名と展開後のフォルダー名には`packages/yakuhanjp/package.json`のバージョンを使います
（例：`build/zip/YakuHanJP_v5.0.0.zip`、展開後は`YakuHanJP_v5.0.0/`）。

ZIPには`core/<family>/{otf,ttf}/`と`merged/<family>/{otf,ttf}/`の全6ファミリー・46スタイル、
合計184フォントと、専用README・ライセンスを収録します。WOFF2・CSS・編集用JSONは含みません。
READMEとMIT本文は`scripts/zip/`、元3フォントのOFL本文・著作権表記は`resource/*/OFL.txt`から同梱します。

```sh
# 生成済みのpackages/core・packages/mergedからZIPだけを作り直す
npm run build:zip

# フォントの変更を反映してZIPを作る（Web用配布物の生成は省略）
npm run build:fonts:packages && npm run build:zip
```

`build:zip`単独ではフォントを再生成しません。定義されたフォントやライセンスが欠損・空の場合は失敗し、
同じバージョンの既存ZIPも削除します。ZIPは完成してから出力先に配置します。
梱包処理のテストは`npm run test:fonts`に含まれます。
GitHub Releasesへの添付は別途行ってください。

`prepublishOnly`・`npm run play`・ドキュメントサイトのCIでもルートの`build`を呼ぶためZIPを生成します。
ZIP生成に失敗した場合は後続処理を停止します。

### 配布用CSSの生成設定

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
