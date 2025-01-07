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
    // if (dom.tagName !== 'TEXTAREA') throw new Error('Only support textarea');
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

        console.log(info);

        const texts = info.lineText.split('\n');

        if (e.shiftKey) {
            let isFirst = true;
            for (const text of texts) {
                if (text.startsWith(tab)) {
                    el.selectionStart = index;
                    el.selectionEnd = index + tabSize;
                    document.execCommand('delete', false);
                    if (isFirst) start -= tabSize;
                    end -= tabSize;
                    index += text.length - tabSize + 1;
                } else {
                    index += text.length + 1;
                }
                isFirst = false;
            }
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


const insertContent = (content: string, isTextArea = true) => {
    if (!content)  return;

    if (isTextArea) {
        document.execCommand('insertText', false, content);
        return;
    }
    // todo 是否需要支持contenteditable？
    // const sel = window.getSelection();
    // // @ts-ignore
    // // console.log('insertHTML', sel, sel!.anchorOffset);

    // if (!sel) return;

    // if (sel.rangeCount > 0) {
    //     const range = sel.getRangeAt(0); // 获取选择范围
    //     range.deleteContents(); // 删除选中的内容
    //     const el = document.createElement('div'); // 创建一个空的div外壳
    //     el.innerHTML = content; // 设置div内容为我们想要插入的内容。
    //     const frag = document.createDocumentFragment();// 创建一个空白的文档片段，便于之后插入dom树
    //     const node = el.firstChild;
    //     if (!node) return;
    //     const lastNode = frag.appendChild(node);
    //     range.insertNode(frag);                 // 设置选择范围的内容为插入的内容
    //     const contentRange = range.cloneRange();  // 克隆选区
    //     contentRange.setStartAfter(lastNode);          // 设置光标位置为插入内容的末尾
    //     contentRange.collapse(true);                   // 移动光标位置到末尾
    //     sel.removeAllRanges();                  // 移出所有选区
    //     // console.log(range, contentRange);
    //     sel.addRange(contentRange);             // 添加修改后的选区
    // }
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

function insertText (text: string, index: number, el: HTMLTextAreaElement) {
    let success = false;
    try {
        success = document.execCommand('insertText', false, text);
    } catch (e) {}
    if (!success) {
        el.value = el.value.slice(0, index) + text + el.value.slice(index);
    }
}