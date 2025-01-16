/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-16 14:48:50
 * @Description: Coding something
 */
import tool from './tool';

export class InputBox {

    container: HTMLElement;
    constructor ({
        placeholder,
        text,
        onconfirm,
        onclose,
    }: {
        placeholder: string,
        text: string,
        onconfirm: (v: string)=>void
        onclose?: ()=>void;
    }) {
        this.container = tool.create('div', 'ib-w');
        const input = tool.create('input', 'ib-input') as HTMLInputElement;
        const close = tool.create('span', 'ib-close', '×', () => {
            onclose?.();
            input.value = '';
            this.close();
        });
        input.setAttribute('placeholder', placeholder);
        const button = tool.create('button', 'ib-btn', text, () => {
            onconfirm(input.value);
        });
        tool.append(this.container, [
            input,
            close,
            button,
        ]);
    }

    open () {
        this.container.style.display = 'flex';
    }
    close () {
        this.container.style.display = 'none';
    }
}