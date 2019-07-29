'use strict';
const fs = require('fs');
const browserify = require('browserify');
const writeFilePromise = require('fs-writefile-promise');
const collectMoveSnippets = require('./collect-move-snippets.js');

async function writeMoveSnippets() {
  let moveSnippets = await collectMoveSnippets();
  await writeFilePromise(__dirname + '/cache/move-snippets.js', moveSnippets);
}

async function build() {
  await writeMoveSnippets();

  let browserify_opts = {
    debug: true,
    bare: true,
    basedir: __dirname
  }

  browserify(browserify_opts)
    .require(require.resolve('./cache/move-snippets.js'), { basedir: __dirname })
    .require(require.resolve('../build/remix-ide/mode-move.js'), { basedir: __dirname })
    .require(require.resolve('./src/move-editor.js'), { entry: true, basedir: __dirname })

    .bundle()
    .pipe(fs.createWriteStream(__dirname + '/cache/bundle.js'));
}

build();
