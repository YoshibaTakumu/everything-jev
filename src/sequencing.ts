export interface IssueNode {
  id: string;
  status: "open" | "running" | "done";
  blockedBy: readonly string[];
}

export function frontier(issues: readonly IssueNode[]): string[] {
  const nodes = new Map<string, IssueNode>();
  for (const issue of issues) {
    if (!issue.id || nodes.has(issue.id))
      throw new Error("Issue IDs must be nonempty and unique");
    if (!["open", "running", "done"].includes(issue.status))
      throw new Error("Unknown issue status");
    if (new Set(issue.blockedBy).size !== issue.blockedBy.length)
      throw new Error("Duplicate dependency");
    nodes.set(issue.id, issue);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  function visit(id: string): void {
    if (visiting.has(id)) throw new Error("Dependency cycle detected");
    if (visited.has(id)) return;
    const issue = nodes.get(id);
    if (!issue) throw new Error("Dependency references an unknown issue");
    visiting.add(id);
    for (const blocker of issue.blockedBy) visit(blocker);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of nodes.keys()) visit(id);
  return issues
    .filter(
      (issue) =>
        issue.status === "open" &&
        issue.blockedBy.every((id) => nodes.get(id)!.status === "done"),
    )
    .map((issue) => issue.id)
    .sort();
}
