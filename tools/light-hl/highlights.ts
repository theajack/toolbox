/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-07 14:26:45
 * @Description: Coding something
 */
// 强调

import {createMeasureText} from '../utils';
import {dom} from 'link-dom';
import {Const} from './constant';

interface IHighLightBase {
    color?: string,
    opacity?: number,
}

interface IHighLightPosition extends IHighLightBase {
    row: number,
    column: number,
    range?: number,
}

interface IHighLightMatch extends IHighLightBase {
    match: string|RegExp,
}

export type IHighLight = IHighLightPosition | IHighLightMatch;

interface IHighLightInfo extends Required<IHighLightBase> {
    left: number,
    top: number,
    index: number,
    width: number,
}

export function transformHighLightInfo (content: string, list: IHighLight[]): IHighLightInfo[] {
    const infos: IHighLightInfo[] = [];
    const DefColor = '#0b8c0b';
    const DefOpacity = 0.4;

    const measureText = createMeasureText('14px Menlo, Monaco, Courier New, monospace');

    for (const item of list) {
        const baseInfo = {
            color: item.color || DefColor,
            opacity: item.opacity || DefOpacity,
        };
        if (isMatchHL(item)) {
            const result = content.matchAll(item.match as any);
            for (const match of result) {
                const before = content.substring(0, match.index!);
                const arr = before.split('\n');
                const leftContent = arr.pop()!;
                infos.push({
                    left: measureText(leftContent) + Const.PLeft,
                    top: arr.length * Const.LineHeight,
                    width: measureText(match[0]),
                    index: arr.length,
                    ...baseInfo,
                });
            }
        } else {
            const {row, column, range = 1} = item;
            const arr = content.split('\n');
            debugger;
            infos.push({
                left: measureText(arr[row].substring(0, column)) + Const.PLeft,
                top: row * Const.LineHeight,
                index: row,
                width: measureText(arr[row].substring(column, column + range)),
                ...baseInfo,
            });
        }
    }
    return infos;
}

function isMatchHL (v: IHighLight): v is IHighLightMatch {
    // @ts-ignore
    return typeof v.match !== 'undefined';
}

export function HighlightBlock (infos: IHighLightInfo[]) {

    return infos.map(info => {
        return dom.div.class('highlight-bar').style({
            position: 'absolute',
            backgroundColor: mergeOpacity(info),
            left: '0',
            top: `${Const.CodePadding + info.top}px`,
            height: `${Const.LineHeight}px`,
            width: '100%',
        }).append(dom.span.style({
            position: 'absolute',
            backgroundColor: info.color,
            left: `${info.left}px`,
            width: `${info.width}px`,
            height: `100%`,
        }));
    });
}

export function mergeOpacity ({
    color, opacity
}: {
    color: string, opacity: number
}) {
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
