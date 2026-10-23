# 開発コンテキスト

YakuHanJPの開発中の仕様変更と、その判断材料を記録します。
チャットをまたぐ進捗・判断の記録方法は、[AGENTS.md](../AGENTS.md)に定めています。

- [開発・生成・公開の手順](development.md)：環境準備、フォント・CSS・Unicode・ZIPの生成、Cloudflare Workersへの公開（2026-10-23：ルートREADMEから移動し、現在のコマンドと照合）
- [v4.1.1からv5.0.0への変更点](v4.1.1-to-v5.0.0.md)：公開APIの維持範囲、フォント生成、ビルド・ZIP作成・公開手順、サイトとPlaygroundの変更、検証結果（2026-10-23：GitHub PagesからCloudflare Workersへの移行設定を追加）
- [mergedサブセット版の調査・計画](merged-subset-plan.md)：**保留中（2026-10-21ユーザー指定）**。ゲームの使用文字から開発時にサブセット化する方が効率的との判断。候補文字・省略方針・別資料評価・計24フォントの実測と計画を参考資料として保持（配布用ビルドは未実装）
- [ルートREADME](../README.md)：ブラウザ版・マージ版の概要、各パッケージの案内、Media・License・Credit
- [coreの編集ガイド](../packages/core/README.md)：文字追加、左右余白、固定幅、縦書きの設定
- [Playgroundのガイド](../playground/README.md)：ブラウザーでの比較とCanvas画像生成

比較資料は2026-10-21時点のスナップショットです。v5.0.0は開発中で、未コミットの更新も含みます。
仕様を変更したときは、実装と各READMEに加えて比較資料も更新してください。
