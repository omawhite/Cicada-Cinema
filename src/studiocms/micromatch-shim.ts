import picomatch from "picomatch";

/**
 * ESM stand-in for `micromatch` in the Worker bundle.
 *
 * `@withstudiocms/effect`'s middleware router calls `micromatch.isMatch` to
 * decide which StudioCMS middleware applies to a request. micromatch ships
 * CommonJS only, and Vite serves it raw to the dev Worker, where it dies with
 * "require is not defined".
 *
 * `isMatch` is the only export the router touches, and micromatch implements it
 * on top of picomatch — which does ship an ESM-friendly build — so delegating
 * keeps the same matching semantics, including an array of patterns matching if
 * any one of them does.
 */
export function isMatch(
  value: string,
  patterns: string | string[],
  options?: picomatch.PicomatchOptions,
): boolean {
  return picomatch.isMatch(value, patterns, options);
}

export default { isMatch };
