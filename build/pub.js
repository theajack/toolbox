/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-12 14:49:59
 * @Description: Coding something
 */
const {execSync} = require('child_process');
const {resolve} = require('path');
const name = process.argv[2];

const toolConfig = require(resolve(__dirname, `../tools/${name}/config.json`));

const tail = toolConfig.name?.startsWith('@') ? ' --access public' : '';

execSync(`cd publish/${name} && npm publish${tail}`);