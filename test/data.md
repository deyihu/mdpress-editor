# mdpress-editor

**markdown editor base monaco and markdown-it**

[[toc]]

## flowchart


::: flowchart

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

## UML

### 时序图 
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: Another authentication Response
@enduml


### 用例图

@startuml
:First Actor:
:Another\nactor: as Man2
actor Woman3
actor :Last actor: as Person1
@enduml

### 类图

@startuml
abstract        abstract
abstract class  "abstract class"
annotation      annotation
circle          circle
()              circle_short_form
class           class
class           class_stereo  <<stereotype>>
diamond         diamond
<>              diamond_short_form
entity          entity
enum            enum
exception       exception
interface       interface
metaclass       metaclass
protocol        protocol
stereotype      stereotype
struct          struct
@enduml

### 对象图

@startuml
object Object01
object Object02
object Object03
object Object04
object Object05
object Object06
object Object07
object Object08

Object01 <|-- Object02
Object03 *-- Object04
Object05 o-- "4" Object06
Object07 .. Object08 : some labels
@enduml


<!-- ## excel test

excel:https://sheetjs.com/pres.numbers -->

## qrcode test


qrcode:http://www.baidu.com
---
qrcode:http://www.baidu.com



## syntax higilight

```js

let shikiHighlighter;
export function registerShikiHighlighter(highlighter) {
    shikiHighlighter = highlighter;
}

export function getShikiHighlighter() {
    return shikiHighlighter;
}

let monaco;
export function registerMonaco(monacoObj) {
    monaco = monacoObj;
}

export function getMonaco() {
    return monaco;
}

let hlsjs;
export function registerHightLight(hls) {
    hlsjs = hls;
}

export function getHightLight() {
    return hlsjs;
}


```

```shell
npm i maptalks
```

```java
Class.forName(driverClass)
//加载MySql驱动
Class.forName("com.mysql.jdbc.Driver")
//加载Oracle驱动
Class.forName("oracle.jdbc.driver.OracleDriver")

```

## task list test

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media


## github emoji

:tada:  
:100:
:+1:
:dog:
:grin:
:laughing:
:neutral_face:
:money_mouth_face:
:cat:
:bug:
🙃 🐵 🐒 🐱 🐈 🦁 🐯 🐅 🐆 🐄 🐫 🐐 🐗 🐷 🌶️ 🍞 🍗 🌯 🍖 🧇 🍞 🥬 🍅 🍍 🍎 🎃 🎇 🎖️ 🏐 🏒 🏓


## include markdown

include:./snip.md

## container

::: info

This is an info box.

:::

::: tip

This is a tip.

:::

::: warning

This is a warning.

:::

::: danger

This is a dangerous warning.

:::

::: details Click me to view the code

```js
console.log('Hello, VitePress!')
```

:::

::: code-group

```js [add.js]
function add(a, b){

    return a+b;

}
console.log(add(1, 2)); 

```

```ts [add.ts]
function add(a:number,b:number):number{
    return a+b;
}
console.log(add(1,2));
```

:::

## ketex

$\sqrt{3x-1}+(1+x)^2$


$$\begin{array}{c}

\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &
= \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} & = 4 \pi \rho \\

\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} & = \vec{\mathbf{0}} \\

\nabla \cdot \vec{\mathbf{B}} & = 0

\end{array}$$



::: katex

\sqrt{3x-1}+(1+x)^2

:::

## mermaid

::: mermaid

flowchart LR

    A[Hard] -->|Text| B(Round)
    B --> C{Decision}
    C -->|One| D[Result 1]
    C -->|Two| E[Result 2]
    

:::

::: mermaid
pie

    title 为什么总是宅在家里？
    "喜欢宅" : 15
    "天气太热或太冷" : 20
    "穷" : 500

:::

::: mermaid
sequenceDiagram    
participant User    
participant System    
User->>System: 发送请求    
System->>User: 返回响应 

:::

::: mermaid
stateDiagram
[*] --> 暂停
    暂停 --> 播放
    暂停 --> 停止
    播放 --> 暂停
    播放 --> 停止
    停止 --> [*] 

:::

::: mermaid
gantt
title 甘特图示例
dateFormat  YYYY-MM-DD
section 项目A    
任务1           :a1, 2023-05-01, 10d    
任务2           :after a1  , 20d
section 项目B    
任务3           :2023-05-15  , 12d    
任务4           :2023-05-20  , 10d

:::

::: mermaid
classDiagram
class Animal {
        +name: string
        +age: int
        +eat(food: string): void
    }

class Dog {
        +sound: string
        +bark(): void
    }

class Cat {
        +climb(): void
    }

    Animal <|-- Dog
    Animal <|-- Cat

:::

## swiper


::: swiper

<div class="swiper">
  <!-- Additional required wrapper -->
  <div class="swiper-wrapper">

    <!-- Slides -->
    <div class="swiper-slide">
       <img src="https://mdpress.glicon.design/p/files/2023-09-19/_97Umejwi3DfuOlGYg7iE.jpg"/>
    </div>
    <div class="swiper-slide">
      <img src="https://mdpress.glicon.design/p/files/2023-09-19/Viaaga99bu_9v4OGJ-Idk.jpg"/>
   </div>
    <div class="swiper-slide">
      <img src="https://mdpress.glicon.design/p/files/2023-09-19/ttkWmxXd0mjrhQp1k195D.jpg"/>
   </div>
    <div class="swiper-slide">
      <img src="https://mdpress.glicon.design/p/files/2023-09-19/GmZdx5wpsgF-wcl1AO2ec.jpg"/>
   </div>
    <div class="swiper-slide">
      <img src="https://mdpress.glicon.design/p/files/2023-09-19/87hQUHXwwa77rhPaWQORV.jpg"/>
   </div>
  </div>
  <!-- If we need pagination -->
  <div class="swiper-pagination"></div>

</div>

:::

## links

[Markdown 官方教程](https://markdown.com.cn/)

![Markdown 官方教程](//mdpress.glicon.design/p/files/2023-09-26/Y_Ys6nU4FzFso9D4hIXUO.png)

hello world

HELLO WORLD

地图是整个引擎里的核心，万物基于此，其是个非常复杂的对象，其组织结构如下
![](https://mdpress.glicon.design/p/files/2023-08-02/hiQhsN4m4V6HbFNCOm6NH.png)
* 一个地图上可以多个图层
* 每个图层里有多个图形数据
* 地图上加些UI元素, 比如气泡和弹窗等

地图提供的是全局性的功能和模块，主要包括
* 图层管理
* 视角控制
* 空间投影控制和切换
* 坐标转换
* 事件的派发和传递
* 天空盒
* 地形
* 绘制元素
* UI元素的添加和删除

所以当我们业务里需要这些功能的时候，应该从地图入手如不是从图层等去思考, 比如有的同学使用 [maptalks.three](https://github.com/maptalks/maptalks.three)插件时，受threejs的影响，老是想着操作 `ThreeLayer` 图层里的相机来控制地图，这是不对的，因为 `ThreeLayer` 仅仅是一个图层而已，一个地图上可以有多个图层，如果图层可以控制地图的视角，那么多个图层同时都操作地图相机视角就会导致地图收到多条视角改变指令，从而导致紊乱

## 地图的组成

虽然地图是个复杂的对象，但是其也是有规律的，其主要包括三大要素
* 配置选项

```js
 //map.options
 //读取配置属性的值
 const centerCross = map.options.centerCross;

 //修改地图配置信息,可以使用config方法
 map.config({
     centerCross: true
 })
```

* 方法

```js
map.addLayer(layer);
map.removeLayer(layer)
map.getLayer(layerid);
//.....
```

* 事件

```js
const mapClickFunc = (e) => {
    //do somethings
};
//添加事件监听
map.on('click', mapClickFunc)
//移除事件监听
map.off('click', mapClickFunc)
//添加事件监听,有且仅有一次，第一次触发后就不会触发了
map.once('click', mapClickFunc)
```

## 关于地图的创建和销毁

### 地图的创建

我们创建地图一般都是

```js
var map = new maptalks.Map("map", {
    center: [180, 0],
    zoom: 4
});
```

<iframe src="https://microget-1300406971.cos.ap-shanghai.myqcloud.com/maptalks-study/map/hello.html"></iframe>

但是有的同学喜欢将地图封装成组件，尤其在vue项目里，这时要注意，因为组件是多例的，所以创建地图是不能把地图容器的dom(上面代码里的 `map` )写死了  
地图创建时也是支持传入dom节点对象的，不仅仅是domid

```js
var map = new maptalks.Map(document.getElementById('map)', {
            center: [180, 0],
            zoom: 4
        });
```

在vue里组件化我们可以借助ref来动态传入地图创建时的dom节点

```js
var map = new maptalks.Map(this.$refs.map, {
    center: [180, 0],
    zoom: 4
});
```

### 地图的销毁

```js
map.remove();
```

当一个地图不在使用了，要记得将其销毁，尤其是vue等现代化开发的SPA项目，否则路由的切换会不断的创建地图，从而导致页面崩了.

**地图是个非常复杂的对象，非常吃资源, 不断的创建和销毁也不是个好的方法**
建议的做法：
将地图创建为个全局变量或者dom元素，路由等切换只是改变页面的非地图模块和要素
![](https://mdpress.glicon.design/p/files/2023-08-02/YJKP-rMIuSnCSym6EDgQh.png)
比如这样的一个页面，路由切换的仅仅切换地图上面的菜单和面板等, 而地图是独立的元素，是不包含在路由里的

* 路由切换时只切换非地图的东西
* 切换路由时利用地图的方法动态切换地图上的要素，比如图层的动态添加和删除，地图视角等的改变，千万不要去随随便便的创建一个新的地图
* 代码设计层面

```html
  <!--地图容器，不把其放到路由里-->
  <div class="map" id="map">
      <h1>Hello App!</h1>
      <p>
          <!--使用 router-link 组件进行导航 -->
          <!--通过传递 `to` 来指定链接 -->
          <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
          <router-link to="/">Go to Home</router-link>
          <router-link to="/about">Go to About</router-link>
      </p>
  </div>
  <!--路由容器-->
  <router-view></router-view>
```


## Features

* Code highlighting. by [highlight.js](https://github.com/highlightjs/highlight.js) or [shiki](https://github.com/shikijs/shiki)
* [Code Group](https://vitepress.dev/guide/markdown#code-groups) support
* [Custom Container](https://vitepress.dev/guide/markdown#custom-containers) support
* [KateX](https://github.com/KaTeX/KaTeX) support
* [Mermaid](https://github.com/mermaid-js/mermaid) support
* [plantuml](https://plantuml.com/zh/) support
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
    //monaco config
    monacoOptions: {
        language: 'markdown',
        value: '',
        automaticLayout: true
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
* getEditor() 
* addTo(mdEditor)
* remove()

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
