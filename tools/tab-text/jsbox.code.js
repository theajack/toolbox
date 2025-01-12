/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-07 10:49:16
 * @Description: Coding something
 */
window.jsboxCode = {
    lib: 'https://cdn.jsdelivr.net/npm/tab-text',
    lang: 'javascript',
    needUI: true,
    code: `document.getElementById('jx-app').innerHTML = '<textarea id="text" style="width: 500px; height: 300px;"></textarea>';
var {useTab} = window.TabText;
useTab(text);`
};