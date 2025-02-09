/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-12 14:48:25
 * @Description: Coding something
 */

const {resolve} = require('path');
const {execSync} = require('child_process');
const name = process.argv[2];
execSync(`vite build -m=sdk_${name}`);

const toolConfig = require(resolve(__dirname, `../tools/${name}/config.json`));

if (toolConfig.envs.includes('browser')) {
    execSync(`vite build -m=iife_${name}`);
}