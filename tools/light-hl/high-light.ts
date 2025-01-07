/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-19 15:52:06
 * @Description: Coding something
 */
import {Const} from './constant';
import {HighlightBlock, IHighLight, mergeOpacity, transformHighLightInfo} from './highlights';
import {renderJS} from './js-renderer';
import {dom, query} from 'link-dom';

type IStyle = Partial<CSSStyleDeclaration>;

let onDisableHLLine: ((code: string, result: string)=>void)|null = null;

export function setOnDisableHLLine (fn: (code: string, result: string)=>void) {
    onDisableHLLine = fn;
}

export function HighLight (
    {
        code = '',
        borderRight = false,
        startIndex = 1,
        highlights = [],
        style = {},
        codeStyle = {},
        lineHeight = Const.LineHeight,
        lineCount,
    }: {
        code?: string,
        borderRight?: boolean;
        startIndex?: number;
        highlights?: IHighLight[]
        style?: IStyle;
        codeStyle?: IStyle;
        lineHeight?: number;
        lineCount?: number;
    } = {
        code: ''
    }
) {
    const preTextStyle = {
        backgroundColor: '#111',
        color: '#fff',
        fontFamily: Const.FontFamily,
        margin: '0',
        fontSize: `${Const.FontSize}px`,
        paddingTop: `${Const.CodePadding}px`,
        paddingBottom: '0',
        paddingLeft: `${Const.PLeft}px`,
        lineHeight: `${lineHeight}px`,
    };
    const preStyle: IStyle = {
        overflowX: 'auto',
        borderRight: borderRight ? '1px solid #666' : 'none',
        flex: '1',
        position: 'relative',
        ...preTextStyle,
    };

    const codeArr = code.split('\n');

    let renderCode = code;
    if (code.length <= 10000) {
        renderCode = renderJS(renderCode, false);
    } else {
        onDisableHLLine ?
            onDisableHLLine(code, renderCode) :
            console.warn('当前代码过长，已关闭代码高亮');
    }


    const wrapStyle: IStyle = {display: 'flex', ...style};
    if (lineCount) {
        wrapStyle.minHeight = `${lineCount * lineHeight + Const.CodePadding * 2}px`;
    }

    const hlInfos = transformHighLightInfo(code, highlights);

    return dom.div.style(wrapStyle).append(
        dom.div.style({
            ...preTextStyle,
            flexDirection: 'column',
            display: 'flex',
            borderRight: '1px solid #aaa',
            padding: `${Const.CodePadding}px 0px`,
            color: '#ddd',
            textAlign: 'right',
        }).append(
            codeArr.map((_, index) => {
                const item = hlInfos.find(item => item.index === index);
                return dom.span.style({
                    padding: '0px 5px',
                    backgroundColor: item ? mergeOpacity(item) : 'transparent',
                }).text(startIndex + index);
            })
        ),
        dom.pre.class('xhl-container').style({...preStyle, ...codeStyle}).mounted(el => {
            setTimeout(() => {
                if (hlInfos.length) {
                    const item = hlInfos[0];
                    el.el.scrollLeft = item.left - (el.el.offsetWidth - item.width) / 2;
                    if (ResizeObserver) {
                        const ob = new ResizeObserver((e) => {
                            const dom = e[0].target;
                            query('.highlight-bar').forEach(item => item.style('maxWidth', `${dom?.scrollWidth}px`));
                        });
                        ob.observe(el.el);
                    }
                }
            }, 100);
        }).append(
            HighlightBlock(hlInfos),
            dom.div.class('xhl-pre').style({...codeStyle, position: 'relative'}).html(renderCode),
        )
    ).el;
}

