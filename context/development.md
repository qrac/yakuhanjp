# 開発・生成・公開の手順

更新日：2026-10-23。リポジトリルートで実行する開発・生成・公開の手順です。
変更の理由と過去の検証結果は[v5比較資料](v4.1.1-to-v5.0.0.md)、資料の一覧は[索引](README.md)を参照してください。

## 環境の準備

Node.jsとnpmを用意し、`npm ci`で依存をインストールします。サイトの本番ビルドはNode 24を指定しています。
フォント・ZIPの生成には、さらにPython 3.12以上とuvが必要です。

## フォントの生成（Glyphsアプリ不要）

Python 3.12以上と[uv](https://docs.astral.sh/uv/)を用意し、リポジトリのルートで実行します。
依存関係は`uv.lock`に固定しています。元フォントは`resource`、約物の文字・余白・縦書き設定は
`packages/core/*/sources/*.json`、輪郭は`packages/core/*/outlines/*.json`から読み込みます。
生成にはFontToolsを使い、Glyphs形式のデータや専用アプリは使用しません。
調整値の意味と文字追加の手順は[coreのREADME](../packages/core/README.md)を参照してください。

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

## mergedサブセットの調査（配布仕様は未確定）

配布用サブセット版の計画は現在保留中です。ゲームの使用文字から開発時にサブセット化する方が効率的との判断で、
以下の調査結果・スクリプトは参考用に保持しています。

調査方針・結果・固定した資料の取得先は[サブセット計画](merged-subset-plan.md)を参照してください。
`scripts/research_merged_subset.py`は取得済みのTUBELEX未正規化頻度データをハッシュ検証して集計します。
通常のフォント生成・ZIPには組み込んでいません。

```sh
.venv/bin/python scripts/research_merged_subset.py \
  --input build/subset-research/source/tubelex-ja_no-normalization.tsv.xz \
  --output build/subset-research/data \
  --font-output build/subset-research/fonts
```

`--font-output`を省くと文字リストと対応範囲の集計だけを行います。試作フォントは`build/`内に限定し、
内部名も全文字版と同じままなので配布・インストール用ではありません。既存の`packages`内のフォントは変更しません。
共通の候補文字リストを維持し、元フォントにない文字はそのフォントの試作から省きます。
省略したコードポイントと対象スタイルは、出力先の`report.json`へ記録します。
別資料での評価は`scripts/evaluate_merged_subset.py`で行います。固定した入力資料の取得先・実行手順と、
基礎文字の補助枠案は[サブセット計画](merged-subset-plan.md#別資料評価と基礎文字の補助枠案)を参照してください。

## 配布物の一括ビルド

ルートの`npm run build`は次の順番で実行します。途中で失敗した場合は、後続の処理を実行しません。

1. `build:fonts:packages`：全形式のフォントを生成・検証し、`packages/core`と`packages/merged`に反映
2. `build:unicode`：`packages/unicode/dist/data.json`を更新
3. `build:main`：最新のcoreフォントからCSSとWOFF2を`packages/yakuhanjp/dist`に生成

ZIPが必要な場合は、続けて`npm run build:zip`を実行します。

Unicodeと配布用の`dist`は削除してから生成するため、古い成果物は残りません。
`packages/yakuhanjp`の`prepublishOnly`もルートの`build`を実行し、公開前に同じ更新を行います。
フォントの入力・形式が変わっていなければ、キャッシュを再利用します。
CSSだけを作り直す場合は`npm run build:main`を実行してください。

## ダウンロード版ZIP

`npm run build`でフォントとWeb用配布物を更新し、`npm run build:zip`でダウンロード版ZIPを生成します。
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

`prepublishOnly`・`npm run play`もルートの`build`を呼びますが、ZIPは生成しません。
GitHub Releases用のZIPは別途`npm run build:zip`で作成してください。

## ドキュメントサイトのビルド

Cloudflare Workersの静的アセットとして`docs/dist`を配信します。
`docs:build`は、コミット済みの`packages/core`のWOFF2からCSS生成とコピーを行ってからサイトをビルドします。

```sh
npm run docs:build

# Workers環境でローカル確認（ビルドを含む）
npm run docs:preview:workers

# Cloudflareへ手動デプロイ（ビルドを含む。事前にWranglerで認証）
npm run docs:deploy
```

フォントの再生成・Unicode生成・ZIP生成は行いません。サイトのビルドにPythonとuvは不要です。

Cloudflare Workers BuildsでGitHubリポジトリを接続し、次の設定を指定します。
ビルド・デプロイは[Cloudflare側で実行](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)します。

| 項目 | 設定 |
| --- | --- |
| Worker名 | `yakuhanjp` |
| 本番ブランチ | `main` |
| ルートディレクトリ | リポジトリルート（`/`） |
| ビルドコマンド | `npm run docs:build` |
| デプロイコマンド | `npx wrangler deploy` |
| ビルド変数 | `NODE_VERSION=24` |

静的アセットの設定は`wrangler.jsonc`で管理します。
独自ドメイン`yakuhanjp.qranoko.jp`はCloudflare側でWorkerへ接続してください。
移行時にはGitHubリポジトリのSettings → Pagesで公開を無効化し、DNSを切り替えます。

## 配布用CSSの生成設定

`packages/yakuhanjp/project.json`のフォント情報と`packages/core`のWOFF2を元に、
`packages/yakuhanjp/src/build.ts`が通常版CSS・jsDelivr向けCSS・ライセンスバナーを生成します。
フォントやウェイト、収録文字を変更するときは`project.json`を編集してください。

`npm run play`は配布用ファイルを生成してからplaygroundを起動します。
フォント情報を変更した後は、再度`npm run build`を実行してください。

