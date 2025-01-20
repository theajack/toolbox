/*
 * @Author: chenzhongsheng
 * @Date: 2025-01-21 00:01:49
 * @Description: Coding something
 */
export class Filter {
    
    type: string = '';

    text: string = '';


    constructor (public blockList: HTMLElement) {

    }

    setTypeFilter (type: string) {
        this.type = type;
        this.filterLog();
    }
    setTextFilter (text: string) {
        this.text = text;
        this.filterLog();
    }

    filterLog () {

        const isPass = (el: HTMLElement) => {
            const {type, text} = this;
            if (type && type !== 'all') {
                const typePass = el.classList.contains(`cc-log-${type}`);
                if (!typePass) return false;
            }

            if (text) {
                const textPass = el.textContent!.indexOf(text) !== -1;
                if (!textPass) return false;
            }
            return true;
        };
        const list = this.blockList.children;

        for (let i = 0; i < list.length; i++) {
            const el = (list[i] as HTMLElement);
            el.style.display = isPass(el) ? 'block' : 'none';
        }

    }
}