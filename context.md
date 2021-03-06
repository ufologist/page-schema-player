# 为什么发起[配页坊](https://github.com/ufologist/page-schema-player)项目?

## 背景

* 因为后台系统实在太多了, 而且都大同小异, 消耗了大量的前端人力
* **在前后端分离的大趋势下, 前端和后端技术栈日益差异化并逐渐形成一些技术壁垒**
* 随着前端参与到越来越多的后台系统开发中去, 逐渐将越来越多的后台系统升级改造为前后端分离的开发模式
* 对于前端来说, 活是越来越多, 但总会有些枯燥无味(让你天天开发后台系统试一试), 因为后台系统差不多都是列表和表单
* **对于人效来说, 由于前后端分离带来的人力资源短板, 在某些时候反而降低了效率**
* 因为由于前端技术近几年的快速发展, 前端技术栈已经大不一样了, 不再是以往简单的"所见即所得的开发模式"
* 前端技术栈越来越与后端方向靠齐, 什么模块化, 组件, 依赖, 包, 转义, 构建, 上线等等相似的概念孕育而生
* 更有很多前端特有的"黑话", 例如兼容性, npm 包, npm 源, babel, ES5, ES2015 等等, 更别提前端那些数不胜数的框架了, 什么单页项目走起, 全家桶来一波
* 前后端分离之后, 前端将页面的开发模式做了一场翻天覆地的大升级, 对前端来说是越来越有利于项目的迭代
* **但对于后端开发人员来说, 面对前端新的技术栈, 看到的可能更多是学习的成本**
* 这样造成的局面就是: **可能简单到只是修改页面上的一个文字, 都需要前端同学的参与**
* 回想以前不分离的时候, 很多页面上简单的活, 后端同学自己分分钟就搞定上线了
* 这也就是前后端分离之后, 我们必须面对的一个问题, 以前前端和后端都能做的事情, 现在只有前端能做了
* 前后端分离之后, 前端和后端的专业化势必带来价值, 将后端从页面的苦海中解脱了出来, 用户的体验也会越来越好
* 但随着前端参与的项目越来越多, 前端疲于奔命的情况也将越来越多, 总是各种项目并行, 各种缺前端人员
* **前端人员有限, 现在页面上什么活都等着前端来做, 其他人员看着干瞪眼的情况, 总是需要想办法解决的**

## 如何解决前端人力短板的问题?

* 核心就一个词: **前端赋能**, 即将前端能力服务化
* 首先需要知道前端有哪些能力, 哪些能力可以服务化, 哪些能力服务化之后最有价值
* 综合之下, 个人认为前端最核心能力要数**搭页面的能力**了, 此乃前端的看家本领(饭碗), 基本上也是前端日常做得最多的事情
* 因此为了释放前端人力, 缓解人力短板, 让前端可以投入到更多更有挑战的地方去, 我们最应该将"搭页面的能力"服务化

## 如何将搭页面的能力服务化?

从技术发展的趋势上看, 服务化最终即平台化, 或者说是 [SaaS](https://baike.baidu.com/item/SaaS) 化, 一般会经历如下几个阶段
1. 一次封装(自己用), 例如封装一个函数, 在项目中使用, 避免重复开发
2. 一个公共库(别人也用), 例如封装一类函数, 形成一个公共包, 在多个项目中使用
3. 一套工具(自家人用), 例如封装一个生成短链接的工具, 可以在前端项目中使用(技术壁垒)
4. 一个平台(大家都用), 例如开发一个在线生成短链接的平台, 让所有人都可以使用(打破技术壁垒)

这个过程即服务的人群越来越多, 越来越广的过程, 还有就是更加通用化的过程

那么搭页面的能力如何服务化呢?
1. 封装   -> 组件化
2. 公共库 -> 组件库
3. 工具   -> 配置化
4. 平台   -> 在线化 -> 可视化

**即可以理解为要将前端搭页面的能力服务化, 最终的目标就是开发出一个可以拖拖拽拽就能够生成页面的平台, 也就是不需要写代码就可以上线页面的平台, 让大众都可以使用**

类似的平台例如[易企秀](https://www.eqxiu.com/), [Strikingly](https://www.strikingly.com "本土化产品“上线了”"), 大家可以去体验一下其中感受(仅为举例, 绝非广告)

## 如何循序渐进地达成服务化的目标?

结合最开始聊到的背景, 个人认为, 第一个小目标是实现可配置化的页面, 主要面对后台列表和表单类的页面, 因为
* 首先组件化配置化, **避免了重复开发**, 是提升前端本身的开发效率, 也就是降低前端的工作量, 让前端可以有更多的时间做更多的事(怎么有点压榨的感觉)
* 其次是通过配置化, 可以降低前端开发的难度, **减少对前端人员的依赖**
* 通过配置的方式, 理论上一个不太懂前端的人, 例如后端人员, 也可以完成部分前端的活了, 即又能充分发挥类似以前不分离时代的优势, 减少出现前端人员短板的情况
* 再例如一些简单的表单信息录入之类的页面, 后端如果自己可以配置出来, 就**不需要前端支持了**

这一步即达成通过配置的方式服务于开发人员, 让其可以通过配置, 以声明的方式, 快速搭建起一些列表或者表单之类的后台页面

即先是以任意的配置形式用起来, 再考虑通过额外的辅助工具(例如可视化平台)来优化这个过程, 让其运作得更好

具体关于配置化的实现方案, 请参考[配置化搭页面的技术选型](https://github.com/ufologist/new-page/blob/master/lib.md#%E9%85%8D%E7%BD%AE%E5%8C%96%E6%90%AD%E9%A1%B5%E9%9D%A2)

## 了解更多

* [如何为搭建物料智能生成代码 - 自动编码](https://www.yuque.com/zaotalk/conf/328#3407a25c "前端搞搭建 | 第三届前端早早聊大会")

  > imgcook 背景 - 前端行业提效分析: 关于 Pro-Code -> Low-Code -> No-Code -> Auto-Code
  >
  > ![imgcook](https://user-images.githubusercontent.com/167221/78014467-8dc62980-737a-11ea-8b1c-12e13f586b9e.png)
* [中台建站的智能化探索](https://zhuanlan.zhihu.com/p/54422324)

  > 无法满足快速迭代的中台业务需求，缺前端、体验差是各业务发展中名列前茅的痛点之一
  > 
  > 我们尝试通过组装和智能破局
* [从零开始的可视化搭建系统](https://zhuanlan.zhihu.com/p/96180775)

  > 模块化 | 布局系统 | 可视化拖拽
  >
  > 一个搭建系统就是基于一份模版语言的数据生产过程
  > * 模版引擎
  >   * 模块
  >   * 属性
  >   * 值
  > * 编辑器
  >   * 属性面板
  >   * 可视化拖拽
* [蚂蚁中后台快速研发平台的领域思考](https://zhuanlan.zhihu.com/p/90238943)

  > hpaPaaS 是一个对应用研发进行全生命周期管理的平台，这个平台定义了这样一种研发模式：在较强的设计、研发规范下，通过可视化拖拽、模型驱动等技术显著降低研发门槛、提升研发效率、保障基本品质。
  >
  > 为什么要选择 hpaPaaS
  > * 提升研发、交付速度，在市场竞争中获得先机
  > * 降低研发门槛，解决招聘难的问题
  > * 降低企业用人成本
  > * 优化企业人才结构，业务研发和技术专家各自有明确的发展线路
  > * 保障应用的基本品质
  > * 获得能力增强，自己就能完成或更快更好的完成研发工作
  > * 从繁冗的日常研发中解放出来，专注于有挑战的工作
  > 
  > 中后台应用研发的未来
  >
  > 随着 hpaPaaS 逐步发展成熟，未来的研发格局将会发生转变。首先有大量应用全部或部分使用 hpaPaaS 研发，同时公司的人才结构将会得到优化，技术专家更专注于技术，产品工程师更专注于业务，两者都有明确的发展路线。
* [云凤蝶中台研发提效实践](https://zhuanlan.zhihu.com/p/78425921)

  > 使用云凤蝶，快速制作高品质中台应用。
  >
  > 由于企业开发市场对于交付效率和可定制性的双重追求，Low-code 平台成为这一市场最合适的开发方式，因为它兼具高效率和灵活性的特点。
  >
  > 做好工具属性只是满足提效的基本要求，更重要的是从横竖两个方向改善生产关系和打通生产资料壁垒。
  >
  > 云凤蝶中台应用是 Low-code 平台，目前聚焦于展现层流水线的打造，将 UI 资产快速组装出可用站点。
  > * UI 资产包 专家级前端工程师使用代码开发组件（UI 资产），完全交由 pro-code 优化专家的生产效率（未来可能转向 CloudIDE），是产业链的上游。
  > * 低代码组装 使用可视化 + 低代码方式组装 UI 界面和制作交互，是我们的核心生产线，是产业链的下游。
  > * 自由布局画布打破层内生产资料壁垒 工作在展现层的 PD、设计师和前端工程师工作产物无缝复用。
  >
  > 总结
  > * 传统提效思路的努力方向“利其器”没有错误，是所有提效必须完成的第一步。
  > * 生产力产生量变的更重要武器是改变生产力关系。能够打穿层级间、打通层级内，消除生产资料壁垒，层级内层级外下游都复用上游产物而不重建，会形成产业链式生产关系，从而效率最大化。
* [云凤蝶可视化搭建的推导与实现 - SEE Conf](https://zhuanlan.zhihu.com/p/101665976)

  > 云凤蝶要做的事情可以总结为两句话，就是**设计的标准化**和**研发的工业化**
  >
  > 做一个组件化的搭建平台，其骨架分为：
  > * 组件识别与导入
  > * 组件拖拽与组合
  > * 组件配置与扩展
  > * 组件布局自适应
  > * 组件状态与联动