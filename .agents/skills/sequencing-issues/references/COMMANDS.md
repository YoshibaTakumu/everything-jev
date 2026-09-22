# 依存グラフの取得と書き込み

[sequencing-issues](../SKILL.md) の取得・変更・照合、および [monitoring-frontier](../../monitoring-frontier/SKILL.md) の読み取りで使う。例の `{owner}`・`{repo}`・番号は対象に置き換える。repository を明示し、作業ディレクトリから別 repository を推測しない。

最初に `gh --version`、`gh issue view --help`、`gh issue edit --help` で利用可能な field と flag を確認する。未対応の操作は GitHub API を使う。別のツールを使う場合も、native な依存・ページネーション・読み書きの対応を実際の機能から判断する。

## グラフを取得する

次は1つの Issue とその接続の先頭ページを読む例である。これだけで全グラフを取得したとは扱わない。

```bash
gh api graphql -F owner='{owner}' -F repo='{repo}' -F number=123 -f query='
query($owner:String!,$repo:String!,$number:Int!){
  repository(owner:$owner,name:$repo){
    issue(number:$number){
      id number title body state updatedAt url repository{nameWithOwner}
      assignees(first:50){
        pageInfo{hasNextPage endCursor}
        nodes{login}
      }
      subIssues(first:50){
        pageInfo{hasNextPage endCursor}
        nodes{id number state url repository{nameWithOwner}}
      }
      blockedBy(first:50){
        pageInfo{hasNextPage endCursor}
        nodes{id number state url repository{nameWithOwner}}
      }
      closedByPullRequestsReferences(first:50,includeClosedPrs:true){
        pageInfo{hasNextPage endCursor}
        nodes{number state isDraft headRefOid url repository{nameWithOwner}}
      }
    }
  }
}'
```

- `hasNextPage` が true の接続は、その Issue と接続の `after` に対応する `endCursor` を渡して続きを取る。親の続きを取るだけでは、子の blocker や PR の続きは取れない。
- 子を持つ Issue を再帰的に展開し、各子について同じ接続を読む。範囲外の blocker も、未完了の依存の根を調べるために辿る。repository と番号で訪問済みを管理する。
- 複数の Issue は GraphQL の alias や node ID で問い合わせをまとめる。取得規模を制限する必要がある場合は、残りを未取得として示す。
- GraphQL の `errors`、権限エラー、未取得ページを確認する。一部の `data` が返っていても取得完了とは限らない。分類には完全性を併記する。

対応する CLI では、単一 Issue の確認に次も使える。大量の接続は `totalCount` などと照合し、必要なページを API で補う。

```bash
gh issue view 123 --repo '{owner}/{repo}' \
  --json number,title,body,state,assignees,parent,subIssues,subIssuesSummary,blockedBy,blocking,closedByPullRequestsReferences
```

## 監視の読み取り

現在の PR head とチェック・レビューを取得する。Issue と PR の対応はグラフの閉鎖参照から辿り、タイトルの類似だけで結び付けない。

```bash
gh pr view 456 --repo '{owner}/{repo}' \
  --json number,url,state,isDraft,headRefOid,baseRefName,mergeStateStatus,reviewDecision,statusCheckRollup,mergedAt
gh pr checks 456 --repo '{owner}/{repo}' --required
```

チェックなし・実行中・取得不能は成功と別に示す。チェック取得後に head が変わったら、旧 SHA の結果で現 head の成功を報告しない。必要な Issue コメントは対象を絞って読み、続きを含めて確認する。実行記録は利用可能な環境の読み取り機能を使い、Issue・branch・SHA と結び付けられた結果だけを根拠にする。

## 許可された辺の変更

対応する CLI の例。追加・削除する辺を利用者の指示と照合してから実行する。

```bash
gh issue edit 123 --repo '{owner}/{repo}' --add-blocked-by 100
gh issue edit 123 --repo '{owner}/{repo}' --remove-blocked-by 100
gh issue edit 100 --repo '{owner}/{repo}' --add-sub-issue 123,124
gh issue edit 100 --repo '{owner}/{repo}' --remove-sub-issue 123
```

CLI が未対応なら [依存の REST API](https://docs.github.com/en/rest/issues/issue-dependencies) と [sub-issue の REST API](https://docs.github.com/en/rest/issues/sub-issues) を使う。追加先に渡す `issue_id` / `sub_issue_id` は表示番号ではなく REST の数値 ID である。`gh api repos/{owner}/{repo}/issues/123 --jq .id` で対象を照合して取得する。

書き込み後は同じ取得経路で辺を読み直す。部分成功や応答不明の場合は、現状を照合して未反映分だけを処理する。依存の辺と親子の包含を置き換えない。

## レート制限と報告

- 読み取りをまとめ、同じ観測時点の結果を分類・図・報告で共有する。次の波では取り直す。
- 書き込みは順に行う。403 / 429 ではエラーの理由を確認し、rate limit の場合は応答の待機指示に従う。権限不足を再試行で解決しようとしない。
- 残量は `gh api rate_limit` で確認する。権限や quota を変更する前に、現在の依頼範囲と制約を確認する。
- コメント投稿が依頼されている場合は本文をファイルに用意し、`gh issue comment 123 --repo '{owner}/{repo}' --body-file <本文ファイル>` のように送る。送信後は内容と送信先を照合する。

CLI の flag の詳細は [gh issue edit](https://cli.github.com/manual/gh_issue_edit)、PR の取得項目は [gh pr view](https://cli.github.com/manual/gh_pr_view) を参照する。
