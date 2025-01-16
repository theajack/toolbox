/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-15 20:21:18
 * @Description: Coding something
 */
import tool from './tool';
import {generateLogBlock, copyText} from './util';
const STRING_MAX = 300;

export function valueViewer (value: any, type: string, isHtml: boolean, needCopy: boolean) {
    return (new ValueViewer(value, type, isHtml, needCopy))._block;
}

class ValueViewer {
    _block: HTMLElement;
    html: boolean;
    constructor (value: any, type: string, isHtml: boolean, needCopy: boolean) {
        if (isHtml) {
            this.html = true;
            this._block = generateLogBlock(type);
            const content = tool.create('div');
            tool.append(this._block, content);
            content.innerHTML = value.toString();
            if (needCopy)
                tool.append(content, tool.create('span', 'log-copy', 'copy', () => {
                    copyText(content.innerText.replace(/ copy$/, ''));
                }));
        } else {
            this._block = generateLogBlock(type);
            tool.append(this._block, generateDiv(value, needCopy));
        }
    }
}

function generateDiv (value: any, needCopy: boolean) {
    const div = tool.create('div');
    switch (typeof value) {
        case 'undefined': generateLogSpan(div, 'undefined'); break;
        case 'object': generateLogSpan(div, 'null'); break;// 只可能是null
        case 'string': generateLogSpan(div, checkMaxLength(value), 'obj-string'); break;
        case 'number': generateLogSpan(div, value, 'obj-number'); break;
        case 'boolean': generateLogSpan(div, value); break;
        case 'function': generateLogSpan(div, checkMaxLength(value.toString()), 'obj-def'); break;
        default :generateLogSpan(div, 'undefined'); break;
    }
    if (needCopy)
        tool.append(div, tool.create('span', 'log-copy', 'copy', () => {
            copyText(value);
        }));
    return div;
}

function checkMaxLength (str: string) {
    if (str.length > STRING_MAX) {
        return str.substring(0, STRING_MAX) + '...';
    }
    return str;
}

function generateLogSpan (div: HTMLElement, str: any, cls?: string) {
    const span = tool.create('span', cls || 'obj-key', str);
    if (div.children.length === 0) {
        div.appendChild(span);
    } else {
        div.insertBefore(span, div.children[0]);
    }
}