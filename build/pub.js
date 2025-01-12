/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-12 14:49:59
 * @Description: Coding something
 */
const {execSync} = require('child_process');
const name = process.argv[2];
execSync(`cd publish/${name} && npm publish`);