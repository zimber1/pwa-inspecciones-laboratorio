export interface SecurityHeader {
  readonly key: string;
  readonly value: string;
}

export function createSecurityHeaders(
  isDevelopment?: boolean,
): readonly SecurityHeader[];

export const securityHeaders: readonly SecurityHeader[];
