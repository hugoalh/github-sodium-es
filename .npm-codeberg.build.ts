import {
	readManifest,
	transform
} from "DNT";
const manifest = await readManifest("jsr.jsonc");
await transform({
	copyEntries: [
		"LICENSE.md",
		"README.md"
	],
	entrypointsExecutable: {
		"ghs": "./libsodium/cli.ts",
		"ghs-ls": "./libsodium/cli.ts",
		"ghs-ts": "./tweetsodium/cli.ts"
	},
	//@ts-ignore Lazy type.
	entrypointsScript: manifest.exports,
	generateDeclarationMap: true,
	mappings: {
		"jsr:@hugoalh/blake@^0.2.2/2b": {
			name: "@hugoalh/blake",
			version: "^0.2.2",
			subPath: "2b"
		},
		"jsr:@hugoalh/nacl@^0.2.1": {
			name: "@hugoalh/nacl",
			version: "^0.2.1"
		}
	},
	metadata: {
		//@ts-ignore Lazy type.
		name: manifest.name,
		//@ts-ignore Lazy type.
		version: manifest.version,
		description: "A module to provide an easier and simplified method for encrypt GitHub secrets.",
		keywords: [
			"github",
			"sodium"
		],
		homepage: "https://codeberg.org/hugoalh/github-sodium-es#readme",
		bugs: {
			url: "https://codeberg.org/hugoalh/github-sodium-es/issues"
		},
		license: "MIT",
		author: "hugoalh",
		repository: {
			type: "git",
			url: "git+https://codeberg.org/hugoalh/github-sodium-es.git"
		},
		private: false,
		publishConfig: {
			access: "public"
		}
	},
	outputDirectory: "dist/npm-codeberg",
	outputDirectoryPreEmpty: true,
	shims: {
		blob: false,
		crypto: false,
		deno: false,
		prompts: false,
		timers: false,
		undici: false,
		weakRef: false,
		webSocket: false
	}
});
