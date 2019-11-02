layui.config({
  base: '../../../../layuiadmin/' //静态资源所在路径
}).extend({
  index: 'lib/index' //主入口模块
}).use(['index', 'table', 'server'], function () {
  var admin = layui.admin;
  var $ = layui.$;
  var table = layui.table;
  //表格示例
  table.render({
    elem: '#contractList'
    , url: '../../../table/table.json' //数据接口
    ,height: "472"
    , page: true //开启分页
    , cols: [[ //表头
      {field: 'id', title: 'ID', width: 80}
      , {field: 'username', title: '销售订单号', width: 100, sort: true}
      , {field: 'sex', title: '签订企业'}
      , {field: 'city', title: '项目名称'}
      , {field: 'sign', title: '签订单位'}
      , {field: 'experience', title: '客户联系人'}
      , {field: 'score', title: '业务员'}
      , {field: 'classify', title: '签订日期'}
      , {field: 'score', title: '交货日期'}
      , {field: '', title: '操作', toolbar: '#checkContract', fixed: 'right'}
    ]]
  });

  table.on('tool(contractList)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
    var data = obj.data;
    var layEvent = obj.event;
    var tr = obj.tr;

    if (layEvent === 'detail') { //查看
      console.log(data)
      location.href = 'contractDetail'
    }
  });

  //弹出新建内容
  // admin.popup({
  //   title: '新建销售订单'
  //   ,shade: 0
  //   ,anim: -1
  //   ,area: ['280px', '150px']
  //   ,id: 'layadmin-layer-skin-test'
  //   ,skin: 'layui-anim layui-anim-upbit'
  //   ,content: $('#orderDetail')
  // })







});