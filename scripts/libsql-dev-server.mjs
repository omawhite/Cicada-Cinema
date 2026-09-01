/**
 * Runs a local libSQL (sqld) server for development.
 *
 * The Cloudflare adapter executes server routes inside workerd, both in
 * `astro dev` and when deployed. Under the `workerd` export condition
 * `@libsql/client` resolves to its web build, which speaks only http/ws — a
 * `file:` database is unreachable from there. Serving the same SQLite file
 * over HTTP gives the Worker a URL it can actually use, and matches the
 * production topology: swap CMS_LIBSQL_URL for a Turso URL and nothing else
 * changes.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { arch, platform } from "node:process";

// The platform packages are optional dependencies of `sqld`, so they resolve
// from that package rather than from the project root.
const require = createRequire(import.meta.url);
const target = `@sqld/${platform}-${arch}`;

let binary;
try {
  const fromSqld = createRequire(require.resolve("sqld/package.json"));
  binary = join(dirname(fromSqld.resolve(`${target}/package.json`)), "sqld");
} catch {
  console.error(
    `No sqld binary for ${platform}-${arch}. Install ${target}, or point ` +
      "CMS_LIBSQL_URL at a remote libSQL database instead.",
  );
  process.exit(1);
}

const args = [
  "--db-path",
  ".studiocms/data",
  "--http-listen-addr",
  "127.0.0.1:8080",
  "--no-welcome",
  ...process.argv.slice(2),
];

const child = spawn(binary, args, { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
