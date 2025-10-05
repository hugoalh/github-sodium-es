import { invokeDenoNodeJSTransformer } from "DNT";
import { parse as parseJSONC } from "STD_JSONC";
const jsrManifest = parseJSONC(await Deno.readTextFile("./jsr.jsonc"));
await invokeDenoNodeJSTransformer({
	copyEntries: [
		"LICENSE.md",
		"README.md"
	],
	//@ts-ignore Lazy type.
	entrypointsScript: jsrManifest.exports,
	generateDeclarationMap: true,
	mappings: {
		"https://raw.githubusercontent.com/hugoalh/blake-es/v0.2.1/2b.ts": {
			name: "@hugoalh/blake",
			version: "^0.2.1",
			subPath: "2b"
		},
		"https://raw.githubusercontent.com/hugoalh/nacl-es/v0.1.1/highlevel.ts": {
			name: "@hugoalh/nacl",
			version: "^0.1.1",
			subPath: "highlevel"
		},
		"https://raw.githubusercontent.com/hugoalh/nacl-es/v0.1.1/lowlevel.ts": {
			name: "@hugoalh/nacl",
			version: "^0.1.1",
			subPath: "lowlevel"
		}
	},
	metadata: {
		//@ts-ignore Lazy type.
		name: jsrManifest.name,
		//@ts-ignore Lazy type.
		version: jsrManifest.version,
		description: "A module to provide an easier and simplified method for encrypt GitHub secrets.",
		keywords: [
			"github",
			"sodium"
		],
		homepage: "https://github.com/hugoalh/github-sodium-es#readme",
		bugs: {
			url: "https://github.com/hugoalh/github-sodium-es/issues"
		},
		license: "MIT",
		author: "hugoalh",
		repository: {
			type: "git",
			url: "git+https://github.com/hugoalh/github-sodium-es.git"
		},
		private: false,
		publishConfig: {
			access: "public"
		}
	},
	outputDirectory: "dist/npm",
	outputDirectoryPreEmpty: true
});
