/*
 * @Author: theajack
 * @Date: 2023-04-04 23:20:27
 * @Description: Coding something
 */
import {LibraryFormats, UserConfig, defineConfig} from 'vite';
import {babel} from '@rollup/plugin-babel';
import {resolve} from 'path';
import pkg from './package.json';
import {execSync} from 'child_process';
import {writeFileSync, copyFileSync, rmdirSync} from 'fs';

const {version, ebuild, name} = pkg;

const pubVersion = ebuild.publish.version || version;

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    const isDev = mode === 'development';
    console.log('defineConfig', mode, isDev);

    let version = pubVersion;
    let name = '';

    if (mode.startsWith('iife') || mode.startsWith('sdk')) {
        [mode, name] = mode.split('_');
        version = require(`./tools/${name}/config.json`).version;
    }

    const config = ({
        'development': geneDevConfig,
        'sdk': () => geneBuildConfig(name),
        'iife': () => geneBuildConfig(name, true),
        'app': geneBuildAppConfig,
    })[mode]();


    return {
        define: {
            __DEV__: isDev,
            __VERSION__: `"${version}"`,
            __WIN__: 'globalThis',
        },
        ...config,
    };
});
// ! Dev VApp 时的配置
function geneDevConfig (): UserConfig {
    return {
        plugins: [],
        server: {
            host: '0.0.0.0',
            port: 5173,
        },
    };
}

function geneBuildAppConfig (): UserConfig {
    return {
        base: `/${name}`,
        build: {
            outDir: './docs'
        }
    };
}

function geneBuildConfig (name: string, isIIFE = false): UserConfig {
    const toolConfig = require(`./tools/${name}/config.json`);

    let formats: LibraryFormats[];

    if (isIIFE) {
        formats = ['iife'];
    } else {
        formats = ['es'];
        if (!toolConfig.browserOnly) {
            formats.push('cjs');
        }
    }
    return {
        plugins: [{
            name: 'generate-npm-stuff',
            writeBundle () {

                if (isIIFE) {
                    const fullName = `${name}.iife.min.js`;
                    copyFileSync(`publish/${name}/iife/${fullName}`, `publish/${name}/${fullName}`);
                    rmdirSync(`publish/${name}/iife`, {recursive: true});
                } else {
                    execSync([
                        'npx dts-bundle-generator -o',
                        `publish/${name}/${name}.es.min.d.ts`,
                        `tools/${name}/index.ts`
                    ].join(' '));
                    generatePackage(name);
                }
            }
        }],
        
        
        build: {
            minify: true,
            lib: {
                entry: resolve(__dirname, `tools/${name}/index.ts`), // 打包的入口文件
                name: toolConfig.libName || upcase(name), // 包名
                formats, // 打包模式，默认是es和umd都打
                fileName: (format: string) => `${name}.${format}.min.js`,
            },
            rollupOptions: {
                external: isIIFE ? [] : toolConfig.dependencies,
                plugins: [
                    babel({
                        exclude: 'node_modules/**',
                        extensions: ['.js', '.ts', 'tsx'],
                        configFile: resolve(__dirname, './build/babel.config.js'),
                    })
                ]
            },
            outDir: resolve(__dirname, `publish/${name}/${isIIFE ? 'iife' : ''}`), // 打包后存放的目录文件
        },
    };
}

function generatePackage (name: string) {

    const target = `./publish/${name}/`;

    copyFileSync(`./tools/${name}/README.md`, `${target}README.md`);
    copyFileSync('./LICENSE', `${target}/LICENSE`);

    const pkg = require('./package.json');
    const toolConfig = require(`./tools/${name}/config.json`);
    const list = toolConfig.dependencies || [];
    const dependencies = {};
    console.log('list', list);
    for (const name of list) {
        dependencies[name] = pkg.dependencies[name];
    }

    writeFileSync(
        `${target}package.json`,
        JSON.stringify(Object.assign(
            ebuild.publish,
            {
                homepage: `https://shiyix.cn/jsbox/?github=theajack.toolbox/tools/${name}`
            },
            pick(toolConfig, [
                'version', 'description',
                'keywords'
            ]),
            {
                name,
                dependencies,
                'main': `${name}.${toolConfig.browserOnly ? 'es' : 'cjs'}.min.js`,
                'module': `${name}.es.min.js`,
                'unpkg': `${name}.iife.min.js`,
                'jsdelivr': `${name}.iife.min.js`,
                'typings': `${name}.es.min.d.ts`,
                'repository': {
                    'type': 'git',
                    'url': `https://github.com/theajack/toolbox/tree/main/tools/${name}`
                },
            }
        ), null, 2),
        'utf8'
    );
}

function pick (target: any, keys: string[]) {
    const result: any = {};
    for (const key of keys) {
        result[key] = target[key];
    }
    return result;
}

function upcase (name: string) {
    return name.split('-').map(s => {
        return s[0].toUpperCase() + s.substring(1);
    }).join('');
}