import { ToolIcon } from './toolicon';
import { createDialog, domSizeByWindow, getDomDisplay, getTableMdText, on, setDomDisplay } from './util';
import dayjs from 'dayjs';
import { computePosition } from '@floating-ui/dom';
import { getToastr } from './toast';

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
    return a + b;
}
console.log(add(1,2));
`;
const TSCODE = `
function add(a:number,b:number):number{
    return a + b;
}
console.log(add(1,2));
`;

const CODEGROUP = '::: code-group\n\n' +
    '```js [add.js]' +
    `${JSCODE}` +
    '```\n\n' +
    '```ts [add.ts]' +
    `${TSCODE}` +
    '```\n' +
    ':::';
const FULLSCREENCLASS = 'mdeditor-fullscreen';

function getEditors(iconDom) {
    const mdEditor = iconDom.getEditor();
    return [mdEditor, mdEditor.editor];
}

const validateSelect = (result) => {
    if (result && result.length) {
        return true;
    }
    return false;
};

const hTitle = function (mdEditor, text) {
    const result = mdEditor.getCurrentRange();
    if (!validateSelect(result)) {
        return;
    }
    const editor = mdEditor.editor;
    const [range] = result;
    editor.executeEdits('', [
        {
            range,
            text
        }
    ]);
};

const tableClick = function (mdEditor, text) {
    const result = mdEditor.getCurrentRange();
    if (!validateSelect(result)) {
        return;
    }
    const editor = mdEditor.editor;
    const [range] = result;
    editor.executeEdits('', [
        {
            range,
            text
        }
    ]);
};

const codeClick = function (mdEditor, text) {
    const result = mdEditor.getCurrentRange();
    if (!validateSelect(result)) {
        return;
    }
    const editor = mdEditor.editor;
    const [range] = result;
    editor.executeEdits('', [
        {
            range,
            text
        }
    ]);
};

// ====
const containerClick = function (mdEditor, text) {
    const result = mdEditor.getCurrentRange();
    if (!validateSelect(result)) {
        return;
    }
    const editor = mdEditor.editor;
    const [range] = result;
    editor.executeEdits('', [
        {
            range,
            text
        }
    ]);
};

function updateDomPosition(themeIconDom, themeDom) {
    computePosition(themeIconDom, themeDom, {
        placement: 'bottom'
    }).then(({ x, y }) => {
        Object.assign(themeDom.style, {
            left: `${x}px`,
            top: `${y}px`
        });
    });
}

const ICONS = [
    {
        name: 'icon-zitijiacu',
        title: '加粗',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getSelectRange();
            if (!validateSelect(result)) {
                return;
            }
            const [starRange, endRange] = result;
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
        }
    },
    {
        name: 'icon-strikethrough',
        title: '删除线',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getSelectRange();
            if (!validateSelect(result)) {
                return;
            }
            const [starRange, endRange] = result;
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
        }
    },
    {
        name: 'icon-italic',
        title: '斜体',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getSelectRange();
            if (!validateSelect(result)) {
                return;
            }
            const [starRange, endRange] = result;
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
        }
    },
    {
        name: 'icon-yinyong',
        title: '引用',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '> hello\n'
                }
            ]);
        }
    },
    {
        name: 'icon-daxie',
        title: '大写',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getSelectText();
            if (!validateSelect(result)) {
                return;
            }
            const [range, text] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: text.toUpperCase()
                }
            ]);
        }
    },
    {
        name: 'icon-xiaoxie',
        title: '小写',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getSelectText();
            if (!validateSelect(result)) {
                return;
            }
            const [range, text] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: text.toLowerCase()
                }
            ]);
        }
    },
    {
        name: 'icon-h11',
        title: '标题1',
        enable: false,
        click: function () {
            hTitle(this.getEditor(), '# ');
        }
    },
    {
        name: 'icon-h',
        title: '标题2',
        enable: false,
        click: function () {
            hTitle(this.getEditor(), '## ');
        }
    },
    {
        name: 'icon-h3',
        title: '标题3',
        enable: false,
        click: function () {
            hTitle(this.getEditor(), '### ');
        }
    },
    {
        name: 'icon-h2',
        title: '标题4',
        enable: false,
        click: function () {
            hTitle(this.getEditor(), '#### ');
        }
    },
    // {
    //     name: 'icon-h1',
    //     title: '标题5'
    // },
    // {
    //     name: 'icon-h6',
    //     title: '标题6'
    // },
    {
        name: 'icon-31liebiao',
        title: '无序列表',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '-  \n-  '
                }
            ]);
        }
    },
    {
        name: 'icon-orderedList',
        title: '有序列表',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '1.  \n2. '
                }
            ]);
        }
    },
    {
        name: 'icon-wodezhuanti',
        title: '任务列表',
        enable: false
    },
    {
        name: 'icon-hr',
        title: '横线',
        // enable: false,
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '------------\n'
                }
            ]);
        }
    },
    {
        name: 'icon-lianjie',
        title: '插入链接',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '[Markdown 官方教程](https://markdown.com.cn/)'
                }
            ]);
        }
    },
    {
        name: 'icon-tupiantianjia',
        title: '插入图片',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '![Markdown 官方教程](https://markdown.com.cn/hero.png)'
                }
            ]);
        }
    },
    {
        name: 'icon-biaodanzujian-biaoge',
        title: '表格',
        click: function () {
            const [mdEditor] = getEditors(this);
            const miniToastr = getToastr();
            if (mdEditor.dialog) {
                miniToastr.warn('检测到你已经打开了一个对话框请关闭当前的才可以使用', '警告', 3000);
                return;
            }
            const dialog = createDialog();
            mdEditor.dom.appendChild(dialog);
            dialog.show();
            mdEditor.dialog = dialog;
            const cancelBtn = dialog.querySelector('#table-btn-cancel');
            const confirmBtn = dialog.querySelector('#table-btn-confirm');
            on(cancelBtn, 'click', () => {
                dialog.close();
                mdEditor.dialog = null;
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
                const text = getTableMdText(rows, cols);
                tableClick(mdEditor, text);
                dialog.close();
                mdEditor.dialog = null;

            });
        }
    },
    {
        name: 'icon-code',
        title: '插入代码',
        click: function () {
            codeClick(this.getEditor(), '```\n\n```\n');
        }
    },
    {
        name: 'icon-js',
        title: '插入js code',
        click: function () {
            codeClick(this.getEditor(), '```js' + JSCODE + '```\n');
        }
    },
    {
        name: 'icon-Artboard',
        title: '插入ts code',
        click: function () {
            codeClick(this.getEditor(), '```ts' + TSCODE + '```\n');
        }
    },
    {
        name: 'icon-bootstrap_tabs',
        title: '插入代码组',
        click: function () {
            containerClick(this.getEditor(), CODEGROUP);
        }
    },
    {
        name: 'icon-093info',
        title: '信息容器',
        click: function () {
            containerClick(this.getEditor(), INFOBOX);
        }
    },
    {
        name: 'icon-tipsvip',
        title: '提示容器',
        click: function () {
            containerClick(this.getEditor(), TIPBOX);
        }
    },
    {
        name: 'icon-jinggao',
        title: '警告容器',
        click: function () {
            containerClick(this.getEditor(), WARNBOX);
        }
    },
    {
        name: 'icon-cuowukongxin',
        title: '危险容器',
        click: function () {
            containerClick(this.getEditor(), DANGERBOX);
        }
    },
    {
        name: 'icon-xuekegongshiku_Char-rm-uk',
        title: 'Katex',
        click: function () {
            containerClick(this.getEditor(), KATEX);
        }
    },
    {
        name: 'icon-liuchengtu',
        title: 'mermaid',
        click: function () {
            containerClick(this.getEditor(), MERMAID);
        }
    },
    {
        name: 'icon-shijian',
        title: '时间',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: dayjs().format('YYYY-MM-DD HH:mm:ss')
                }
            ]);
        }
    },
    {
        name: 'icon-emoji',
        title: 'github emoji',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: ':tada: :dog: :cat: '
                }
            ]);
        }
    },
    {
        name: 'icon-mulu',
        title: '(toc)table of content',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '\n[[toc]]\n'
                }
            ]);
        }
    },
    {
        name: 'icon-daoruwenjian',
        title: 'include a markdown file',
        click: function () {
            const [mdEditor, editor] = getEditors(this);
            const result = mdEditor.getCurrentRange();
            if (!validateSelect(result)) {
                return;
            }
            const [range] = result;
            editor.executeEdits('', [
                {
                    range,
                    text: '\ninclude@//mdpress.glicon.design/p/files/2023-09-03/t83dlckX52cWiNtzBHkOL.md\n'
                }
            ]);
        }
    },
    {
        name: 'icon-m-geshihuawenzi',
        title: '格式化文档',
        enable: false,
        click: function () {
            // editor.getAction('editor.action.formatDocument').run();
        }
    }

];

function checkDomDisplay(dom) {
    let display = getDomDisplay(dom);
    if (display === 'none') {
        display = 'block';
    } else if (display === 'block') {
        display = 'none';
    } else {
        display = 'block';
    }
    return display;
}

const ICONS_RIGHT = [
    {
        name: 'icon-pifuzhuti-xianxing',
        title: '主题',
        position: 'right',
        click: function () {
            const mdEditor = this.getEditor();
            const themeDom = mdEditor.themeDom;
            const iconDom = this.getDom();
            const display = checkDomDisplay(themeDom);
            setTimeout(() => {
                setDomDisplay(themeDom, display);
                updateDomPosition(iconDom, themeDom);
            }, 16);
        }
    },
    {
        name: 'icon-pos_nav_icon_implements',
        title: 'export file',
        position: 'right',
        click: function () {
            const mdEditor = this.getEditor();
            const exportFileDom = mdEditor.exportFileDom;
            const iconDom = this.getDom();
            const display = checkDomDisplay(exportFileDom);
            setTimeout(() => {
                setDomDisplay(exportFileDom, display);
                updateDomPosition(iconDom, exportFileDom);
            }, 16);
        }
    },
    {
        name: 'icon-yulan',
        title: '预览',
        position: 'right',
        click: function () {
            const mdEditor = this.getEditor();
            mdEditor.preview = !mdEditor.preview;
            mdEditor.checkPreviewState();
        }
    },
    {
        name: 'icon-quanping',
        title: '全屏',
        position: 'right',
        click: function () {
            const mdEditor = this.getEditor();
            const container = mdEditor.getContainer();
            container.oldStyle = container.oldStyle || {};
            const oldStyle = container.oldStyle;
            const classList = container.classList;
            if (classList.contains(FULLSCREENCLASS)) {
                classList.remove(FULLSCREENCLASS);
                mdEditor.fullScreen = false;
                for (const key in oldStyle) {
                    container.style[key] = oldStyle[key];
                }
                mdEditor.fire('closefullscreen', { fullScreen: mdEditor.fullScreen });
            } else {
                classList.add(FULLSCREENCLASS);
                container.oldStyle = {
                    width: container.style.width,
                    height: container.style.height
                };
                mdEditor.fullScreen = true;
                domSizeByWindow(container);
                mdEditor.fire('openfullscreen', { fullScreen: mdEditor.fullScreen });
            }
            // updateTheme();
        }
    },
    {
        name: 'icon-github',
        title: 'github',
        position: 'right',
        click: function () {
            window.open('https://github.com/deyihu/mdpress-editor');
        }
    }
];

export function createDefaultIcons(mdEditor) {
    const icons = ICONS.concat(ICONS_RIGHT.reverse()).map(d => {
        return new ToolIcon(Object.assign(d, { icon: d.name }));
    });
    icons.forEach(icon => {
        if (!icon.isEnable()) {
            return;
        }
        if (icon.options.click) {
            icon.on('click', icon.options.click);
        } else {
            console.warn(`not find click event for icon:${icon.options.title}`);
        }
        icon.addTo(mdEditor);
    });
}
