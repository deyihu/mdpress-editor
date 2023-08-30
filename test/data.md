# mdedtor

**markdown editor base monaco**

hello world

```shell
npm i maptalks
```


## github emoji

:tada:  
:100:

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

## links

[Markdown 官方教程](https://markdown.com.cn/)

![Markdown 官方教程](https://markdown.com.cn/hero.png)

hello world

HELLO WORLD

地图是整个引擎里的核心，万物基于此，其是个非常复杂的对象，其组织结构如下
![](//mdpress.glicon.design/p/files/2023-08-02/hiQhsN4m4V6HbFNCOm6NH.png)
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
![](//mdpress.glicon.design/p/files/2023-08-02/YJKP-rMIuSnCSym6EDgQh.png)
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
