/**
 * Stand-in for `diff2html` in the Worker bundle.
 *
 * `@withstudiocms/sdk` statically imports `html` from diff2html in
 * `dist/lib/diff.js`, so the package lands in every server route. diff2html
 * renders through `@profoundlogic/hogan`, which ships CommonJS only — no
 * browser or ESM build — and workerd cannot evaluate it ("require is not
 * defined"), so every route dies at import.
 *
 * `html()` is reached only by `SDKCoreJs.diffTracking.getDiffHTML`, which backs
 * the dashboard's version-diff viewer. Keeping the export but making the call
 * fail loudly confines the loss to that one screen; the POC disables diff
 * tracking in the site config so nothing reaches it.
 */
export function html(): never {
  throw new Error(
    "Diff rendering is unavailable: diff2html depends on CommonJS-only " +
      "templating that cannot run in the Cloudflare Workers runtime. Keep " +
      "diff tracking disabled in the StudioCMS site settings.",
  );
}

export default { html };
