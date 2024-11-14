import { Buffer } from "node:buffer";
import libsodium from "https://esm.sh/libsodium-wrappers@^0.7.15";
import {
	isJSONObject,
	type JSONObject
} from "https://raw.githubusercontent.com/hugoalh/is-json-es/v1.0.4/mod.ts";
await libsodium.ready;
export interface GitHubRESTSetPublicKeyRequestBody {
	encrypted_value: string;
	key_id: string;
}
/**
 * GitHub sodium sealer for encrypt value to the GitHub secret value.
 */
export class GitHubSodiumSealer {
	get [Symbol.toStringTag](): string {
		return "GitHubSodiumSealer";
	}
	#keyID?: string;
	#publicKey: Buffer;
	/**
	 * Initialize the GitHub sodium sealer.
	 * @param {string} publicKey Public key, which get from the GitHub organization or repository, need for encrypt value to the GitHub secret value before create or update the GitHub secret.
	 * @param {string} [keyID] ID of the key, which get from the GitHub organization or repository, need for create or update the GitHub secret. This parameter is optional if no need to output as part of the {@linkcode Request} body.
	 */
	constructor(publicKey: string, keyID?: string) {
		if (!(
			typeof keyID === "undefined" ||
			(typeof keyID === "string" && keyID.length > 0)
		)) {
			throw new TypeError(`Parameter \`keyID\` is not \`undefined\`, or a string which is non empty!`);
		}
		if (!(publicKey.length > 0)) {
			throw new SyntaxError(`Parameter \`publicKey\` is not a string which is non empty!`);
		}
		this.#keyID = keyID;
		this.#publicKey = Buffer.from(publicKey, "base64");
	}
	/**
	 * Encrypt value to the GitHub secret value.
	 * @param {string} value Value that need to encrypt as the GitHub secret value.
	 * @returns {string} An encrypted GitHub secret value.
	 */
	encrypt(value: string): string {
		if (!(value.length > 0)) {
			throw new SyntaxError(`Parameter \`value\` is not a string which is non empty!`);
		}
		return Buffer.from(libsodium.crypto_box_seal(Buffer.from(value), this.#publicKey)).toString("base64");
	}
	/**
	 * Encrypt value to the GitHub secret value, and output as part of the {@linkcode Request} body for create or update GitHub secret via the GitHub REST API.
	 * @param {string} value Value that need to encrypt as the GitHub secret value.
	 * @returns {GitHubRESTSetPublicKeyRequestBody} Part of the {@linkcode Request} body for create or update GitHub secret via the GitHub REST API.
	 */
	encryptToRequestBody(value: string): GitHubRESTSetPublicKeyRequestBody {
		if (this.#keyID !== "string") {
			throw new Error(`Key ID was not defined at the initialize stage!`);
		}
		return {
			encrypted_value: this.encrypt(value),
			key_id: this.#keyID
		};
	}
	/**
	 * Get the ID of the key.
	 * @returns {string | undefined} ID of the key.
	 */
	getKeyID(): string | undefined {
		return this.#keyID;
	}
	/**
	 * Get the ID of the key.
	 * @returns {string | undefined} ID of the key.
	 */
	get keyID(): string | undefined {
		return this.#keyID;
	}
	/**
	 * Initialize the GitHub sodium sealer from the {@linkcode Response} JSON body.
	 * @param {JSONObject} input {@linkcode Response} JSON body.
	 * @returns {GitHubSodiumSealer} GitHub sodium sealer.
	 */
	static fromJSON(input: JSONObject): GitHubSodiumSealer {
		if (
			typeof input.key !== "string" ||
			typeof input.key_id !== "string"
		) {
			throw new Error(`Parameter \`input\` is not a valid response JSON body!`);
		}
		return new this(input.key, input.key_id);
	}
	/**
	 * Initialize the GitHub sodium sealer from the {@linkcode Response}.
	 * @param {Response} input {@linkcode Response}.
	 * @returns {Promise<GitHubSodiumSealer>} GitHub sodium sealer.
	 */
	static async fromResponse(input: Response): Promise<GitHubSodiumSealer> {
		const responsePayload = await input.clone().json();
		if (!isJSONObject(responsePayload)) {
			throw new Error(`Parameter \`input\` is not a valid response!`);
		}
		return GitHubSodiumSealer.fromJSON(responsePayload);
	}
	/**
	 * Encrypt value to the GitHub secret value.
	 * @param {string} publicKey Public key, which get from the GitHub organization or repository, need for encrypt value to the GitHub secret value before create or update the GitHub secret.
	 * @param {string} value Value that need to encrypt as the GitHub secret value.
	 * @returns {string} An encrypted GitHub secret value.
	 * @deprecated Migrate to `new GitHubSodiumSealer(publicKey).encrypt(value)`.
	 */
	static seal(publicKey: string, value: string): string {
		return new this(publicKey).encrypt(value);
	}
}
export default GitHubSodiumSealer;
/**
 * Encrypt value to the GitHub secret value.
 * @param {string} publicKey Public key, which get from the GitHub organization or repository, need for encrypt value to the GitHub secret value before create or update the GitHub secret.
 * @param {string} value Value that need to encrypt as the GitHub secret value.
 * @returns {string} An encrypted GitHub secret value.
 * @deprecated Migrate to `new GitHubSodiumSealer(publicKey).encrypt(value)`.
 */
export function seal(publicKey: string, value: string): string {
	return new GitHubSodiumSealer(publicKey).encrypt(value);
}
