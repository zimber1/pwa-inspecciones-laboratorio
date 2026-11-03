export const dynamic = "force-dynamic";

export type HealthCheckPayload = {
  status: "ok";
  healthy: boolean;
  service: string;
  version: string;
  commitSha: string;
  sha: string;
  commit: string;
  environment: string;
  timestamp: string;
  uptime: number;
};

export function resolveReleaseMetadata(): {
  version: string;
  commitSha: string;
  environment: string;
} {
  const version =
    process.env.APP_VERSION?.trim() ||
    process.env.NEXT_PUBLIC_APP_VERSION?.trim() ||
    process.env.npm_package_version?.trim() ||
    "0.1.0";

  const commitSha =
    process.env.COMMIT_SHA?.trim() ||
    process.env.GIT_COMMIT_SHA?.trim() ||
    process.env.NEXT_PUBLIC_COMMIT_SHA?.trim() ||
    "dev";

  const environment = process.env.NODE_ENV?.trim() || "development";

  return {
    version,
    commitSha,
    environment,
  };
}

export async function GET(): Promise<Response> {
  const { version, commitSha, environment } = resolveReleaseMetadata();

  const payload: HealthCheckPayload = {
    status: "ok",
    healthy: true,
    service: "pwa-inspecciones-laboratorio",
    version,
    commitSha,
    sha: commitSha,
    commit: commitSha,
    environment,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  };

  return Response.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-App-Version": version,
      "X-Commit-Sha": commitSha,
    },
  });
}

export async function HEAD(): Promise<Response> {
  const { version, commitSha } = resolveReleaseMetadata();

  return new Response(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-App-Version": version,
      "X-Commit-Sha": commitSha,
    },
  });
}
