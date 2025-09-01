import {
	isJSONObject,
	type JSONObject
} from "https://raw.githubusercontent.com/hugoalh/is-json-es/v1.0.5/mod.ts";
import { GitHubSodiumSealer } from "./basic.ts";
export interface GitHubRESTSetSecretRequestBody {
	encrypted_value: string;
	key_id: string;
}
/**
 * GitHub sodium sealer for encrypt value to the GitHub secret value.
 */
export class GitHubSodiumSealerExtend extends GitHubSodiumSealer {
	override get [Symbol.toStringTag](): string {
		return "GitHubSodiumSealerExtend";
	}
	#keyID: string;
	/**
	 * Initialize.
	 * @param {string} publicKey Public key (recipient's public key), which get from the GitHub organization or repository, need for encrypt value to the GitHub secret value before create or update the GitHub secret.
	 * @param {string} keyID ID of the key, which get from the GitHub organization or repository, need for create or update the GitHub secret. This parameter is optional if no need to output as part of the {@linkcode Request} body.
	 */
	constructor(publicKey: string, keyID: string) {
		super(publicKey);
		if (!(typeof keyID === "string" && keyID.length > 0)) {
			throw new TypeError(`Parameter \`keyID\` is not a string which is non empty!`);
		}
		this.#keyID = keyID;
	}
	/**
	 * Encrypt value to the GitHub secret value, and output as part of the {@linkcode Request} body for create or update GitHub secret via the GitHub REST API.
	 * @param {string} value Value that need to encrypt as the GitHub secret value.
	 * @returns {GitHubRESTSetSecretRequestBody} Part of the {@linkcode Request} body for create or update GitHub secret via the GitHub REST API.
	 */
	encryptToRequestBody(value: string): GitHubRESTSetSecretRequestBody {
		return {
			encrypted_value: this.encrypt(value),
			key_id: this.#keyID
		};
	}
	/**
	 * Get the ID of the key.
	 * @returns {string} ID of the key.
	 */
	get keyID(): string {
		return this.#keyID;
	}
	/**
	 * Initialize the GitHub sodium sealer with the {@linkcode Response} JSON body from get GitHub secret public key via the GitHub REST API.
	 * @param {JSONObject} input {@linkcode Response} body from the GitHub REST API.
	 * @returns {GitHubSodiumSealerExtend} GitHub sodium sealer.
	 */
	static fromJSON(input: JSONObject): GitHubSodiumSealerExtend {
		if (
			typeof input.key !== "string" ||
			typeof input.key_id !== "string"
		) {
			throw new Error(`Parameter \`input\` is not a valid response JSON body!`);
		}
		return new this(input.key, input.key_id);
	}
	/**
	 * Initialize the GitHub sodium sealer with the {@linkcode Response} from get GitHub secret public key via the GitHub REST API.
	 * @param {Response} input {@linkcode Response} from the GitHub REST API.
	 * @returns {Promise<GitHubSodiumSealerExtend>} GitHub sodium sealer.
	 */
	static async fromResponse(input: Response): Promise<GitHubSodiumSealerExtend> {
		const responsePayload: unknown = await input.clone().json();
		if (!isJSONObject(responsePayload)) {
			throw new Error(`Parameter \`input\` is not a valid response!`);
		}
		return this.fromJSON(responsePayload);
	}
}
export default GitHubSodiumSealerExtend;
