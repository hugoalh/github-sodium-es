import { configureDenoLintPlugin } from "https://raw.githubusercontent.com/hugoalh/deno-lint-rules/v0.4.0/mod.ts";
export default configureDenoLintPlugin({
	"no-alert": true,
	"no-confirm": true,
	"no-prompt": true
}) satisfies Deno.lint.Plugin as Deno.lint.Plugin;
