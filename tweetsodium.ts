import { Blake2B } from "https://raw.githubusercontent.com/hugoalh/blake-es/v0.2.2/2b.ts";
import {
	box,
	boxKeyPair,
	boxNonceLength,
	boxOverheadLength,
	boxPublicKeyLength,
	type KeyPair
} from "https://raw.githubusercontent.com/hugoalh/nacl-es/v0.2.1/mod.ts";
import "./_polyfill.ts";
const sodiumOverheadLength: number = boxOverheadLength + boxPublicKeyLength;
/**
 * GitHub sodium sealer for encrypt value to the GitHub secret value.
 */
export class GitHubSodiumSealer {
	get [Symbol.toStringTag](): string {
		return "GitHubSodiumSealer/TweetSodium";
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
		const ekp: KeyPair = boxKeyPair();
		const result = new Uint8Array(sodiumOverheadLength + value.length);
		result.set(ekp.publicKey, 0);

		// 24 bytes nonce, which is a Blake2B digest from the ephemeral public key and the recipient's public key.
		const nonce: Uint8Array = new Blake2B({ length: boxNonceLength }).update(ekp.publicKey).update(this.#publicKey).hash();

		const cipherText: Uint8Array = box(new TextEncoder().encode(value), nonce, this.#publicKey, ekp.secretKey);
		result.set(cipherText, boxPublicKeyLength);
		return result.toBase64();
	}
}
export default GitHubSodiumSealer;
