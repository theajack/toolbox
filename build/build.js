
const {execSync} = require('child_process');
const name = process.argv[2];
execSync(`vite build -m=sdk_${name}`);