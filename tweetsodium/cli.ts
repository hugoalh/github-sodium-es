#!/usr/bin/env -S deno run
import { exit } from "node:process";
import {
	parseArgs,
	styleText
} from "node:util";
import { GitHubSodiumSealer } from "../tweetsodium.ts";
if (!import.meta.main) {
	throw new Error(`This entrypoint is for command line only!`);
}
addEventListener("unhandledrejection", (event: PromiseRejectionEvent): void => {
	event.preventDefault();
	let message: string;
	if (event.reason instanceof Error) {
		message = event.reason.message;
		if ((event.reason.stack ?? "").length > 0) {
			message += `\n${event.reason.stack}`;
		}
	} else {
		message = String(event.reason);
	}
	console.error(`${styleText(["red"], "ERR", { validateStream: false })}\t${message}`);
	exit(1);
}, { capture: true });
const { positionals } = parseArgs({ allowPositionals: true });
if (positionals.length !== 2) {
	throw new Error(`Invalid arguments length! Expect: 2, Current: ${positionals.length}.`);
}
const [
	publicKey,
	secretValue
]: readonly string[] = positionals;
console.log(new GitHubSodiumSealer(publicKey).encrypt(secretValue));
