# FAQ

收集整理自向好友 ant "安利"配页坊时的一些聊天记录和一些常见的问题答疑

## 为什么要使用配页坊?

使用配页坊之后, 针对简单的页面和增删改查以及表单这类模式化的页面, 可以不需要写代码, 单凭一个 JSON 配置文件就可以配置出一整个页面

## 开发出配页坊大概花了多长的时间?

从想法到可应用, 前前后后差不多花了 3 周左右的时间
* 第 1 周: 技术调研 + 概要设计
* 第 2 周: MVP
* 第 3 周: 可应用 + 完善文档 + 出品

## 是什么动力驱使你开发出配页坊的?

主要是因为工程师文化吧. 我理解的工程师文化的主要核心就是[工具文化](https://36kr.com/p/146507 "以Facebook为案例剖析科技公司应有的工具文化"), 永不停歇地折腾: 善用工具提升效率, 工具化一切重复劳动, 自动化一切能够自动化的

> Facebook对于内部工具（Tools）是非常非常关注的。公司要把最好的人才放到工具开发那一块，因为工具做好了，可以达到事半功倍的效果，所有人的效率都可以得到提高，而不仅仅是工程师。
>
> Facebook有两个工具组。一个叫研发工具组（Dev Tools），专门负责研发工具的开发和维护，所有有助于工程师开发速度和质量的工具，主要服务对象是内部工程师。另外一个叫网站支持和工具组（Site Support and Tools），主要负责公司里面所有的通用工具的开发和维护，关注的主要是方便用户和Facebook的交流以及Facebook内部的沟通，主要都是通讯工具，服务对象是用户和所有员工。

带头保持对技术的觉察和兴趣, 开发出提效的工具也能让大家从繁琐的重复劳动中解脱出来, 以便有更多的时间做更有价值的事情, 更多地去思考业务, 关注核心流程和未来规划. 而不会因为琐事耗尽了时间和精力, 以至于对其他的事情已经有心无力

## `page-schema-player` 和 `page-schema` 这两个项目的关系是怎么样的?

做个通俗的比喻: `page-schema-player` 项目就好比视频播放器, `page-schema` 项目就好比一个个视频文件(例如 video.mp4)
* 因此 `page-schema-player` 项目是相对稳定的(内置了 AMis 官方组件), 针对简单的需求, 不需要太多地关注 `page-schema-player` 项目, 你只需要关注 `page-schema` 项目, 写好页面的配置文件, 然后"提供"给 `page-schema-player` 项目去"播放"就好了. 就好比你在用视频播放器的时候, 你只需要准备好视频文件, 提供给视频播放器, 至于具体要如何才能播放出来画面, 你完全不需要关心
* 当需要增加自定义组件时, 才需要关注 `page-schema-player` 项目, 即理解为需要让视频播放器支持一种新的视频文件格式或者提供新的功能特性, 此时我们才需要对 `page-schema-player` 项目进行开发测试部署上线发布新版本, 即对视频播放器进行迭代开发

## 配页坊后续的规划是怎么样的?

得益于百度 AMis 提供的强大的页面配置化能力, 我们会先通过直接手写页面配置文件的方式来应用一段时间, 在实际的业务中接受考验以评估适用程度和项目收益, 后续再规划可视化的编辑器来提升开发体验, 以及一整套搭页面的平台