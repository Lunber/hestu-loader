# 一个微信小程序的编译器
----

## 安装
```
npm install wechat-hestu-loader

```

## webpack.config
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.ht$/,
        loader: 'wechat-hestu-loader'
      }
    ]
  }
}
```

## 使用方式

### 最简单的姿势



```
require('./pages/index/index.mina')
```
在 app.js 中项目中引入之后会在根目录的 dist 文件夹下生成两份文件分别为 


```
/pages/index/index.wxml
/pages/index/index.wxss

```

比起返回 babel 转换过的 script 标签中的内容

### 关于语法
由于使用的是 vue-template-compiler 进行解析，所以语法基本与 vue-loader，相同

比如你想用 pug，那么在 template 标签中加入 `lang="pug"` 即可


### 高亮设置

将高亮设置为 vuecomponent 即可

### 配置项

dist: 前缀路径名
replace: 需要替换的路径名 如{src: ''}
mode: 小程序类型，默认为微信小程序。目前可传参数有```'wechat'```,```'baidu'```。

