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
export function generateFunc (log: Console) {
    const el = log.blockList;
    return tool.append(
        tool.create('div', 'log-funcs'),
        [
            tool.append(
                tool.create('div', 'log-types'),
                [
                    laseEl = gc(el, TYPE.all),
                    gc(el, TYPE.error),
                    gc(el, TYPE.warn),
                    gc(el, TYPE.info),
                    gc(el, TYPE.log),
                    gc(el, TYPE.tc),
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


export function checkType (el, type) {
    if (state !== TYPE.all && type !== state) {
        el.style.display = 'none';
    }
}