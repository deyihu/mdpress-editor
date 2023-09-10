
import miniToastr from 'mini-toastr';
import { createDom, domSizeByWindow, getDom, getMonaco, getPrettier, now } from './util';
import { createMarkdown } from './markdown';
import { initMermaid } from './plugins/mermaid';
import { createDefaultIcons } from './icons';
import Eventable from './Eventable';
import Viewer from 'viewerjs';
import { checkCodeGroup } from './plugins/container';
import { checkSnippets } from './plugins/snippet';
import { checkIframe } from './plugins/iframe';

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
            console.error('dom is not HTMLElement', dom);
            miniToastr.error('dom is not HTMLElement');
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
        this.initDoms();
        this.initTools();
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
        previewDom.className = 'mdeditor-preview vp-doc';

        const toolsDom = this.toolsDom = createDom('div');
        toolsDom.className = 'mdeditor-tools';

        const mainDom = createDom('div');
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
    }

    initTools() {
        // const toolsDom = this.toolsDom;
        createDefaultIcons(this, miniToastr);
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
        checkSnippets(value, (text) => {
            const html = md.render(text);
            this.previewDom.innerHTML = html;
            this.editorUpdateValues = [];
            checkCodeGroup(this.previewDom);
            checkLinks(this.previewDom);
            checkIframe(this.previewDom);
            initMermaid(this.previewDom);

            if (this.imageViewer) {
                this.imageViewer.destroy();
            }
            this.imageViewer = new Viewer(this.previewDom);
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
        const previewHeight = Math.max(this.previewDom.scrollHeight, scrollHeight);
        this.previewDom.scroll({
            top: scrollTop / scrollHeight * previewHeight,
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
}
