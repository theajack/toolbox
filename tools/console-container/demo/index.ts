/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-15 20:24:31
 * @Description: Coding something
 */
import {Console} from '../index';
// import {Console} from '../../../publish/console-container';

const log = new Console({
    container: '#container',
});
window.log = log;

console.log('11');
console.log('11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111');
console.log(
    '11', 222, '33333333',
    Object.keys(window),
    {a: 1},
    {b: '11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'},
    window,
    navigator
);
console.info('111');
console.info('111');
console.info('111');
console.error('111');
console.error(window);
console.warn('111');

dark.onclick = () => {log.setMode('dark');};
light.onclick = () => {log.setMode('light');};
show.onclick = () => {log.setVisible(true);};
hide.onclick = () => {log.setVisible(false);};