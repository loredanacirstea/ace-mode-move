const project = require('../project.js');

const aceVersionForRemixIde = 'v1.1.8';

function buildForRemixIde() {
  project.run('mkdir -p build/remix-ide');
  project.run(`cp build/legacy/${aceVersionForRemixIde}/src-brace/mode-move.js build/remix-ide/mode-move.js`);
}

module.exports = buildForRemixIde;

if (! module.parent) {
  buildForRemixIde();
}
