
import miniToastr from 'mini-toastr';
import { createDom, domSizeByWindow, getDom, getMonaco, now, on } from './util';
import { createMarkdown } from './markdown';
import { initMermaid } from '../plugins/mermaid';
import { createDefaultIcons } from './icons';
import Eventable from './Eventable';
import {
    FetchScheduler
} from 'fetch-scheduler';
const fetchScheduler = new FetchScheduler({
    requestCount: 6 // Concurrent number of fetch requests
});

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

function checkCodeGroup(dom) {
    const codeGroups = dom.querySelectorAll('.vp-code-group');
    const domActive = (dom, active = true) => {
        if (!dom) {
            return;
        }
        if (active) {
            dom.classList.add('active');
        } else {
            dom.classList.remove('active');
        }
    };
    codeGroups.forEach(codeGroup => {
        const tabsDom = codeGroup.querySelector('.tabs');
        const blocksDom = codeGroup.querySelector('.blocks');
        const radios = tabsDom.querySelectorAll('input[type=radio]');
        const pres = blocksDom.querySelectorAll('pre');
        domActive(pres[0]);
        radios.forEach((radio, index) => {
            on(radio, 'click', () => {
                pres.forEach(pre => {
                    domActive(pre, false);
                });
                const pre = pres[index];
                domActive(pre);
            });
        });
    });

}
const SNIP_FLAG = '<<< @';
function checkSnippets(text, callback) {
    if (text.indexOf(SNIP_FLAG) === -1) {
        callback(text, false);
        return;
    }
    const array = text.split(SNIP_FLAG);
    const snips = [];
    for (let i = 1, len = array.length; i < len; i++) {
        const line = array[i];
        let snipUrl = '';
        for (let j = 0, len1 = line.length; j < len1; j++) {
            const char = line[j];
            if (char === ' ' || char === '\n' || char === '\r') {
                snips.push({
                    start: 0,
                    end: j,
                    url: snipUrl,
                    line
                });
                break;
            }
            snipUrl += char;
        }
    }
    let idx = 0;
    const end = () => {
        idx++;
        if (idx === snips.length) {
            snips.forEach(snip => {
                const { text, end, url } = snip;
                if (!text) {
                    snip.line = `<p style="color:red">fetch snip file error,url:${url}</p>` + snip.line.substring(end, Infinity);
                } else {
                    snip.line = `${text}\n` + snip.line.substring(end, Infinity);
                }
            });
            let value = array[0];
            snips.forEach(snip => {
                value += snip.line;
            });
            callback(value, true);
        }
    };
    snips.forEach(snip => {
        const promise = fetchScheduler.createFetch(snip.url, {
            // ...
        });
        promise.then(res => res.text()).then(text => {
            snip.text = text;
            end();
        }).catch(err => {
            console.error(err);
            end();
        });
    });
    // callback(text);
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
        super();
        dom = getDom(dom);
        if (!dom || !(dom instanceof HTMLElement)) {
            console.error('dom is not HTMLElement', dom);
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
        initToastr();

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
            console.error('not find monaco editor namespace');
            return;
        }
        this.editor = monaco.editor.create(this.editorDom, Object.assign({}, OPTIONS.monacoOptions, monacoOptions));
        this.editor.onDidChangeModelContent(() => {
            const value = this.getValue();
            this.editorUpdateValues.push(value);
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
            initMermaid(this.previewDom);
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
