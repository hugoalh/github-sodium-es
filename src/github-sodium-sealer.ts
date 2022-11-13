import { isString as adIsString } from "@hugoalh/advanced-determine";
import libsodium from "libsodium-wrappers";
await libsodium.ready;
/**
 * @class GitHubSodiumSealer
 * @description Encrypt value to GitHub secret value.
 */
class GitHubSodiumSealer {
	#publicKeyStorage: Buffer;
	/**
	 * @constructor
	 * @param {string} publicKey Organization's or repository's public key, which need for encrypt value to secret value before create or update a secret.
	 */
	constructor(publicKey: string) {
		if (!adIsString(publicKey, { empty: false })) {
			throw new TypeError(`Argument \`publicKey\` must be type of string (non-empty).`);
		}
		this.#publicKeyStorage = Buffer.from(publicKey, "base64");
	}
	/**
	 * @method
	 * @param {string} value Value that need to encrypt as secret value.
	 * @returns {string} An encrypted GitHub secret value.
	 */
	encrypt(value: string): string {
		if (!adIsString(value, { empty: false })) {
			throw new TypeError(`Argument \`value\` must be type of string (non-empty).`);
		}
		return Buffer.from(libsodium.crypto_box_seal(Buffer.from(value), this.#publicKeyStorage)).toString("base64");
	}
}
export default GitHubSodiumSealer;
