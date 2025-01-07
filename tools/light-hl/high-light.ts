/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-19 15:52:06
 * @Description: Coding something
 */
import {renderJS} from './js-renderer';
import {collectRef, dom} from 'link-dom';

export const CharWidth = 8.428784;
export const LineHeight = 18;
const CodePadding = 10;
type IStyle = Partial<CSSStyleDeclaration>;

let onDisableHLLine: ((code: string[], result: string)=>void)|null = null;

export function setOnDisableHLLine (fn: (code: string[], result: string)=>void) {
    onDisableHLLine = fn;
}

function extractLength (code: string[], line: number, column: number, text: string): number {
    const lineCode = code[line - 1];
    const columnIndex = column - 1;
    if (lineCode.substr(columnIndex, text.length) === text) return text.length;
    let n = 0;
    for (let i = columnIndex + 1; i < lineCode.length; i++) {
        n++;
        if (lineCode[i] === '(' || lineCode[i] === ')') {
            return n;
        }
    }
    return n;
}

export function HighLight (
    {
        code = '',
        borderRight = false,
        startIndex = 1,
        highlight,
        style = {},
        codeStyle = {},
        lineHeight = LineHeight,
        lineCount,
    }: {
        code: string|string[],
        borderRight?: boolean;
        startIndex?: number;
        highlight?: {text?: string, color?: string, opacity?: number, line?: number, column?: number, length?: number},
        style?: IStyle;
        codeStyle?: IStyle;
        lineHeight?: number;
        lineCount?: number;
    } = {
        code: ''
    }
) {
    if (typeof code === 'string') {
        code = code.split('\n');
    }

    // highlight-config
    let hlc: {
        color: string, opacity: number, hlIndex: number, hlWidth: number,
        hlLeft: number, column: number, enable: boolean,
    } =
        {enable: false} as any;

    const needHighLight = !!highlight;
    if (needHighLight) {
        const {color = '#0b8c0b', opacity = 0.4, line = 0, column = 0, text = ''} = highlight;
        const length = highlight.length ?? extractLength(code, line, column, text);
        const hlIndex = line - 1;

        // const hlWidth = (!column) ? 0 : (length || 1) * CharWidth;
        // const hlLeft = column * CharWidth;

        const hlWidth = (!column) ? 0 : (length || 1) * CharWidth;
        const hlLeft = column * CharWidth;

        hlc = {color, opacity, hlIndex, hlWidth, hlLeft, column, enable: true};
    }

    const preTextStyle = {
        backgroundColor: '#111',
        color: '#fff',
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        margin: '0',
        fontSize: '14px',
        paddingTop: `${CodePadding}px`,
        paddingBottom: '0',
        paddingLeft: '8px',
        lineHeight: `${lineHeight}px`,
    };
    const preStyle: IStyle = {
        overflowX: 'auto',
        borderRight: borderRight ? '1px solid #666' : 'none',
        flex: '1',
        position: 'relative',
        ...preTextStyle,
    };

    let renderCode = code.join('\n');
    if (code.length <= 10000) {
        renderCode = renderJS(renderCode, false);
    } else {
        onDisableHLLine ?
            onDisableHLLine(code, renderCode) :
            console.warn('当前代码过长，已关闭代码高亮');
    }


    const wrapStyle: IStyle = {display: 'flex', ...style};
    if (lineCount) {
        wrapStyle.minHeight = `${lineCount * lineHeight + CodePadding * 2}px`;
    }

    const $ = collectRef('hlBar');

    return dom.div.style(wrapStyle).append(
        dom.div.style({
            ...preTextStyle,
            flexDirection: 'column',
            display: 'flex',
            borderRight: '1px solid #aaa',
            padding: `${CodePadding}px 0px`,
            color: '#ddd',
            textAlign: 'right',
        }).append(
            code.map((_, index) => {
                return dom.span.style({
                    padding: '0px 5px',
                    backgroundColor: (hlc.enable && index === hlc.hlIndex) ? mergeOpacity(hlc.color, hlc.opacity) : 'transparent',
                }).text(startIndex + index);
            })
        ),
        dom.pre.class('xhl-container').style({...preStyle, ...codeStyle}).mounted(el => {
            setTimeout(() => {
                if (needHighLight) {
                    el.el.scrollLeft = hlc.enable ? (hlc.hlLeft - (el.el.offsetWidth - hlc.hlWidth) / 2) : 0;
                    if (ResizeObserver) {
                        const ob = new ResizeObserver((e) => {
                            const dom = e[0].target;
                            $.hlBar.style('maxWidth', `${dom?.scrollWidth}px`);
                        });
                        ob.observe(el.el);
                    }
                }
            }, 100);
        }).append(
            HighlightBlock(),
            dom.div.class('xhl-pre').style({...codeStyle, position: 'relative'}).html(renderCode),
        )
    ).el;
}

function HighlightBlock(){

    return (hlc.enable && typeof hlc.column === 'number') ?
     dom.div.ref($.hlBar).style({
        position: 'absolute',
        backgroundColor: mergeOpacity(hlc.color, hlc.opacity),
        left: '0',
        top: `${CodePadding + hlc.hlIndex * lineHeight}px`,
        height: `${lineHeight}px`,
        width: '100%',
    }).append(dom.span.style({
        position: 'absolute',
        backgroundColor: hlc.color,
        left: `${hlc.hlLeft}px`,
        width: `${hlc.hlWidth}px`,
        height: `100%`,
    })) : '', // todo null
}

function mergeOpacity (color: string, opacity: number) {
    if (color[0] === '#') {
        const to16 = (opacity: number) => {
            const N = Math.round(opacity * 1.6 * 10).toString(16);
            return (N.length === 2) ? 'F' : N;
        };
        const n = to16(opacity);
        return color.length === 4 ? `${color}${n}` : `${color}${n}${n}`;
    } else if (color.startsWith('rgba')) {
        return color.replace(/,([0-9]*)\)/, `,${opacity})`);
    }
    // @ts-ignore
    return color.replace(/,([0-9]*)\)/, (str: string, v) => `,${v},${opacity})`);
}
