import { Buffer } from "node:buffer";
import { Blake2B } from "https://raw.githubusercontent.com/hugoalh/blake-es/v0.2.1/2b.ts";
import {
	box,
	boxKeyPair,
	boxNonceLength,
	boxOverheadLength,
	boxPublicKeyLength
} from "https://raw.githubusercontent.com/hugoalh/nacl-es/v0.1.1/highlevel.ts";
import type { KeyPair } from "https://raw.githubusercontent.com/hugoalh/nacl-es/v0.1.1/lowlevel.ts";
const sodiumOverheadLength: number = boxOverheadLength + boxPublicKeyLength;
/**
 * GitHub sodium sealer for encrypt value to the GitHub secret value.
 */
export class GitHubSodiumSealer {
	get [Symbol.toStringTag](): string {
		return "GitHubSodiumSealer";
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
		this.#publicKey = Buffer.from(publicKey, "base64");
	}
	/**
	 * Get the 24 bytes nonce, which is a Blake2B digest from the ephemeral public key and the recipient's public key.
	 * @param {Uint8Array} epk Ephemeral public key.
	 * @returns {Uint8Array} A 24 bytes nonce.
	 */
	#getNonce(epk: Uint8Array): Uint8Array {
		return new Blake2B({ length: boxNonceLength }).update(epk).update(this.#publicKey).hash();
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
		const nonce: Uint8Array = this.#getNonce(ekp.publicKey);
		const cipherText: Uint8Array = box(new TextEncoder().encode(value), nonce, this.#publicKey, ekp.secretKey);
		result.set(cipherText, boxPublicKeyLength);
		return Buffer.from(result).toString("base64");
	}
}
export default GitHubSodiumSealer;
/**
 * Encrypt value to the GitHub secret value.
 * @param {string} publicKey Public key, which get from the GitHub organization or repository, need for encrypt value to the GitHub secret value before create or update the GitHub secret.
 * @param {string} value Value that need to encrypt as the GitHub secret value.
 * @returns {string} An encrypted GitHub secret value.
 */
export function seal(publicKey: string, value: string): string {
	return new GitHubSodiumSealer(publicKey).encrypt(value);
}
