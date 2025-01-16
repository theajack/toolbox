/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-15 20:21:18
 * @Description: Coding something
 */
import {objectViewer} from './object-viewer';
import {valueViewer} from './value-viewer';
import TYPE from './type';

export class ConsoleHacker {
    needCopy: boolean;
    onConsole: (el: HTMLElement, arg: any, type: string) => void;
    constructor (needCopy: boolean) {
        this.needCopy = needCopy;
        window.console.tc = window.console.log;
        // window.console.html = window.console.log;
        TYPE.list.forEach((name) => {
            this.hack(name);
        });
        window.addEventListener('error', function (err) {
            console.error(`${err.constructor.name}:\n${err.error.stack}`);
        });
    }
    hack (name: string) {
        const f = window.console[name];
        console['_' + name] = f;
        window.console[name] = (...arg: any[]) => {
            f(...arg);
            if (arg.length == 0) {
                return;
            }
            if (arg.length === 1) {
                arg = arg[0];
                if (objectViewer.test(arg)) {
                    this.onConsole(objectViewer(arg, name), arg, name);
                } else {
                    this.onConsole(valueViewer(arg, name, false, this.needCopy), arg, name);
                }
            } else {
                this.renderMulti(arg, name);
            }
        };
    }
    renderMulti (arg: any[], name: string) {
        let str = '';
        const objArr: any[] = [];
        for (let i = 0; i < arg.length; i++) {
            const value = arg[i];
            if (objectViewer.test(value)) {
                objArr.push(value);
                str += '[' + spanStr('key', 'Object' + (objArr.length)) + '] ';
            } else {
                str += generateHtml(value) + ' ';
            }
        }
        this.onConsole(valueViewer(str, name, true, this.needCopy), str, name);
        objArr.forEach((obj, i) => {
            this.onConsole(objectViewer(obj, 'tc', 'Object' + (i + 1)), obj, name);
        });
    }
}

function generateHtml (value) {
    let str = '';
    switch (typeof value) {
        case 'undefined': str = spanStr('key', 'undefined'); break;
        case 'object': str = spanStr('key', 'null'); break;// 只可能是null
        case 'string': str = spanStr('string', value); break;
        case 'number': str = spanStr('number', value); break;
        case 'boolean': str = spanStr('key', value); break;
        case 'function': str = spanStr('def', value.toString()); break;
        default :break;
    }
    return str;
}

function spanStr (cls, text) {
    return '<span class="tc-obj-' + cls + '">' + text + '</span>';
}