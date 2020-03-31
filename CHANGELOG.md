# CHANGELOG

* v1.2.0 2020-3-31

  * feat: 实现接口的未登录处理器(`api._unauthorized`)机制

* v1.1.0 2020-3-24

  * feat: 在外部会有需要用到 [`env`](https://github.com/ufologist/page-schema-player/blob/201265ce7d0af9fd10016ff039b20e7833267f28/src/app/AMisRenderer.tsx#L38) 中方法的场景, 例如弹一个 `notify` 或者发送一个额外的请求, 因此将其暴露到 `window.amisEnv`

* v1.0.0 2020-3-21

  * 初始版本