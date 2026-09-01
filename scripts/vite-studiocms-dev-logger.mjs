/**
 * Makes StudioCMS's `studiocms:logger` usable when server routes run in workerd.
 *
 * `@inox-tools/runtime-logger` (a StudioCMS dependency) hands the Astro logger
 * to the app through the Node `globalThis`. Its build-time plugin reads that
 * defensively — `globalThis[sym]?.get(name) ?? baseLogger.fork(label)` — but
 * its dev plugin does not:
 *
 *     const logger = globalThis[Symbol.for(...)].get('studiocms-runtime');
 *
 * With the Cloudflare adapter, `astro dev` evaluates server modules inside
 * workerd, a separate realm whose `globalThis` never receives that symbol, so
 * every server route dies at import with "Cannot read properties of undefined
 * (reading 'get')". Production builds are unaffected.
 *
 * This plugin claims the same resolved module id first (`enforce: "pre"`) and
 * serves a console-backed logger with the same shape instead.
 */
const RESOLVED_PREFIX = "\0@it-astro:logger:";

const loggerModule = (label) => `
const write = (level, label, message) => {
  const line = label ? "[" + label + "] " + message : message;
  (level === "error" || level === "warn" ? console.error : console.log)(line);
};

class RuntimeLogger {
  constructor(options, label) {
    this.options = options;
    this.label = label;
  }
  fork(label) {
    return new RuntimeLogger(this.options, label);
  }
  info(message) { write("info", this.label, message); }
  warn(message) { write("warn", this.label, message); }
  error(message) { write("error", this.label, message); }
  debug(message) { write("debug", this.label, message); }
}

const shared = globalThis[Symbol.for("@inox-tools/runtime-logger/integrations")];
export const logger =
  shared?.get(${JSON.stringify(label)}) ?? new RuntimeLogger({ level: "info" }, ${JSON.stringify(label)});
`;

export function studiocmsDevLogger() {
  return {
    name: "cicada:studiocms-dev-logger",
    enforce: "pre",
    apply: "serve",
    load(id) {
      if (!id.startsWith(RESOLVED_PREFIX)) return;
      return loggerModule(id.slice(RESOLVED_PREFIX.length));
    },
  };
}
