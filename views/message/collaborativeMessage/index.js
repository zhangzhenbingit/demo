layui.config({
  base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
  index: 'lib/index' //主入口模块
}).use(["index", "laytpl", "element", "form", "table", "laydate", "server"], function () {
  var $ = layui.$;
  var form = layui.form;
  var laytpl = layui.laytpl;
  var server = layui.server;
  var element = layui.element;
  var laydate = layui.laydate;
  var table = layui.table;

  laydate.render({
    elem: '#dateSelect',
    range: true
  });
  table.render({
    elem: '#dataList'
    , url: '../../../json/table1.json' //数据接口
    , page: true //开启分页
    , height: "472"
    , cols: [[
      { field: 'source', title: '消息来源', width: 200 }
      , { field: 'content', title: '内容' }
      , { field: 'date', title: '时间', width: 200 }
      , { field: 'state', title: '状态', width: 200 }
      , { field: 'source', title: '查看详情', toolbar: '#checkDetail', width: 200 }
    ]]
  });

  //监听工具条 
  table.on('tool(dataList)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
    var data = obj.data;
    var layEvent = obj.event;
    var tr = obj.tr;

    if (layEvent === 'detail') { //查看
      console.log(data)
      location.href = 'messageDetail'
    }
  });

});