# セットアップと最初の確認

確認日: **2026-09-22**。使いたい経路だけを選ぶ。以下のライブ例は推論リクエストを送るため、利用者が実行を依頼している場合に使う。本スキルを読むだけでは接続や課金を開始しない。

掲載例は `@typesafe-ai/sdk` 0.6.0 と `typesafe-sdk` 0.7.1 の模擬通信で、リクエスト形式と応答の読み方を検証した。ライブAPIへの接続やモデルの判断品質は、この検証に含まない。

## 1. コードを書かず試す

[Playground](https://console.typesafe.ai/playground) で state と質問を設定する。まず架空の短い文章と1つの Noul から始め、Choice と Score を足して応答の違いを見る。[公式 Quick start](https://docs.typesafe.ai/introduction/quickstart)。

API利用時は [公式コンソール](https://console.typesafe.ai/keys) でキーを管理し、実行環境の `TYPESAFE_API_KEY` に設定する。キーをチャット・ソース・シェル履歴へ直接記載しない。サーバー側で利用し、ブラウザへキーを配布しない。[JavaScript client config](https://docs.typesafe.ai/sdk/javascript/api/interfaces/TypeSafeClientConfig)。

## 2. このリポジトリをオフラインで試す

`everything-jev` のルートで実行する。Node と pnpm の版は `.node-version`・`package.json` を正とする。確認時点は Node 24、pnpm 12.5.1。

```sh
pnpm --version
pnpm install --frozen-lockfile
pnpm hooks:install
pnpm build
pnpm jev list
pnpm jev inspect contact-filter
pnpm jev demo contact-filter
pnpm verify
```

`demo` は固定の架空応答で動作し、APIキーは不要。モデルを実際に評価した結果ではない。`inspect` で送信予定の state と質問を読む。[CONTRIBUTING.md](../../../../CONTRIBUTING.md)、[ローカルCLI](../../../../docs/api.md)。

ライブ評価を依頼された場合は、環境変数を設定したうえで、送信してよい入力を指定する。

```sh
pnpm jev evaluate contact-filter --input examples/contact.json --live
```

このCLIは `.env` を自動読込しない。gitignored な `.env` を明示的に使う場合は、次のように起動する。

```sh
node --env-file=.env dist/cli.js evaluate contact-filter --input examples/contact.json --live
```

入力ファイルは state を置き換える。候補やルーブリックを変更したい場合は、リクエストをコードで定義する。CLIの終了コード0は外部操作の承認ではなく、JSON内の判断結果を読む。[ローカルCLIの仕様](../../../../docs/api.md)。

## 3. 公式 JavaScript / TypeScript SDK

公式SDKの確認時点の要件は Node.js 20以降。**このリポジトリの要件は Node 24**。新しい利用側プロジェクトで公式SDKを使う場合の例であり、既存の `JevClient` を自動で置き換えない。[JavaScript SDK](https://docs.typesafe.ai/sdk/javascript)。

```sh
pnpm add @typesafe-ai/sdk
```

`example.mjs` として保存する。先に `TYPESAFE_API_KEY` を実行環境へ設定する。

```javascript
import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient({ defaultModel: "jev-1.13.0" });
const result = await client.systemOne({
  state: { message: "Where can I read the API documentation?" },
  questions: {
    requests_docs: noul("Does `message` explicitly request documentation?"),
  },
});
console.log({ model: result.model, answer: result.answers.requests_docs });
```

```sh
node example.mjs
```

`defaultModel` はクライアント設定、`model` はリクエストごとの上書き。SDK既定はエイリアスのため、再現性が必要なら版を指定し、応答の実モデル名も記録する。[TypeSafeClientConfig](https://docs.typesafe.ai/sdk/javascript/api/interfaces/TypeSafeClientConfig)、[SystemOneRequest](https://docs.typesafe.ai/sdk/javascript/api/interfaces/SystemOneRequest)。

## 4. 公式 Python SDK

Python 3.10以降。利用側の独立した仮想環境にインストールする。[Quick start](https://docs.typesafe.ai/introduction/quickstart)、[Python SDK](https://docs.typesafe.ai/sdk/python)。

```sh
python3 -m venv .venv
. .venv/bin/activate
python -m pip install typesafe-sdk
```

`example.py` として保存し、同じ環境変数を設定してから実行する。

```python
from typesafe_sdk import Noul, TypeSafeClient

with TypeSafeClient(model="jev-1.13.0") as client:
    result = client.system_one(
        state={"message": "Where can I read the API documentation?"},
        questions={
            "requests_docs": Noul(
                instructions="Does `message` explicitly request documentation?"
            )
        },
    )
print(result.model, result.answers["requests_docs"].noul)
```

```sh
python example.py
```

非同期処理には `AsyncTypeSafeClient` がある。同期版と名前や引数を混同せず、[同期クライアント](https://docs.typesafe.ai/sdk/python/api/clients/sync)・[非同期クライアント](https://docs.typesafe.ai/sdk/python/api/clients/async) の利用版を確認する。

## 5. SDKを使わず HTTP で呼ぶ

次を `request.json` に保存する。内容は架空の入力例。

```json
{
  "model": "jev-1.13.0",
  "state": { "message": "Where can I read the API documentation?" },
  "questions": {
    "requests_docs": {
      "type": "noul",
      "instructions": "Does `message` explicitly request documentation?"
    }
  }
}
```

```sh
curl --fail-with-body https://api.typesafe.ai/v1/systemone \
  -H "Authorization: Bearer $TYPESAFE_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @request.json
```

HTTP仕様は [API reference](https://docs.typesafe.ai/api)。応答の `answers.requests_docs.noul` と `model`・`usage` を確認する。値を固定の正解と決め付けず、範囲と質問との対応を検証する。

## 接続で困った場合

| 状況 | 確認すること |
| --- | --- |
| 401 | キーの設定先・有効性・Bearer認証。キー自体は出力しない |
| 422 | HTTP仕様に対する state・questions・criteria の型や必須項目 |
| 429 / 529 | レート制限／過負荷。再試行の待機指示、回数、全体の期限を確認 |
| タイムアウト | 通信・入力サイズ・1回当たりの時間と再試行込みの時間を分ける |
| 高確信なのに誤る | 候補漏れ、質問の曖昧さ、入力の不足、言語や境界例を点検 |

公式SDKには既定の再試行処理があるが、このリポジトリの `JevClient` は自動再試行しない。ローカルの2 MiB制限とタイムアウトも、本APIのトークン上限とは別である。[APIエラー](https://docs.typesafe.ai/api)、[Python retries](https://docs.typesafe.ai/sdk/python/api/retries)、[JavaScript RetryPolicy](https://docs.typesafe.ai/sdk/javascript/api/interfaces/RetryPolicy)、[ローカル実装](../../../../docs/api.md)。

SDKのデバッグログに本文が含まれる場合がある。テストでは架空入力と模擬通信を使い、ログの扱いは利用版の設定を読む。接続成功と対象業務の精度評価を分け、次は [LIMITATIONS.md](LIMITATIONS.md) の評価条件を確認する。

## 公式のエージェント用スキルとの違い

本スキルは概要・設計・導入を案内する独自資料。別途公開されている [公式 TypeSafe skill](https://docs.typesafe.ai/agent-skill) は、[公式リポジトリ](https://github.com/typesafe-ai/skills/tree/main/skills/typesafe-ai) にある。追加導入を依頼された場合に公式の現行手順を確認し、重複する方法で複数コピーを作らない。
