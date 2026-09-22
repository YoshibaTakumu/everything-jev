# Jev の概要と出力の読み方

確認日: **2026-09-22**。以下は公式資料の要約で、このリポジトリでの精度測定ではない。

## Jev は何をするか

Jev は TypeSafe が提供する System One モデル。自然言語を含む state と型付きの質問を受け、アプリケーションが分岐や順位付けに使える値を返す。一般的なチャットの返答やコードの続きを生成するモデルを置き換えるものではない。[Introduction](https://docs.typesafe.ai/introduction)、[System One](https://docs.typesafe.ai/concepts/system-one)、[コーディングエージェントとの関係](https://docs.typesafe.ai/introduction/coding-agents)。

公式は学習方針を RLCD（Reinforcement Learning for Calibrated Decisions）と説明している。確率の校正は多数の予測と結果の対応を評価する性質で、個々の判断の正しさを保証しない。モデル内部の層構成やパラメータ数など、公式に示されていない情報は推測しない。[AI primer](https://docs.typesafe.ai/introduction/machine-learning-primer)。

## 入力から出力まで

```text
アプリケーションが state と質問・候補を作る
  → Jev が各質問を評価する
  → answers と実モデル名・usage を受け取る
  → コードが検証・集約・分岐する
```

- `state`: 評価対象の文章・レコード・関連資料。文字列、JSON オブジェクト、配列を使う。
- `questions`: 質問IDをキーにした質問の集合。各質問に `type`・`instructions` と必要な `criteria` を持たせる。
- `model`: 利用するモデルIDまたはエイリアス。
- 応答: `model`、質問IDごとの `answers`、トークンの `usage`。

同一リクエストの質問は同じ state を見るが、互いの回答を参照しない。質問IDは応答を対応させるためのもので推論には渡らないため、IDだけに判断の意味を埋め込まない。[State](https://docs.typesafe.ai/concepts/state)、[Primitives](https://docs.typesafe.ai/primitives)、[HTTP API](https://docs.typesafe.ai/api)。

## 3つの質問型

| 型 | 適した問い | 定義するもの | 主な返却値 |
| --- | --- | --- | --- |
| **Choice** | 既知の候補のどれに該当するか | 候補ID → 説明の辞書。候補が網羅的でなければ `other` / `no_match` を含める | `choice`、候補ごとの `probabilities`、`confidence` |
| **Score** | 定義した段階のどこに位置するか | 低い段階から高い段階への、意味が明確な評価基準の配列 | `score`、`legend`、段階ごとの `probabilities`、`confidence` |
| **Noul** | ある条件が成立しているか | 明確な yes/no の問い。必要なら true/false の基準 | `noul`（yes の確率、0〜1） |

Choice は1つを選ぶ相対的な問い。複数ラベルを独立に付けたい場合は、候補ごとの Noul などに分ける。Score は段階番号の確率加重値なので小数になり得るが、実際の金額・日数・件数を精密に復元する用途には使わない。[Choice](https://docs.typesafe.ai/primitives/choice)、[Score](https://docs.typesafe.ai/primitives/score)。

Choice の候補名と説明は両方モデルへ渡る。質問IDとは扱いが異なる。Score の各段階は独立に評価され、モデルは段階番号や隣の基準を見ない。「前の段階より良い」と書かず、それぞれの説明だけで意味が通る基準にする。[Choice](https://docs.typesafe.ai/primitives/choice)、[Score](https://docs.typesafe.ai/primitives/score)。

Noul の 0.5 は yes/no が拮抗しているという意味で、対象の強さが「中程度」という意味ではない。強弱を測りたいなら、段階を定義した Score が適する。Noul には別の `confidence` フィールドがない。[Noul](https://docs.typesafe.ai/primitives/noul)。

## 確率と confidence を混同しない

Choice／Score の `confidence` は分布の形から得られる要約値。最大確率、正答率、実行権限とは別であり、公式に示されていない計算式を決め付けない。候補間の比較には `probabilities`、不確実な結果を退避させる設計には用途に応じた指標を使う。[Confidence](https://docs.typesafe.ai/confidence)。

高確信でも候補集合や入力が誤っていれば判断を誤り得る。権限・現在の対象・改訂番号などは別に確認する。これは、このリポジトリの [アーキテクチャ](../../../../docs/architecture.md) が採用する実行境界である。

## 説明の例

「問い合わせを自動処理したい」なら、まず問い合わせの種類を Choice、明示された緊急性を Noul、状況の複雑さを Score などで別々に評価する。その結果を使って、コードが定型処理・生成モデル・人間の担当へ振り分ける。返信文の作成や外部送信は、それぞれを担当する別の処理で行う。

この例は設計案。実際の分類品質や時間短縮は、対象の問い合わせで評価する。具体的な構成は [ARCHITECTURE.md](ARCHITECTURE.md) を参照する。
