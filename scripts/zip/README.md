# Yaku Han JP v{{VERSION}}

Yaku Han JP（ヤクハンジェイピー）は、日本語テキストに含まれる約物を半角にするフォントです。

- 公式サイト：https://yakuhanjp.qranoko.jp
- ソース・リリース：https://github.com/qrac/yakuhanjp
- 制作者：[Qrac](https://qrac.jp) / [QRANOKO](https://qranoko.jp)

## フォントの選び方

- `core/`：約物だけを収録したフォント。他の日本語フォントと組み合わせ、約物に適用して使用します。
- `merged/`：元の日本語フォントへ半角約物を組み込んだフォント。通常の日本語フォントとして使用できます。ファイル名は`MergedYakuHanJP-Regular.otf`などです。

| ファミリー | 書体 | 元フォント |
| --- | --- | --- |
| YakuHanJP / YakuHanJPs | ゴシック体 | Noto Sans JP |
| YakuHanMP / YakuHanMPs | 明朝体 | Noto Serif JP |
| YakuHanRP / YakuHanRPs | 丸ゴシック体 | M PLUS Rounded 1c |

末尾の`s`はカッコだけを半角にする版です。末尾に`s`がない版は収録対象の約物全体を半角にします。
各ファミリーのウェイトはファイル名で確認できます。

## インストール

使用するフォントのOTFまたはTTFを選び、OSのフォントインストール機能で追加してください。
OTFとTTFは同じファミリー・スタイルの別形式です。同じスタイルはどちらか一方をインストールしてください。
利用するアプリが対応する形式を選んでください。全字形の形式変換を避けたい場合、JP/RP系はTTF、MP系はOTFが元フォントと同じ形式です。

Web向けのCSS・WOFF2は同梱していません。Webでは[npm](https://www.npmjs.com/package/yakuhanjp)または[CDN](https://cdn.jsdelivr.net/npm/yakuhanjp/)をご利用ください。

## ライセンス

プロジェクトのライセンス表記は`SIL OFL 1.1 AND MIT`です。
収録フォントにはSIL Open Font License 1.1が適用されます。
元フォントの著作権表記とOFL全文を`LICENSES/`の各元フォント名フォルダーに、MIT全文を`LICENSES/MIT.txt`に収録しています。
フォント内の著作権・ライセンス情報も参照してください。
