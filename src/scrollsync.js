import { isTitle, trimTitle } from './util';

function getTitleDom(dom, title, lineNumber) {
    lineNumber += '';
    const nodes = dom.children;
    for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        if (node.dataset.lineNumber === lineNumber) {
            return {
                node
            };
        }
    }
    title = trimTitle(title);
    title = title.replaceAll(' ', '-');
    title = title.toLowerCase();
    title = encodeURIComponent(title);
    // const nodes = dom.children;
    for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        if (node.id === title) {
            return {
                node
            };
        }
    }
}

export function calScroll(editor, dom) {
    const ranges = editor.getVisibleRanges();
    if (!ranges.length) {
        return;
    }
    const range = ranges[0];
    const model = editor.getModel();
    const { startLineNumber } = range;
    let lineNumber = startLineNumber;
    let title;
    let offsetLines = 0;
    while (lineNumber >= 1) {
        let content = model.getLineContent(lineNumber);
        if (isTitle(content)) {
            title = content;
            break;
        }
        content = content.trim();
        if (content !== '') {
            offsetLines++;
        }
        lineNumber--;
    }
    if (!title) {
        return;
    }
    const result = getTitleDom(dom, title, lineNumber);
    if (!result) {
        return;
    }
    const lineCount = model.getLineCount();
    lineNumber = startLineNumber;
    let nextTitle, nextNode, nextOffsetLines = 0;
    while (lineNumber <= lineCount) {
        let content = model.getLineContent(lineNumber);
        if (isTitle(content)) {
            nextTitle = content;
            break;
        }
        content = content.trim();
        if (content !== '') {
            nextOffsetLines++;
        }
        lineNumber++;
    }
    if (nextTitle) {
        const result = getTitleDom(dom, nextTitle, lineNumber);
        if (result) {
            nextNode = result.node;
        }
    }
    const { node } = result;
    let lineHeight = 22;
    if (nextNode) {
        const raws = nextOffsetLines + offsetLines;
        if (raws > 10) {
            const offsetHeight = nextNode.offsetTop - node.offsetTop;
            lineHeight = offsetHeight / raws;
        }

    }
    // console.log(title);
    // console.log(node);
    const top = node.offsetTop || 0;
    const scrollTop = top + offsetLines * lineHeight - 50;
    return scrollTop;

}
