/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-15 20:21:18
 * @Description: Coding something
 */
import {ConsoleHacker} from './hack-console';
import tool from './tool';
import {objectViewer} from './object-viewer';
import {generateFunc, checkType} from './func';
import './style.less';
import './global.d';
import {InputBox} from './input-box';

export class Console {
    console: ConsoleHacker;
    title: string;
    lastConsoleValue: any;
    lastType: string;
    index: number;
    version: string;
    blockList: HTMLElement;
    funcs: HTMLElement;

    filterBox: InputBox;
    runBox: InputBox;

    container: HTMLElement;
    mode: 'light'|'dark';
    needCopy: boolean = false;

    constructor ({
        container,
        needCopy = true,
        mode = 'dark',
    }: {
        container: HTMLElement|string,
        needCopy?: boolean,
        mode?: 'light'|'dark',
    }) {
        if (typeof container === 'string') {
            container = document.querySelector(container)! as HTMLElement;
        }
        container.classList.add('tc-console-container');
        this.container = container;
        this.needCopy = needCopy;
        this.console = new ConsoleHacker(needCopy);
        this.title = 'log';
        this.lastConsoleValue = {};
        this.lastType = '';
        this.index = 1;
        this.version = __VERSION__;
        this.container.classList.add(`tc-${mode}`);
        this.mode = mode;

        this._render();
        // tab , page , index
    }

    setMode (mode: 'light'|'dark') {
        this.container.classList.replace(`tc-${this.mode}`, `tc-${mode}`);
        this.mode = mode;
    }
    setVisible (bool: boolean, style = 'flex') {
        this.container.style.display = bool ? style : 'none';
    }
    init () {
        // this.page.innerHTML = '> log test '+this.index;
        // tool.addStyle(/* css*/``, 'tconLogPlugin');
        this.blockList = tool.create('div', 'log-list');
        this.funcs = generateFunc(this);

        this.filterBox = new InputBox({
            placeholder: 'Filter Log.',
            text: 'filter',
            onconfirm: (v: string) => { this.filterLog(v); },
            onclose: () => { this.filterLog(''); }
        });
        this.runBox = new InputBox({
            placeholder: 'Run Javascript.',
            text: 'run',
            onconfirm (v: string) {
                if (v.indexOf('\n') === -1) {
                    const result = new Function(`return ${v}`)();
                    console.log(result);
                } else {
                    new Function(v)();
                }
            },
        });

        tool.append(this.container, [
            this.funcs,
            this.filterBox.container,
            this.runBox.container,
            this.blockList
        ]);
    }
    filterLog (v: string) {
        const reg = new RegExp(v);
        const list = this.blockList.children;
        for (let i = 0; i < list.length; i++) {
            const el = list[i] as HTMLElement;
            const v = (reg.test(el.textContent || '')) ? 'block' : 'none';
            el.style.display = v;
        }
    }
    private _appendRepeatEle () {
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
    private _render () {
        this.init();
        this.console.onConsole = (el, args, type) => {
            checkType(el, type);
            if (objectViewer.test(args)) {
                tool.append(this.blockList, el);
            } else {
                if (this.lastConsoleValue === args && this.lastType === type && this.blockList.children.length > 0) {
                    this.index++;
                    this._appendRepeatEle();
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

export default Console;