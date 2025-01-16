/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-07 10:49:16
 * @Description: Coding something
 */
window.jsboxCode = {
    lib: 'https://cdn.jsdelivr.net/npm/console-container',
    lang: 'javascript',
    needUI: true,
    code: `document.getElementById('jx-app').innerHTML = '<div id="container" style="height: 600px;"></div>';
var {Console} = window.ConsoleContainer;
new Console({ container: '#container'});`
};