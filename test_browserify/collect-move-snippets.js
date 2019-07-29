'use strict';
const path = require('path');
const enumerateFiles = require('enumerate-files');
const readFilePromise = require('fs-readfile-promise');

const DATADIR = __dirname + '/data';


async function moveFilesToModuleCode(moveFileNames) {
  let moveCodeCollection = {};
  for (let moveFileName of moveFileNames) {
    let moveCode = await readFilePromise(moveFileName);
    let name = path.basename(moveFileName, '.mvir');
    moveCodeCollection[name] = moveCode.toString();
  }
  return 'module.exports = ' + JSON.stringify(moveCodeCollection, null, 2) + ';';
}

async function collectMoveCode() {
  let files = Array.from(await enumerateFiles(DATADIR));
  let moveFileNames = files.filter(file => /\.mvir$/.test(file));
  return await moveFilesToModuleCode(moveFileNames);
}

module.exports = collectMoveCode
