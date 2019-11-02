layui.config({
  base: '../../../../../layuiadmin/' //静态资源所在路径
}).extend({
  index: 'lib/index' //主入口模块
}).use(['index', 'table', 'server','laydate'], function () {
  var $ = layui.$;
  laydate = layui.laydate;
  //日期
  laydate.render({
    elem: '#date2'
  });
  laydate.render({
    elem: '#date'
  });




});