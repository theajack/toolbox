/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-18 14:23:01
 * @Description: Coding something
 */

import {mount, dom} from 'link-dom';

const DefaultColor = '#9cdcfe';

mount(dom.style.text(
/* css*/`
.xhl-punc {
    color: #ddd;
}
.xhl-bkt {
    color: #ffe11c;
}
.xhl-k1 {
    color: #569cd6;
}
.xhl-k2 {
    color: #c586c0;
}
.xhl-k3 {
    color: #3ac9b0;
}
.xhl-num {
    color: #b5cea8;
}
.xhl-f {
    color: #dcdcaa;
}
.xhl-reg,
.xhl-reg * {
    color: #d16969;
}
.xhl-str,
.xhl-str *,
.xhl-str .xhl-cm {
    color: #ce9178;
}
.xhl-cm,
.xhl-cm * {
    color: #6a8a35;
}
.xhl-jsx {
    color: #569cd6;
}
.xhl-tmp,.xhl-tmp .xhl-punc,.xhl-tmp .xhl-bkt{
    color: rgb(86,156,214);
}
.xhl-def{color: ${DefaultColor};}
.xhl-def .xhl-punc {
    color: #ddd;
}
.xhl-pre {
    background-color: #111;
    padding: 10px;
    color: ${DefaultColor};
    font-size: 14px;
    margin: 0;
    overflow-x: auto;
    font-family: Menlo, Monaco, "Courier New", monospace;
    line-height: 18px;
}
.xhl-container {
    overflow: auto;
}
.xhl-container .xhl-pre{
    background-color: transparent;
    padding: 0;
    font-family: inherit;
    line-height: inherit;
    font-size: inherit;
    color: inherit;
    overflow: unset;
    color: ${DefaultColor};
}
.xhl-pre::-webkit-scrollbar,
.xhl-container::-webkit-scrollbar {
    width: 5px;
    cursor: pointer;
    height: 5px;
}
.xhl-pre::-webkit-scrollbar-button, .xhl-container::-webkit-scrollbar-button {
    display: none;
}
.xhl-pre::-webkit-scrollbar-track,
.xhl-container::-webkit-scrollbar-track {
    background-color: transparent;
}
.xhl-pre::-webkit-scrollbar-thumb,
.xhl-container::-webkit-scrollbar-thumb {
    background-color: #666;
    cursor: pointer;
    background-clip: initial;
}
.xhl-pre::-webkit-scrollbar-thumb:hover,
.xhl-container::-webkit-scrollbar-thumb:hover {
    background-color: #888;
    cursor: pointer;
}
`), document.head);


export function renderJS (val: string, wrap: boolean = true) {
    val = val.replace(/\&lt;/g, '__LT__').replace(/\&gt;/g, '__GT__');
    const innerHTML = renderColor(val.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    return wrap ? `<pre class='xhl-pre'>${innerHTML}</pre>` : innerHTML;
}

const keyword1 = ['var', 'new', 'const', 'let', 'typeof', 'in', 'function', 'this', 'true', 'false', 'null', 'undefined', 'async', 'delete', 'class', 'extends']; // var
const keyword2 = ['return', 'for', 'while', 'else if', 'if', 'else', 'switch', 'case', 'default', 'break', 'continue', 'await', 'yield', 'try', 'catch', 'finally', 'throw', 'export', 'import', 'from']; // return
const keyword3 = ['console', 'window', 'document', 'Date', 'Array', 'Object', 'Boolean', 'Number', 'String', 'alert', 'RegExp', 'Function', 'JSON', 'Date']; // Date
// const sign = ['"', "'", "`", ",", ";", "\\:", "\\.", "\\(", "\\)", "\\{", "\\}", "\\[", "\\]", "\\+", "\\-", "\\*", "\\/", "_", "\\|", "\\", "\\&", "\\%", "\\$", "\\!", "\\<", "\\=", "\\>",  "\\^", "~", "@", "#"];
const sign = ['\\/', '\\', '\\(', '\\)', '\\[', '\\]', '\\{', '\\}', '\\+', '\\-', '\\*', '\\=', ',', '\\.', ':', '%', '_', '\\$', '@', '#', '\\^', '\\|', '!', '~'];

const bkt = ['\\(', '\\)', '\\[', '\\]', '\\{', '\\}'];

const signBegin = '(^|(&lt;)|(&lt;)|[\\n\\t;<> ' + sign.join('') + '])';
const signEnd = '([' + sign.join('') + '\\n;<> ]|(&lt;)|(&lt;)|$)';


function sp (str: string, cls: string) {
    return '<span class="xhl-' + cls + '">' + str + '</span>';
}

type IWord = string|RegExp|((...v:string[])=>string);

function _replace (str: string, reg: RegExp|string, cls: string, word: IWord) {
    // if (cls === 'tmp') debugger;
    return str.replace(reg, function (s) {
        if (typeof word === 'string') {
            return s.replace(word, sp(word, cls));
        } else if (typeof word === 'object') {
            return s.replace(word, function (s2) {
                return sp(s2, cls);
            });
        } else if (typeof word === 'function') {
            // @ts-ignore
            return sp(word(...(arguments as string[])), cls);
        }
        return sp(s, cls);
    });
}

function replace (str: string, reg: string|string[], cls: string, word: string) {
    if (str.indexOf('</span>') !== -1) {
        const _regExp = (typeof reg === 'string') ? regExp(reg) : reg[0];
        str = str.replace(_regExp, function (s1) {
            // 只有字符串
            const _regExp2 = (typeof reg === 'string') ? new RegExp(reg, 'g') : reg[1];
            return _replace(s1, _regExp2, cls, word);
        });
    } else {
        const _regExp = (typeof reg === 'string') ? new RegExp(reg, 'g') : reg[1];
        str = _replace(str, _regExp, cls, word);
    }
    return str;
}

function regExp (reg: string) {
    return new RegExp(reg + '(?![^<]*>|[^<>]*<\/)', 'g');
}
function renderColor (text: string) {
    // text = text.replace('\t', '    ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    text = pipe(text, [
        ['\\$\\{(.*)\\}', 'tmp', (str, $1) => str.replace($1, sp($1, 'def'))],
        [
            // @ts-ignore
            [
                /("(?:[^"\\]|\\.)*")|(\'(?:[^\'\\]|\\.)*\')|(`((?:[^`\\]|\\.)|\n)*`)(?![^<]*>|[^<>]*<\/)/g,
                /("(?:[^"\\]|\\.)*")|(\'(?:[^\'\\]|\\.)*\')|(`((?:[^`\\]|\\.)|\n)*`)/g
            ],
            'str'
        ], // 有bug：需要不包含字符串本身
        ['(//.*(\n|$))|(\\/\\*(.|\n)*?\\*\\/)', 'cm'],
        ['\\/[a-zA-Z0-9' + sign.slice(1).join('') + ' ]+\\/[gi]?', 'reg'], // 正则
        // ['\\.[a-zA-Z_\\$]+[a-zA-Z_\\$0-9]* ?\\' + signEnd, 'a', new RegExp('[a-zA-Z_\\$]+[a-zA-Z_\\$0-9]*', 'g')],
        grArr(keyword1, 'k1'),
        grArr(keyword1, 'k1'), // 重复是为了解决相邻同类元素 无法被匹配 比如 function function 只有第一个function被匹配，因为他们共享一个空格
        grArr(keyword2, 'k2'),
        grArr(keyword2, 'k2'),
        grArr(keyword3, 'k3'),
        grArr(keyword3, 'k3'),
        [signBegin + '[a-zA-Z_\\$]+[a-zA-Z_\\$0-9]* ?\\(', 'f', new RegExp('[a-zA-Z_\\$]+[a-zA-Z_\\$0-9]*', 'g')],
        [signBegin + '[0-9]+(\\.?[0-9]+)?' + signEnd, 'num', /[0-9]+(.?[0-9]+)?/g],
        [signBegin + '[0-9]+(\\.?[0-9]+)?' + signEnd, 'num', /[0-9]+(.?[0-9]+)?/g],
        ['&lt;\\/?[a-zA-Z\\-]*(\\/| |\n|&gt;)', 'jsx'],
        // [signBegin+'[0-9]+'+signEnd,'num',/[0-9]+/g],
        ['[' + bkt.join('') + ']', 'bkt', new RegExp('[' + bkt.join('') + ']', 'g')],
        ['[' + sign.join('') + ']', 'punc', new RegExp('[' + sign.join('') + ']', 'g')],
        ['[' + sign.join('') + ']', 'punc', new RegExp('[' + sign.join('') + ']', 'g')],
    ]);
    text = text.replace(/\&lt;/g, sp('<', 'punc')).replace(/\&gt;/g, sp('>', 'punc')).replace(/;/g, sp(';', 'punc')).replace(/&/g, sp('&', 'punc'));
    text = text.replace(/__LT__/g, '&amp;lt;').replace(/__GT__/g, '&amp;gt;');
    return text;
}

// const signEnd = '[ \\(\\.\\n]';

function grArr (array: string[], cls: string) {
    return [signBegin + '((' + array.join(')|(') + '))' + signEnd, cls, new RegExp('((' + array.join(')|(') + '))', 'g')];
}

function pipe (text: string, array: ((IWord)[])[]) {
    for (let i = 0; i < array.length; i++) {
        array[i].unshift(text);
        // @ts-ignore
        text = replace.apply(null, array[i]);
    }
    return text;
}