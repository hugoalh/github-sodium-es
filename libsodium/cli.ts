import { GitHubSodiumSealer } from "../libsodium.ts";
if (!import.meta.main) {
	throw new Error(`This entrypoint is for command line only!`);
}
const [
	publicKey = "",
	secretValue = ""
]: readonly string[] = Deno.args;
console.log(new GitHubSodiumSealer(publicKey).encrypt(secretValue));
