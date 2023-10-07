import { trimTitle, isTitle, formatHeadContents } from './util';

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
    for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        if (node.id === title) {
            return {
                node
            };
        }
    }
}

// function getCurrentTitleDoms(dom, lineNum) {
//     console.log(lineNum);
//     const nodes = dom.children;
//     let preNode, nextNode, offsetLines = 0, startLine, endLine;
//     for (let i = 0, len = nodes.length; i < len; i++) {
//         const node = nodes[i];
//         const tag = node.tagName;
//         if (!isHeadTag(tag)) {
//             continue;
//         }
//         let lineNumber = node.getAttribute('linenumber');
//         lineNumber = parseInt(lineNumber);
//         if (lineNumber <= lineNum) {
//             preNode = node;
//             offsetLines = lineNum - lineNumber;
//             startLine = lineNumber;
//         }
//         if (lineNumber > lineNum) {
//             nextNode = node;
//             endLine = lineNumber;
//             break;
//         }
//     }
//     return {
//         preNode, nextNode, offsetLines, startLine, endLine
//     };
// }

// export function calScroll(editor, dom) {
//     const ranges = editor.getVisibleRanges();
//     if (!ranges.length) {
//         return;
//     }
//     const range = ranges[0];
//     // const model = editor.getModel();
//     const { startLineNumber } = range;
//     const { preNode, nextNode, offsetLines, startLine, endLine } = getCurrentTitleDoms(dom, startLineNumber);
//     if (!preNode) {
//         return;
//     }
//     console.log(preNode.id, nextNode.id);
//     const node = preNode;
//     let lineHeight = 22;
//     if (nextNode) {
//         const raws = endLine - startLine;
//         if (raws > 10) {
//             const offsetHeight = nextNode.offsetTop - node.offsetTop;
//             lineHeight = offsetHeight / raws;
//         }

//     }
//     // console.log(title);
//     // console.log(node);
//     const top = node.offsetTop || 0;
//     const scrollTop = top + offsetLines * lineHeight - 40;
//     return scrollTop;

// }

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
    const headContents = formatHeadContents(dom);
    while (lineNumber >= 1) {
        let content = model.getLineContent(lineNumber);
        if (isTitle(content, headContents)) {
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
        if (isTitle(content, headContents)) {
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
    // const { preNode, nextNode, offsetLines, startLine, endLine } = getCurrentTitleDoms(dom, startLineNumber);
    // if (!preNode) {
    //     return;
    // }
    // console.log(preNode.id, nextNode.id);
    // const node = preNode;
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
    const scrollTop = top + offsetLines * lineHeight - 40;
    return scrollTop;
}
