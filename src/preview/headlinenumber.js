import { isHeadTag, isTitle, trimTitle } from '../util';

export function setHeadLineNumber(editor, dom) {
    const model = editor.getModel();
    const lineCount = model.getLineCount();
    const headLines = [];
    for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
        const content = model.getLineContent(lineNumber);
        if (isTitle(content)) {
            headLines.push({
                lineNumber,
                content
            });
        }
    }
    const children = dom.children || [];
    const heads = [];
    Array.prototype.forEach.call(children, element => {
        if (isHeadTag(element.tagName)) {
            heads.push(element);
        }
    });
    for (let i = 0, len = heads.length; i < len; i++) {
        const head = heads[i];
        let content = head.textContent;
        content = trimTitle(content);
        for (let j = i, len1 = headLines.length; j < len1; j++) {
            const { lineNumber } = headLines[j];
            let title = headLines[j].content;
            title = trimTitle(title);
            if (content === title) {
                head.dataset.lineNumber = lineNumber;
                break;
            }
        }
    }
}
