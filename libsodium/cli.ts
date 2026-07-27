import { GitHubSodiumSealer } from "../libsodium.ts";
if (!import.meta.main) {
	throw new Error(`This entrypoint is for command line only!`);
}
const args: readonly string[] = Deno.args;
if (args.length !== 2) {
	throw new Error(`Invalid arguments length! Expect: 2, Current: ${args.length}.`);
}
const [
	publicKey,
	secretValue
]: readonly string[] = args;
console.log(new GitHubSodiumSealer(publicKey).encrypt(secretValue));
