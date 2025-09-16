import {
	getMetadataFromConfig,
	invokeDenoNodeJSTransformer
} from "DNT";
const configJSR = await getMetadataFromConfig("jsr.jsonc");
await invokeDenoNodeJSTransformer({
	copyAssets: [
		"LICENSE.md",
		"README.md"
	],
	entrypoints: configJSR.getExports(),
	fixInjectedImports: true,
	generateDeclarationMap: true,
	mappings: {
		"https://raw.githubusercontent.com/hugoalh/blake-es/v0.2.1/2b.ts": {
			name: "@hugoalh/blake",
			version: "^0.2.1",
			subPath: "2b"
		},
		"https://raw.githubusercontent.com/hugoalh/is-json-es/v1.0.5/mod.ts": {
			name: "@hugoalh/is-json",
			version: "^1.0.5"
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
		name: configJSR.getName(),
		version: configJSR.getVersion(),
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
		scripts: {
		},
		engines: {
		},
		private: false,
		publishConfig: {
			access: "public"
		}
	},
	outputDirectory: "dist/npm",
	outputDirectoryPreEmpty: true
});
