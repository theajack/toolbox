/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-07 10:49:16
 * @Description: Coding something
 */
window.jsboxCode = {
    lib: 'https://cdn.jsdelivr.net/npm/tab-text',
    lang: 'javascript',
    needUI: true,
    code: `document.getElementById('jx-app').innerHTML = '<div id="container" style="margin-bottom: 10px;"></div>';
var {highlight, HighLight} = window.LightHl;

var html = highlight('console.log("Hello World!");');
document.getElementById('container').innerHTML = html;

document.getElementById('jx-app').appendChild(HighLight({
    code: 'function main(){\n  console.log("Hello World!");\n}',
    highlights: [{
        match: /on[s ]/g,
    }]
}));`
};