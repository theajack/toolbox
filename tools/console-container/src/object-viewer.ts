import tool from './tool';
import {generateLogBlock} from './util';
const MAX_DEEP = 8;
export function objectViewer (obj: any, type: string, name?: string) {
    return (new ObjectViewer(obj, type, name))._block;
}
objectViewer.test = function (arg) {
    return typeof arg === 'object' && arg !== null;
};

class ObjectViewer {
    _block: HTMLElement;
    deep: number;
    constructor (obj: any, type: string, name?: string) {
        this._block = generateLogBlock(type);
        this.deep = 0;
        traverse.call(this, this._block, name || obj.constructor.name, obj);
    }
}

function nextEl (el: any) {
    const child = Array.prototype.slice.apply(el.parentNode.children);
    return child[child.indexOf(el) + 1];
}
const hugeObjectList = [ HTMLElement, HTMLDocument ];
function checkHugeObject (block: any, key: string, obj: HTMLElement) {
    for (let i = 0; i < hugeObjectList.length; i++) {
        if (obj instanceof hugeObjectList[i]) {
            let str = obj.constructor.name, cls = 'cls';
            if (hugeObjectList[i] === HTMLElement) {
                str = obj.tagName.toLowerCase();
                if (obj.className !== '') {
                    str += ('.' + (obj.className.split(' ').join('.')));
                }
                cls = 'key';
            }
            const div = generateUnOpenHead();
            div.innerHTML = '<span class="tc-obj-key">' + key + '</span>:[<span class="tc-obj-' + cls + '">' + str + '</span>]';
            tool.append(block, div);
            return true;
        }
    }
    return false;
}

// 生成head
function generateHead (block: HTMLElement, key: string, obj: any) {
    if (checkHugeObject(block, key, obj)) {
        return false;
    }
    let html: string, _objHead: HTMLElement;
    if (obj === null) {
        html = '<span class="tc-obj-key">' + key + '</span>:<span class="tc-obj-key">null</span>';
        _objHead = generateUnOpenHead();
    } else {
        const isArray = obj instanceof Array;
        const start = isArray ? '[' : '{';
        const end = isArray ? ']' : '}';
        html = '<span class="tc-log-angle"></span> <span class="tc-obj-key">' + key + '</span>:' + start;
        let first = true;
        for (const k in obj) {
            html += (first ? '' : ',') + generateItem(k, obj[k], !isArray);
            first = false;
        }
        html += end;
        _objHead = tool.create('div', 'log-obj-head log-ell', '', function (this: HTMLElement) {
            const openClass = (this.children[0].className.indexOf('tc-open') !== -1) ? '' : ' tc-open';
            nextEl(this).className = 'tc-log-obj-view' + openClass;
            this.children[0].className = 'tc-log-angle' + openClass;
        });
    }
    _objHead.innerHTML = html;
    tool.append(block, _objHead);
    return true;
}
// 生成head中单个键值对
function generateItem (key: string, value: any, needKey = true) {
    let html = needKey ? '<span class="tc-obj-key">' + key + '</span>:' : '';
    switch (typeof value) {
        case 'object':
            if (value === null) {
                html += '<span class="tc-obj-key">null</span>';
            } else {
                if (value instanceof HTMLElement) {
                    html += '&lt;<span class="tc-obj-key">' + value.tagName.toLowerCase() + '</span>/&gt;';
                } else if (value instanceof HTMLDocument) {
                    html += '(#document)';
                } else {
                    html += ((value instanceof Array) ? '[…]' : '{…}');
                }
            }
            break;
        case 'string':html += '<span class="tc-obj-string">"' + value + '"</span>'; break;
        case 'number':html += '<span class="tc-obj-number">' + value + '</span>'; break;
        case 'boolean':html += '<span class="tc-obj-key">' + value + '</span>'; break;
        case 'function':html += ' <span class="tc-obj-key">f</span>(){}'; break;
        default :html += value;
    }
    return html;
}

// 生成一个子级不可展开的head
function generateOpenItem (block: HTMLElement, key: string, value: any) {
    const div = generateUnOpenHead();
    div.innerHTML = generateItem(key, value);
    block.appendChild(div);
}
// 生成一个不可展开的head
function generateUnOpenHead () {
    return tool.create('div', 'log-obj-head log-ell log-node', '', function (this: HTMLElement) {
        console.tc(this.innerText);
    });
}

// 生成一个json详情view
function generateView (block: HTMLElement) {
    const _objView = tool.create('div', 'log-obj-view');
    block.appendChild(_objView);
    return _objView;
}

function traverse (this: HTMLElement, block: any, key: any, obj: any) {
    if (!checkMaxDeep.call(this, block, key, obj)) {
        return;
    }
    obj = dealDate(obj);
    if (!generateHead(block, key, obj)) {
        return;
    }
    const view = generateView(block);
    for (const k in obj) {
        if (typeof obj[k] === 'object') {
            traverse.call(this, view, k, obj[k]);
        } else {
            generateOpenItem(view, k, obj[k]);
        }
    }
}

function checkMaxDeep (this: ObjectViewer, block: HTMLElement, key: string, obj: any) {
    if (this.deep > MAX_DEEP) {
        const div = generateUnOpenHead();
        let str: string;
        try {
            str = JSON.stringify(obj);
        } catch (e) {
            if (typeof obj.toString === 'function') {
                str = obj.toString();
            } else {
                str = '[' + (typeof obj) + ']';
            }
        }
        div.innerHTML = '<span class="tc-obj-key">' + key + '</span>:' + str;
        tool.append(block, div);
        return false;
    }
    this.deep++;
    return true;
}

function dealDate (obj: any) {
    if (obj instanceof Date) {
        const res = {
            time: obj.getTime(),
            year: obj.getFullYear(),
            month: obj.getMonth(),
            date: obj.getDate(),
            day: obj.getDay(),
            value: obj.toString(),
            localValue: obj.toLocaleString(),
        };
        return res;
    }
    return obj;
}