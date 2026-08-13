# GitHub Sodium (ES)

[**⚖️** MIT](./LICENSE.md)

🔗
[DistBoard @hugoalh](https://hugoalh.github.io/distboard/github_sodium_ecmascript)
● [GitHub](https://github.com/hugoalh/github-sodium-es)
● [JSR](https://jsr.io/@hugoalh/github-sodium)
● [NPM](https://www.npmjs.com/package/@hugoalh/github-sodium)

An ECMAScript module to provide an easier and simplified method for encrypt GitHub secrets.

## 🌟 Features

- Support multiple implementations:
  - **LibSodium:** Default; Recommended by GitHub; Bad compatibility with bundler or compiler.
  - **TweetSodium:** Originally created by GitHub but deprecated and unmaintained ([Repository](https://github.com/github/tweetsodium)), currently maintain here; Good compatibility with bundler or compiler.

## 🎯 Runtime Targets

Any runtime which support ECMAScript should able to use this; These runtimes are officially supported:

- **[Bun](https://bun.sh/)** >= v1.1.0
- **[Deno](https://deno.land/)** >= v2.1.0
- **[NodeJS](https://nodejs.org/)** >= v20.9.0

## 🛡️ Runtime Permissions

This does not request any runtime permission.

## #️⃣ Entrypoints

| **Type** | **Name** | **Path** | **Description** |
|:--|:--|:--|:--|
| API | `.` | `./mod.ts` | Default (LibSodium). |
| API | `./libsodium` | `./libsodium.ts` | LibSodium. |
| API | `./tweetsodium` | `./tweetsodium.ts` | TweetSodium. |
| CLI | `./cli` | N/A | Default (LibSodium). |
| CLI | `./libsodium/cli` | `./libsodium/cli.ts` | LibSodium. |
| CLI | `./tweetsodium/cli` | `./tweetsodium/cli.ts` | TweetSodium. |

> [!NOTE]
> - Different runtimes have vary support for the entrypoints, visit the runtime documentation for more information.
> - These are not part of the public APIs hence should not be used:
>   - Benchmark/Test file (e.g.: `example.bench.ts`, `example.test.ts`).
>   - Entrypoint name or path include any underscore prefix (e.g.: `_example.ts`, `foo/_example.ts`).
>   - Identifier/Namespace/Symbol include any underscore prefix (e.g.: `_example`, `Foo._example`).

## 🧩 APIs

- ```ts
  class GitHubSodiumSealer {
    constructor(publicKey: string);
    encrypt(value: string): string;
  }
  ```

> [!NOTE]
> - For the full or prettier documentation, can visit via:
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/doc)
>   - [JSR](https://jsr.io/@hugoalh/github-sodium)

## 🧩 CLIs

- ```powershell
  ghs $PublicKey $SecretValue
  ```
- ```powershell
  ghs-ls $PublicKey $SecretValue
  ```
- ```powershell
  ghs-ts $PublicKey $SecretValue
  ```

## ✍️ Examples

- ```ts
  new GitHubSodiumSealer("2Sg8iYjAxxmI2LvUXpJjkYrMxURPc8r+dB7TJyvv1234").encrypt("plain-text-secret");
  ```
- ```powershell
  ghs '2Sg8iYjAxxmI2LvUXpJjkYrMxURPc8r+dB7TJyvv1234' 'plain-text-secret'
  ```
