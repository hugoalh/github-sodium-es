import libsodium from "npm:libsodium-wrappers@^0.8.4";
import "./_polyfill.ts";
await libsodium.ready;
/**
 * GitHub sodium sealer for encrypt value to the GitHub secret value.
 */
export class GitHubSodiumSealer {
	get [Symbol.toStringTag](): string {
		return "GitHubSodiumSealer/LibSodium";
	}
	#publicKey: Uint8Array;
	/**
	 * Initialize.
	 * @param {string} publicKey Public key (recipient's public key), which get from the GitHub organization or repository, need for encrypt value to the GitHub secret value before create or update the GitHub secret.
	 */
	constructor(publicKey: string) {
		if (!(publicKey.length > 0)) {
			throw new SyntaxError(`Parameter \`publicKey\` is not a string which is non empty!`);
		}
		this.#publicKey = Uint8Array.fromBase64(publicKey);
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
		return libsodium.crypto_box_seal(new TextEncoder().encode(value), this.#publicKey).toBase64();
	}
}
export default GitHubSodiumSealer;
