let DefaultTab = '  ';

export default {
    setTabValue,
    useTab,
    onKeyDown,
};

export function setTabValue (v: string) {
    DefaultTab = v;
}

export function useTab (el: HTMLTextAreaElement|string) {
    const dom = typeof el === 'string' ? document.querySelector(el) : el;
    if (!dom) throw new Error('Target not exist');
    if (dom.tagName !== 'TEXTAREA') throw new Error('Only support textarea');
    dom.addEventListener('keydown', onKeyDown);
}

export function onKeyDown (this: HTMLTextAreaElement, e: Event) {
    onKeyDownBase(this, e as KeyboardEvent, DefaultTab);
}

function onKeyDownBase (el: HTMLTextAreaElement, e: KeyboardEvent, tab: string) {
    const a = tab;
    const b = a.length;
    if (e.keyCode === 9) {
        e.preventDefault();
        const c = el.selectionStart,
            currentEnd = el.selectionEnd;
        if (e.shiftKey === false) {
            if (!_isMultiLine(el)) {
                el.value = el.value.slice(0, c) + a + el.value.slice(c);
                el.selectionStart = c + b;
                el.selectionEnd = currentEnd + b;
            } else {
                const d = _findStartIndices(el);
                let l = d.length;
                let newStart = 0;
                let newEnd: number | 'end' = 0;
                let affectedRows = 0;
                while (l--) {
                    let f = d[l];
                    if (d[l + 1] && c != d[l + 1]) f = d[l + 1];
                    if (f >= c && d[l] < currentEnd) {
                        el.value = el.value.slice(0, d[l]) + a + el.value.slice(d[l]);
                        newStart = d[l];
                        if (!newEnd) newEnd = (d[l + 1] ? d[l + 1] - 1 : 'end');
                        affectedRows++;
                    }
                }
                el.selectionStart = newStart;
                el.selectionEnd = (newEnd !== 'end' ? newEnd + (b * affectedRows) : el.value.length);
            }
        } else {
            if (!_isMultiLine(el)) {
                if (el.value.substr(c - b, b) == a) {
                    el.value = el.value.substr(0, c - b) + el.value.substr(c);
                    el.selectionStart = c - b;
                    el.selectionEnd = currentEnd - b;
                } else if (el.value.substr(c - 1, 1) == '\n' && el.value.substr(c, b) == a) {
                    el.value = el.value.substring(0, c) + el.value.substr(c + b);
                    el.selectionStart = c;
                    el.selectionEnd = currentEnd - b;
                }
            } else {
                const d = _findStartIndices(el);
                let l = d.length;
                let newStart = 0;
                let newEnd: number | 'end' = 0;
                let affectedRows = 0;
                while (l--) {
                    let f = d[l];
                    if (d[l + 1] && c != d[l + 1]) f = d[l + 1];
                    if (f >= c && d[l] < currentEnd) {
                        if (el.value.substr(d[l], b) == a) {
                            el.value = el.value.slice(0, d[l]) + el.value.slice(d[l] + b);
                            affectedRows++;
                        } else { }
                        newStart = d[l];
                        if (!newEnd) newEnd = (d[l + 1] ? d[l + 1] - 1 : 'end');
                    }
                }
                el.selectionStart = newStart;
                el.selectionEnd = (newEnd !== 'end' ? newEnd - (affectedRows * b) : el.value.length);
            }
        }
    } else if (e.keyCode === 13 && e.shiftKey === false && e.ctrlKey === false) {
        const cursorPos = el.selectionStart;
        const d = _findStartIndices(el);
        const numStartIndices = d.length;
        let startIndex = 0;
        let endIndex = 0;
        const tabMatch = new RegExp('^' + a.replace('\t', '\\t').replace(/ /g, '\\s') + '+', 'g');
        let lineText = '';
        let tabs: any = null;
        for (let x = 0; x < numStartIndices; x++) {
            if (d[x + 1] && (cursorPos >= d[x]) && (cursorPos < d[x + 1])) {
                startIndex = d[x];
                endIndex = d[x + 1] - 1;
                break;
            } else {
                startIndex = d[numStartIndices - 1];
                endIndex = el.value.length;
            }
        }
        lineText = el.value.slice(startIndex, endIndex);
        tabs = lineText.match(tabMatch);
        if (tabs !== null) {
            e.preventDefault();
            let h = tabs[0];
            let i = h.length;
            const j = cursorPos - startIndex;
            if (i > j) {
                i = j;
                h = h.slice(0, j);
            }
            el.value = el.value.slice(0, cursorPos) + '\n' + h + el.value.slice(cursorPos);
            el.selectionStart = cursorPos + i + 1;
            el.selectionEnd = el.selectionStart;
        }
    }
}

function _isMultiLine (a: HTMLTextAreaElement) {
    const b = a.value.slice(a.selectionStart, a.selectionEnd),
        nlRegex = new RegExp(/\n/);
    if (nlRegex.test(b)) return true;
    else return false;
}
function _findStartIndices (a: HTMLTextAreaElement) {
    let b = a.value;
    const startIndices: number[] = [];
    let offset = 0;
    while (b.match(/\n/) && b.match(/\n/)!.length > 0) {
        offset = (startIndices.length > 0 ? startIndices[startIndices.length - 1] : 0);
        const c = b.search('\n');
        startIndices.push(c + offset + 1);
        b = b.substring(c + 1);
    }
    startIndices.unshift(0);
    return startIndices;
}