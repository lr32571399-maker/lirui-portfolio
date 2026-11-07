# 首页标题：React Bits StrokeText（JS + CSS）

来源：https://reactbits.dev/r/StrokeText-JS-CSS.json 。原始 registry.json 已保留，许可见 REACT-BITS-LICENSE.md。

仅标题使用 React，人物追视控制器仍为原生 JavaScript。运行页面不需要 Node 或网络；index.html 引用 assets/title/stroke-title.js 和 stroke-title.css。

修改参数在 mount.jsx，当前 animationDuration: 1 表示描边与填充完整序列共 1 秒，悬停重绘同样为 1 秒。StrokeText.jsx 在官方源码基础上增加可选 animationDuration，通过 timeline.timeScale 调整整体时长。布局 CSS 固定两行的 SVG 高度，避免 ResizeObserver 受字体亚像素测量影响反复重启动画。fillColor 保持 null，白色填充由 title-layout.css 提供。

重新构建：在本目录运行 npm ci、npm run build。依赖版本由 package-lock.json 锁定。验收运行根目录 node tests/stroke-title-check.cjs，覆盖描边完成、悬停重绘、白色填充、移动端、减少动态效果和人物追视。
