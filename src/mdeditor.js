// import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { create } from 'domclickoutside';
import { ACTIVE_CLASS, createDom, domHide, domId, domShow, domSizeByWindow, extend, formatHeadContents, getDom, getDomDisplay, hideLoading, isTitle, now, on, showLoading, trimTitle } from './util';
import { createMarkdown } from './markdown';
import { createDefaultIcons } from './icons';
import Eventable from './Eventable';
import Viewer from 'viewerjs';
import { checkIframe } from './preview/iframe';
import { checkInclude } from './mdinclude';
import { scrollTop } from './preview/scrolltop';
import { calScroll } from './scrollsync';
import { removePreBgColor } from './preview/prebackground';
import { themes } from '../theme';
import { fetchScheduler } from './fetchScheduler';
import { getToastr, initToastr } from './toast';
import { checkLinks } from './preview/link';
import { checkCodeGroup } from './preview/codegroup';
import { initMermaid } from './preview/mermaid';
import { fromatMarkMapJSON } from './preview/markmap';
import { initSwiper } from './preview/swiper';
import { checkFullScreen } from './fullscreen';
import { getMonaco, getPrettier } from './deps';
import { makeToc } from './maketoc';
import { initQRCode } from './preview/qrcode';
import { exportHTML } from './exporthtml';
import printJS from 'print-js';
import { toBlob } from 'html-to-image';
import { initExcel } from './preview/excel';
import { exportMarkMapHTML } from './exportmarkmap';
import { lazyLoad } from './preview/layzload';
// import emojiData from '@emoji-mart/data'
import { Picker } from 'emoji-mart';
import { setHeadLineNumber } from './preview/headlinenumber';
import { initFlowChart } from './preview/flowchart';
import { domDiff } from './diff';

const THEME_ID = 'mdeditor_theme_style';
const THEMECACHE = new Map();
const md = createMarkdown();

const exportFilesData = [
    {
        icon: 'icon-file-markdown1',
        label: '导出Markdown',
        type: 'markdown'
    },
    {
        icon: 'icon-html',
        label: '导出HTML',
        type: 'html'
    },
    {
        icon: 'icon-tupiantianjia',
        label: '导出图片',
        type: 'png'
    },
    {
        icon: 'icon-naotu',
        label: '导出markmap',
        type: 'markmap'
    },
    {
        icon: 'icon-dayin',
        label: '打印',
        type: 'print'
    }
];

function hideDomByDisplay(dom) {
    dom = dom.target || dom;
    if (!(dom instanceof HTMLElement)) {
        console.error(dom, 'is not HTMLElement');
        return;
    }
    const display = getDomDisplay(dom);
    if (display === 'block') {
        domHide(dom);
    }
}

function createFloatPanel() {
    const dom = createDom('div');
    dom.className = 'mdeditor-float-container';
    return dom;
}

function createLiElement() {
    const li = createDom('div');
    li.className = 'mdeditor-theme-select-item';
    return li;
}

function getVSCodePasteData(items) {
    let editorDataItem, codeItem;
    items.forEach(item => {
        const { type } = item;
        if (type === 'vscode-editor-data') {
            editorDataItem = item;
        }
        if (type === 'text/plain') {
            codeItem = item;
        }
    });
    if (!editorDataItem || !codeItem || !editorDataItem.text || !codeItem.text) {
        return;
    }
    const text = editorDataItem.text;
    if (!text) {
        return;
    }
    let json;
    try {
        json = JSON.parse(text);
    } catch (error) {
        return;
    }
    if (!json || !json.mode) {
        return;
    }

    return {
        language: json.mode,
        text: codeItem.text
    };

}

const OPTIONS = {
    debug: false,
    preview: true,
    dark: false,
    theme: 'vitepress',
    themeURL: './../theme/',
    themeCache: true,
    tocOpen: false,
    emojiURL: 'https://cdn.jsdelivr.net/npm/@emoji-mart/data',
    iconfontURL: '//at.alicdn.com/t/c/font_4227162_duj4njl0dzn.css',
    monacoOptions: {
        language: 'markdown',
        value: '',
        automaticLayout: true
    },
    prettierOptions: {
        tabWidth: 4
    },
    updatePreviewDuration: 500,
    autoParseVSCodePasteData: false
};

/**
 * a Class for Eventable
 */
function Base() {

}

export class MDEditor extends Eventable(Base) {
    constructor(dom, options) {
        initToastr();
        super();
        dom = getDom(dom);
        if (!dom || !(dom instanceof HTMLElement)) {
            const message = 'dom is not HTMLElement';
            console.error(message, dom);
            getToastr().error(message);
            return;
        }
        dom.classList.add('mdeditor-container');
        options = Object.assign({}, OPTIONS, options);
        this.dom = dom;
        this.editorDom = null;
        this.previewDom = null;
        this.tocOpen = false;
        this.toolsDom = null;
        this.dialog = null;
        this.options = options;
        this.preview = this.options.preview;
        this.tocOpen = this.options.tocOpen;
        this.dark = this.options.dark;
        this.fullScreen = false;
        this.editorUpdateValues = [];
        this.themeName = '';
        this.clickOutSide = create();
        this.themeHistroy = [];
        this._initIconFont();
        this._initDoms();
        this._initTheme();
        this._initExportFile();
        this._initEmoji();
        this._initTools();
        this.setTheme(options.theme);
        this._checkDark();
        setTimeout(() => {
            this._checkPreviewState();
            this._checkTocState();
        }, 16);

        this.frameId = null;
        let time = now();
        const loop = () => {
            if (now() - time > this.options.updatePreviewDuration) {
                this.updatePreview();
                time = now();
            }
            this.frameId = requestAnimationFrame(loop);
        };

        this.frameId = requestAnimationFrame(loop);
        on(window, 'resize', () => {
            if (!this.fullScreen) {
                return;
            }
            domSizeByWindow(this.getContainer());
        });
        this.pasteItems = [];

    }

    _initIconFont() {
        const id = 'mdpress-iconfont';
        if (document && document.head && this.options.iconfontURL) {
            const style = document.head.querySelector(`#${id}`);
            if (!style) {
                const style = createDom('link');
                style.rel = 'stylesheet';
                style.href = this.options.iconfontURL;
                style.id = id;
                document.head.appendChild(style);
            }
        }
    }

    _initDoms() {
        const monaco = getMonaco();
        const miniToastr = getToastr();
        if (!monaco) {
            const message = 'not find monaco editor namespace';
            console.error(message);
            miniToastr.error(message);
            return;
        }
        const { monacoOptions } = this.options;

        const editorDom = this.editorDom = createDom('div');
        editorDom.className = 'mdeditor-editor';

        const previewDom = this.previewDom = createDom('div');
        previewDom.className = 'mdeditor-preview vp-doc markdown-body';
        previewDom.id = domId();

        const editorContainer = this.editorContainer = createDom('div');
        editorContainer.className = 'mdeditor-editor-container';
        editorContainer.appendChild(editorDom);
        editorContainer.appendChild(previewDom);
        editorContainer.addEventListener('paste', e => {
            if (e.clipboardData) {
                this.pasteItems = Array.prototype.map.call(e.clipboardData.items, (item) => {
                    return {
                        type: item.type,
                        kind: item.kind,
                        data: item
                    };
                });
                this.pasteItems.forEach((item) => {
                    item.data.getAsString((text) => {
                        item.text = text;
                    });
                });
            }
            this.fire('paste', extend({}, e, { target: this }));
        }, true);

        const tocDom = this.tocDom = createDom('div');
        tocDom.className = 'mdeditor-toc';

        const mainDom = this.mainDom = createDom('div');
        mainDom.className = 'mdeditor-main';
        mainDom.appendChild(editorContainer);
        mainDom.appendChild(tocDom);

        const toolsDom = this.toolsDom = createDom('div');
        toolsDom.className = 'mdeditor-tools';
        this.dom.appendChild(toolsDom);
        this.dom.appendChild(mainDom);

        const scrollTopDom = createDom('div');
        scrollTopDom.className = 'mdeditor-scrolltop editor-scrolltop';
        scrollTopDom.innerHTML = '<i class="iconfont icon-huidaodingbu"></i>';
        this.dom.appendChild(scrollTopDom);
        on(scrollTopDom, 'click', () => {
            this.editor.setScrollTop(0, 0);
        });
        // mainDom.appendChild(editorDom);
        // mainDom.appendChild(previewDom);

        this.editor = monaco.editor.create(this.editorDom, Object.assign({}, OPTIONS.monacoOptions, monacoOptions));
        this.editor.onDidChangeModelContent(() => {
            const value = this.getValue();
            this.editorUpdateValues.push(value);
        });
        this.editor.onDidScrollChange((e) => {
            this._scrollEvent = e;
            this._syncScroll();
        });
        this.editor.onDidPaste((e) => {
            if (!this.options.autoParseVSCodePasteData) {
                return;
            }
            const result = getVSCodePasteData(this.pasteItems);
            if (!e.range || !result || result.language === 'markdown') {
                return;
            }
            this.editor.popUndoStop();
            this.editor.executeEdits('', [
                {
                    range: e.range,
                    text: '```' + result.language + '\n' + result.text + '\n```\n'
                }
            ]);
        });
        this.editor.addAction({
            id: '', // 菜单项 id
            label: 'Format Code', // 菜单项名称
            keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
            contextMenuGroupId: '9_cutcopypaste', // 所属菜单的分组
            run: () => {
                const prettier = getPrettier();
                if (!prettier) {
                    const message = 'not find prettier';
                    console.warn(message);
                    miniToastr.warn(message);
                    return;
                }
                if (!prettier.prettierPlugins) {
                    const message = 'not find prettier plugins';
                    console.warn(message);
                    miniToastr.warn(message);
                    return;
                }
                prettier.format(this.getValue(), Object.assign({}, this.options.prettierOptions, {
                    parser: 'markdown',
                    plugins: prettier.prettierPlugins
                })).then(text => {
                    const [range] = this.getWholeRange();
                    this.editor.executeEdits('', [
                        {
                            range,
                            text
                        }
                    ]);
                    setTimeout(() => {
                        this._syncScroll();
                    }, 1000);
                });
            }
        });
    }

    _initTools() {
        createDefaultIcons(this);
    }

    _initTheme() {
        const themeDom = createFloatPanel();
        this.themeDom = themeDom;
        this.mainDom.appendChild(themeDom);
        const lis = themes.map(name => {
            const li = createLiElement();
            li.dataset.theme = name;
            li.innerHTML = `<i class="iconfont icon-31liebiao"></i>&nbsp;&nbsp;${name}`;
            themeDom.appendChild(li);
            return li;
        });
        lis.forEach(li => {
            on(li, 'click', e => {
                const theme = e.target.dataset.theme;
                this._activeThemeItem(e.target);
                this.setTheme(theme);
            });
        });
        this.clickOutSide.addDom(this.themeDom);
        on(themeDom, 'clickoutside', hideDomByDisplay);
    }

    _initExportFile() {
        const exportFileDom = createFloatPanel();
        this.exportFileDom = exportFileDom;
        this.mainDom.appendChild(exportFileDom);
        const lis = exportFilesData.map(d => {
            const li = createLiElement();
            li.dataset.type = d.type;
            li.innerHTML = `<i class="iconfont ${d.icon}"></i>&nbsp;&nbsp;${d.label}`;
            exportFileDom.appendChild(li);
            return li;
        });
        lis.forEach(li => {
            on(li, 'click', e => {
                const theme = e.target.dataset.type;
                this._exportFile(theme);
            });
        });
        this.clickOutSide.addDom(this.exportFileDom);
        on(exportFileDom, 'clickoutside', hideDomByDisplay);
    }

    _initEmoji() {
        const emojiDom = createFloatPanel();
        this.emojiDom = emojiDom;
        const onEmojiSelect = (data) => {
            // console.log(data);
            const native = data.native;
            const [range] = this.getCurrentRange();
            this.editor.executeEdits('', [
                {
                    range,
                    text: `${native}\n`
                }
            ]);
        };
        const pickerOptions = {
            onEmojiSelect,
            data: async () => {
                const response = await fetch(this.options.emojiURL);
                return response.json();
            }
        };
        const picker = new Picker(pickerOptions);
        emojiDom.appendChild(picker);

        this.mainDom.appendChild(emojiDom);
        this.clickOutSide.addDom(this.emojiDom);
        on(emojiDom, 'clickoutside', hideDomByDisplay);
    }

    _exportFile(type) {
        const previewDom = this.previewDom;
        const children = this.previewDom.children;
        const scrollTopDom = children[children.length - 1];
        const addScroll = () => {
            previewDom.appendChild(scrollTopDom);
        };

        const removeScroll = () => {
            previewDom.removeChild(scrollTopDom);
        };
        let text, fileType;
        if (type === 'markdown') {
            text = this.editor.getValue();
            fileType = 'md';
        } else if (type === 'html') {
            removeScroll();
            text = exportHTML(previewDom.outerHTML, this.styleText);
            fileType = type;
            addScroll();
        } else if (type === 'png') {
            fileType = type;
            showLoading();
            removeScroll();
            // let w = 0;
            // Array.prototype.forEach.call(children, element => {
            //     const rect = element.getBoundingClientRect();
            //     w = Math.max(rect.width, w);
            // });
            const rect = previewDom.getBoundingClientRect();
            const { scrollHeight } = this.previewDom;
            const { height } = rect;
            const { innerHeight } = window;
            // const w = Math.max(width, scrollWidth, innerWidth);
            const h = Math.max(height, scrollHeight, innerHeight) + 10;
            const w = rect.width + 10;
            toBlob(previewDom, { width: w, height: h }).then(blob => {
                saveAs(blob, `${now()}.${fileType}`);
                hideLoading();
                addScroll();
            }).catch(err => {
                console.error(err);
                getToastr().error(err);
                hideLoading();
                addScroll();
            });
            return;
        } else if (type === 'print') {
            printJS(this.previewDom.id, 'html');
        } else if (type === 'markmap') {
            const markmap = fromatMarkMapJSON(this.mdText);
            text = exportMarkMapHTML(markmap);
            fileType = 'html';
        }
        if (!text) {
            return;
        }
        const blob = new Blob([text], { type: `text/${text};charset=utf-8` });
        saveAs(blob, `${now()}.${fileType}`);
    }

    _checkPreviewState() {
        const { preview } = this;
        if (preview) {
            this.editorDom.style.width = '50%';
            domShow(this.previewDom);
        } else {
            this.editorDom.style.width = '100%';
            domHide(this.previewDom);
        }
        this.fire(preview ? 'openpreview' : 'closepreview', { preview });
    }

    _checkTocState() {
        const { tocOpen } = this;
        let width = 300;
        if (!tocOpen) {
            width = 0;
        }
        this.editorContainer.style.width = `calc(100% - ${width}px)`;
        this.tocDom.style.width = `${width}px`;
        (width > 0 ? domShow(this.tocDom) : domHide(this.tocDom));
        if (width > 0) {
            this._initTocData();
        }
        this.fire(tocOpen ? 'opentoc' : 'closetoc', { tocOpen });
    }

    _initTocData() {
        if (!this.tocOpen) {
            return this;
        }
        makeToc(this.previewDom, '.mdeditor-toc');
        const aLinks = this.tocDom.querySelectorAll('a');
        aLinks.forEach(dom => {
            dom.id = dom.id || domId();
            dom.textContent = trimTitle(dom.textContent);
        });
        const findDomPosition = (a, currentTitle) => {
            const result = [];
            aLinks.forEach(dom => {
                let title = dom.textContent;
                title = trimTitle(title);
                if (title === currentTitle) {
                    result.push(dom);
                }
            });
            const index = result.indexOf(a);
            return Math.max(index, 0) + 1;
        };
        const model = this.editor.getModel();
        const lineCount = model.getLineCount();
        const headContents = formatHeadContents(this.previewDom);
        const findTitleRow = (a) => {
            let title = a.textContent;
            title = trimTitle(title);
            const index = findDomPosition(a, title);
            let idx = 0;
            for (let lineNum = 1; lineNum <= lineCount; lineNum++) {
                let content = model.getLineContent(lineNum);
                if (isTitle(content, headContents)) {
                    content = trimTitle(content);
                    if (content.indexOf(title) === 0) {
                        idx++;
                        if (idx === index) {
                            return lineNum;
                        }
                    }
                }
            }
        };

        const linkClick = (e) => {
            const a = e.target;
            if (!a.id) {
                return;
            }
            const row = findTitleRow(a);
            if (row) {
                const top = this.editor.getTopForLineNumber(row);
                this.editor.setScrollTop(top);
            }
        };
        aLinks.forEach(a => {
            on(a, 'click', linkClick);
        });
    }

    setValue(value) {
        if (!this.editor) {
            console.error('not find editor');
            return this;
        }
        this.editor.setValue(value);
        return this;
    }

    getValue() {
        if (!this.editor) {
            console.error('not find editor');
            return this;
        }
        return this.editor.getValue();
    }

    updatePreview() {
        if (!this.preview) {
            return this;
        }
        const len = this.editorUpdateValues.length;
        if (len === 0) {
            return this;
        }
        const value = this.editorUpdateValues[len - 1];
        checkInclude(value, (text) => {
            this.mdText = text;
            let html = md.render(text);
            html = lazyLoad(html, this);
            const dom = this.previewDom;

            if (dom.childNodes.length === 0) {
                dom.innerHTML = html;
            } else {
                const tempDom = document.createElement('div')
                tempDom.innerHTML = html;
                domDiff(dom, tempDom, this);
            }
            this.editorUpdateValues = [];
            checkCodeGroup(dom, this);
            checkLinks(dom, this);
            checkIframe(dom, this);
            initMermaid(dom, this);
            removePreBgColor(dom, this);
            initQRCode(dom, this);

            initSwiper(dom, this);
            initFlowChart(dom, this);

            if (this.imageViewer) {
                this.imageViewer.destroy();
            }
            this.imageViewer = new Viewer(dom);
            initExcel(dom, this);
            setHeadLineNumber(dom, this.editor);
            // scrollTop(dom, this);
            this._initTocData();
            this._syncScroll();
        });
    }

    _syncScroll() {
        if (!this._scrollEvent || !this.preview) {
            return this;
        }
        const { scrollHeight, scrollTop } = this._scrollEvent;
        const previewDom = this.previewDom;
        let top = 0;
        if (scrollTop > 10) {
            top = calScroll(this.editor, previewDom);
            if (!top) {
                const previewHeight = Math.max(previewDom.scrollHeight, scrollHeight);
                top = scrollTop / scrollHeight * previewHeight;
            }
        }
        previewDom.scroll({
            top,
            left: 0,
            behavior: 'smooth'
        });
    }

    // https://github.com/microsoft/monaco-editor/issues/639
    getSelectText() {
        const range = this.editor.getSelection();
        const text = this.editor.getModel().getValueInRange(range);
        if (!text) {
            return;
        }
        return [range, text];
    }

    // https://github.com/microsoft/monaco-editor/issues/172
    getSelectRange() {
        const select = this.editor.getSelection();
        if (!select) {
            return;
        }
        const { startLineNumber, endLineNumber, startColumn, endColumn } = select;
        const starRange = {
            startLineNumber,
            endLineNumber: startLineNumber,
            startColumn,
            endColumn: startColumn
        };
        const endRange = {
            startLineNumber: endLineNumber,
            endLineNumber,
            startColumn: endColumn,
            endColumn
        };
        // const model = this.editor.getModel();
        return [starRange, endRange];
    }

    // https://blog.csdn.net/Anchor_CHEN/article/details/127223203
    getCurrentRange() {
        const position = this.editor.getPosition();
        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column
        };
        return [range];
    }

    getWholeRange() {
        const model = this.editor.getModel();
        const linesNumber = model.getLineCount();
        const range = {
            startLineNumber: 1,
            endLineNumber: linesNumber,
            startColumn: 1,
            endColumn: 100000
        };
        return [range];

    }

    isPreview() {
        return this.preview;
    }

    isFullScreen() {
        return this.fullScreen;
    }

    isToc() {
        return this.tocOpen;
    }

    getContainer() {
        return this.dom;
    }

    getEditor() {
        return this.editor;
    }

    _activeThemeItem(item) {
        const items = this.themeDom.querySelectorAll('.mdeditor-theme-select-item');
        if (typeof item === 'string') {
            for (let i = 0, len = items.length; i < len; i++) {
                if (items[i].dataset.theme === item) {
                    item = items[i];
                    break;
                }
            }
        }
        if (!item || typeof item === 'string') {
            return;
        }
        items.forEach(item => {
            item.classList.remove(ACTIVE_CLASS);
        });
        item.classList.add(ACTIVE_CLASS);
    }

    setTheme(theme) {
        if (theme === this.themeName) {
            console.warn(`'${theme}' equal current theme '${this.themeName}'`);
            return this;
        }
        if (themes.indexOf(theme) === -1) {
            getToastr().error(`'${theme}' theme not exist`);
            return this;
        }
        this.themeName = theme;
        this.themeHistroy.push(theme);
        const themeChange = (text) => {
            if (theme !== this.themeName) {
                console.warn(`'${theme}' theme ignored,the new '${this.themeName}' will fetch`);
                return this;
            }
            const children = document.head.children;
            let styleLink;
            for (let i = 0, len = children.length; i < len; i++) {
                if (children[i].id === THEME_ID) {
                    styleLink = children[i];
                }
            }
            if (styleLink) {
                document.head.removeChild(styleLink);
            }
            this.styleText = text;
            const style = createDom('style');
            style.id = THEME_ID;
            style.type = 'text/css';
            style.innerHTML = text;
            document.head.appendChild(style);
            this._activeThemeItem(theme);
            this.fire('themechange', { theme, value: text });
            if (this.dark && theme.indexOf('dark') === -1) {
                console.warn(`current model is dark,the '${theme}' theme is mismatching`);
            }
        };
        const themeCache = this.options.themeCache;
        if (THEMECACHE.get(theme) && themeCache) {
            themeChange(THEMECACHE.get(theme));
        } else {
            const url = `${this.options.themeURL}${theme}.css?t=${now()}`;
            // get theme style
            const promise = fetchScheduler.createFetch(url, {
                // ...
            });
            promise.then(res => res.text()).then(text => {
                if (themeCache) {
                    THEMECACHE.set(theme, text);
                }
                themeChange(text);
            }).catch(err => {
                console.error(`not fetch theme：'${theme}' from:${url}`);
                console.error(err);
            });
        }
        return this;
    }

    getTheme() {
        return this.themeName;
    }

    getIcons() {
        return Array.prototype.map.call(this.toolsDom.children, c => {
            return c.parent;
        });
    }

    openPreview() {
        if (this.isPreview()) {
            return this;
        }
        this.preview = true;
        this._checkPreviewState();
        return this;
    }

    closePreview() {
        if (!this.isPreview()) {
            return this;
        }
        this.preview = false;
        this._checkPreviewState();
        return this;
    }

    openFullScreen() {
        if (this.isFullScreen()) {
            return this;
        }
        checkFullScreen(this);
        return this;
    }

    closeFullScreen() {
        if (!this.isFullScreen()) {
            return this;
        }
        checkFullScreen(this);
        return this;
    }

    openToc() {
        if (this.isToc()) {
            return this;
        }
        this.tocOpen = true;
        this._checkTocState();
        return this;
    }

    closeToc() {
        if (!this.isToc()) {
            return this;
        }
        this.tocOpen = false;
        this._checkTocState();
        return this;
    }

    _checkDark() {
        const iconDoms = Array.prototype.map.call(this.toolsDom.children, (dom) => {
            return dom;
        });
        const doms = [this.toolsDom, this.editorDom, this.tocDom, this.exportFileDom, this.themeDom];
        const DARKCLASS = 'mdeditor-dark';
        const TOOLCLASS = 'mdeditor-panel-dark';
        const dark = this.dark;
        doms.forEach(dom => {
            if (dark) {
                dom.classList.add(DARKCLASS);
                dom.classList.add(TOOLCLASS);
            } else {
                dom.classList.remove(DARKCLASS);
                dom.classList.remove(TOOLCLASS);
            }
        });
        iconDoms.forEach(dom => {
            if (dark) {
                dom.classList.add(DARKCLASS);
            } else {
                dom.classList.remove(DARKCLASS);
            }
        });

        this.editor.updateOptions({
            theme: dark ? 'vs-dark' : 'vs'
        });
        let previewTheme = 'vitepress';
        for (let len = this.themeHistroy.length, i = len - 1; i >= 0; i--) {
            if (this.themeHistroy[i].indexOf('dark') === -1) {
                previewTheme = this.themeHistroy[i];
                break;
            }
        }
        this.setTheme(dark ? 'github-dark' : previewTheme);
        this.fire(dark ? 'opendark' : 'closedark', { dark });
    }

    openDark() {
        this.dark = true;
        return this.checkDark();
    }

    closeDark() {
        this.dark = false;
        return this.checkDark();
    }

    isDark() {
        return this.dark;
    }
}

export function getMarkdownIt() {
    return md;
}
