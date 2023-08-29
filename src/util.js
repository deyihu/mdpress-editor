
export function getDom(id) {
    if (id instanceof HTMLElement) {
        return id;
    }
    if (id.indexOf('#') > -1 || id.indexOf('.') > -1) {
        return document.querySelector(id);
    }
    return document.getElementById(id);
}

export function createDom(tagName) {
    return document.createElement(tagName);
}

export const on = (target, event, hanlder) => {
    target.addEventListener(event, hanlder);
};

export function createDialog() {
    const dialog = createDom('dialog');
    dialog.className = 'mdeditor-dialog';
    dialog.innerHTML = `
    <div>
        <label>列数:</label>
        <input type="number" value="3" id="table-cols"/>
        </div>
    <br>
    <div>
        <label>行数:</label>
        <input type="number" value="3" id="table-rows"/>
    </div>
    <br>
    <div style="text-align: right;">
        <button id="table-btn-cancel">取消</button>
        <button id="table-btn-confirm">确认</button>
    </div>
    `;
    return dialog;
}

export function getTableMdText(rows, cols) {
    let head = [], headLine = [];
    let rowsText = '', row = [];
    for (let j = 1; j <= rows; j++) {
        row = [];
        for (let i = 1; i <= cols; i++) {
            if (j === 1) {
                head.push(`列${i}  `);
                headLine.push('-----');
            }
            row.push('     ');
        }
        row = row.join(' | ');
        row = `| ${row.toString()} |\n`;
        rowsText += row;
    }
    head = head.join(' | ');
    head = `| ${head.toString()} |\n`;
    headLine = headLine.join(' | ');
    headLine = `| ${headLine.toString()} |\n`;
    return `${head}${headLine}${rowsText}`;
}

export function now() {
    return new Date().getTime();
}

export function domSizeByWindow(dom) {
    const { innerWidth, innerHeight } = window;
    dom.style.width = `${innerWidth}px`;
    dom.style.height = `${innerHeight}px`;
}
