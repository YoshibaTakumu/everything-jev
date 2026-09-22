# everything-jev

**Jev の構造化された判定を、検証できる自動化に組み込むための TypeScript ツールキット。**

[English](README.md) · [22 のレシピ](docs/cookbook.md) · [ハーネスへの組み込み](docs/harness.md) · [調査資料](docs/sources.md)

[技術ドキュメント索引](docs/README.md) · [採用技術と管理方法](docs/tech-stack/README.md)

TypeSafe の Jev を使う共通クライアント、回答の検証、判定ポリシー、用途別の実行可能なサンプルをまとめた独立 OSS です。MIT ライセンス、ランタイム依存なし。開発・業務・ドキュメント・メディアの自動化を扱います。

## まず動かす

Node.js 24.x、pnpm 12.5.1 を用意してください。CI は `.node-version` に指定した Node 24 で実行します。

```sh
git clone https://github.com/YoshibaTakumu/everything-jev.git
cd everything-jev
pnpm install --frozen-lockfile
pnpm hooks:install
pnpm build
pnpm jev list
pnpm jev demo all
pnpm verify
```

開発には TypeScript 7、整形には Biome、lint には oxlint、テストには Vitest 5 を使います。Lefthook がローカルの Git フックを実行し、commitlint がローカルと CI で Conventional Commits を検査します。`pnpm verify` で整形・lint・コンパイル・テストを確認します。詳細は [CONTRIBUTING](CONTRIBUTING.md) を参照してください。

デモは API キー不要です。**回答は手書きの固定データで、Jev の推論結果や精度測定ではありません。** 入力、判定、保留、権限の扱いを確認するためのものです。デモの権限確認も架空の値です。

実際に Jev を呼ぶ場合は、環境変数 `TYPESAFE_API_KEY` を安全に設定し、送信内容を確認して実行します。

```sh
pnpm jev inspect contact-filter
pnpm jev evaluate contact-filter --input examples/contact.json --live
```

`--input` は判定対象の JSON データです。質問や候補はレシピ側で定義します。JSON の内容は TypeSafe の API に送信されます。`.env` は自動では読み込みません。ライブ実行でも CLI は外部システムの権限を確認できないため、結果を `review` にします。

## 内部の考え方

**観測 → 候補の限定 → Jev の判定 → 回答の検証 → コードによる条件確認 → 提案・保留・ブロック**。

Jev には曖昧な意味の判断を渡し、会社・ユーザーの権限、同意、依存関係、更新版、金額計算、送信、保存、再検証はアプリケーションが担当します。モデルの confidence を実行許可に変換しません。

短期・長期メモリーは外部ストアに保存し、Jev は保存候補や検索候補の選別を担います。音声は ASR・応答生成・TTS、動画は文字起こし・編集 API・レンダリング、スライドはテンプレート・生成コード・画像確認と組み合わせます。

## 初版の収録内容

| 分野       | レシピ                                                                                 |
| ---------- | -------------------------------------------------------------------------------------- |
| 開発       | ハーネス、意味 lint、コードレビュー、セキュリティ、エージェント管理、Issue の順序付け  |
| 知識・操作 | ノートのタグ、メモリー、ブラウザー、タイピングゲーム、デスクトップ、音声のルーティング |
| 業務       | SEO / AIEO、LINE、メール、問い合わせの振り分け、会計、法務                             |
| 制作       | Google Docs、PowerPoint、コードで作るスライド、動画編集                                |

実装済みなのは、API クライアントと検証、保留を含む判定ポリシー、22 レシピ、Issue の依存グラフ、メモリーの参照範囲チェック、評価指標、CLI とテストです。

**各サービスへの接続、送信、会計への記帳、実際のスライド生成などは未実装で、接続設計を文書化しています。** v0.1.0 のテストは通信の模擬応答を使います。実 API の品質評価、実顧客データでの検証、22 サービスへの接続完了を意味しません。npm への公開も行っていません。

## 本番へ組み込む

[ハーネス設計](docs/harness.md)に、読み取り時の振り分け、lint、レビュー、Issue 管理、メモリー、操作前の判定、制作フローへの組み込みを整理しています。[評価](docs/evaluation.md)では誤判定と保留率を測ります。閾値は例示なので、対象言語・業務・モデルのバージョンごとに検証してください。

原則をコードで試せる状態から始め、外部 adapter を実装し、更新競合・重複処理・権限・誤判定を含めて検証する構成です。すべての操作が自動的に安全になるという保証はありません。

TypeSafe や各サービスの公式プロジェクトではありません。元になった研究と公開実装へのリンクは [sources](docs/sources.md)、参加方法は [CONTRIBUTING](CONTRIBUTING.md) を参照してください。
