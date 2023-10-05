const TAG = 'excel:';
const RQCODE = 'excel';
function inline(state, startLine, endLine) {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const content = state.src.substring(pos, max);

    if (content.indexOf(TAG) === -1 || pos >= max) {
        return false;
    }

    if (content.indexOf(TAG) === 0) {
        const token = state.push(RQCODE, 'div', -1);
        token.markup = TAG;
        token.content = content.replaceAll(TAG, '');

        // token = state.push('inline', 'p', 1);
        // token.content = content.replaceAll(TAG, '');
        // token.map = [startLine, state.line];
        // token.children = [];

        // token = state.push(RQCODE + '_close', 'div', -1);
        // token.markup = TAG;

        state.line = startLine + 1;
        return true;
    }
    return false;
}
export function excelPlugin(md, config) {
    md.block.ruler.after('blockquote', TAG, inline, {
        alt: ['paragraph', 'reference', 'blockquote', 'list']
    });
    md.renderer.rules[RQCODE] = render;
}

function render(tokens, idx) {
    const token = tokens[idx];
    const { content } = token;
    return `<div class="excel-container">${content}</div>`;
}
