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
import {Filter} from './filter';

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

    filter: Filter;

    constructor ({
        container,
        needCopy = true,
        mode = 'dark',
        bgTransparent = false,
    }: {
        container: HTMLElement|string,
        needCopy?: boolean,
        mode?: 'light'|'dark',
        bgTransparent?: boolean,
    }) {
        if (typeof container === 'string') {
            container = document.querySelector(container)! as HTMLElement;
        }
        container.classList.add('cc-console-container');
        if (bgTransparent) {
            container.style.backgroundColor = 'transparent';
        }
        this.container = container;
        this.needCopy = needCopy;
        this.console = new ConsoleHacker(needCopy);
        this.title = 'log';
        this.lastConsoleValue = {};
        this.lastType = '';
        this.index = 1;
        this.version = __VERSION__;
        this.container.classList.add(`cc-${mode}`);
        this.mode = mode;

        this._render();

        this.filter = new Filter(this.blockList);
        // tab , page , index
    }

    setMode (mode: 'light'|'dark') {
        this.container.classList.replace(`cc-${this.mode}`, `cc-${mode}`);
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
            onconfirm: (v: string) => { this.filterText(v); },
            onclose: () => { this.filterText(''); }
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
    filterText (v: string) {
        this.filter.setTextFilter(v);
    }
    filterType (v: 'all'|'error'|'warn'|'log'|'info'|'tc') {
        this.filter.setTypeFilter(v);
    }
    clear () {
        this.blockList.innerHTML = '';
    }
    private _appendRepeatEle () {
        let c: any = this.blockList.children;
        let el = c[c.length - 1].querySelector('.cc-log-repeat')! as HTMLElement;
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