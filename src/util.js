
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

let shikiHighlighter;
export function registerShikiHighlighter(highlighter) {
    shikiHighlighter = highlighter;
}

export function getShikiHighlighter() {
    return shikiHighlighter;
}

let monaco;
export function registerMonaco(monacoObj) {
    monaco = monacoObj;
}

export function getMonaco() {
    return monaco;
}

let hlsjs;
export function registerHightLight(hls) {
    hlsjs = hls;
}

export function getHightLight() {
    return hlsjs;
}

let prettierjs;
export function registerPrettier(prettier) {
    prettierjs = prettier;
}

export function getPrettier() {
    return prettierjs;
}

let markMapJS;
export function registerMarkMap(markmap) {
    markMapJS = markmap;
}

export function getMarkMap() {
    return markMapJS;
}

let swiperJS;

export function registerSwiper(swiper) {
    swiperJS = swiper;
}

export function getSwiper() {
    return swiperJS;
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
