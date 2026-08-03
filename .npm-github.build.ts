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
		"https://raw.githubusercontent.com/hugoalh/blake-es/v0.2.2/2b.ts": {
			name: "@hugoalh/blake",
			version: "^0.2.2",
			subPath: "2b"
		},
		"https://raw.githubusercontent.com/hugoalh/nacl-es/v0.2.1/mod.ts": {
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
	outputDirectory: "dist/npm-github",
	outputDirectoryPreEmpty: true
});
