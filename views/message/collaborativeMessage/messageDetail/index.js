layui.config({
  base: '../../../../layuiadmin/' //静态资源所在路径
}).extend({
  index: 'lib/index' //主入口模块
}).use(["index", "laytpl", "element", "form", "table", "laydate", "server"], function () {
  var $ = layui.$;
  var element = layui.element;


});