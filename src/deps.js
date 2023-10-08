
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

let qrcodeJS;

export function registerQRCode(qrcode) {
    qrcodeJS = qrcode;
}

export function getQRCode() {
    return qrcodeJS;
}

let mermaidJS;
export function registerMermaid(mermaid) {
    mermaidJS = mermaid;
}

export function getMermaid() {
    return mermaidJS;
}

let xlsxJS;
export function registerXLSX(xlsx) {
    xlsxJS = xlsx;
}

export function getXLSX() {
    return xlsxJS;
}

let x_spreadsheetJS;
export function registerX_spreadsheet(x_spreadsheet) {
    x_spreadsheetJS = x_spreadsheet;
}

export function getX_spreadsheet() {
    return x_spreadsheetJS;
}

let flowChartJS;

export function registerFlowChart(flowChart) {
    flowChartJS = flowChart;
}

export function getFlowChart() {
    return flowChartJS;
}
