import { GitHubSodiumSealer } from "./mod.ts";
Deno.test("1", { permissions: "none" }, () => {
	console.log(new GitHubSodiumSealer("xDk/2gU6fiTtRnolIM5bWzJLvQWkDG4gp3y/OBQjcVY=").encrypt("plain-text-secret"));
});
