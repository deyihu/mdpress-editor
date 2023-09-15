
import miniToastr from 'mini-toastr';
import { ACTIVE_CLASS, createDom, domSizeByWindow, getDom, getMonaco, getPrettier, now, on } from './util';
import { createMarkdown } from './markdown';
import { initMermaid } from './plugins/mermaid';
import { createDefaultIcons } from './icons';
import Eventable from './Eventable';
import Viewer from 'viewerjs';
import { checkCodeGroup } from './plugins/container';
import { checkIframe } from './plugins/iframe';
import { checkInclude } from './plugins/include';
import { scrollTop } from './plugins/scrolltop';
import { calScroll } from './scrollsync';
import { removePreBgColor } from './plugins/prebackground';
import { themes } from '../theme';
import { fetchScheduler } from './fetchScheduler';
const THEME_ID = 'mdeditor_theme_style';
const md = createMarkdown();

let miniToastrInit = false;

function initToastr() {
    if (!miniToastrInit) {
        miniToastr.init({
            appendTarget: document.body
        });
        miniToastrInit = true;
    }
}
function checkLinks(dom) {
    const links = dom.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.indexOf('http:') > -1 || href.indexOf('https://') > -1 || href.indexOf('//') > -1) {
            link.setAttribute('target', '_blank');
        }
    });
}

const OPTIONS = {
    preview: true,
    theme: 'vitepress',
    themeURL: './../theme/',
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
            miniToastr.error(message);
            return;
        }
        dom.classList.add('mdeditor-container');
        options = Object.assign({}, OPTIONS, options);
        this.dom = dom;
        this.editorDom = null;
        this.previewDom = null;
        this.toolsDom = null;
        this.dialog = null;
        this.options = options;
        this.preview = this.options.preview;
        this.fullScreen = false;
        this.editorUpdateValues = [];
        this.themeName = '';
        this.initDoms();
        this.initTheme();
        this.initTools();
        this.setTheme(options.theme);
        setTimeout(() => {
            this.checkPreviewState();
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
        window.addEventListener('resize', () => {
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

        const toolsDom = this.toolsDom = createDom('div');
        toolsDom.className = 'mdeditor-tools';

        const mainDom = this.mainDom = createDom('div');
        mainDom.className = 'mdeditor-main';

        this.dom.appendChild(toolsDom);
        this.dom.appendChild(mainDom);
        mainDom.appendChild(editorDom);
        mainDom.appendChild(previewDom);
        const monaco = getMonaco();
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
        this.editor.onMouseDown(() => {
            this.themeDom.style.display = 'none';
        });
    }

    initTools() {
        // const toolsDom = this.toolsDom;
        createDefaultIcons(this, miniToastr);
    }

    initTheme() {
        const themeDom = createDom('div');
        this.themeDom = themeDom;
        themeDom.className = 'mdeditor-theme-container';
        this.mainDom.appendChild(themeDom);

        // const selectDom = this.selectDom = createDom('select');
        // selectDom.className = 'mdeditor-theme-select';
        // const optionList = themes.map(name => {
        //     return `<option class="mdeditor-theme-select-item" value="${name}">${name}</option>`;
        // }).join('').toString();
        // selectDom.innerHTML = optionList;
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
        // on(document.body, 'click', e => {
        //     console.log(e);
        //     const { clientX, clientY } = e;
        //     const rect = this.themeDom.getBoundingClientRect();
        //     const { left, top, right, bottom } = rect;
        //     console.log(this.themeDom.style.display);
        //     if ((clientX < left || clientX > right || clientY < top || clientY > bottom) && this.themeDom.style.display === 'block') {
        //         this.themeDom.style.display = 'none';
        //     }
        // });

        // themeDom.appendChild(selectDom);
        // on(selectDom, 'change', (e) => {
        //     const theme = selectDom.options[selectDom.selectedIndex].value;
        //     this.setTheme(theme);
        // });

    }

    checkPreviewState() {
        const { preview } = this;
        if (preview) {
            this.editorDom.style.width = '50%';
            this.previewDom.style.display = 'block';
            // this.editorUpdateValues.push(this.getValue());
            // this.previewDom.style.width = '50%';
        } else {
            this.editorDom.style.width = '100%';
            this.previewDom.style.display = 'none';
            // this.previewDom.style.width = '50%';
        }
        this.fire(preview ? 'openpreview' : 'closepreview', { preview });
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
            const html = md.render(text);
            const dom = this.previewDom;
            dom.innerHTML = html;
            this.editorUpdateValues = [];
            checkCodeGroup(dom);
            checkLinks(dom);
            checkIframe(dom);
            initMermaid(dom);
            removePreBgColor(dom);

            if (this.imageViewer) {
                this.imageViewer.destroy();
            }
            this.imageViewer = new Viewer(dom);
            scrollTop(dom);
        });
    }

    _syncScroll() {
        if (!this._scrollEvent) {
            return this;
        }
        if (!this.preview) {
            return this;
        }
        let top = calScroll(this.editor, this.previewDom);
        if (!top) {
            const { scrollHeight, scrollTop } = this._scrollEvent;
            const previewHeight = Math.max(this.previewDom.scrollHeight, scrollHeight);
            top = scrollTop / scrollHeight * previewHeight;
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
        const url = `${this.options.themeURL}${themeName}.css`;
        // get theme style
        const promise = fetchScheduler.createFetch(url, {
            // ...
        });
        promise.then(res => res.text()).then(text => {
            if (styleLink) {
                document.head.removeChild(styleLink);
            }
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
}
