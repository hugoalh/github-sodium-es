import { parseArgs } from "node:util";
import { GitHubSodiumSealer } from "../libsodium.ts";
if (!import.meta.main) {
	throw new Error(`This entrypoint is for command line only!`);
}
const { positionals } = parseArgs({ allowPositionals: true });
if (positionals.length !== 2) {
	throw new Error(`Invalid arguments length! Expect: 2, Current: ${positionals.length}.`);
}
const [
	publicKey,
	secretValue
]: readonly string[] = positionals;
console.log(new GitHubSodiumSealer(publicKey).encrypt(secretValue));
