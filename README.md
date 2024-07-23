# mdpress-editor

A simple markdown editor base [monaco-editor](https://github.com/microsoft/monaco-editor) and [markdown-it](https://github.com/markdown-it/markdown-it)

## Features

* Code highlighting. by [highlight.js](https://github.com/highlightjs/highlight.js) or [shiki](https://github.com/shikijs/shiki)
* [Code Group](https://vitepress.dev/guide/markdown#code-groups) support
* [Custom Container](https://vitepress.dev/guide/markdown#custom-containers) support
* [KateX](https://github.com/KaTeX/KaTeX) support
* [Mermaid](https://github.com/mermaid-js/mermaid) support
* [plantuml](https://plantuml.com/zh/) support
* [flowchart](http://flowchart.js.org/) support
* [Swiper](https://github.com/nolimits4web/swiper) support
* [Qrcode](https://github.com/davidshimjs/qrcodejs) support
* [github emoji](https://github.com/missive/emoji-mart) support
* toc support
* include a remote markdown file
* Multi theme support, theme from [juejin-markdown-themes](https://github.com/xitu/juejin-markdown-themes)
* export md, html, png files
* export [Markmap](https://github.com/markmap/markmap) support
* XLSX File view by [x-spreadsheet](https://github.com/myliang/x-spreadsheet) and [sheetjs](https://github.com/SheetJS/sheetjs/tree/master)
* support custom toolbar
* [Prettier](https://github.com/prettier/prettier) format support
* dark model support

## Install

### NPM

```sh
npm i mdpress-editor
#or
yarn add mdpress-editor

```

### CDN 

```html
<link rel="stylesheet" href="https://unpkg.com/mdpress-editor/index.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/mdpress-editor/dist/mdpress-editor.min.js"></script>
```

## Notes

* [highlight.js](https://github.com/highlightjs/highlight.js) is external you need:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
```

* It contains a large number of plugins

Considering the size of the packaging, so some plugin packages require you to dynamically register them

* [monaco-editor](https://github.com/microsoft/monaco-editor)
* [Prettier](https://github.com/prettier/prettier)
* [shiki](https://github.com/shikijs/shiki)
* [Swiper](https://github.com/nolimits4web/swiper)
* [Mermaid](https://github.com/mermaid-js/mermaid)
* [Qrcode](https://github.com/davidshimjs/qrcodejs)
* ....

When using these plugins, you need to inject the necessary plugin packages

```js
require(['vs/editor/editor.main'], function() {
    registerMonaco(monaco);
});

prettier.prettierPlugins = prettierPlugins;
registerPrettier(prettier);
...
```

* The icons from [iconfont](https://www.iconfont.cn/)

```html
<link rel="stylesheet" href="//at.alicdn.com/t/c/font_4227162_duj4njl0dzn.css" crossorigin="anonymous">
```

## Code highlighting

Built in [highlight.js](https://github.com/highlightjs/highlight.js)  as a Code highlighting tool. If you like [shiki](https://github.com/shikijs/shiki), you can register [shiki](https://github.com/shikijs/shiki) as a Code highlighting tool

## Themes

It is a standalone folder that requires you to manually copy when used in the project

you can:

* copy from `node-moudules/mdress-editor/theme`
* set theme url from cdn url when create  `MDEditor`

## Code format by Prettier

```html
<script src="./lib/prettier/standalone.js"></script>
<script src="./lib/prettier/plugins/acorn.js"></script>
<!-- <script src="./lib/prettier/plugins/angular.js"></script> -->
<script src="./lib/prettier/plugins/babel.js"></script>
<script src="./lib/prettier/plugins/estree.js"></script>
<!-- <script src="./lib/prettier/plugins/flow.js"></script> -->
<!-- <script src="./lib/prettier/plugins/glimmer.js"></script> -->
<!-- <script src="./lib/prettier/plugins/graphql.js"></script> -->
<script src="./lib/prettier/plugins/html.js"></script>
<script src="./lib/prettier/plugins/markdown.js"></script>
<!-- <script src="./lib/prettier/plugins/meriyah.js"></script> -->
<script src="./lib/prettier/plugins/postcss.js"></script>
<script src="./lib/prettier/plugins/typescript.js"></script>
<!-- <script src="./lib/prettier/plugins/yaml.js"></script> -->
```

[more info for prettier in browser](https://prettier.io/docs/en/browser)

## Use

```js
import 'mdpress-editor/index.css';
import {
    showLoading,
    hideLoading
} from 'mdpress-editor';
```

or

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/mdpress-editor/dist/mdpress-editor.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/mdpress-editor/index.css">

<script>
    mdpress.registerMonaco(window.monaco);
    mdpress.showLoading();
    mdpress.hideLoading();
    ...
</script>
```

## API

### getMarkdownIt

get [markdown-it](https://github.com/markdown-it/markdown-it) instance

```js
import {
    getMarkdownIt
} from 'mdpress-editor';
const md = getMarkdownIt();
md.use( /**you plugin**/ );
```

### themes

all theme list

```js
import 'mdpress-editor/index.css';
import {
    themes
} from 'mdpress-editor';
console.log(themes);
```

### showLoading

### hideLoading

```js
import {
    showLoading,
    hideLoading
} from 'mdpress-editor';
```

### registerMonaco   

[monaco-editor](https://github.com/microsoft/monaco-editor)

```js
     require(['vs/editor/editor.main'], function() {
         registerMonaco(window.monaco);
     });
```

### registerShikiHighlighter

 [shiki](https://github.com/shikijs/shiki)

```js
 shiki
     .getHighlighter({
         theme: 'material-theme-palenight',
         langs: languages
     })
     .then(highlighter => {
         registerShikiHighlighter(highlighter);
     });
```

### registerPrettier 

[Prettier](https://github.com/prettier/prettier)

```js
 prettier.prettierPlugins = prettierPlugins;
 registerPrettier(prettier);
```

### registerSwiper

 [Swiper](https://github.com/nolimits4web/swiper)

```js
   registerSwiper(Swiper);
```

### registerQRCode

 [Qrcode](https://github.com/davidshimjs/qrcodejs)

```js
registerQRCode(QRCode);
```

### registerMermaid 

[Mermaid](https://github.com/mermaid-js/mermaid)

```js
registerMermaid(mermaid);
```

### registerXLSX 

[sheetjs](https://github.com/SheetJS/sheetjs/tree/master)

```js
registerXLSX(XLSX);
```

### registerX_spreadsheet 

[x-spreadsheet](https://github.com/myliang/x-spreadsheet)

```js
registerX_spreadsheet(x_spreadsheet);
```

### registerFlowChart 

* [flowchart](http://flowchart.js.org/)

```js
registerFlowChart(flowchart);
```

### MDEditor  

Editor Core Object

#### constructor

```js
import {
    showLoading,
    hideLoading,
    MDEditor
} from 'mdpress-editor';

const mdEditor = new MDEditor(dom, {
    preview: true, //open preview model
    theme: 'vitepress',
    dark: false,
    themeURL: './../theme/', //theme files path
    themeCache: true, //open theme cache
    tocOpen: false, //open toc
    emojiURL: 'https://cdn.jsdelivr.net/npm/@emoji-mart/data',
    //monaco config
    monacoOptions: {
        language: 'markdown',
        value: '',
        automaticLayout: true
    },
    prettierOptions: {
        tabWidth: 4
    }
})
```

#### methods

  + setValue(value)

  

```js
   mdEditor.setValue('# hello \n ');
```

  + getValue()
  + getSelectText()
  

```js
   const [range, text] = mdEditor.getSelectText();
```

  + getSelectRange()
  

```js
   const [starRange, endRange] = mdEditor.getSelectRange();
```

  + getCurrentRange()
  

```js
   const [range] = mdEditor.getCurrentRange();
```

  + getIcons()

  

```js
  const icons = mdEditor.getIcons();
```

  + isPreview()
  + isFullScreen()
  + isToc()
  + isDark()
  + getContainer() `get eidtor container`
  + getEditor() `get monaco editor`

```js
   const monacoEditor = mdEditor.getEditor();
   monacoEditor.executeEdits('', [{
       range,
       text
   }]);
```

  + setTheme()

```js
  mdEditor.setTheme('vitepress');
```

  + getTheme()
  + openPreview()
  + closePreview()
  + openFullScreen()
  + closeFullScreen()
  + openToc()
  + closeToc()
  + openDark()
  + closeDark()

#### events

* openfullscreen
* closefullscreen
* openpreview
* closepreview
* themechange
* opentoc
* closetoc
* opendark
* closedark
* paste

```js
mdEditor.on('paste', e => {
    console.log(e);
    let files = e.clipboardData.files || [];
})
```

you can listen `paste` for get  files for upload images or other files

### ToolIcon

the icon for toolbar

#### constructor

```js
const icon = new ToolIcon({
    icon: 'icon-zitijiacu', //iconfont icon name
    title: '加粗',
    className: '', //custom className
    position: 'left' //the postion,left or right
});
icon.on('click', e => {
    console.log(e);
    const mdEditor = e.target.getEditor();
});
icon.addTo(mdEditor);
```

#### methods

* getDom()
* on(event, handler)

```js
icon.on('click', e => {
    console.log(e);
})
```

* getMDEditor() 
* addTo(mdEditor)
* remove()
* show()
* hide()
* isVisible()

#### example

 custom a toolicon for upload markdown file

```js
  function customIcons() {
      const data = {
          icon: 'icon-file-markdown1',
          title: '我是自定义按钮-导入markdown',
          className: 'red'
      }
      const icon = new ToolIcon(data);
      icon.addTo(mEditor);
      icon.on('click', () => {
          const parseMd = (file) => {
              const fileRender = new FileReader();
              fileRender.onload = () => {
                  if (mEditor && fileRender.result) {
                      mEditor.setValue(fileRender.result);
                  }
              };
              fileRender.readAsText(file);
          };
          const inputFile = document.createElement('input');
          inputFile.type = 'file';
          inputFile.accept = '.md';
          inputFile.addEventListener('change', () => {
              if (inputFile.files.length) {
                  parseMd(inputFile.files[0]);
              } else {
                  alert('没有发现上传文件');
              }
          });
          inputFile.click();
      })

  }
```
