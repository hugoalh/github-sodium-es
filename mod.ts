import { Buffer } from "node:buffer";
import libsodium from "https://esm.sh/libsodium-wrappers@^0.7.15";
await libsodium.ready;
/**
 * GitHub sodium sealer for encrypt value to the GitHub secret value.
 */
export class GitHubSodiumSealer {
	get [Symbol.toStringTag](): string {
		return "GitHubSodiumSealer";
	}
	#publicKey: Buffer;
	/**
	 * Initialize the GitHub sodium sealer.
	 * @param {string} publicKey Public key of the GitHub organization or repository, which need for encrypt value to the GitHub secret value before create or update a GitHub secret.
	 */
	constructor(publicKey: string) {
		if (!(publicKey.length > 0)) {
			throw new SyntaxError(`Parameter \`publicKey\` is not a string which is non-empty!`);
		}
		this.#publicKey = Buffer.from(publicKey, "base64");
	}
	/**
	 * Encrypt value to the GitHub secret value.
	 * @param {string} value Value that need to encrypt as GitHub secret value.
	 * @returns {string} An encrypted GitHub secret value.
	 */
	encrypt(value: string): string {
		if (!(value.length > 0)) {
			throw new SyntaxError(`Parameter \`value\` is not a string which is non-empty!`);
		}
		return Buffer.from(libsodium.crypto_box_seal(Buffer.from(value), this.#publicKey)).toString("base64");
	}
	/**
	 * Encrypt value to the GitHub secret value.
	 * @param {string} publicKey Public key of the GitHub organization or repository, which need for encrypt value to the GitHub secret value before create or update a GitHub secret.
	 * @param {string} value Value that need to encrypt as GitHub secret value.
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
 * @param {string} publicKey Public key of the GitHub organization or repository, which need for encrypt value to the GitHub secret value before create or update a GitHub secret.
 * @param {string} value Value that need to encrypt as GitHub secret value.
 * @returns {string} An encrypted GitHub secret value.
 */
export function seal(publicKey: string, value: string): string {
	return new GitHubSodiumSealer(publicKey).encrypt(value);
}
