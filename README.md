# ts-node-problem

## The Problem

I've set up a basic command line tool to run a Google Lighthouse test
programmatically, as
[described in the Lighthouse documentation](https://github.com/GoogleChrome/lighthouse/blob/main/docs/readme.md).

I'm using the following tools and libraries, at the latest version available at the time I've set up this repository:

- [Node.js](https://nodejs.org/en), version 20, installed through [nvm](https://github.com/nvm-sh/nvm)
- [Yarn](https://yarnpkg.com/) package manager, version 3, in
  [plug'n'play](https://yarnpkg.com/features/pnp#initializing-pnp) mode
- [TypeScript](https://www.typescriptlang.org/), version 5
- [ts-node](https://github.com/TypeStrong/ts-node), version 10
- [lighthouse](https://github.com/GoogleChrome/lighthouse#readme), version 10

I've set up TypeScript with the default configuration using this command:

```
yarn tsc --init
```

I try to run my script using this command:

```
yarn start
```

I get the following error message:

```
Error: require() of ES Module /Users/patrick.hund/IdeaProjects/ts-node-problem/.yarn/cache/lighthouse-npm-10.4.0-fbaeb66489-62fb3d106d.zip/node_modules/lighthouse/core/index.js from /Users/patrick.hund/IdeaProjects/ts-node-problem/src/index.ts not supported.
Instead change the require of index.js in /Users/patrick.hund/IdeaProjects/ts-node-problem/src/index.ts to a dynamic import() which is available in all CommonJS modules.
    at require$$0.Module._extensions..js (/Users/patrick.hund/IdeaProjects/ts-node-problem/.pnp.cjs:10762:15)
    at Object.require.extensions.<computed> [as .js] (/Users/patrick.hund/IdeaProjects/ts-node-problem/.yarn/__virtual__/ts-node-virtual-be91e04a9a/0/cache/ts-node-npm-10.9.1-6c268be7f4-090adff130.zip/node_modules/ts-node/src/index.ts:1608:43)
    at Module.load (node:internal/modules/cjs/loader:1115:32)
    at Function.Module._load (node:internal/modules/cjs/loader:962:12)
    at Function.require$$0.Module._load (/Users/patrick.hund/IdeaProjects/ts-node-problem/.pnp.cjs:10611:31)
    at Module.require (node:internal/modules/cjs/loader:1139:19)
    at require (node:internal/modules/helpers:121:18)
    at Object.<anonymous> (/Users/patrick.hund/IdeaProjects/ts-node-problem/src/index.ts:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1257:14)
    at Module.m._compile (/Users/patrick.hund/IdeaProjects/ts-node-problem/.yarn/__virtual__/ts-node-virtual-be91e04a9a/0/cache/ts-node-npm-10.9.1-6c268be7f4-090adff130.zip/node_modules/ts-node/src/index.ts:1618:23) {
  code: 'ERR_REQUIRE_ESM'
}

Process finished with exit code 1
```
