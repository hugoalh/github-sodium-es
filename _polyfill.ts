//deno-lint-ignore-file hugoalh/no-import-dynamic -- Polyfill.
if (typeof Uint8Array.fromBase64 === "undefined") {
	await import("npm:es-arraybuffer-base64@^1.1.2/Uint8Array.fromBase64/auto");
}
if (typeof Uint8Array.prototype.toBase64 === "undefined") {
	await import("npm:es-arraybuffer-base64@^1.1.2/Uint8Array.prototype.toBase64/auto");
}
