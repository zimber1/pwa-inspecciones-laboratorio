
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(root, "reports");

const requiredFiles = [
  "package.json",
  "package-lock.json",
  "README.md",
  "public/manifest.webmanifest",
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/globals.css",
  "src/components/app-shell.tsx",
  "src/lib/data/inspections.ts",
  "docs/requirements.md",
  "docs/decision-record.md",
  "docs/test-strategy.md",
  "tests/starter.spec.mjs",
  "tests/manifest.spec.ts",
  "tests/unit/validation.spec.ts",
  "tests/unit/idempotency.spec.ts",
  "tests/integration/queue.spec.ts",
  "tests/integration/inspections.spec.ts",
  "tests/e2e/inspections.spec.ts",
  "playwright.config.ts",
  ".github/workflows/academic-evaluation.yml",
  "evidence/individual.md",
];

const requiredDirs = [
  "tests/unit",
  "tests/integration",
  "tests/e2e",
];

const missingFiles = requiredFiles.filter(
  (file) => !existsSync(resolve(root, file)),
);

const missingDirs = requiredDirs.filter(
  (dir) => !existsSync(resolve(root, dir)),
);

const structureCheck = {
  id: "structure",
  status:
    missingFiles.length === 0 && missingDirs.length === 0
      ? "pass"
      : "fail",
  missingFiles,
  missingDirs,
};

if (process.argv.includes("--structure")) {
  console.log(
    structureCheck.status === "pass"
      ? "Estructura obligatoria presente."
      : JSON.stringify(structureCheck, null, 2),
  );
  process.exit(structureCheck.status === "pass" ? 0 : 1);
}

mkdirSync(reportDir, { recursive: true });

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const checks = [structureCheck];

function runCheck(id, args) {
  console.log(`\nVerificando ${id}: npm ${args.join(" ")}`);

  const run = spawnSync(npm, args, {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
    maxBuffer: 20 * 1024 * 1024,
    env: process.env,
  });

  if (run.stdout) process.stdout.write(run.stdout);
  if (run.stderr) process.stderr.write(run.stderr);

  const status =
    run.status === 0 && !run.error ? "pass" : "fail";

  checks.push({
    id,
    status,
    exitCode: run.status,
    error: run.error?.message ?? null,
  });

  return status === "pass";
}

if (structureCheck.status === "pass") {
  runCheck("typecheck", ["run", "typecheck"]);
  runCheck("unit-regression-and-integration", ["run", "test:coverage"]);
  runCheck("e2e", ["run", "test:e2e"]);
  runCheck("build", ["run", "build"]);
} else {
  console.error(
    "\nFaltan artefactos obligatorios. Se omiten las pruebas para evitar una validacion incompleta.",
  );
}

const git = (args) => {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  return result.status === 0 ? result.stdout.trim() : null;
};

const documents = [
  "docs/requirements.md",
  "docs/decision-record.md",
  "docs/test-strategy.md",
  "evidence/individual.md",
  "README.md",
].map((file) => ({
  file,
  exists: existsSync(resolve(root, file)),
  content: existsSync(resolve(root, file))
    ? readFileSync(resolve(root, file), "utf8")
    : null,
}));

const gitStatus = git(["status", "--porcelain"]);

const result = {
  schemaVersion: 3,
  checkedAt: new Date().toISOString(),
  commitSha: git(["rev-parse", "HEAD"]),
  workingTreeClean: gitStatus === null ? null : gitStatus === "",
  runtime: {
    node: process.version,
    platform: process.platform,
  },
  status: checks.every((check) => check.status === "pass")
    ? "pass"
    : "fail",
  checks,
  academicReview: {
    status: "pending",
    message:
      "La validacion automatica no asigna una calificacion. Revisar requisitos, decisiones y evidencias por integrante con la rubrica.",
    documents,
  },
  limits: [
    "La instalacion limpia mediante npm ci se valida por separado.",
    "La presencia de archivos no demuestra por si sola su calidad.",
    "La cobertura solo corresponde a los archivos incluidos en su comando.",
    "Las pruebas E2E no demuestran sincronizacion remota sin un servicio remoto real.",
    "Este script no certifica la ausencia de secretos.",
  ],
};

writeFileSync(
  resolve(reportDir, "verification.json"),
  JSON.stringify(result, null, 2) + "\n",
  "utf8",
);

console.log(
  `\nVerificacion tecnica: ${result.status}. Revision academica: pendiente. Reporte: reports/verification.json`,
);

process.exit(result.status === "pass" ? 0 : 1);
