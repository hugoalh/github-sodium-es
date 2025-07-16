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
		"https://esm.sh/libsodium-wrappers@^0.7.15": {
			name: "libsodium-wrappers",
			version: "^0.7.15"
		},
		"https://raw.githubusercontent.com/hugoalh/is-json-es/v1.0.4/mod.ts": {
			name: "@hugoalh/is-json",
			version: "^1.0.4"
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
