import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { create } from 'domclickoutside';
import { ACTIVE_CLASS, createDom, domHide, domId, domShow, domSizeByWindow, getDom, getDomDisplay, hideLoading, isTitle, now, on, showLoading, trimTitle } from './util';
import { createMarkdown } from './markdown';
import { createDefaultIcons } from './icons';
import Eventable from './Eventable';
import Viewer from 'viewerjs';
import { checkIframe } from './preview/iframe';
import { checkInclude } from './plugins/include';
import { scrollTop } from './preview/scrolltop';
import { calScroll } from './scrollsync';
import { removePreBgColor } from './preview/prebackground';
import { themes } from '../theme';
import { fetchScheduler } from './fetchScheduler';
import { getToastr, initToastr } from './toast';
import { checkLinks } from './preview/link';
import { checkCodeGroup } from './preview/codegroup';
import { initMermaid } from './preview/initmermaid';
import { checkMarkMap, initMarkMap } from './preview/markmap';
import { initSwiper } from './preview/swiper';
import { checkFullScreen } from './fullscreen';
import { getMonaco, getPrettier } from './deps';
import { makeToc } from './maketoc';
import { initQRCode } from './preview/qrcode';
import { exportHTML } from './exporthtml';
import printJS from 'print-js';

const THEME_ID = 'mdeditor_theme_style';
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
        icon: 'icon-dayin',
        label: '打印',
        type: 'print'
    }
];

function hideDomByDisplay(dom) {
    const display = getDomDisplay(dom);
    if (display === 'block') {
        domHide(dom);
    }
}

const OPTIONS = {
    preview: true,
    theme: 'vitepress',
    themeURL: './../theme/',
    tocOpen: false,
    monacoOptions: {
        language: 'markdown',
        value: '',
        automaticLayout: true
    }
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
        this.fullScreen = false;
        this.editorUpdateValues = [];
        this.themeName = '';
        this.clickOutSide = create();
        this.initDoms();
        this.initTheme();
        this.initExportFile();
        this.initTools();
        this.setTheme(options.theme);
        setTimeout(() => {
            this.checkPreviewState();
            this.checkTocState();
        }, 16);

        this.frameId = null;
        let time = now();
        const loop = () => {
            if (now() - time > 250) {
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

    }

    initDoms() {
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
        const monaco = getMonaco();
        const miniToastr = getToastr();
        if (!monaco) {
            const message = 'not find monaco editor namespace';
            console.error(message);
            miniToastr.error(message);
            return;
        }
        this.editor = monaco.editor.create(this.editorDom, Object.assign({}, OPTIONS.monacoOptions, monacoOptions));
        this.editor.onDidChangeModelContent(() => {
            const value = this.getValue();
            this.editorUpdateValues.push(value);
        });
        this.editor.onDidScrollChange((e) => {
            this._scrollEvent = e;
            this._syncScroll();
        });
        this.editor.addAction({
            id: '', // 菜单项 id
            label: 'Format Code', // 菜单项名称
            // keybindings: [this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.KEY_J], // 绑定快捷键
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
                prettier.format(this.getValue(), {
                    parser: 'markdown',
                    plugins: prettier.prettierPlugins
                }).then(text => {
                    // console.log(text);
                    const [range] = this.getWholeRange();
                    this.editor.executeEdits('', [
                        {
                            range,
                            text
                        }
                    ]);
                });
            }// 点击后执行的操作
        });
        // this.editor.onMouseDown(() => {
        //     domHide(this.themeDom);
        // });
    }

    initTools() {
        createDefaultIcons(this);
    }

    initTheme() {
        const themeDom = createDom('div');
        this.themeDom = themeDom;
        themeDom.className = 'mdeditor-theme-container';
        this.mainDom.appendChild(themeDom);
        const lis = themes.map(name => {
            const li = createDom('div');
            li.className = 'mdeditor-theme-select-item';
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
        on(themeDom, 'clickoutside', e => {
            hideDomByDisplay(e.target);
        });
    }

    initExportFile() {
        const exportFileDom = createDom('div');
        this.exportFileDom = exportFileDom;
        exportFileDom.className = 'mdeditor-theme-container';
        this.mainDom.appendChild(exportFileDom);
        const lis = exportFilesData.map(d => {
            const li = createDom('div');
            li.className = 'mdeditor-theme-select-item';
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
        on(exportFileDom, 'clickoutside', e => {
            hideDomByDisplay(e.target);
        });
    }

    _exportFile(type) {
        // console.log(type);
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
            const rect = previewDom.getBoundingClientRect();
            const { scrollHeight, scrollWidth } = this.previewDom;
            const { width, height } = rect;
            const { innerWidth, innerHeight } = window;
            html2canvas(previewDom, { useCORS: true, windowWidth: Math.max(width, scrollWidth, innerWidth), windowHeight: Math.max(height, scrollHeight, innerHeight) + 10 })
                .then((canvas) => {
                    canvas.toBlob((blob) => {
                        saveAs(blob, `${now()}.${fileType}`);
                    });
                    hideLoading();
                    addScroll();
                }).catch(err => {
                    console.error(err);
                })
                .finally(() => {

                });
            return;
        } else if (type === 'print') {
            printJS(this.previewDom.id, 'html');
        }
        if (!text) {
            return;
        }
        const blob = new Blob([text], { type: `text/${text};charset=utf-8` });
        saveAs(blob, `${now()}.${fileType}`);
    }

    checkPreviewState() {
        const { preview } = this;
        if (preview) {
            this.editorDom.style.width = '50%';
            domShow(this.previewDom);
            // this.editorUpdateValues.push(this.getValue());
            // this.previewDom.style.width = '50%';
        } else {
            this.editorDom.style.width = '100%';
            domHide(this.previewDom);
            // this.previewDom.style.width = '50%';
        }
        this.fire(preview ? 'openpreview' : 'closepreview', { preview });
    }

    checkTocState() {
        const { tocOpen } = this;
        let width = 250;
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
        // const allDoms = this.previewDom.children;
        // const findChildren = (dom) => {
        //     const parentTag = dom.tagName.toLowerCase();
        //     const parentType = parentTag[0];
        //     const parentLevel = parentTag[1];
        //     const children = [];
        //     let findParent = false;
        //     for (let i = 0, len = allDoms.length; i < len; i++) {
        //         if (allDoms[i] === dom) {
        //             findParent = true;
        //             continue;
        //         }
        //         if (!findParent) {
        //             continue;
        //         }
        //         const tagName = allDoms[i].tagName.toLowerCase();
        //         if (tagName === parentTag) {
        //             break;
        //         }
        //         if (tagName[0] !== parentType) {
        //             continue;
        //         }
        //         const level = parseInt(tagName[1]);
        //         if ((level - 1).toString() === parentLevel) {
        //             children.push({
        //                 dom: allDoms[i]
        //             });
        //         }
        //     }
        //     return children;
        // };
        // const titles = this.previewDom.querySelectorAll('h1');
        // const nodes = Array.prototype.map.call(titles, (node) => {
        //     return {
        //         dom: node
        //     };
        // });

        // const find = (node) => {
        //     const children = findChildren(node.dom);
        //     node.children = children;
        //     if (children.length) {
        //         children.forEach(child => {
        //             find(child);
        //         });
        //     }
        // };
        // nodes.forEach(node => {
        //     find(node);
        // });
        // const toHTML = (node) => {
        //     const { dom, children } = node;
        //     let html = `<li><a href="javascript:void(0)"/>${trimTitle(dom.textContent)}</a>`;
        //     if (children && children.length) {
        //         html += '<ul>';
        //         html += children.map(child => {
        //             return toHTML(child);
        //         }).join('');
        //         html += '</ul>';
        //     }
        //     html += '</li>';
        //     return html;
        // };
        // let html = '<ul>';
        // html += nodes.map(node => {
        //     return toHTML(node);
        // }).join('');
        // html += '</ul>';
        // this.tocDom.innerHTML = html;
        const liDoms = this.tocDom.querySelectorAll('li');
        const model = this.editor.getModel();
        const lineCount = model.getLineCount();
        const findTitleRow = (text) => {
            for (let i = 1; i <= lineCount; i++) {
                let content = model.getLineContent(i);
                if (isTitle(content)) {
                    content = trimTitle(content);
                    if (content.indexOf(text) === 0) {
                        return i;
                    }
                }
            }
        };

        const liClick = (e) => {
            let title = e.target.textContent;
            title = trimTitle(title);
            const row = findTitleRow(title);
            if (row) {
                const top = this.editor.getTopForLineNumber(row);
                this.editor.setScrollTop(top);
            }
        };
        liDoms.forEach(li => {
            on(li, 'click', liClick);
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
            text = checkMarkMap(text);
            const html = md.render(text);
            const dom = this.previewDom;
            dom.innerHTML = html;
            this.editorUpdateValues = [];
            checkCodeGroup(dom);
            checkLinks(dom);
            checkIframe(dom);
            initMermaid(dom);
            removePreBgColor(dom);
            initMarkMap(dom);
            initQRCode(dom);
            if (this.swipers) {
                this.swipers.forEach(swiper => {
                    swiper.destroy();
                });
            }
            this.swipers = initSwiper(dom);

            if (this.imageViewer) {
                this.imageViewer.destroy();
            }
            this.imageViewer = new Viewer(dom);
            scrollTop(dom);
            this._initTocData();
        });
    }

    _syncScroll() {
        if (!this._scrollEvent) {
            return this;
        }
        if (!this.preview) {
            return this;
        }
        const { scrollHeight, scrollTop } = this._scrollEvent;
        let top = 0;
        if (scrollTop > 10) {
            top = calScroll(this.editor, this.previewDom);
            if (!top) {
                const previewHeight = Math.max(this.previewDom.scrollHeight, scrollHeight);
                top = scrollTop / scrollHeight * previewHeight;
            }
        }
        this.previewDom.scroll({
            top,
            left: 0,
            behavior: 'smooth'
        });
    }

    // https://github.com/microsoft/monaco-editor/issues/639
    // eslint-disable-next-line no-unused-vars
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

    setTheme(themeName) {
        if (themeName === this.themeName) {
            return this;
        }
        const children = document.head.children;
        let styleLink;
        for (let i = 0, len = children.length; i < len; i++) {
            if (children[i].id === THEME_ID) {
                styleLink = children[i];
            }
        }
        const url = `${this.options.themeURL}${themeName}.css?t=${now}`;
        // get theme style
        const promise = fetchScheduler.createFetch(url, {
            // ...
        });
        promise.then(res => res.text()).then(text => {
            if (styleLink) {
                document.head.removeChild(styleLink);
            }
            this.styleText = text;
            const style = createDom('style');
            style.id = THEME_ID;
            style.type = 'text/css';
            style.innerHTML = text;
            document.head.appendChild(style);
            this.themeName = themeName;
            this._activeThemeItem(themeName);
            this.fire('themechange', { theme: themeName, value: text });
        }).catch(err => {
            console.error(`not fetch theme：${themeName} from:${url}`);
            console.error(err);
        });
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
        this.checkPreviewState();
        return this;
    }

    closePreview() {
        if (!this.isPreview()) {
            return this;
        }
        this.preview = false;
        this.checkPreviewState();
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
        this.checkTocState();
        return this;
    }

    closeToc() {
        if (!this.isToc()) {
            return this;
        }
        this.tocOpen = false;
        this.checkTocState();
        return this;
    }
}
