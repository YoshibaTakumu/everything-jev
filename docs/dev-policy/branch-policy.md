# Branch and worktree policy

Read this before choosing a base, changing shared history or cleaning up worktrees. [PR policy](github-pr.md) owns review and merge readiness.

## Start and resume

- Inspect `git status --short --branch`, the remotes and `git worktree list` before editing. Preserve unrelated or unowned changes; stage only files belonging to the task.
- Fetch the relevant remote before choosing a base. Use the user's specified base, otherwise the repository's current default branch. Confirm it from the remote instead of inferring it from the local checkout name.
- Continue an existing task branch when it contains required prior work. Review its full diff against the intended PR base so earlier changes are included deliberately. Describe the resulting combined change in the PR.
- For new isolated work, create a named branch and separate worktree. Use a concise `<type>/<slug>` name such as `docs/domain-guide` or `fix/client-cancellation`; preserve established task branch names. Keep temporary investigation artifacts in gitignored `local/` or outside the repository.

## Publish and update

Use the commit conventions and hooks in [Contributing](../../CONTRIBUTING.md#git-hooks-and-commit-messages). Verify remote, branch and diff before pushing; verify the resulting remote SHA afterwards.

When a published branch needs a newer base, merge the fetched base into the task branch, resolve conflicts and rerun affected checks. Rebase/force push rewrites shared history and is not a routine cleanup step; it requires explicit authorization covering that history. Changes after review require checks against the new PR head.

## After merge

Confirm the PR's merged state, merge commit and destination branch. Fast-forward a clean local base checkout when appropriate; if it contains unrelated work or has diverged, preserve it and report its state. Delete a task branch/worktree only after its work is safely integrated and no active task or uncommitted artifact still relies on it. A closed unmerged PR is not evidence that its work can be discarded.
