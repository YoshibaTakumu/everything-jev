export interface MemoryRecord {
  id: string;
  tenantId: string;
  principalId: string;
  projectId: string;
  text: string;
  provenance: string;
  consent: boolean;
  createdAt: number;
  expiresAt: number;
  revoked: boolean;
}

export interface MemoryScope {
  tenantId: string;
  principalId: string;
  projectId: string;
}

export function eligibleMemories(
  records: readonly MemoryRecord[],
  scope: MemoryScope,
  now: number,
): MemoryRecord[] {
  if (
    !Number.isFinite(now) ||
    !scope.tenantId ||
    !scope.principalId ||
    !scope.projectId
  )
    throw new Error("Explicit scope and finite time are required");
  const seen = new Set<string>();
  for (const record of records) {
    if (!record.id || seen.has(record.id))
      throw new Error("Memory IDs must be nonempty and unique");
    seen.add(record.id);
  }
  return records
    .filter(
      (record) =>
        record.tenantId === scope.tenantId &&
        record.principalId === scope.principalId &&
        record.projectId === scope.projectId &&
        record.consent === true &&
        record.revoked === false &&
        !!record.provenance &&
        !!record.text &&
        Number.isFinite(record.createdAt) &&
        Number.isFinite(record.expiresAt) &&
        record.createdAt <= now &&
        record.expiresAt > now,
    )
    .map((record) => ({ ...record }));
}
