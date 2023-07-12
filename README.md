# ts-node-problem

## The Problem

I've set up a basic command line tool to run a Google Lighthouse test
programmatically, as
[described in the Lighthouse documentation](https://github.com/GoogleChrome/lighthouse/blob/main/docs/readme.md).

I'm using the following tools and libraries, at the latest version available at
the time I've set up this repository:

- [Node.js](https://nodejs.org/en), version 20, installed through
  [nvm](https://github.com/nvm-sh/nvm)
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

## Troubleshooting

### Is it Yarn?

I had a suspicion that it might be Yarn and its Plug'n'Play mode that causes the
issue, so I've changed the project's package manager setup to use
[npm](https://www.npmjs.com/) instead.

If you want to try this out, check out the branch
[npm](https://github.com/pahund/ts-node-problem/tree/npm).

```
git checkout npm
npm install
npm run start
```

The error message is the same, so **it's not Yarn**.

### Is it Lighthouse?

The next question I asked myself is: “is something wrong with the Lighthouse
library that won't let it play nice with my very basic setup?”

I removed the lighthouse dependency and the demo code. I added a dependency to
the library [chalk](https://www.npmjs.com/package/chalk) instead, which can be
used for colored console output. I replaced the lighthouse example in my script
with a basic chalk example.

Running the chalk demo produced a similar error as lighthouse,
`Error: require() of ES Module` etc.

In the README of chalk, there is an interesting note, though:

> IMPORTANT: Chalk 5 is ESM. If you want to use Chalk with TypeScript or a build
> tool, you will probably want to use Chalk 4 for now.

Could this be the cause? I tried downgrading chalk to version 4 and, lo and
behold, it works now!

Lighthouse is also ESM, so the answer to the question “Is it Lighthouse?” is:
**Kind of, the problem is ESM!**

You can try it out:

```
git checkout other-libraries
yarn install
yarn start
```

This works, but if your change the chalk version in package.json to 5, you get
the error again.

### Is it the TypeScript configuration?

There is a
[GitHub issue on the ts-node repository](https://github.com/TypeStrong/ts-node/issues/935)
regarding this problem. Some comments in the thread suggest changing the
TypeScript configuration and add `"type": "module"` to package.json.

I did this, now I get a different error message:

```
git checkout ts-config-change
yarn start
```

**Result:**

```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /Users/patrick.hund/IdeaProjects/ts-node-problem/src/index.ts
    at new NodeError (node:internal/errors:405:5)
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:99:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:142:36)
    at defaultLoad (node:internal/modules/esm/load:86:20)
    at nextLoad (node:internal/modules/esm/hooks:726:28)
    at load$1 (file:///Users/patrick.hund/IdeaProjects/ts-node-problem/.pnp.loader.mjs:1456:12)
    at nextLoad (node:internal/modules/esm/hooks:726:28)
    at load (/Users/patrick.hund/IdeaProjects/ts-node-problem/.yarn/__virtual__/ts-node-virtual-be91e04a9a/0/cache/ts-node-npm-10.9.1-6c268be7f4-090adff130.zip/node_modules/ts-node/dist/child/child-loader.js:19:122)
    at nextLoad (node:internal/modules/esm/hooks:726:28)
    at Hooks.load (node:internal/modules/esm/hooks:370:26) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
```

### Is it _ts-node_?

I tried removing _ts-node_ altogether and just compiling the TypeScript code and
running the resulting JavaScript code with _node_.

```
git checkout no-ts-node
yarn
yarn start
```

Same error message – apparently, this is a general problem with TypeScript, not
specifically with _ts-node_.

### Can dynamic imports help?

I found [this on StackOverflow](https://stackoverflow.com/a/75281896/1253156),
where someone had the same problem with _node-fetch_:

> You can use this line instead of "require"
> `const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));`

So they are suggesting to use a dynamic import statement, like it actually suggests in my error message:

```
Instead change the require of index.js in /Users/patrick.hund/IdeaProjects/ts-node-problem/src/index.ts to a dynamic import() which is available in all CommonJS modules.
```

Unfortunately, I couldn't get it to work.

```
git checkout dynamic-import
yarn start
```

…same error message…

### Not using TypeScript at all

We **can** throw out the baby with the bathwater and just resort to using plain JavaScript (with ESM modules):

```
git checkout no-typescript
yarn
yarn start
```

This works, but of course, we have none of the benefits of working with TypeScript.
