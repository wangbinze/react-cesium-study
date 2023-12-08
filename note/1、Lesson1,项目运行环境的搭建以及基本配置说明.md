## 项目运行环境的搭建
React + Cesium + craco + craco-cesium
```
const CracoCesiumPlugin = require("craco-cesium")
module.exports = {
  plugins: [
    { 
      plugin:CracoCesiumPlugin()
    }
  ]
};
```
具体相关可参考Cesium官网介绍：
[https://cesium.com/learn/cesiumjs-learn/cesiumjs-webpack/](https://cesium.com/learn/cesiumjs-learn/cesiumjs-webpack/)
## 项目运行

1. 需要在Cesium官网注册token，注册账号后可在Access Tokens 中获取

[https://ion.cesium.com/tokens?page=1](https://ion.cesium.com/tokens?page=1)
`Cesium.Ion.defaultAccessToken = "你的token";`
只有这样才能访问到地球

2. 渲染加载地球

`new Cesium.Viewer("dom id", {});`

3. 其他一些基本配置项，参考代码中的注释
## 文件目录结构
所有课程均在github 项目中，地址：[https://github.com/wangbinze/react-cesium-study](https://github.com/wangbinze/react-cesium-study)

对应方式为：
第一课 --> Lesson1
第二课 --> Lesson2
