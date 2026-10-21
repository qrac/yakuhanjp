# Playground

リポジトリのルートで依存関係をインストールして起動します。

```sh
npm install
npm run play        # ブラウザーで約物フォントの適用前後を比較
npm run play:canvas # マージフォントを使ったCanvas・OGP画像生成
```

Canvasの画像生成APIはVite開発サーバー専用です。生成には`packages/merged`のフォントファイルが必要です。`node-canvas`を使い、1200 × 630のPNGを返します。

入力値はURLのクエリに保存されるため、そのままURLを共有できます。編集時は現在の履歴を更新し、空のテキストも復元します。画像生成ではフォントごとに存在するウェイトだけを選択できます。

## 構成

- `_default`: フォント比較画面
- `canvas`: Canvas・OGP画像生成の画面、API処理、テスト
- `canvas/src/canvas.ts`: フォント登録・改行・折り返し・PNG出力
- `shared`: 両画面で使用する選択肢、URL同期、共通スタイル

Vite設定から読み込むローカルモジュールは`.ts`まで指定しています。`shared`もESMとして扱い、`--configLoader native`で読み込める構成です。

## 確認

```sh
npm run play:check
npm run play:test
```

APIテストではnativeローダーでViteを起動し、PNGのサイズ・全フォントの生成・無効な入力への応答を確認します。テスト実行にはTypeScriptを直接読み込めるNode.js 22.18以降と、ローカルポートの使用許可が必要です。
