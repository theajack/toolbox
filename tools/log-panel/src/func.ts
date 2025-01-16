/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-15 20:21:18
 * @Description: Coding something
 */
import tool from './tool';

// import {dom} from 'link-dom';

import TYPE from './type';
import {Icons} from './util';
let state = TYPE.all;
let laseEl: any;
function gc (el: HTMLElement, type: string) {
    let cls = 'log-func log-' + type;
    if (type === state) {
        cls += ' active';
    }
    return tool.create('div', cls, type, function (this: HTMLElement) {
        if (type === state) {
            return;
        }
        if (laseEl) {laseEl.className = laseEl.className.replace('tc-active', '').trim();}
        state = type;
        laseEl = this;
        this.className += ' tc-active';
        const list = el.children;
        if (state === TYPE.all) {
            for (let i = 0; i < list.length; i++) {
                (list[i] as HTMLElement).style.display = 'block';
            }
        } else {
            for (let i = 0; i < list.length; i++) {
                const el = list[i] as HTMLElement;
                if (el.className.indexOf('tc-log-' + type) !== -1) {
                    el.style.display = 'block';
                } else {
                    el.style.display = 'none';
                }
            }
        }
    });
}
export function generateFunc (log) {
    const el = log.blockList;
    const clear = tool.create('div', 'log-func log-clear log-icon', '', () => {
        log.blockList.innerHTML = '';
        console.tc('Console all clear');
    });
    clear.innerHTML = Icons.Delete;
    return tool.append(
        tool.create('div', 'log-funcs'),
        [
            clear,
            laseEl = gc(el, TYPE.all),
            gc(el, TYPE.error),
            gc(el, TYPE.warn),
            gc(el, TYPE.info),
            gc(el, TYPE.log),
            gc(el, TYPE.tc),

            
        ]
    );
}


export function checkType (el, type) {
    if (state !== TYPE.all && type !== state) {
        el.style.display = 'none';
    }
}