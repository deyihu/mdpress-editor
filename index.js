
// import { editor } from 'monaco-editor';
import miniToastr from 'mini-toastr';
import dayjs from 'dayjs';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import emoji from 'markdown-it-emoji';
import mermaid from 'mermaid';
import { extendMarkdownItWithKatex } from './plugins/katex';
import { extendMarkdownItWithMermaid } from './plugins/mermaid';
const md = MarkdownIt({
    html: true,
    highlight: function (str, lang) {
        // console.log(lang);
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) { }
        }

        return ''; // use external default escaping
    }
});
md.use(emoji, {});
extendMarkdownItWithKatex(md);
extendMarkdownItWithMermaid(md);

let miniToastrInit = false;

function initToastr() {
    if (!miniToastrInit) {
        miniToastr.init({
            appendTarget: document.body
        });
        miniToastrInit = true;
    }
}

function getDom(id) {
    if (id instanceof HTMLElement) {
        return id;
    }
    if (id.indexOf('#') > -1) {
        return document.getElementById(id.substring(1, Infinity));
    }
    if (id.indexOf('.') > -1) {
        return document.getElementsByClassName(id.substring(1, Infinity))[0];
    }
}

function createDom(tagName) {
    return document.createElement(tagName);
}

function createDialog() {
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

function getTableMdStr(rows, cols) {
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

function now() {
    return new Date().getTime();
}

function syncMermaid(dom) {
    if (!mermaid) {
        return;
    }
    mermaid.initialize({ startOnLoad: false });
    const els = dom.querySelectorAll('.mermaid');
    const notInit = [];
    for (let i = 0, len = els.length; i < len; i++) {
        const dataset = els[i].dataset;
        if (!dataset.processed) {
            notInit.push(1);
        }
    }
    if (notInit.length) {
        mermaid.run({
            nodes: els
        });
    }
}

const icons = [
    {
        name: 'icon-zitijiacu',
        label: '加粗'
    },
    {
        name: 'icon-strikethrough',
        label: '删除线'
    },
    {
        name: 'icon-italic',
        label: '斜体'
    },
    {
        name: 'icon-yinyong',
        label: '引用'
    },
    {
        name: 'icon-daxie',
        label: '大写'
    },
    {
        name: 'icon-xiaoxie',
        label: '小写'
    },
    {
        name: 'icon-h11',
        label: '标题1'
    },
    {
        name: 'icon-h',
        label: '标题2'
    },
    {
        name: 'icon-h3',
        label: '标题3'
    },
    {
        name: 'icon-h2',
        label: '标题4'
    },
    // {
    //     name: 'icon-h1',
    //     label: '标题5'
    // },
    // {
    //     name: 'icon-h6',
    //     label: '标题6'
    // },
    {
        name: 'icon-31liebiao',
        label: '无序列表'
    },
    {
        name: 'icon-orderedList',
        label: '有序列表'
    },
    {
        name: 'icon-wodezhuanti',
        label: '任务列表'
    },
    {
        name: 'icon-hr',
        label: '横线'
    },
    {
        name: 'icon-lianjie',
        label: '插入链接'
    },
    {
        name: 'icon-tupiantianjia',
        label: '插入图片'
    },
    {
        name: 'icon-biaodanzujian-biaoge',
        label: '表格'
    },
    {
        name: 'icon-js',
        label: '插入js code'
    },
    {
        name: 'icon-Artboard',
        label: '插入ts code'
    },
    {
        name: 'icon-emoji',
        label: 'github emoji'
    },
    {
        name: 'icon-093info',
        label: '信息容器'
    },
    {
        name: 'icon-tipsvip',
        label: '提示容器'
    },
    {
        name: 'icon-jinggao',
        label: '警告容器'
    },
    {
        name: 'icon-cuowukongxin',
        label: '危险容器'
    },
    {
        name: 'icon-xuekegongshiku_Char-rm-uk',
        label: 'Katex'
    },
    {
        name: 'icon-liuchengtu',
        label: 'mermaid'
    },
    {
        name: 'icon-shijian',
        label: '时间'
    },
    {
        name: 'icon-yulan',
        label: '预览'
    },
    {
        name: 'icon-quanping',
        label: '全屏'
    }
];

const INFOBOX = `
::: info\n
This is an info box.

:::\n
`;
const TIPBOX = `
::: tip\n
This is a tip.

:::\n
`;
const WARNBOX = `
::: warning\n
This is a warning.

:::\n
`;
const DANGERBOX = `
::: danger\n
This is a dangerous warning.

:::\n
`;

const MERMAID = `
::: mermaid\n
flowchart LR
    A[Hard] -->|Text| B(Round)
    B --> C{Decision}
    C -->|One| D[Result 1]
    C -->|Two| E[Result 2]
    
:::\n
`;

const KATEX = `
::: katex

\\sqrt{3x-1}+(1+x)^2

:::\n
`;

const JSCODE = `
function add(a,b){
    return a+b;
}
console.log(add(1,2));
`;
const TSCODE = `
function add(a:number,b:number):number{
    return a+b;
}
console.log(add(1,2));
`;

const OPTIONS = {
    preview: true,
    monacoOptions: {
        language: 'markdown',
        value: '',
        automaticLayout: true
    }
};

export class MDEditor {
    constructor(dom, options) {
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
        this.editorUpdateValues = [];
        if (!this.options.monaco) {
            console.error('not find monaco namespace');
            return;
        }
        this.initDoms();
        this.initTools();
        this.checkPreviewState();
        initToastr();

        this.frameId = null;
        let time = now();
        const loop = () => {
            if (now() - time > 1000) {
                this.updatePreview();
                time = now();
            }
            syncMermaid(this.previewDom);
            this.frameId = requestAnimationFrame(loop);
        };

        this.frameId = requestAnimationFrame(loop);

    }

    initDoms() {
        const { monaco, monacoOptions } = this.options;

        const editorDom = this.editorDom = createDom('div');
        editorDom.className = 'mdeditor-editor';

        const previewDom = this.previewDom = createDom('div');
        previewDom.className = 'mdeditor-preview';

        const toolsDom = this.toolsDom = createDom('div');
        toolsDom.className = 'mdeditor-tools';

        const mainDom = createDom('div');
        mainDom.className = 'mdeditor-main';

        this.dom.appendChild(toolsDom);
        this.dom.appendChild(mainDom);
        mainDom.appendChild(editorDom);
        mainDom.appendChild(previewDom);
        this.editor = monaco.editor.create(this.editorDom, Object.assign({}, OPTIONS.monacoOptions, monacoOptions));
        this.editor.onDidChangeModelContent(() => {
            // console.log(this.editor.getValue());
            const value = this.getValue();
            this.editorUpdateValues.push(value);
            // const html = md.render(value);
            // console.log(html);
        });
    }

    initTools() {
        const toolsDom = this.toolsDom;
        const iconDoms = icons.map(d => {
            const { name, label } = d;
            const dom = createDom('i');
            dom.className = `item iconfont ${name}`;
            dom.title = label;
            return dom;
        });

        const on = (target, event, hanlder) => {
            target.addEventListener(event, hanlder);
        };

        // https://github.com/microsoft/monaco-editor/issues/639
        // eslint-disable-next-line no-unused-vars
        const getSelectText = () => {
            const range = this.editor.getSelection();
            const text = this.editor.getModel().getValueInRange(range);
            if (!text) {
                return;
            }
            return [range, text];
        };

        // https://github.com/microsoft/monaco-editor/issues/172
        const getSelectRange = () => {
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
            return [starRange, endRange, this.editor];
        };
        // https://blog.csdn.net/Anchor_CHEN/article/details/127223203
        const getCurrentRange = () => {
            const position = this.editor.getPosition();
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column,
                endColumn: position.column
            };
            return [range, this.editor];
        };

        const validateSelect = (result) => {
            if (result && result.length) {
                return true;
            }
            return false;
        };

        // ====
        const blodClick = () => {
            const result = getSelectRange();
            if (!validateSelect(result)) {
                return;
            }
            const [starRange, endRange, editor] = result;
            editor.executeEdits('', [
                {
                    range: starRange,
                    text: '**'
                },
                {
                    range: endRange,
                    text: '**'
                }
            ]);
        };
        on(iconDoms[0], 'click', blodClick);
        // ====
        const deleteLineClick = () => {
            const result = getSelectRange();
            if (!validateSelect(result)) {
                return;
            }
            const [starRange, endRange, editor] = result;
            editor.executeEdits('', [
                {
                    range: starRange,
                    text: '~~'
                },
                {
                    range: endRange,
                    text: '~~'
                }
            ]);
        };
        on(iconDoms[1], 'click', deleteLineClick);
        // ====
        const xietiClick = () => {
            const result = getSelectRange();
            if (!validateSelect(result)) {
                return;
            }
            const [starRange, endRange, editor] = result;
            editor.executeEdits('', [
                {
                    range: starRange,
                    text: '*'
                },
                {
                    range: endRange,
                    text: '*'
                }
            ]);
        };
        on(iconDoms[2], 'click', xietiClick);
        // ====
        const refrenceClick = () => {
            const result = getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range, editor] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '> '
                }
            ]);
        };
        on(iconDoms[3], 'click', refrenceClick);
        // ====
        const upperCaseClick = () => {
            const result = getSelectText();
            if (!validateSelect(result)) {
                return;
            }
            const [range, text] = result;
            this.editor.executeEdits('', [
                {
                    range,
                    text: text.toUpperCase()
                }
            ]);
        };
        on(iconDoms[4], 'click', upperCaseClick);
        // ====
        const lowerCaseClick = () => {
            const result = getSelectText();
            if (!validateSelect(result)) {
                return;
            }
            const [range, text] = result;
            this.editor.executeEdits('', [
                {
                    range,
                    text: text.toLowerCase()
                }
            ]);
        };
        on(iconDoms[5], 'click', lowerCaseClick);
        // ====
        const hTitle = (text) => {
            const result = getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range, editor] = result;
            editor.executeEdits('', [
                {
                    range,
                    text
                }
            ]);
        };
        const h1Click = () => {
            hTitle('# ');
        };
        const h2Click = () => {
            hTitle('## ');
        };
        const h3Click = () => {
            hTitle('### ');
        };
        const h4Click = () => {
            hTitle('#### ');
        };
        on(iconDoms[6], 'click', h1Click);
        on(iconDoms[7], 'click', h2Click);
        on(iconDoms[8], 'click', h3Click);
        on(iconDoms[9], 'click', h4Click);

        // ====
        const commonTaskClick = (text) => {
            const result = getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range, editor] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '-  \n-  '
                }
            ]);
        };
        on(iconDoms[10], 'click', commonTaskClick);

        // ====
        const numTaskClick = (text) => {
            const result = getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range, editor] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '1.  \n2. '
                }
            ]);
        };
        on(iconDoms[11], 'click', numTaskClick);
        // ====
        const checkTaskClick = (text) => {
            const result = getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range, editor] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '- [] task1\n- [] task2\n'
                }
            ]);
        };
        on(iconDoms[12], 'click', checkTaskClick);
        // ====
        const horLineClick = (text) => {
            const result = getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range, editor] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '------------\n'
                }
            ]);
        };
        on(iconDoms[13], 'click', horLineClick);
        // ====
        const linkClick = (text) => {
            const result = getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range, editor] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '[Markdown 官方教程](https://markdown.com.cn/)'
                }
            ]);
        };
        on(iconDoms[14], 'click', linkClick);
        // ====
        const imgClick = (text) => {
            const result = getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range, editor] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '![Markdown 官方教程](https://markdown.com.cn/hero.png)'
                }
            ]);
        };
        on(iconDoms[15], 'click', imgClick);
        // ====
        const tableClick = (text) => {
            const result = getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range, editor] = result;
            editor.executeEdits('', [
                {
                    range,
                    text
                }
            ]);
        };
        on(iconDoms[16], 'click', () => {
            if (this.dialog) {
                miniToastr.warn('检测到你已经打开了一个对话框请关闭', '警告', 3000);
                return;
            }
            const dialog = createDialog();
            this.dom.appendChild(dialog);
            dialog.show();
            this.dialog = dialog;
            const cancelBtn = dialog.querySelector('#table-btn-cancel');
            const confirmBtn = dialog.querySelector('#table-btn-confirm');
            on(cancelBtn, 'click', () => {
                dialog.close();
                this.dialog = null;
            });
            on(confirmBtn, 'click', () => {
                const rowsDom = dialog.querySelector('#table-rows');
                const colsDom = dialog.querySelector('#table-cols');
                let rows = rowsDom.value, cols = colsDom.value;
                rows = Math.abs(rows);
                cols = Math.abs(cols);
                if (rows === 0 || cols === 0) {
                    miniToastr.warn('表格行数或者列数为0', '警告', 3000);
                    return;
                }
                const text = getTableMdStr(rows, cols);
                tableClick(text);
                dialog.close();
                this.dialog = null;

            });
        });

        // ====
        const codeClick = (text) => {
            const result = getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range, editor] = result;
            editor.executeEdits('', [
                {
                    range,
                    text
                }
            ]);
        };
        const jsCode = () => {
            codeClick('```js' + JSCODE + '```\n');
        };
        const tsCode = () => {
            codeClick('```ts' + TSCODE + '```\n');
        };
        on(iconDoms[17], 'click', jsCode);
        on(iconDoms[18], 'click', tsCode);

        // ====
        const emojiClick = (text) => {
            const result = getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range, editor] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: ':tada:'
                }
            ]);
        };
        on(iconDoms[19], 'click', emojiClick);
        // ====
        const containerClick = (text) => {
            const result = getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range, editor] = result;
            editor.executeEdits('', [
                {
                    range,
                    text
                }
            ]);
        };
        const info = () => {
            containerClick(INFOBOX);
        };
        const tip = () => {
            containerClick(TIPBOX);
        };
        const warn = () => {
            containerClick(WARNBOX);
        };
        const danger = () => {
            containerClick(DANGERBOX);
        };
        const mermaid = () => {
            containerClick(MERMAID);
        };
        const ketex = () => {
            containerClick(KATEX);
        };
        on(iconDoms[20], 'click', info);
        on(iconDoms[21], 'click', tip);
        on(iconDoms[22], 'click', warn);
        on(iconDoms[23], 'click', danger);
        on(iconDoms[24], 'click', ketex);
        on(iconDoms[25], 'click', mermaid);

        // ====
        const timeClick = (text) => {
            const result = getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range, editor] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: dayjs().format('YYYY-MM-DD HH:mm:ss')
                }
            ]);
        };

        on(iconDoms[26], 'click', timeClick);
        // ====
        const previewClick = (text) => {
            this.preview = !this.preview;
            this.checkPreviewState();
        };

        on(iconDoms[27], 'click', previewClick);
        // ====
        const fullScreenClick = (text) => {
            const isFullScreen = document.mozFullScreen || document.webkitIsFullScreen;
            const dom = this.dom;
            if (dom.requestFullscreen && !isFullScreen) {
                dom.requestFullscreen();
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        };

        on(iconDoms[28], 'click', fullScreenClick);
        // on(iconDoms[6], 'click', h1Click);
        iconDoms.forEach(dom => {
            toolsDom.appendChild(dom);
        });
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
        const html = md.render(value);
        this.previewDom.innerHTML = html;
        this.editorUpdateValues = [];
    }
}
