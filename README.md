# GitHub Sodium (ES)

[**⚖️** MIT](./LICENSE.md)

[![GitHub: hugoalh/github-sodium-es](https://img.shields.io/github/v/release/hugoalh/github-sodium-es?label=hugoalh/github-sodium-es&labelColor=181717&logo=github&logoColor=ffffff&sort=semver&style=flat "GitHub: hugoalh/github-sodium-es")](https://github.com/hugoalh/github-sodium-es)
[![JSR: @hugoalh/github-sodium](https://img.shields.io/jsr/v/@hugoalh/github-sodium?label=@hugoalh/github-sodium&labelColor=F7DF1E&logo=jsr&logoColor=000000&style=flat "JSR: @hugoalh/github-sodium")](https://jsr.io/@hugoalh/github-sodium)
[![NPM: @hugoalh/github-sodium](https://img.shields.io/npm/v/@hugoalh/github-sodium?label=@hugoalh/github-sodium&labelColor=CB3837&logo=npm&logoColor=ffffff&style=flat "NPM: @hugoalh/github-sodium")](https://www.npmjs.com/package/@hugoalh/github-sodium)

An ECMAScript module to provide an easier and simplified method for encrypt GitHub secrets.

## 🎯 Targets

| **Runtime \\ Source** | **GitHub Raw** | **JSR** | **NPM** |
|:--|:-:|:-:|:-:|
| **[Bun](https://bun.sh/)** >= v1.1.0 | ❌ | ✔️ | ✔️ |
| **[Deno](https://deno.land/)** >= v2.1.0 | ✔️ | ✔️ | ✔️ |
| **[NodeJS](https://nodejs.org/)** >= v20.9.0 | ❌ | ✔️ | ✔️ |

## 🛡️ Runtime Permissions

This does not request any runtime permission.

## #️⃣ Sources

- GitHub Raw
  ```
  https://raw.githubusercontent.com/hugoalh/github-sodium-es/{Tag}/mod.ts
  ```
- JSR
  ```
  jsr:@hugoalh/github-sodium[@{Tag}]
  ```
- NPM
  ```
  npm:@hugoalh/github-sodium[@{Tag}]
  ```

> [!NOTE]
> - It is recommended to include tag for immutability.
> - These are not part of the public APIs hence should not be used:
>   - Benchmark/Test file (e.g.: `example.bench.ts`, `example.test.ts`).
>   - Entrypoint name or path include any underscore prefix (e.g.: `_example.ts`, `foo/_example.ts`).
>   - Identifier/Namespace/Symbol include any underscore prefix (e.g.: `_example`, `Foo._example`).

## ⤵️ Entrypoints

| **Name** | **Path** | **Description** |
|:--|:--|:--|
| `.` | `./mod.ts` | Default. |

## 🧩 APIs

- ```ts
  class GitHubSodiumSealer {
    constructor(publicKey: string);
    encrypt(value: string): string;
  }
  ```

> [!NOTE]
> - For the full or prettier documentation, can visit via:
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/doc/)
>   - [JSR](https://jsr.io/@hugoalh/github-sodium)

## ✍️ Examples

- ```ts
  new GitHubSodiumSealer("2Sg8iYjAxxmI2LvUXpJjkYrMxURPc8r+dB7TJyvv1234").encrypt("plain-text-secret");
  ```
