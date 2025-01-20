export default {
    create (tag: string, cls?: string, text?: string, click?: any) {
        const el = document.createElement(tag);
        if (cls) {
            el.className = cls.split(' ').map((item) => {
                return 'cc-' + item;
            }).join(' ');
        }
        if (text) {
            if (el.tagName === 'INPUT') {
                (el as HTMLInputElement).value = text;
            } else {
                el.innerText = text;
            }
        }
        if (click) {el.addEventListener('click', click);}
        return el;
    },
    attr (el: HTMLElement, name: string, value: any) {
        if (typeof value === 'undefined') {
            return el.getAttribute(name);
        }
        el.setAttribute(name, value);
        return el;
    },
    append (el: HTMLElement, array: any) {
        if (array instanceof Array) {
            array.forEach((item) => {
                el.appendChild(item);
            });
        } else {
            el.appendChild(array);
        }
        return el;
    },
    addStyle (css: string, id: string) {
        const style = this.create('style');
        style.innerHTML = css;
        if (id) {
            const s = document.getElementById(id);
            if (s !== null) {
                return s;
            }
            this.attr(style, 'id', id);
        }
        window.document.head.appendChild(style);
        return style;
    },
    hasClass (el: HTMLElement, name: string) {
        return getRegExp(name).test(el.className);
    },
    addClass (el: HTMLElement, name: string) {
        check(name, (cls: any) => {
            if (!this.hasClass(el, cls)) {
                if (el.className === '') {
                    el.className = cls;
                } else {
                    el.className += ' ' + cls;
                }
            }
        });
        return el;
    },
    rmClass (el: any, name: any) {
        if (this.hasClass(el, name)) {
            el.className = el.className.replace(getRegExp(name), ' ').trim();
        }
        return el;
    },
    replaceClass (arg: any, a: any, b: any) {
        check(arg, (el: any) => {
            if (this.hasClass(el, a)) {
                el.className = el.className.replace(getRegExp(a), ' ' + b + ' ').trim();
            } else {
                this.addClass(el, b);
            }
        });
        return arg;
    },
    active (...arg: any[]) {
        check(arg, (el) => {
            this.addClass(el, 'cc-active');
        });
    },
    inactive (...arg: any[]) {
        check(arg, (el) => {
            this.rmClass(el, 'cc-active');
        });
    }
};

function check (arg: any, cb: any) {
    if (arg instanceof Array) {
        for (let i = 0; i < arg.length; i++) {
            cb(arg[i], i);
        }
    } else {
        cb(arg, 0);
    }
}

function getRegExp (name: string) {
    return new RegExp('(^| )' + name + '($| )');
}