# AMis 实用手册

## 先看一遍官网文档

* [快速开始](https://baidu.github.io/amis/docs/getting-started#jssdk)

  > 这是一个基于 React 框架的页面渲染器，有配置就能生成页面，配置是什么样的？请前往基本用法阅读。知道怎么配置后，就可以用以下方式用于自己的项目了。
  >
  > 如果你没有组件定制需求直接使用，而且不想折腾 React 相关的，我建议你直接用 JSSDK 用法。
* [基本用法](https://baidu.github.io/amis/docs/basic)和[高级用法](https://baidu.github.io/amis/docs/advanced)

  > 为了简化前端开发，amis Renderer 能够直接用配置就能将页面渲染出来。
* [API 说明](https://baidu.github.io/amis/docs/api)

  > amis 渲染器的数据都来源于 api，有一定的格式要求。
  >
  > 每个渲染的接口返回都有自己的格式要求，主要体现在 data 字段内部，具体请参考每个渲染的接口说明。
* [如何定制](https://baidu.github.io/amis/docs/sdk)和[自定义组件](https://baidu.github.io/amis/docs/dev)

  > 工作原理: amis 的渲染过程就是将 json 转成对应的 React 组件。先通过 json 的 type 找到对应的 Component 然后，然后把其他属性作为 props 传递过去完成渲染。
* [样式说明](https://baidu.github.io/amis/docs/style)

  > amis 中有大量的功能类 class 可以使用，即可以用在 schema 中，也可以用在自定义组件开发中，掌握这些 class, 几乎可以不用写样式。
  >
  > amis 中的样式基于 [Bootstrap V3](https://v3.bootcss.com/), 集成了 [Font Awesome](https://fontawesome.com/icons?d=gallery&m=free) 图标
* 所有的[示例](https://baidu.github.io/amis/pages/simple)和[渲染器](https://baidu.github.io/amis/docs/renderers)都快速过一遍
* 对 AMis 提供的能力要有大概的印象
  * 例如有哪些内置组件是可以配置出来的, 大概提供了什么功能
  * 有了印象就相当于在大脑中建立了索引, 这样当你遇到问题时可以快速在官方文档中找到想要的内容, 而不至于瞎猫乱撞, 在查找内容和确认 AMis 内置能力方面花很多时间
  * 使用官方文档提供的搜索功能, 可以让你快速找到想要的内容

## 适配接口的数据格式

amis 要求所有的接口都必须返回固定的数据格式, 当你的系统与之不符时, 需要在 `fetcher` 那做适配, 例如

```javascript
fetcher: function(api) {
    // 适配这种格式 {"code": 0, "message": "", "result": {}}
    return axios(config).then(response => {
        let payload = {
            status: response.data.code,
            msg: response.data.message,
            data: response.data.result
        };

        return {
            ...response,
            data: payload
        };
    });
}
```

参考
* [API 说明][API 说明]
* [issue#27](https://github.com/baidu/amis/issues/27)

## 通过 `adaptor` 来适配组件的数据规范

对于支持接口的组件(例如: [`CURD`][CRUD])对数据格式(即 `data` 字段内部)也是有规范的, 当你的系统与之不匹配时, 需要通过 `adaptor` 来做适配, 例如

* 方式一: 以 JSON 配置时, 可以使用字符串函数体格式

  ```json
  {
      "type": "crud",
      "api": {
          "url": "https://domain.com/list",
          "adaptor": "payload.data.items = payload.data.content; payload.data.total = payload.data.totalElements; return payload;"
      }
  }
  ```
* 方式二: 通过 JS 来配置为一个函数

  ```javascript
  {
      type: 'crud',
      api: {
          url: 'https://domain.com/list',
          adaptor: function(payload, response, api) {
              var data = payload.data;

              var _data = {
                  items: data.content,
                  total: data.totalElements
              };

              payload.data = _data;
              return payload;
          }
      }
  }
  ```

* 方式三: 由于通过 JSON 配置时, 只能使用字符串函数体格式, 写起来不方便, 而且每个地方都要这么写, 无法公共使用, 因此实现内置具名的 `adaptor` 就可以非常方便的配置了

  1. 在 fetcher 中实现内置的 `adaptor`

     ```javascript
     // fetcher: (fetcherConfig: any)

     // 通过给 adaptor 指定名称来自动适配组件接口规范
     var qsParam = new QsMan(url).getObject();
     var adaptorName = '';
     if (typeof fetcherConfig.adaptor === 'object') {
         adaptorName = fetcherConfig.adaptor.name;
         // 必须删掉, 否则会被当做真正的 adaptor 来执行, 我们其实只需要知道名字
         delete fetcherConfig.adaptor;
     } else if (qsParam._adaptor) {
         adaptorName = qsParam._adaptor;
     }

     return axios(url, config).then(function(response) {
         // 适配组件接口规范
         if (response.data.data) {
             // CRUD: https://baidu.github.io/amis/docs/renderers/CRUD#%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E
             // 实际中发现, CRUD 还支持 {rows:[],total:0} 这样的数据格式
             if (adaptorName === 'page-content') {
                 // 适配 data 的这种格式
                 // {
                 //     "content": [],
                 //     "totalElements": 0
                 // }
                 // 到 CRUD 要求的格式
                 // {
                 //     "item": [],
                 //     "total": 0
                 // }
                 response.data.data = {
                     items: response.data.data.content,
                     total: response.data.data.totalElements
                 };
            } else if (adaptorName === 'upload-image-data') {
                // 上传图片返回的数据需要适配成
                // {
                //     "value": "https://domain.com/a.png"
                // }
                response.data.data = {
                    value: response.data.data
                };
            }
         }
     };
     ```
  2. 在 `api` 中通过对象方式来指定 `adaptor` 的名字, 或者通过在 URL 中传入参数也可以, 例如 `_adaptor=xxx`, 主要是为了识别出来

     ```json
     {
         "type": "crud",
         "api": {
             "url": "https://domain.com/list",
             "adaptor": {
                 "name": "page-content"
             }
         }
     }
     ```

参考
* [Api 类型][Api 类型]

## 动态化 API 的 `url`

有些情况下, 例如切换不同的环境, 需要 API 的 `url` 是根据某些变量来动态拼接的

假设: `env.dev.api` 的值为 `https://dev.domain.com`

```json
{
    "label": "上传视频",
    "name": "videoUrl",
    "type": "file",
    "reciever": "${env.dev.api}/upload-video"
}
```

这样取值可以替换掉 `env.dev.api` 的值, 但被 URL 编码了, 最终 `url` 变成了: `https%3A%2F%2Fdev.domain.com/upload-video`

因此需要指定 `raw` 过滤器, 不使用默认的 `url_encode` 过滤器

```json
{
    "label": "上传视频",
    "name": "videoUrl",
    "type": "file",
    "reciever": "${env.dev.api | raw}/upload-video"
}
```

参考
* [amis/src/utils/api.ts#buildApi](https://github.com/baidu/amis/blob/94cbacef61cfacbd37f4d637253ea457b8066bb4/src/utils/api.ts#L82)
* [amis/src/utils/tpl-builtin.ts#tokenize](https://github.com/baidu/amis/blob/94cbacef61cfacbd37f4d637253ea457b8066bb4/src/utils/tpl-builtin.ts#L425)

## 给整个页面一些初始化的数据, 例如权限

通过配置 `page` 的 [`initApi`](https://baidu.github.io/amis/docs/renderers/Page#initapi), 可以让返回的数据在当前 page 渲染器, 以及所有孩子渲染器都能取到这个变量, 例如告诉前端是否有新增按钮的权限

```json
{
    "type": "page",
    "title": "页面的初始化数据",
    "body": "initApi 返回的数据: ${date}",
    "initApi": "https://houtai.baidu.com/api/mock2/page/initData?$"
}
```

注意由于配页坊会使用提示页面的 schema 先整体渲染一次 page, 走的 `componentDidMount`, 此时因为没有 `initApi` 所以不会去加载什么初始化数据.

待远端的 schema 加载回来 `setState` 之后, 会走 `componentDidUpdate`, 此时要让页面去加载 `initApi` 配置的初始化数据, 就必须通过 `isApiOutdated` 的判断条件, 因此在 `initApi` 中添加了一个 `$` 符号, 以达成这个条件去执行加载初始化数据的逻辑

参考
* [amis/src/renderers/Page.tsx#componentDidUpdate](https://github.com/baidu/amis/blob/bd5b6dd8400e2bb3b76720ebd0fb8f012664f869/src/renderers/Page.tsx#L158)

## 给表格添加搜索条件搜索按钮

通过 `filter` 给表格添加搜索条件, 就是添加一个 `Form` 上去

```json
{
    "type": "crud",
    "filter": {
        "title": "查询条件",
        "controls": [
            {
                "type": "text",
                "name": "title",
                "placeholder": "通过关键字搜索",
                "addOn": {
                    "label": "搜索",
                    "type": "submit"
                }
            }
        ],
        "actions": [
            {
                "type": "submit",
                "label": "查询",
                "primary": true
            },
            {
                "type": "reset",
                "label": "重置"
            }
        ]
    }
}
```

## 控制表格分页查询的参数名

表格分页查询的默认参数为
* `page: 1`
* `perPage: 10`

可以通过设置来改变参数的名称
* `pageField` 分页页码字段名
* `perPageField` 分页一页显示的多少条数据的字段名

参考
* [CRUD][CRUD]

## 格式化表格字段显示的内容

通过 `tpl` 类型用 JS 模板引擎来组织输出, 可用于实现格式化表格字段的内容, 例如

* 对于简单的没有逻辑的拼装, 直接用 `${xxx}` 字符串模版来完成, `${xxx.xxx.xxx}` 即使访问到空的值, 也不会报错

  ```json
  "columns": [
      {
          "label": "姓名",
          "name": "name",
          "type": "tpl",
          "tpl": "<span class='label label-default'>${name}</span>"
      }
  ]
  ```

  获取数组中的值时, 也需要使用 `.` 来取值, 例如: `${array.0.xxx}`

  通过 `${xxx}` 取到的值, 默认会做 html 转义, 也就是说 `${xxx}` 完全等价于 `${xxx | html}`, 如果不想转义, 那么请这么写 `${xxx | raw}`

  从这里看出, 取值时是支持指定 `filter` 的, 通过管道符 `|` 来使用, 已经内置了很多实用的 `filter`, 支持组合使用, 如果还是没有合适的, 可以通过 `registerFilter` 来自定义 `filter`

  调试时可以使用 `${& | json}` 来查看该行对应的数据
* 有逻辑处理的, 采用的 `lodash` 的 [`template`](https://lodash.com/docs/4.17.15#template) 语法

  ```json
  "columns": [
      {
          "label": "姓名",
          "name": "name",
          "type": "tpl",
          "tpl": "<% if (data.vip) { %><span class='label label-danger'>VIP</span><% } %><%= data.name %>"
      }
  ]
  ```

  其中的 `data` 为该行对应的数据

注意
* `${xxx}` 与 `<%= data.xxx %>` 这两种语法不能同时使用
* 可以通过 `${items}` 获取整个列表的数据

参考
* [Tpl][Tpl]

## 关于内置数据(全局数据)

有哪些数据可以用取决于在哪个容器, 会 merge 很多数据, 例如 api 返回的数据, 通过 `React Developer Tools` 查看 `Renderer` 可以在 `data` 上发现这些数据(以 `Table/Cell` 为例)
* `query`
* `index`
* `items`
* `page`
* `total`
* `selectedItems`
* `unSelectedItems`
* 一旦接口的 `data` 中也返回了这些字段, 值就会被覆盖, 因此只能做字段的适配

参考
* [数据作用域][数据作用域]

## 给表格字段增加详情弹框

通过 `popOver` 我们可以为某个表格字段增加一个放大按钮, 点击后弹出一个详情弹框, 例如

```json
"columns": [
    {
        "label": "视频链接",
        "name": "videoUrl",
        "popOver": {
            "title": "预览视频",
            "body": {
                "type": "video",
                "src": "${videoUrl}",
                "autoPlay": true,
                "rates": [1, 1.5, 2]
            }
        }
    }
]
```

参考
* [Field][Field]

## 弹框回调事件

通过配置 `dialog.onClose` 和 `dialog.onConfirm`, 可以分别在关闭弹框和确认弹框(表单提交成功)时加入自定义的逻辑

```json
{
    "body": {
        "label": "弹出弹框",
        "type": "button",
        "actionType": "dialog",
        "dialog": {
            "title": "弹框",
            "body": {
                "type": "form",
                "api": "https://houtai.baidu.com/api/mock2/form/saveForm?waitSeconds=1",
                "controls": [
                    {
                        "type": "text",
                        "name": "text",
                        "label": "文本"
                    }
                ]
            },
            "onClose": function() {
                alert('关闭弹框');
            },
            "onConfirm": function() {
                alert('提交成功');
            }
        }
    }
}
```

参考
* [amis/src/renderers/Dialog.tsx](https://github.com/baidu/amis/blob/bd5b6dd8400e2bb3b76720ebd0fb8f012664f869/src/renderers/Dialog.tsx#L57)
* [Button][Button]

## 表单回调事件

通过配置 `form.onFinished` 等一系列 `form.onXxx` 可以在表单回调时加入自定义的逻辑

```json
{
    "type": "page",
    "body": {
        "type": "form",
        "api": "https://houtai.baidu.com/api/mock2/form/saveForm?waitSeconds=1",
        "controls": [
            {
                "name": "email",
                "label": "Email",
                "type": "email",
                "description": "描述文字"
            },
            {
                "name": "text",
                "type": "text",
                "label": "Text",
                "required": true
            }
        ],
        "onSubmit": function() {
            alert('发送提交');
        },
        "onFinished": function() {
            alert('提交成功');
        }
    }
}
```

参考
* [amis/src/renderers/Form/index.tsx](https://github.com/baidu/amis/blob/bd5b6dd8400e2bb3b76720ebd0fb8f012664f869/src/renderers/Form/index.tsx#L92)

## 表格开启复选框用于做批量操作

* 配置 `bulkActions` 并加入到 `headerToolbar` 就可以开启复选框用于做批量操作

  ```json
  {
      "type": "crud",
      "api": "/list",
      "bulkActions": [
          {
              "label": "批量删除",
              "actionType": "ajax",
              "api": "/delete",
              "confirmText": "确定要批量删除吗?"
          }
      ],
      "headerToolbar": [
          "bulkActions"
      ]
  }
  ```
* 通过 `Table` 组件的 `itemCheckableOn`(未在官方文档中说明) 可以用表达式来决定这一行是否出现复选框

  ```json
  {
      "type": "crud",
      "api": "/list",
      "itemCheckableOn": "data.checkable",
      "bulkActions": [
          {
              "label": "批量删除",
              "actionType": "ajax",
              "api": "/delete",
              "confirmText": "确定要批量删除吗?"
          }
      ],
      "headerToolbar": [
          "bulkActions"
      ]
  }
  ```

参考
* [amis/src/renderers/Table.tsx#TableProps](https://github.com/baidu/amis/blob/965296f9c3714ec6368f55c8406d539f70f7c467/src/renderers/Table.tsx#L77)
* [amis/src/store/table.ts#checkable](https://github.com/baidu/amis/blob/13ae3a07c0f8014d690c93d37cc256dd9826ae8c/src/store/table.ts#L136)

## 上传文件相关

* `maxSize` 的单位为 `byte`, 因此如果要限制只能上传 `1KB` 的文件, 应该设置为 `"maxSize": 1024`, 如果要限制只能上传 `1MB` 的文件, 应该设置为 `"maxSize": 1048576`
* `file` 类型默认只允许上传纯文本, 可以设置 `"accept": "*"` 以允许上传任意文件, 或者也可以指定某种文件类型
* `image` 类型返回的数据格式是有规范的, 必须是 `{"data": {"value": "https://domain.com/a.png"}}`, 但是在文档中没有说明, 只是在 [issue#95](https://github.com/baidu/amis/issues/95) 中提到了
   * 当你的系统返回的数据格式与之不符时, 需要适配, `reciever` 参数是支持 `api` 格式的配置的, 但是在文档中没有说明, 只是在 [issue#259](https://github.com/baidu/amis/issues/259) 中提到 `1.0.3` 版本起就可以了
* `image` 的 `crop` 参数不仅支持设置 `aspectRatio`, 还支持 [Cropper.js](https://github.com/fengyuanchen/cropperjs) 的其他 `Options`
* 通过设置 `description`, 可以放一些说明文字

参考
* [File][File]
* [Image][Image]
* [amis/src/renderers/Form/Image.tsx#_send](https://github.com/baidu/amis/blob/01a8b8293a87655cfeabdeb16eb8d8e2f8bc4336/src/renderers/Form/Image.tsx#L773)
* [amis/src/renderers/Form/Image.tsx#buildCrop](https://github.com/baidu/amis/blob/01a8b8293a87655cfeabdeb16eb8d8e2f8bc4336/src/renderers/Form/Image.tsx#L286)
* [amis/src/renderers/Form/Item.tsx](https://github.com/baidu/amis/blob/13ae3a07c0f8014d690c93d37cc256dd9826ae8c/src/renderers/Form/Item.tsx)

## 表单项的验证

* 通过 `validations` 来设置表单字段的验证规则
* 可以扩展 `FormItem` 的 `validations` 验证规则
  * 例如想 `FormItem` 扩展出一个规则 `isPhone` 来验证是否为手机号码
  * 从现有的文档来看, 只能通过[自定义表单组件中的自定义验证器][自定义组件]来实现, 但仅仅为了扩充一个验证器规则就实现一个自定义组件, 似乎有点重了, [issue#493](https://github.com/baidu/amis/issues/493)
  * 后来查看了 [amis/src/utils/validations.ts#addRule](https://github.com/baidu/amis/blob/59528118082f707aad73a5cc24a4da7ec4505c88/src/utils/validations.ts#L211), 发现这个方法是用来扩展验证规则的, 但官方文档中没有提到
  * 使用方式如下

    ```javascript
    import {
        addRule
    } from 'amis';
    import {
        validations,
        validateMessages // 可用于覆盖默认的验证信息
    } from 'amis/lib/utils/validations';
    
    addRule('isPhone', function(values, value) {
        return validations.matchRegexp(values, value, /^1\d{10}$/);
    }, '请输入正确的手机号码');
    ```
* 支持后端接口做验证, 提示到前端, 必须返回 `status` 为 `422`

参考
* [FormItem][FormItem]
* [amis/src/utils/api.ts#responseAdaptor](https://github.com/baidu/amis/blob/94cbacef61cfacbd37f4d637253ea457b8066bb4/src/utils/api.ts#L168)
* [amis/src/store/form.ts#saveRemote](https://github.com/baidu/amis/blob/f65fc630ffda7a5780c0224d6bc48ec71330d247/src/store/form.ts#L243)

## 控制表单提交时的数据格式

* 默认会以 `POST` 方式提交表单数据, 一般格式为 `application/json`
* 设置 `dataType` 为 `form` 以提交 `application/x-www-form-urlencoded` 格式的数据

  ```json
  {
      "type": "form",
      "api": {
          "url": "https://domain.com/form",
          "dataType": "form"
      }
  }
  ```
* 当需要以 `GET` 方式提交数据时, 需要设置 `data` 为特殊的表达式以将表单的所有数据 mapping 过来, 还支持追加或者覆盖值

  ```json
  {
      "type": "form",
      "api": {
          "method": "get",
          "url": "https://domain.com/form",
          "data": {
              "&": "$$",
              "id": "${id | default:undefined}"
          }
      }
  }
  ```
* 需要多选数据按照传统模式提交, 例如: 批量选择和多选模式下的 `select` 组件
  * 默认提交过去的数据是以 `,` 组合在一起的字符串, 例如: `ids=1,2`
  * `post` 请求时希望按照传统的模式提交数据, 例如: `ids=1&ids=2`, 可以通过结合过滤器和设置 [`qsOptions` 的 `arrayFormat`](https://github.com/ljharb/qs#stringifying) 来解决

    ```json
    "api": {
        "method": "post",
        "url": "https://domain.com/form",
        "dataType": "form",
        "qsOptions": {
            "arrayFormat": "repeat"
        },
        "data": {
            "&": "$$",
            "ids": "${ids | split:,}"
        }
    }
    ```
  * `get` 请求时希望按照传统的模式提交数据, 可以通过结合过滤器和使用 `requestAdaptor` 来解决

    ```json
    "api": {
        "method": "get",
        "url": "https://domain.com/form",
        "data": {
            "&": "$$",
            "ids": "${ids | split:,}"
        },
        "requestAdaptor": "api.url = api.url.replace(/\\[\\d\\]/g, '')"
    }
    ```

参考
* [amis/src/utils/api.ts#wrapFetcher](https://github.com/baidu/amis/blob/94cbacef61cfacbd37f4d637253ea457b8066bb4/src/utils/api.ts#L175)
* [amis/src/utils/api.ts#buildApi](https://github.com/baidu/amis/blob/94cbacef61cfacbd37f4d637253ea457b8066bb4/src/utils/api.ts#L41)
* [amis/src/utils/tpl-builtin.ts#dataMapping](https://github.com/baidu/amis/blob/94cbacef61cfacbd37f4d637253ea457b8066bb4/src/utils/tpl-builtin.ts#L476)
* [Api 类型][Api 类型]

## 控制表单的底部按钮

* 单独使用表单时, 是配置 `form` 的 `actions` 来控制表单的底部按钮

  ```json
  {
      "type": "page",
      "title": "独立表单",
      "body": {
          "type": "form",
          "title": "独立表单",
          "controls": [
              {
                  "label": "文本",
                  "name": "text",
                  "type": "text"
              }
          ],
          "actions": [
              {
                  "label": "提交",
                  "type": "submit"
              }
          ]
      }
  }
  ```
* **当在弹框中使用表单时, 配置在 `form` 上的 `actions` 会被忽略**, `dialog` 默认会有【取消】和【确认】这两个按钮, 可以通过配置 `dialog` 的 `actions` 来控制弹框的底部按钮
  ```json
  {
      "type": "page",
      "title": "弹框中的表单",
      "body": {
          "label": "弹个表单",
          "type": "button",
          "actionType": "dialog",
          "dialog": {
              "actions": [
                  {
                      "label": "dialog.actions",
                      "type": "submit"
                  }
              ],
              "body": {
                  "type": "form",
                  "title": "独立表单",
                  "controls": [
                      {
                          "label": "文本",
                          "name": "text",
                          "type": "text"
                      }
                  ],
                  "actions": [
                      {
                          "label": "form.actions",
                          "type": "submit"
                      }
                  ]
              }
          }
      }
  }
  ```

参考
* [Dialog][Dialog]

## 新增和修改共用一套表单

* 列表的新增行数据表单和修改行数据表单基本上一致的
* 新增的时候, 一般就是一个全新的表单, 不需要填入初始数据
* 修改的时候, 一般会通过接口重新拉取一下单条数据作为表单的初始数据, 还可能限制某些字段不能修改(例如: ID)
* 如果新增和修改分开配置的话, 就需要配置 2 个表单, 当需要调整时, 就需要调整 2 个地方
* 可以通过 `definitions` 来定义当前页面公共的配置项(可以理解为 snippet), 通过 `$ref` 来引用以达到共用一套表单的目的

例如:
* 通过 `definitions` 定义好表单, 根据是否有 `id` 来决定拉取初始数据
* 通过 `$ref` 来引用这个表单
  ```json
  {
      "definitions": {
          "createOrUpdateForm": {
              "body": {
                  "type": "form",
                  "initApi": "/get/${id}",
                  "initFetchOn": "data.id",
                  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
                  "controls": [
                      {
                          "name": "id",
                          "type": "hidden"
                      },
                      {
                          "label": "标题",
                          "name": "text",
                          "type": "text",
                          "required": true
                      }
                  ]
              }
          }
      },
      "type": "page",
      "title": "新增和修改共用一套表单",
      "toolbar": [
          {
              "type": "button",
              "actionType": "dialog",
              "label": "新增",
              "dialog": {
                  "title": "新增",
                  "$ref": "createOrUpdateForm"
              }
          }
      ],
      "body": {
          "type": "crud",
          "api": "https://houtai.baidu.com/api/mock2/crud/list",
          "columns": [
              {
                  "label": "ID",
                  "name": "id"
              },
              {
                  "label": "标题",
                  "name": "text",
                  "type": "text"
              },
              {
                  "type": "operation",
                  "label": "操作",
                  "buttons": [
                      {
                          "type": "button",
                          "actionType": "dialog",
                          "label": "修改",
                          "dialog": {
                              "title": "修改",
                              "$ref": "createOrUpdateForm"
                          }
                      }
                  ]
              }
          ]
      }
  }
  ```

注意: `definitions` 中定义的表单, 必须先是 `body` 这一层

参考
* [Definitions][Definitions]

## 选项全选

* `select` 设置为多选模式时, 通过 `checkAll` 可以开始全选功能
  ```json
  {
      "label": "选项表单",
      "name": "select",
      "type": "select",
      "multiple": true,
      "checkAll": true
  }
  ```

* `checkboxes` 通过 `checkAll` 可以开始全选功能
  ```json
  {
      "label": "复选框组",
      "name": "checkboxes",
      "type": "checkboxes",
      "checkAll": true
  }
  ```

参考
* [Select][Select]
* [Checkboxes][Checkboxes]



[Api 类型]: https://baidu.github.io/amis/docs/renderers/Types#api
[API 说明]: https://baidu.github.io/amis/docs/api
[自定义组件]: https://baidu.github.io/amis/docs/dev
[数据作用域]: https://baidu.github.io/amis/docs/advanced#%E6%95%B0%E6%8D%AE%E4%BD%9C%E7%94%A8%E5%9F%9F
[Definitions]: https://baidu.github.io/amis/docs/renderers/Definitions
[FormItem]: https://baidu.github.io/amis/docs/renderers/Form/FormItem
[File]: https://baidu.github.io/amis/docs/renderers/Form/File
[Image]: https://baidu.github.io/amis/docs/renderers/Form/Image
[Select]: https://baidu.github.io/amis/docs/renderers/Form/Select
[Checkboxes]: https://baidu.github.io/amis/docs/renderers/Form/Checkboxes
[CRUD]: https://baidu.github.io/amis/docs/renderers/CRUD
[Field]: https://baidu.github.io/amis/docs/renderers/Field
[Tpl]: https://baidu.github.io/amis/docs/renderers/Tpl
[Dialog]: https://baidu.github.io/amis/docs/renderers/Dialog
[Button]: https://baidu.github.io/amis/docs/renderers/Form/Button