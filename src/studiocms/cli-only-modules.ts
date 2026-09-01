/**
 * Empty stand-in for the Node/CLI-only packages StudioCMS pulls into routes.
 *
 * `@withstudiocms/effect` re-exports the whole `@effect/platform-node` and
 * `@effect/cli` namespaces from its entry point, so importing anything from it
 * — as every StudioCMS route and its middleware does — drags both into the
 * Worker bundle. Neither survives workerd: platform-node reaches for Node
 * internals, and `@effect/cli` depends on `ini`, which is CommonJS, so the
 * route dies at import with "module is not defined".
 *
 * StudioCMS only touches those namespaces (`PlatformNode.NodeContext`,
 * `NodeRuntime`, `Cli.*`) under `dist/cli/`, which runs under Node and resolves
 * the real packages — this alias applies to the app build only. Nothing in the
 * request path reads from them, so the Worker can safely get an empty module.
 */
export {};
