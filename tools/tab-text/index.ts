let DefaultTab = '  ';

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
    const tabSize = tab.length;
    if (e.code === 'Tab') {
        e.preventDefault();

        const info = getSelectionInfo(el);

        let {startLineIndex: index, start, end} = info;

        // console.log(info);

        const texts = info.lineText.split('\n');

        if (e.shiftKey) {
            let isFirst = true;
            for (const text of texts) {
                if (text.startsWith(tab)) {
                    el.selectionStart = index;
                    el.selectionEnd = index + tabSize;
                    document.execCommand('delete', false);
                    if (isFirst) {
                        // ! 如果不能继续缩退了就无需移动start
                        if (text.startsWith(tab + tab)) {
                            start -= tabSize;
                        }
                    };
                    end -= tabSize;
                    index += text.length - tabSize + 1;
                } else {
                    index += text.length + 1;
                }
                isFirst = false;
            }
            // console.log(start, end);
            el.selectionStart = start;
            el.selectionEnd = end;
            return;
        }

        if (texts.length === 1) {
            insertContent(tab);
            return;
        }

        start += tabSize;
        for (const text of texts) {
            el.selectionStart = el.selectionEnd = index;
            insertContent(tab);
            index += tabSize + text.length + 1;
            end += tabSize;
        }
        el.selectionStart = start;
        el.selectionEnd = end;

    } else if (e.code === 'Enter' && !e.ctrlKey) {
        const info = getSelectionInfo(el);
        const text = info.lineText.split('\n')[0];
        let content = '\n';
        let i = 0;
        while (text.substring(i, i + tabSize) === tab) {
            content += tab;
            i += tabSize;
        }
        if (i > 0) {
            insertContent(content);
            e.preventDefault();
        }
    }
}

function insertContent (content: string) {
    if (!content)  return;
    document.execCommand('insertText', false, content);
};

function getSelectionInfo (el: HTMLTextAreaElement): {
    text: string,
    lineText: string,
    start: number,
    end: number,
    line: number, // 跨了多少行
    startLineIndex: number, // 起始行的第一个字符的index
} {
    const start = el.selectionStart;
    const end = el.selectionEnd;

    let text = '';

    const value = el.value;

    text = value.substring(start, end);

    const before = value.substring(0, start); // 前面的所有字符
    const lastN = before.lastIndexOf('\n');

    const startLineIndex = lastN + 1;

    return {
        start,
        end,
        text,
        lineText: value.substring(startLineIndex, end),
        line: text.split('\n').length,
        startLineIndex,
    };

}