import {
	getMetadataFromConfig,
	invokeDenoNodeJSTransformer
} from "DNT";
const configJSR = await getMetadataFromConfig("jsr.jsonc");
await invokeDenoNodeJSTransformer({
	assetsCopy: [
		"LICENSE.md",
		"README.md"
	],
	entrypoints: configJSR.getExports(),
	generateDeclarationMap: true,
	mappings: {
		"https://esm.sh/libsodium-wrappers@^0.7.15": {
			name: "libsodium-wrappers",
			version: "^0.7.15"
		}
	},
	metadata: {
		name: configJSR.getName(),
		version: configJSR.getVersion(),
		description: "A module to provide an easier sodium for GitHub secrets.",
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
			node: ">=16.13.0"
		},
		private: false,
		publishConfig: {
			access: "public"
		}
	},
	outputDirectory: "npm",
	outputDirectoryPreEmpty: true
});
