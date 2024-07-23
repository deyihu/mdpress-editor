
export const ACTIVE_CLASS = 'active';

/**
 * Merges the properties of sources into destination object.
 * @param  {Object} dest   - object to extend
 * @param  {...Object} src - sources
 * @return {Object}
 * @memberOf Util
 */
export function extend(dest) { // (Object[, Object, ...]) ->
    for (let i = 1; i < arguments.length; i++) {
        const src = arguments[i];
        for (const k in src) {
            dest[k] = src[k];
        }
    }
    return dest;
}

/**
 * Whether the object is null or undefined.
 * @param  {Object}  obj - object
 * @return {Boolean}
 * @memberOf Util
 */
export function isNil(obj) {
    return obj == null;
}

/**
 * Check whether the object is a string
 * @param {Object} obj
 * @return {Boolean}
 * @memberOf Util
 */
export function isString(obj) {
    if (isNil(obj)) {
        return false;
    }
    return typeof obj === 'string' || (obj.constructor !== null && obj.constructor === String);
}

/**
 * Stop browser event propagation
 * @param  {Event} e - browser event.
 * @memberOf DomUtil
 */
export function stopPropagation(e) {
    e._cancelBubble = true;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
    return this;
}

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

export function createFolderTreeDialog() {
    const dialog = createDom('dialog');
    dialog.className = 'mdeditor-dialog';
    dialog.innerHTML = `
    <div class="file-dnd-container">
         <h2>拖拽文件夹到此处</h2>
     </div>

    <br>
    <div style="text-align: right;">
        <button id="table-btn-cancel">取消</button>
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

export function getFolderTreeText(nodes) {

    // let level = 1;
    let text = '';
    const loopNode = (node, level = 1) => {
        const { name } = node;
        let prefix = '├─ ';
        if (level > 1) {
            const array = [];
            while (array.length < level - 1) {
                array.push('| ');
            }
            prefix = array.join('').toString() + prefix;
        }
        text += `${prefix}${name} \n`;
        const children = node.children;
        if (children && children.length) {
            level++;
            children.forEach(child => {
                loopNode(child, level);
            });
        }
    };
    return nodes.map(node => {
        text = '';
        loopNode(node);
        return text;
    }).join('').toString();
}

export function getDomDisplay(dom) {
    return dom.style.display;
}

export function setDomDisplay(dom, display) {
    dom.style.display = display;
}

export function domShow(dom) {
    dom.style.display = 'block';
}

export function domHide(dom) {
    dom.style.display = 'none';
}

export function now() {
    return new Date().getTime();
}

export function domSizeByWindow(dom) {
    const { innerWidth, innerHeight } = window;
    dom.style.width = `${innerWidth}px`;
    dom.style.height = `${innerHeight}px`;
}

const LOADING_ID = 'mdeditor-loading-container';
export function showLoading() {
    const dom = document.getElementById(LOADING_ID);
    if (dom) {
        return;
    }
    const div = createDom('div');
    div.id = LOADING_ID;
    div.className = LOADING_ID;
    div.innerHTML = ' <div class="mdeditor-loading"></div> ';
    document.body.appendChild(div);
}

export function hideLoading() {
    const dom = document.getElementById(LOADING_ID);
    if (!dom) {
        return;
    }
    document.body.removeChild(dom);
}

export function isTitle(title, headContents) {
    title = title.trim();
    if (title[0] === '#') {
        title = trimTitle(title);
        return headContents.indexOf(title) > -1;
    }
}

export function trimTitle(title) {
    title = title.replaceAll('#', '');
    title = title.trim();
    return title;
}

let idx = 1;
export function domId() {
    return `dom-${idx++}`;
}

const HEADTAGS = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6'
];

export function isHeadTag(tag) {
    tag = tag.toLowerCase();
    return HEADTAGS.indexOf(tag) > -1;
}

export function formatHeadContents(dom) {
    const children = dom.children || [];
    const contents = [];
    Array.prototype.forEach.call(children, element => {
        if (isHeadTag(element.tagName)) {
            const content = element.textContent;
            contents.push(trimTitle(content));
        }
    });
    return contents;
}
