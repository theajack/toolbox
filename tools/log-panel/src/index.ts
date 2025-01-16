/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-15 20:21:18
 * @Description: Coding something
 */
import {ConsoleHacker} from './hack-console.js';
import tool from './tool.js';
import {objectViewer} from './object-viewer.js';
import {generateFunc, checkType} from './func.js';
import './style.css';
import './global.d';

export class Log {
    console: ConsoleHacker;
    title: string;
    lastConsoleValue: any;
    lastType: string;
    index: number;
    version: string;
    blockList: HTMLElement;
    funcs: HTMLElement;
    constructor (
        public container: HTMLElement,
        public needCopy: boolean = false,
    ) {
        container.classList.add('console-container');
        this.console = new ConsoleHacker(needCopy);
        this.title = 'log';
        this.lastConsoleValue = {};
        this.lastType = '';
        this.index = 1;
        this.version = __VERSION__;

        this.render();
        // tab , page , index
    }
    init () {
        // this.page.innerHTML = '> log test '+this.index;
        // tool.addStyle(/* css*/``, 'tconLogPlugin');
        this.blockList = tool.create('div', 'log-list');
        this.funcs = generateFunc(this);
        tool.append(this.container, [ this.funcs, this.blockList]);
    }
    appendRepeatEle () {
        let c: any = this.blockList.children;
        let el = c[c.length - 1].querySelector('.tc-log-repeat')! as HTMLElement;
        if (el) {
            el.innerText = this.index + '';
        } else {
            el = tool.create('span', 'log-repeat', this.index + '');
            c = c[c.length - 1].children;
            c = c[c.length - 1];
            c.insertBefore(el, c.children[0]);
        }
    }
    render () {
        this.init();
        this.console.onConsole = (el, args, type) => {
            checkType(el, type);
            if (objectViewer.test(args)) {
                tool.append(this.blockList, el);
            } else {
                if (this.lastConsoleValue === args && this.lastType === type && this.blockList.children.length > 0) {
                    this.index++;
                    this.appendRepeatEle();
                } else {
                    this.lastConsoleValue = args;
                    this.lastType = type;
                    this.index = 1;
                    tool.append(this.blockList, el);
                }
            }
        };
    }
}