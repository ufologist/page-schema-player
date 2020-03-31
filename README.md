# 配页坊: 简称配方 - 为配置页面而生, 专注于配置后台页面

[![Build Status][ci-status-image]][ci-status-url] [![Known Vulnerabilities][vulnerabilities-status-image]][vulnerabilities-status-url] [![changelog][changelog-image]][changelog-url] [![license][license-image]][license-url]

[vulnerabilities-status-image]: https://snyk.io/test/npm/page-schema-player/badge.svg
[vulnerabilities-status-url]: https://snyk.io/test/npm/page-schema-player
[ci-status-image]: https://travis-ci.com/ufologist/page-schema-player.svg?branch=master
[ci-status-url]: https://travis-ci.com/ufologist/page-schema-player
[license-image]: https://img.shields.io/github/license/ufologist/page-schema-player.svg
[license-url]: https://github.com/ufologist/page-schema-player/blob/master/LICENSE
[changelog-image]: https://img.shields.io/badge/CHANGE-LOG-blue.svg?style=flat-square
[changelog-url]: https://github.com/ufologist/page-schema-player/blob/master/CHANGELOG.md

基于 [amis-admin](https://github.com/fex-team/amis-admin) 提供以配置的方式快速搭建(后台)页面的能力, 释放前端人力, 提升整体人效

名字灵感来源: [《长安十二时辰》, 长安一百零八坊](https://baike.baidu.com/tashuo/browse/content?id=7a42871d4821ddfd79e93fa8)

> 坊，先秦开始称“里”“闾”“闾里”，是中国古代城市居住区组织的基本单位，南北朝开始出现“坊”的称呼，隋朝开始正式改称“坊”，唐代里、坊称呼互相使用，长安城以坊为基本单位的格局称为“里坊制”。

试一试 [Playground](https://ufologist.github.io/page-schema/_demo/index.html)

![page-schema-playground](https://user-images.githubusercontent.com/167221/77224470-ef2f1100-6ba0-11ea-8506-358c6c30e357.gif)

## [为什么发起配页坊项目?](./context.md)

## 哪些页面可以配置出来?

可以毫不谦虚地说, 任何页面都可以"配置"出来. 当然了, 这背后主要是感谢 [百度 AMis](https://baidu.github.io/amis "前端低代码框架") 提供的配置化能力, 我们主要是应用这个能力, 快速服务于业务, 体现出技术的价值.

> 前端低代码框架，通过 JSON 配置就能生成各种后台页面。
> 
> 目前在百度大量用于内部平台的前端开发，已有 100+ 部门使用，创建了 1.2w+ 页面。

基于 AMis 的特点, 适合使用的场景有
* 各种 PC 端后台系统
* 列表(增删改查), 弹窗, 表单(**支持联动**)

## 运作原理

* 本仓库可以理解为是一个**根据页面配置信息来渲染页面的播放器**, 即该项目名字的由来: `page-schema-player`
* 类似于视频播放器, 读取视频文件(例如 `video.mp4`), 然后播放(渲染)视频
* `page-schema-player` 则是加载远程的页面配置文件, 例如 [https://ufologist.github.io/page-schema/_demo/crud-load-once.json](https://ufologist.github.io/page-schema/_demo/crud-load-once.json), 然后根据这个配置信息[将页面渲染出来](https://ufologist.github.io/page-schema-player/index.html?_schema=https%3A%2F%2Fufologist.github.io%2Fpage-schema%2F_demo%2Fcrud-load-once.json)

```
https://ufologist.github.io/page-schema-player/index.html?_schema=https://ufologist.github.io/page-schema/_demo/crud-load-once.json
---------------------------------------------------------         -----------------------------------------------------------------
                            ↓                                                                     ↓
                 page-schema-player 页面的 URL                                              页面配置文件的 URL
```

![page-schema-player](https://user-images.githubusercontent.com/167221/77226063-4688ad80-6bb0-11ea-9eaf-fb79cfafa045.png)

## 快速开始

* clone `page-schema-player` 项目以定制功能和做私有化部署

  > `git clone https://github.com/ufologist/page-schema-player.git`
* 启动 `page-schema-player` 项目

  > ```
  > npm install
  > npm start
  > ```

  例如: `http://localhost:8080`
* [快速开始 `page-schema` 项目](https://github.com/ufologist/page-schema#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)

## 文件详解

```
page-schema-player/
|── src/
|   |── index.html               - 页面
|   |── index.tsx                - 应用的入口
|   |
|   |── app/                     - 应用的主逻辑
|   |   |── App.tsx              - 加载 schema 转交给 AMisRenderer 来渲染页面
|   |   |── AMisRenderer.tsx     - AMis 渲染器完成页面的渲染
|   |   |── info-page-schema.ts  - 封装提示页的 schema
|   |   |── load-schema.ts       - 加载 schema 文件
|   |   └── polyfill.tsx         - ES2015 的一些 polyfill
|   |
|   └── ext/                     - 应用的扩展逻辑
|       |── amis-components/     - 用于放置 AMis 自定义组件
|       |   └── Demo.tsx
|       |
|       |── theme.less           - 覆盖 AMis 的样式, 用于定制皮肤
|       |── get-default-mode.ts  - 获取默认的环境模式(实现自动识别的规则)
|       |── is-in-white-list.ts  - 加载 schema 文件的白名单规则
|       |── adapt-response.ts    - 适配各种接口到 AMis 标准的接口规范
|       |── validations.ts       - 扩展验证规则
|       |── renderer-defaults.ts - 用于覆盖 AMis 组件的一些默认值
|       └── util.ts              - 工具函数
└── ...
```

## 内置功能

除了 AMis 自带的功能, `page-schema-player` 主要在应用层面封装了很多实用功能

* [启动屏(骨架屏) loading 效果](./src/index.html)
* 支持[自动识别环境模式](./src/ext/get-default-mode.ts), 或者通过 URL 的 `_mode` 参数指定环境模式(例如 dev/test/stage/production)
* 通过 URL 的 `_schema` 参数[加载页面的配置信息](./src/app/load-schema.ts), 支持[白名单机制](./src/ext/is-in-white-list.ts)
* [页面级错误提示](./src/app/info-page-schema.ts), 例如 `_schema` 加载失败
* 将页面配置的 `title` 作为浏览器页面的标题
* [优化 HTTP 接口的错误提示](./src/app/AMisRenderer.tsx), 源自 [standard-http-client](https://github.com/ufologist/standard-http-client)
* [预留定制皮肤](./src/ext/theme.less)
* [预留扩展验证规则](./src/ext/validations.ts)
* [预留覆盖 AMis 组件的一些默认值](./src/ext/renderer-defaults.ts)
* 优化了 [webpack 构建配置](./webpack.config.js), 避免了一些坑
* 可实现内置[具名的 `adaptor`](./src/ext/adapt-response.ts), 例如通过 `filter:` 基于过滤器来适配数据, 使用方法为在 `api` 中配置或者在 URL 参数中指定内置 `adaptor` 的名称
  * 在 `api` 中配置

    ```json
    "api": {
        "url": "/list",
        "adaptor": {
            "name": "your_adaptor_name"
        }
    }
    ```
  * 在 `api.url` 参数中指定: `_adaptor=your_adaptor_name`
* [实现未登录处理器](./src/ext/adapt-response.ts): 当发现接口返回某种状态时, 就重定向到某个页面. 使用方法为在 `api` 中配置 `_unauthorized` 或者在 URL 参数中指定内置 `_unauthorized` 处理器的名称
  * 在 `api` 中配置 `_unauthorized`, 支持多种方式
    * 方式1: 指定内置处理器的名字(`handler: 'xxx'`), 例如只需要指定未登录处理器的名字为 `demo`, 那么只要接口遇到 `401` 的状态码, 就自动跳转到某个统一登录页
    * 方式2: 指定方法完全自定义逻辑(`handler: function(result)`)
    * 方式3: 指定状态码(`status`)和重定向页面(`redirectUrl`)以及重定向参数的名称(`redirectParamName`)

    ```json
    // 最简单的方式, 通过字符串来指定内置未登录处理器的名字
    "api": {
        "_unauthorized": "demo"
    }

    // 当指定方法时, 则可以完全自定义逻辑
    "api": {
        "_unauthorized": function(result) {
            alert('在这里实现判断未登录的逻辑, 并完成后续动作');
        }
    }

    // 当使用对象来指定时, 则设置 `handler` 属性, 也是支持字符串或者方法
    "api": {
        "_unauthorized": {
            "handler": "demo"
        }
    }

    // 当使用对象来指定时, 可以通过设置 status, redirectUrl, redirectParamName 属性来自定义重定向
    // 即当接口返回的状态为 status 时, 重定向到 redirectUrl, 重定向时会将当前页面的 URL 传给 redirectParamName 指定的那个参数
    "api": {
        "_unauthorized": {
            "status": 401,
            "redirectUrl": "//github.com/ufologist",
            // "redirectUrl": "${_env.api}", // redirectUrl 支持使用变量, 会传入 `_env` 数据
            "redirectParamName": "redirect_uri"
        }
    }
    ```
  * 在 `api.url` 参数中指定: `_unauthorized=your_unauthorized_name`
* 在 `window.amisEnv` 上暴露了 AMis 的内部方法, 方便在外部场景中需要时使用(例如弹一个 `notify` 或者发一个 HTTP 请求)
  ```javascript
  amisEnv.notify('error', '内容');
  amisEnv.alert('内容', '标题');
  amisEnv.confirm('内容', '标题').then(function(confirm) {
      if (confirm) {
          alert('确定');
      } else {
          alert('取消');
      }
  });
  amisEnv.copy('内容');
  amisEnv.fetcher({
      method: 'get',
      url: 'https://houtai.baidu.com/api/mock2/saveForm?waitSeconds=2'
  }).then(function(response) {
      console.log('fetcher', response);
  });
  ```

为了方便使用, [内置了一些全局数据](./src/app/App.tsx), 可以在页面的配置中使用这些值, 具体请参考[数据作用域](https://baidu.github.io/amis/docs/advanced#%E6%95%B0%E6%8D%AE%E4%BD%9C%E7%94%A8%E5%9F%9F)
* `_qsParams`: URL 上的参数
* `_definitions`: 页面配置文件中定义的 `definitions` 字段
* `_env`: 根据 `_mode` 匹配出页面配置文件中定义的 `definitions.env`, 即 `_mode=dev` 则获取到的是 `definitions.env.dev`

例如
* 在内容中使用

  ```json
  {
      "title": "使用内置的全局数据",
      "body": "${_qsParam._schema}"
  }
  ```
* 在 `api` 的 url 中使用

  ```json
  "api": {
      "url": "${_env.api | raw}/list",
  }
  ```

## 如何自定义组件?

* [实现自定义组件的说明文档](https://baidu.github.io/amis/docs/dev)
* 将自定义组件放置在 `src/ext/amis-components` 目录下

## 构建部署

```
npm run build
```

最终你只需要将 `dist` 目录下的所有文件部署到服务器上就可以了, 例如做为静态资源上传到阿里云 OSS.

## [FAQ](./faq.md)