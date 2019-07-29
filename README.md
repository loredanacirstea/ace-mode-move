# ace-mode-move

Syntax highlighting for Libra's Move language (https://developers.libra.org/docs/move-paper), for Ace ( https://ace.c9.io/ )

Based on https://github.com/raphaelhuefner/ace-mode-solidity.

- The [`build`](./build/) directory holds prebuilt versions of the Move edit mode like you would find in the [ace-builds](https://github.com/ajaxorg/ace-builds/) repository.
- The [`build/legacy`](./build/legacy/) directory has older versions which were built with a re-created ACE build process which does not crash on recent Node.js versions.
- As an added bonus, the `legacy` directory has also [brace](https://www.npmjs.com/package/brace) (ACE for browserify) versions, look for `src-brace` subdirs.
- `mode-javascript.js` files only exist to ensure the 2 build processes are consistent.
- Currently the only tested build is `build/remix-ide/mode-move.js` because the main focus is to enable [Remix IDE](https://github.com/ethereum/remix-ide) to start using this NPM package.
