/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-15 20:21:18
 * @Description: Coding something
 */
import type {Console} from '.';
import tool from './tool';

import TYPE from './type';
import {Icons} from './util';
let state = TYPE.all;
let laseEl: any;
function gc (type: string, filter: (v: string)=>void) {
    let cls = 'log-func log-' + type;
    if (type === state) {
        cls += ' active';
    }
    return tool.create('div', cls, type, function (this: HTMLElement) {
        if (type === state) {
            return;
        }
        if (laseEl) {laseEl.className = laseEl.className.replace('cc-active', '').trim();}
        state = type;
        laseEl = this;
        this.className += ' cc-active';
        filter(type);
    });
}
export function generateFunc (log: Console) {
    const filter = (v: string) => {
        log.filterType(v as any);
    };
    return tool.append(
        tool.create('div', 'log-funcs'),
        [
            tool.append(
                tool.create('div', 'log-types'),
                [
                    laseEl = gc(TYPE.all, filter),
                    gc(TYPE.error, filter),
                    gc(TYPE.warn, filter),
                    gc(TYPE.info, filter),
                    gc(TYPE.log, filter),
                    gc(TYPE.tc, filter),
                ]
            ),
            createBtns(log),
        ]
    );
}

function createBtns (log: Console) {
    const map = {
        clear: () => {
            log.blockList.innerHTML = '';
            console.tc('Console all clear');
        },
        filter: () => {
            log.filterBox.open();
        },
        run: () => {
            log.runBox.open();
        }
    };
    const children: any[] = [];
    for (const key in map) {
        const clear = tool.create('span', `log-${key} log-icon`, '', map[key]);
        clear.innerHTML = Icons[key];
        children.push(clear);
    }
    const funcs = tool.create('div', 'log-icon-w');
    tool.append(funcs, children);
    return funcs;
}


export function checkType (el: HTMLElement, type: string) {
    if (state !== TYPE.all && type !== state) {
        el.style.display = 'none';
    }
}