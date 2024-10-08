import { ToolIcon } from './toolicon';
import { createDialog, createFolderTreeDialog, getDomDisplay, getTableMdText, on, setDomDisplay } from './util';
import dayjs from 'dayjs';
import { computePosition } from '@floating-ui/dom';
import { getToastr } from './toast';
import { checkFullScreen } from './fullscreen';
import { FileDND } from 'filednd';

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
$\\sqrt{3x-1}+(1+x)^2$\n
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

const SWIPER = `
::: swiper\n

<div class="swiper">
  <!-- Additional required wrapper -->
  <div class="swiper-wrapper">

    <!-- Slides -->
    <div class="swiper-slide">
       <img src="//mdpress.glicon.design/p/files/2023-09-19/_97Umejwi3DfuOlGYg7iE.jpg"/>
    </div>
    <div class="swiper-slide">
      <img src="//mdpress.glicon.design/p/files/2023-09-19/Viaaga99bu_9v4OGJ-Idk.jpg"/>
   </div>
    <div class="swiper-slide">
      <img src="//mdpress.glicon.design/p/files/2023-09-19/ttkWmxXd0mjrhQp1k195D.jpg"/>
   </div>
    <div class="swiper-slide">
      <img src="//mdpress.glicon.design/p/files/2023-09-19/GmZdx5wpsgF-wcl1AO2ec.jpg"/>
   </div>
    <div class="swiper-slide">
      <img src="//mdpress.glicon.design/p/files/2023-09-19/87hQUHXwwa77rhPaWQORV.jpg"/>
   </div>
  </div>
  <!-- If we need pagination -->
  <div class="swiper-pagination"></div>

  <!-- If we need navigation buttons -->
  <!--<div class="swiper-button-prev"></div>-->
  <!--<div class="swiper-button-next"></div>-->

  <!-- If we need scrollbar -->
  <!-- <div class="swiper-scrollbar"></div> -->
</div>
:::\n`;

const TASKLIST = `
- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media
`;

const FLOWCHART = `
::: flowchart\n
st=>start: Start:>http://www.google.com[blank]
e=>end:>http://www.google.com
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...
para=>parallel: parallel tasks

st->op1->cond
cond(yes)->io->e
cond(no)->para
para(path1, bottom)->sub1(right)->op1
para(path2, top)->op1

::: 
`;

function getEditors(iconDom) {
    const mdEditor = iconDom.getMDEditor();
    return [mdEditor, mdEditor.getEditor()];
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
    const editor = mdEditor.getEditor();
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
    const editor = mdEditor.getEditor();
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
    const editor = mdEditor.getEditor();
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
    const editor = mdEditor.getEditor();
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

export function rangeEqual(range1, range2) {
    return range1.endColumn === range2.endColumn &&
        range1.startColumn === range2.startColumn &&
        range1.startLineNumber === range2.startLineNumber &&
        range1.endLineNumber === range2.endLineNumber;
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
            if (rangeEqual(starRange, endRange)) {
                return;
            }
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
            if (rangeEqual(starRange, endRange)) {
                return;
            }
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
            if (rangeEqual(starRange, endRange)) {
                return;
            }
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
            hTitle(this.getMDEditor(), '# ');
        }
    },
    {
        name: 'icon-h',
        title: '标题2',
        enable: false,
        click: function () {
            hTitle(this.getMDEditor(), '## ');
        }
    },
    {
        name: 'icon-h3',
        title: '标题3',
        enable: false,
        click: function () {
            hTitle(this.getMDEditor(), '### ');
        }
    },
    {
        name: 'icon-h2',
        title: '标题4',
        enable: false,
        click: function () {
            hTitle(this.getMDEditor(), '#### ');
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
                    text: '- item1  \n- item2  '
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
                    text: TASKLIST
                }
            ]);
        }
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
                    text: '[mdpress-editor](https://github.com/deyihu/mdpress-editor)'
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
                    text: '![image](https://markdown.com.cn/hero.png)'
                }
            ]);
        }
    },
    {
        name: 'icon-wangyelianjie',
        title: '插入iframe',
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
                    text: '<iframe src="https://markdown.com.cn/cheat-sheet.html#%E6%80%BB%E8%A7%88"></iframe>'
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
                mdEditor.dom.removeChild(dialog);
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
            codeClick(this.getMDEditor(), '```\n\n```\n');
        }
    },
    {
        name: 'icon-js',
        title: '插入js code',
        click: function () {
            codeClick(this.getMDEditor(), '```js' + JSCODE + '```\n');
        }
    },
    {
        name: 'icon-Artboard',
        title: '插入ts code',
        click: function () {
            codeClick(this.getMDEditor(), '```ts' + TSCODE + '```\n');
        }
    },
    {
        name: 'icon-bootstrap_tabs',
        title: '插入代码组',
        click: function () {
            containerClick(this.getMDEditor(), CODEGROUP);
        }
    },
    {
        name: 'icon-badge',
        title: '插入Badge',
        click: function () {
            containerClick(this.getMDEditor(), '<span class="VPBadge tip">^1.9.0</span>');
        }
    },
    {
        name: 'icon-093info',
        title: '信息容器',
        click: function () {
            containerClick(this.getMDEditor(), INFOBOX);
        }
    },
    {
        name: 'icon-yiwancheng',
        title: '提示容器',
        click: function () {
            containerClick(this.getMDEditor(), TIPBOX);
        }
    },
    {
        name: 'icon-jinggao',
        title: '警告容器',
        click: function () {
            containerClick(this.getMDEditor(), WARNBOX);
        }
    },
    {
        name: 'icon-cuowukongxin',
        title: '危险容器',
        click: function () {
            containerClick(this.getMDEditor(), DANGERBOX);
        }
    },
    {
        name: 'icon-xuekegongshiku_Char-rm-uk',
        title: 'Katex',
        click: function () {
            containerClick(this.getMDEditor(), KATEX);
        }
    },
    {
        name: 'icon-liuchengtu',
        title: 'mermaid',
        click: function () {
            containerClick(this.getMDEditor(), MERMAID);
        }
    },
    {
        name: 'icon-flowChart',
        title: 'flowchart',
        click: function () {
            containerClick(this.getMDEditor(), FLOWCHART);
        }
    },
    {
        name: 'icon-swiper',
        title: 'swiper',
        click: function () {
            containerClick(this.getMDEditor(), SWIPER);
        }
    },
    {
        name: 'icon-excel',
        title: 'excel',
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
                    text: '\nexcel:https://sheetjs.com/pres.numbers\n'
                }
            ]);
        }
    },
    {
        name: 'icon-erweima',
        title: '二维码',
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
                    text: '\nqrcode:https://developer.mozilla.org/zh-CN/\n'
                }
            ]);
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
            // const [mdEditor, editor] = getEditors(this);
            // const result = mdEditor.getCurrentRange();
            // if (!validateSelect(result)) {
            //     return;
            // }
            // const [range] = result;
            // editor.executeEdits('', [
            //     {
            //         range,
            //         text: ':tada: :dog: :cat: '
            //     }
            // ]);
            const mdEditor = this.getMDEditor();
            const emojiDom = mdEditor.emojiDom;
            const iconDom = this.getDom();
            const display = checkDomDisplay(emojiDom);
            setTimeout(() => {
                setDomDisplay(emojiDom, display);
                updateDomPosition(iconDom, emojiDom);
            }, 32);
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
        name: 'icon-naotu',
        title: 'markmap',
        enable: false,
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
                    text: '\n[[markmap]]\n'
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
                    text: '\ninclude://mdpress.glicon.design/p/files/2023-09-03/t83dlckX52cWiNtzBHkOL.md\n'
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
    },
    {
        name: 'icon-icon-48-mulushu',
        title: '文件夹目录树',
        // enable: false,
        click: function () {
            const [mdEditor] = getEditors(this);
            const miniToastr = getToastr();
            if (mdEditor.dialog) {
                miniToastr.warn('检测到你已经打开了一个对话框请关闭当前的才可以使用', '警告', 3000);
                return;
            }
            const dialog = createFolderTreeDialog();
            mdEditor.dom.appendChild(dialog);
            dialog.show();
            mdEditor.dialog = dialog;
            const cancelBtn = dialog.querySelector('#table-btn-cancel');
            // const confirmBtn = dialog.querySelector('#table-btn-confirm');
            let fileDND;

            const close = () => {
                dialog.close();
                mdEditor.dialog = null;
                mdEditor.dom.removeChild(dialog);
                fileDND && fileDND.dispose();
            };
            on(cancelBtn, 'click', close);
            const fileContainer = dialog.querySelector('.file-dnd-container');
            if (fileContainer) {
                fileDND = new FileDND(fileContainer);
                fileDND.dnd((files) => {
                    // const tree = fileDND.toTree();
                    const text = fileDND.toFolderTree();
                    codeClick(this.getMDEditor(), '```\n' + text + '```\n');
                    close();
                });
            }
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
        name: 'icon-mulu1',
        title: '目录',
        position: 'right',
        click: function () {
            const mdEditor = this.getMDEditor();
            mdEditor.tocOpen = !mdEditor.tocOpen;
            mdEditor._checkTocState();
        }
    },
    {
        name: 'icon-pifuzhuti-xianxing',
        title: '主题',
        position: 'right',
        click: function () {
            const mdEditor = this.getMDEditor();
            const themeDom = mdEditor.themeDom;
            const iconDom = this.getDom();
            const display = checkDomDisplay(themeDom);
            setTimeout(() => {
                setDomDisplay(themeDom, display);
                updateDomPosition(iconDom, themeDom);
            }, 32);
        }
    },
    {
        name: 'icon-pos_nav_icon_implements',
        title: 'export file',
        position: 'right',
        click: function () {
            const mdEditor = this.getMDEditor();
            const exportFileDom = mdEditor.exportFileDom;
            const iconDom = this.getDom();
            const display = checkDomDisplay(exportFileDom);
            setTimeout(() => {
                setDomDisplay(exportFileDom, display);
                updateDomPosition(iconDom, exportFileDom);
            }, 32);
        }
    },
    {
        name: 'icon-yulan',
        title: '预览',
        position: 'right',
        click: function () {
            const mdEditor = this.getMDEditor();
            mdEditor.preview = !mdEditor.preview;
            mdEditor._checkPreviewState();
        }
    },
    {
        name: 'icon-quanping',
        title: '全屏',
        position: 'right',
        click: function () {
            const mdEditor = this.getMDEditor();
            checkFullScreen(mdEditor);
        }
    },
    {
        name: 'icon-heisemoshi',
        title: '暗黑模式',
        position: 'right',
        click: function () {
            const mdEditor = this.getMDEditor();
            mdEditor.dark = !mdEditor.dark;
            mdEditor._checkDark();
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
