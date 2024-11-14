# GitHub Sodium (ES)

[**⚖️** MIT](./LICENSE.md)

[![GitHub: hugoalh/github-sodium-es](https://img.shields.io/github/v/release/hugoalh/github-sodium-es?label=hugoalh/github-sodium-es&labelColor=181717&logo=github&logoColor=ffffff&sort=semver&style=flat "GitHub: hugoalh/github-sodium-es")](https://github.com/hugoalh/github-sodium-es)
[![JSR: @hugoalh/github-sodium](https://img.shields.io/jsr/v/@hugoalh/github-sodium?label=@hugoalh/github-sodium&labelColor=F7DF1E&logo=jsr&logoColor=000000&style=flat "JSR: @hugoalh/github-sodium")](https://jsr.io/@hugoalh/github-sodium)
[![NPM: @hugoalh/github-sodium](https://img.shields.io/npm/v/@hugoalh/github-sodium?label=@hugoalh/github-sodium&labelColor=CB3837&logo=npm&logoColor=ffffff&style=flat "NPM: @hugoalh/github-sodium")](https://www.npmjs.com/package/@hugoalh/github-sodium)

An ES (JavaScript & TypeScript) module to provide an easier and simplified method for encrypt GitHub secrets, based on the NPM package [`libsodium.js`](https://www.npmjs.com/package/libsodium-wrappers).

## 🔰 Begin

### 🎯 Targets

|  | **Remote** | **JSR** | **NPM** |
|:--|:--|:--|:--|
| **[Bun](https://bun.sh/)** >= v1.1.0 | ❌ | ❓ | ✔️ |
| **[Cloudflare Workers](https://workers.cloudflare.com/)** | ❌ | ❓ | ✔️ |
| **[Deno](https://deno.land/)** >= v1.42.0 | ✔️ | ✔️ | ✔️ |
| **[NodeJS](https://nodejs.org/)** >= v16.13.0 | ❌ | ❓ | ✔️ |

> [!NOTE]
> - It is possible to use this module in other methods/ways which not listed in here, however those methods/ways are not officially supported, and should beware maybe cause security issues.

### #️⃣ Resources Identifier

- **Remote - GitHub Raw:**
  ```
  https://raw.githubusercontent.com/hugoalh/github-sodium-es/{Tag}/mod.ts
  ```
- **JSR:**
  ```
  [jsr:]@hugoalh/github-sodium[@{Tag}]
  ```
- **NPM:**
  ```
  [npm:]@hugoalh/github-sodium[@{Tag}]
  ```

> [!NOTE]
> - For usage of remote resources, it is recommended to import the entire module with the main path `mod.ts`, however it is also able to import part of the module with sub path if available, but do not import if:
>
>   - it's path has an underscore prefix (e.g.: `_foo.ts`, `_util/bar.ts`), or
>   - it is a benchmark or test file (e.g.: `foo.bench.ts`, `foo.test.ts`), or
>   - it's symbol has an underscore prefix (e.g.: `_bar`, `_foo`).
>
>   These elements are not considered part of the public API, thus no stability is guaranteed for them.
> - For usage of JSR or NPM resources, it is recommended to import the entire module with the main entrypoint, however it is also able to import part of the module with sub entrypoint if available, please visit the [file `jsr.jsonc`](./jsr.jsonc) property `exports` for available sub entrypoints.
> - It is recommended to use this module with tag for immutability.

### 🛡️ Require Runtime Permissions

*This module does not require any runtime permission.*

## 🧩 APIs (Excerpt)

- ```ts
  class GitHubSodiumSealer {
    constructor(publicKey: string, keyID?: string);
    encrypt(value: string): string;
    encryptToRequestBody(value: string): GitHubRESTSetPublicKeyRequestBody;
    getKeyID(): string | undefined;
    get keyID(): string | undefined;
    static fromJSON(input: JSONObject): GitHubSodiumSealer;
    static async fromResponse(input: Response): Promise<GitHubSodiumSealer>;
  }
  ```
- ```ts
  interface GitHubRESTSetPublicKeyRequestBody {
    encrypted_value: string;
    key_id: string;
  }
  ```

> [!NOTE]
> - For the full or prettier documentation, can visit via:
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/documentation_generator/)
>   - [JSR](https://jsr.io/@hugoalh/github-sodium)

## ✍️ Examples

- ```ts
  new GitHubSodiumSealer("2Sg8iYjAxxmI2LvUXpJjkYrMxURPc8r+dB7TJyvv1234").encrypt("plain-text-secret");
  ```
