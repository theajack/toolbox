/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-07 13:32:53
 * @Description: Coding something
 */
import {highlight, HighLight} from '..';

const html = highlight('console.log("Hello World!");');
document.getElementById('container')!.innerHTML = html;

document.body.appendChild(HighLight({
    code: 'function main(){\n  console.log("Hello World!");\n}',
    highlights: [{
        match: /on[s ]/g,
    }]
}));