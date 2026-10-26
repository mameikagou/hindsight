/**
 * opencode2 entrypoint — the plugin opencode v2 (`@opencode/cli`, binary `opencode2`) loads.
 *
 * It is a SEPARATE entry from src/index.ts because v2's plugin contract shares nothing with v1's:
 * v1 loads a function returning named hooks, v2 loads a `{id, setup(ctx)}` object. Handing either
 * host the other's export loads a plugin that registers nothing and reports no error.
 *
 * 两个宿主共用 ~/.config/opencode/opencode.json[c] 和一个插件目录。v1 根据 package.json
 * 的 main 加载 dist/index.js，v2 加载目录下的 index.js。v1 只接受 plugin 字段，v2 在
 * 内存中合并 plugin 与 plugins，不修改磁盘配置；安装器按现有配置和目标宿主选择字段。
 *
 * The harness reports as "opencode2" rather than "opencode": that selects the `harnesses.opencode2`
 * config section and keeps v2 sessions attributable in diagnostics separately from v1's. The bank
 * is unaffected — the default id template (`coding-agent::{gitProject}`) is harness-neutral, so
 * both hosts compound into the same repo memory.
 *
 * The body lives in harness/opencode2.ts; everything behind it is the shared RuntimeCore.
 */
import { createOpencode2PluginEntry } from "./harness/opencode2";
import { createPluginEntry } from "./harness/plugin-entry";

/**
 * The v2 definition, plus v1's plugin function as `server`. A host that looks this package up by
 * NAME — v2 given a non-absolute entry such as `~/.hindsight/coding-agents`, or v1 1.18+ — reads
 * package.json `exports["./server"]` (→ the root index.js → this file) before `main`. Without it v2
 * fell through to `exports["."]`, got v1's function and refused to load the plugin (#5823); v1 1.18+
 * reads the same export and accepts an object default that has `server()`. v2's schema ignores the
 * extra key, and older v1 never reads `./server`, so it still follows `main` to dist/index.js.
 */
const HindsightOpencode2Plugin = {
  ...createOpencode2PluginEntry("opencode2"),
  server: createPluginEntry("opencode"),
};

export default HindsightOpencode2Plugin;
export { HindsightOpencode2Plugin };
