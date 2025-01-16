/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-15 20:21:18
 * @Description: Coding something
 */
import tool from './tool';
// import TYPE from './type'
export function generateLogBlock (type: string) {
    const block = tool.create('div', 'log-block log-' + type);
    const hide = tool.create('div', 'log-block-hide', '×', () => {
        block.parentNode!.removeChild(block);
    });
    tool.append(block, hide);
    return block;
}
export function copyText (text: string) {
    const textArea = document.createElement('textarea');

    textArea.style.position = 'fixed';
    textArea.style.background = 'transparent';
    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
        if (document.execCommand('copy')) {
            console.tc('复制内容成功');
        } else {
            console.tc('复制内容失败');
        }
    } catch (err) {
        console.error('浏览器不支持复制功能');
    }

    document.body.removeChild(textArea);
}

export const Icons = {
    Delete: '<svg width="12" height="12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 10V44H39V10H9Z" fill="none" stroke="#676968" stroke-width="3" stroke-linejoin="round"/><path d="M20 20V33" stroke="#676968" stroke-width="3" stroke-linecap="butt" stroke-linejoin="round"/><path d="M28 20V33" stroke="#676968" stroke-width="3" stroke-linecap="butt" stroke-linejoin="round"/><path d="M4 10H44" stroke="#676968" stroke-width="3" stroke-linecap="butt" stroke-linejoin="round"/><path d="M16 10L19.289 4H28.7771L32 10H16Z" fill="none" stroke="#676968" stroke-width="3" stroke-linejoin="round"/></svg>',
    Filter: '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L20.4 25.8178V38.4444L27.6 42V25.8178L42 9H6Z" fill="none" stroke="#676968" stroke-width="3" stroke-linejoin="round"/></svg>',
    Run: '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 24V11.8756L25.5 17.9378L36 24L25.5 30.0622L15 36.1244V24Z" fill="none" stroke="#676968" stroke-width="3" stroke-linejoin="round"/></svg>',
};