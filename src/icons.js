import { ToolIcon } from './toolicon';
import { createDialog, domSizeByWindow, getTableMdText, on } from './util';
import dayjs from 'dayjs';

const ICONS = [
    {
        name: 'icon-zitijiacu',
        title: '加粗'
    },
    {
        name: 'icon-strikethrough',
        title: '删除线'
    },
    {
        name: 'icon-italic',
        title: '斜体'
    },
    {
        name: 'icon-yinyong',
        title: '引用'
    },
    {
        name: 'icon-daxie',
        title: '大写'
    },
    {
        name: 'icon-xiaoxie',
        title: '小写'
    },
    {
        name: 'icon-h11',
        title: '标题1'
    },
    {
        name: 'icon-h',
        title: '标题2'
    },
    {
        name: 'icon-h3',
        title: '标题3'
    },
    {
        name: 'icon-h2',
        title: '标题4'
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
        title: '无序列表'
    },
    {
        name: 'icon-orderedList',
        title: '有序列表'
    },
    {
        name: 'icon-wodezhuanti',
        title: '任务列表',
        enable: false
    },
    {
        name: 'icon-hr',
        title: '横线',
        enable: false
    },
    {
        name: 'icon-lianjie',
        title: '插入链接'
    },
    {
        name: 'icon-tupiantianjia',
        title: '插入图片'
    },
    {
        name: 'icon-biaodanzujian-biaoge',
        title: '表格'
    },
    {
        name: 'icon-code',
        title: '插入代码'
    },
    {
        name: 'icon-js',
        title: '插入js code'
    },
    {
        name: 'icon-Artboard',
        title: '插入ts code'
    },
    {
        name: 'icon-bootstrap_tabs',
        title: '插入代码组'
    },
    {
        name: 'icon-093info',
        title: '信息容器'
    },
    {
        name: 'icon-tipsvip',
        title: '提示容器'
    },
    {
        name: 'icon-jinggao',
        title: '警告容器'
    },
    {
        name: 'icon-cuowukongxin',
        title: '危险容器'
    },
    {
        name: 'icon-xuekegongshiku_Char-rm-uk',
        title: 'Katex'
    },
    {
        name: 'icon-liuchengtu',
        title: 'mermaid'
    },
    {
        name: 'icon-shijian',
        title: '时间'
    },
    {
        name: 'icon-emoji',
        title: 'github emoji'
    },
    {
        name: 'icon-mulu',
        title: '(toc)table of content'
    },
    {
        name: 'icon-daoruwenjian',
        title: 'link a markdown file'
    },
    {
        name: 'icon-m-geshihuawenzi',
        title: '格式化文档',
        enable: false
    },
    {
        name: 'icon-yulan',
        title: '预览'
    },
    {
        name: 'icon-quanping',
        title: '全屏'
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

const CODEGROUP = '::: code-group\n\n' +
    '```js [add.js]' +
    `${JSCODE}` +
    '```\n\n' +
    '```ts [add.ts]' +
    `${TSCODE}` +
    '```\n' +
    ':::';

export function createDefaultIcons(mdEditor, miniToastr) {
    const editor = mdEditor.editor;
    const container = mdEditor.getContainer();
    const icons = ICONS.map(d => {
        return new ToolIcon(Object.assign(d, { icon: d.name }));
    });

    const validateSelect = (result) => {
        if (result && result.length) {
            return true;
        }
        return false;
    };

    const iconAddEvent = (icon, event, handler) => {
        icon.on(event, handler);
    };

    // ====
    const blodClick = function () {
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
    };
    iconAddEvent(icons[0], 'click', blodClick);
    // ====
    const deleteLineClick = function () {
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
    };
    iconAddEvent(icons[1], 'click', deleteLineClick);
    // ====
    const xietiClick = function () {
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
    };
    iconAddEvent(icons[2], 'click', xietiClick);
    // ====
    const refrenceClick = function () {
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
    };
    iconAddEvent(icons[3], 'click', refrenceClick);
    // ====
    const upperCaseClick = function () {
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
    };
    iconAddEvent(icons[4], 'click', upperCaseClick);
    // ====
    const lowerCaseClick = function () {
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
    };
    iconAddEvent(icons[5], 'click', lowerCaseClick);
    // ====
    const hTitle = function (text) {
        const result = mdEditor.getCurrentRange();
        if (!validateSelect(result)) {
            return;
        }
        const [range] = result;
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
    iconAddEvent(icons[6], 'click', h1Click);
    iconAddEvent(icons[7], 'click', h2Click);
    iconAddEvent(icons[8], 'click', h3Click);
    iconAddEvent(icons[9], 'click', h4Click);

    // ====
    const commonTaskClick = function (text) {
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
    };
    iconAddEvent(icons[10], 'click', commonTaskClick);

    // ====
    const numTaskClick = function (text) {
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
    };
    iconAddEvent(icons[11], 'click', numTaskClick);
    // // ====
    // const checkTaskClick = function (text) {
    //     const result = getCurrentRange();
    //     if (!validateSelect(result)) {
    //         return;
    //     }
    //     const [range] = result;
    //     editor.executeEdits('', [
    //         {
    //             range,
    //             text: '- [] task1\n- [] task2\n'
    //         }
    //     ]);
    // };
    // iconAddEvent(icons[12], 'click', checkTaskClick);
    // ====
    const horLineClick = function (text) {
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
    };
    iconAddEvent(icons[13], 'click', horLineClick);
    // ====
    const linkClick = function (text) {
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
    };
    iconAddEvent(icons[14], 'click', linkClick);
    // ====
    const imgClick = function (text) {
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
    };
    iconAddEvent(icons[15], 'click', imgClick);
    // ====
    const tableClick = function (text) {
        const result = mdEditor.getCurrentRange();
        if (!validateSelect(result)) {
            return;
        }
        const [range] = result;
        editor.executeEdits('', [
            {
                range,
                text
            }
        ]);
    };
    iconAddEvent(icons[16], 'click', () => {
        if (mdEditor.dialog) {
            miniToastr.warn('检测到你已经打开了一个对话框请关闭', '警告', 3000);
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
            tableClick(text);
            dialog.close();
            mdEditor.dialog = null;

        });
    });

    // ====
    const codeClick = function (text) {
        const result = mdEditor.getCurrentRange();
        if (!validateSelect(result)) {
            return;
        }
        const [range] = result;
        editor.executeEdits('', [
            {
                range,
                text
            }
        ]);
    };
    const commonCode = () => {
        codeClick('```\n\n```\n');
    };
    const jsCode = () => {
        codeClick('```js' + JSCODE + '```\n');
    };
    const tsCode = () => {
        codeClick('```ts' + TSCODE + '```\n');
    };
    iconAddEvent(icons[17], 'click', commonCode);
    iconAddEvent(icons[18], 'click', jsCode);
    iconAddEvent(icons[19], 'click', tsCode);

    // ====
    const containerClick = function (text) {
        const result = mdEditor.getCurrentRange();
        if (!validateSelect(result)) {
            return;
        }
        const [range] = result;
        editor.executeEdits('', [
            {
                range,
                text
            }
        ]);
    };
    const codeGroup = () => {
        containerClick(CODEGROUP);
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
    iconAddEvent(icons[20], 'click', codeGroup);
    iconAddEvent(icons[21], 'click', info);
    iconAddEvent(icons[22], 'click', tip);
    iconAddEvent(icons[23], 'click', warn);
    iconAddEvent(icons[24], 'click', danger);
    iconAddEvent(icons[25], 'click', ketex);
    iconAddEvent(icons[26], 'click', mermaid);

    // ====
    const timeClick = function (text) {
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
    };

    iconAddEvent(icons[27], 'click', timeClick);

    // ====
    const emojiClick = function (text) {
        const result = mdEditor.getCurrentRange();
        if (!validateSelect(result)) {
            return;
        }
        const [range] = result;
        editor.executeEdits('', [
            {
                range,
                text: ':tada:'
            }
        ]);
    };
    iconAddEvent(icons[28], 'click', emojiClick);
    // ====
    const tocClick = function (text) {
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
    };
    iconAddEvent(icons[29], 'click', tocClick);
    // ====
    const linkFileClick = function (text) {
        const result = mdEditor.getCurrentRange();
        if (!validateSelect(result)) {
            return;
        }
        const [range] = result;
        editor.executeEdits('', [
            {
                range,
                text: '\n<<< @//mdpress.glicon.design/p/files/2023-09-03/t83dlckX52cWiNtzBHkOL.md\n'
            }
        ]);
    };
    iconAddEvent(icons[30], 'click', linkFileClick);
    // ====
    const formatClick = function (text) {
        editor.getAction('editor.action.formatDocument').run();
    };
    iconAddEvent(icons[31], 'click', formatClick);

    // ====
    const previewClick = function (text) {
        mdEditor.preview = !mdEditor.preview;
        mdEditor.checkPreviewState();
    };

    iconAddEvent(icons[32], 'click', previewClick);
    // ====
    let oldStyle = {

    };
    const fullScreenClass = 'mdeditor-fullscreen';
    const fullScreenClick = function (text) {
        const classList = container.classList;
        if (classList.contains(fullScreenClass)) {
            classList.remove(fullScreenClass);
            mdEditor.fullScreen = false;
            for (const key in oldStyle) {
                container.style[key] = oldStyle[key];
            }
            mdEditor.fire('closefullscreen', { fullScreen: mdEditor.fullScreen });
        } else {
            classList.add(fullScreenClass);
            oldStyle = {
                width: container.style.width,
                height: container.style.height
            };
            mdEditor.fullScreen = true;
            domSizeByWindow(container);
            mdEditor.fire('openfullscreen', { fullScreen: mdEditor.fullScreen });
        }
        // const isFullScreen = document.mozFullScreen || document.webkitIsFullScreen;
        // const dom = mdEditor.dom;
        // if (dom.requestFullscreen && !isFullScreen) {
        //     dom.requestFullscreen();
        // } else if (document.exitFullscreen) {
        //     document.exitFullscreen();
        // }
    };

    iconAddEvent(icons[33], 'click', fullScreenClick);
    icons.forEach(icon => {
        if (!icon.isEnable()) {
            return;
        }
        icon.addTo(mdEditor);
    });
}
