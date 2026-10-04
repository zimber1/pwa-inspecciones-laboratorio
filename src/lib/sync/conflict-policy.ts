export type ConflictSource = "local" | "remote" | "sync-response";

export type InspectionConflictVersion<
  TPayload extends Record<string, unknown> = Record<string, unknown>
> = Readonly<{
  inspectionId: string;
  version: number;
  updatedAt: string;
  operationId: string;
  source: ConflictSource;
  payload: Readonly<TPayload>;
}>;

export type ConflictResolutionReason =
  | "different-inspection"
  | "higher-version"
  | "newer-updated-at"
  | "operation-id-tiebreaker"
  | "duplicate-operation";

export type InspectionConflictResolution<
  TPayload extends Record<string, unknown> = Record<string, unknown>
> = Readonly<{
  hasConflict: boolean;
  inspectionId: string | null;
  winner: InspectionConflictVersion<TPayload>;
  discarded: InspectionConflictVersion<TPayload> | null;
  applied: "current" | "incoming";
  reason: ConflictResolutionReason;
  trace: readonly string[];
}>;

type CandidateLabel = "current" | "incoming";

export function isSameInspection(
  current: Pick<InspectionConflictVersion, "inspectionId">,
  incoming: Pick<InspectionConflictVersion, "inspectionId">
) {
  return current.inspectionId === incoming.inspectionId;
}

export function resolveInspectionConflict<
  TPayload extends Record<string, unknown> = Record<string, unknown>
>(
  current: InspectionConflictVersion<TPayload>,
  incoming: InspectionConflictVersion<TPayload>
): InspectionConflictResolution<TPayload> {
  validateCandidate("current", current);
  validateCandidate("incoming", incoming);

  const baseTrace = [
    `current:${current.inspectionId}@v${current.version}:${current.updatedAt}:${current.operationId}`,
    `incoming:${incoming.inspectionId}@v${incoming.version}:${incoming.updatedAt}:${incoming.operationId}`
  ];

  if (!isSameInspection(current, incoming)) {
    return {
      hasConflict: false,
      inspectionId: null,
      winner: incoming,
      discarded: null,
      applied: "incoming",
      reason: "different-inspection",
      trace: [...baseTrace, "decision:different-inspection"]
    };
  }

  if (current.version !== incoming.version) {
    return chooseWinner({
      current,
      incoming,
      reason: "higher-version",
      incomingWins: incoming.version > current.version,
      trace: baseTrace
    });
  }

  const timestampComparison = compareTimestamps(
    current.updatedAt,
    incoming.updatedAt
  );

  if (timestampComparison !== 0) {
    return chooseWinner({
      current,
      incoming,
      reason: "newer-updated-at",
      incomingWins: timestampComparison < 0,
      trace: baseTrace
    });
  }

  if (current.operationId !== incoming.operationId) {
    return chooseWinner({
      current,
      incoming,
      reason: "operation-id-tiebreaker",
      incomingWins: incoming.operationId > current.operationId,
      trace: baseTrace
    });
  }

  return {
    hasConflict: true,
    inspectionId: current.inspectionId,
    winner: current,
    discarded: incoming,
    applied: "current",
    reason: "duplicate-operation",
    trace: [...baseTrace, "decision:duplicate-operation:keep-current"]
  };
}

export function shouldApplyIncomingInspection<
  TPayload extends Record<string, unknown> = Record<string, unknown>
>(
  current: InspectionConflictVersion<TPayload>,
  incoming: InspectionConflictVersion<TPayload>
) {
  return resolveInspectionConflict(current, incoming).applied === "incoming";
}

function chooseWinner<TPayload extends Record<string, unknown>>(input: {
  current: InspectionConflictVersion<TPayload>;
  incoming: InspectionConflictVersion<TPayload>;
  reason: Exclude<
    ConflictResolutionReason,
    "different-inspection" | "duplicate-operation"
  >;
  incomingWins: boolean;
  trace: readonly string[];
}): InspectionConflictResolution<TPayload> {
  const winner = input.incomingWins ? input.incoming : input.current;
  const discarded = input.incomingWins ? input.current : input.incoming;
  const applied = input.incomingWins ? "incoming" : "current";

  return {
    hasConflict: true,
    inspectionId: input.current.inspectionId,
    winner,
    discarded,
    applied,
    reason: input.reason,
    trace: [
      ...input.trace,
      `decision:${input.reason}:${applied}:winner-${winner.operationId}:discarded-${discarded.operationId}`
    ]
  };
}

function compareTimestamps(left: string, right: string) {
  const leftTime = Date.parse(left);
  const rightTime = Date.parse(right);

  if (Number.isFinite(leftTime) && Number.isFinite(rightTime)) {
    return leftTime - rightTime;
  }

  return left.localeCompare(right);
}

function validateCandidate(
  label: CandidateLabel,
  candidate: InspectionConflictVersion
) {
  if (!candidate.inspectionId.trim()) {
    throw new Error(`${label}.inspectionId is required`);
  }

  if (!Number.isFinite(candidate.version) || candidate.version < 0) {
    throw new Error(`${label}.version must be a non-negative number`);
  }

  if (!candidate.updatedAt.trim()) {
    throw new Error(`${label}.updatedAt is required`);
  }

  if (!candidate.operationId.trim()) {
    throw new Error(`${label}.operationId is required`);
  }
}
