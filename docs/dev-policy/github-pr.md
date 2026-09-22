# Pull requests

Use this for PR creation, updates, review and merge. Preserve the delivery scope already authorized in the task: an explicit request to create and merge a PR covers those steps without another confirmation. A review-only request remains a review. Registry publication and third-party messaging retain the separate boundaries in [AGENTS.md](../../AGENTS.md).

## Prepare the complete change

1. Follow [branch policy](branch-policy.md), inspect the full diff against the intended base and include new files in review. Check that the PR contains only the authorized work, including any intentionally accumulated earlier commits.
2. Complete [task verification](task-lifecycle.md#implement-and-verify) and [publication review](document-lifecycle.md#updating-the-documents). Commit and push using the repository hooks, then verify the remote head.
3. Use the [PR template](../../.github/pull_request_template.md). Lead with the concrete problem and resulting behavior; state checks actually run, evidence limits and remaining scope. Use a Conventional Commit title suitable for the final merge commit. Add Issue links only when they refer to real related work.
4. Reuse an existing PR for the branch. Choose draft when work or evidence is incomplete; a completed change requested for merge can be opened ready for review. Do not add unrelated reviewers, labels or tracker updates.

## Review and merge

Read the current diff, review comments and unresolved threads. Resolve actionable findings or explain remaining uncertainty. A self-check is verification, not an independent approval; never fabricate an approval or grant one on the author's behalf.

Immediately before merge, confirm all of the following from GitHub:

- The requested PR targets the intended repository/base, is ready and has the same head SHA that was reviewed and tested.
- Applicable CI jobs on that revision have completed successfully; required reviews and repository protections are satisfied. An intentionally skipped non-applicable job is not a failed check, but a missing/pending required job is not success.
- There are no unresolved actionable review findings, change requests or merge conflicts. Any new commit restarts review of the affected diff and checks.

Use a repository-supported merge method and bind the operation to the inspected head SHA where the client supports it. Do not bypass protections with administrator overrides or weaken checks to complete a task. If merge is blocked by external approval/access, report the concrete blocker and preserve the reviewed branch.

Before a squash or merge commit, validate its complete proposed message (subject, blank line and body) with `pnpm commitlint --edit <message-file>`. PR checks validate existing branch commits, not the new message generated at merge time. A valid PR title does not establish that its body satisfies commitlint. Wrap prose to the configured line-length limit and pass the validated subject/body explicitly to the merge client; keep temporary message files outside tracked documentation.

After merge, verify the merged state and merge commit, and check the destination branch's CI for that commit. Apply [branch cleanup](branch-policy.md#after-merge) only when safe. A release PR is a separate change governed by [Releases](../../CONTRIBUTING.md#releases); merging an ordinary PR does not authorize merging a release PR or publishing a package.
