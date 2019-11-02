layui.config({
  base: '../../layuiadmin/' //静态资源所在路径
}).extend({
  index: 'lib/index' //主入口模块
}).use(['index', 'form', 'table', 'server'], function () {
  var $ = layui.$;
  var table = layui.table;
  var form = layui.form;

  //表格示例
  table.render({
    elem: '#demo'
    , url: './table.json' //数据接口
    , page: true //开启分页
    , cols: [[ //表头
      {field: 'id', title: 'ID', width: 80, fixed: 'left'}
      , {field: 'username', title: '用户名', width: 100, sort: true}
      , {field: 'sex', title: '性别', width: 80}
      , {field: 'city', title: '城市', width: 80}
      , {field: 'sign', title: '签名', width: 177}
      , {field: 'experience', title: '积分', width: 80}
      , {field: 'score', title: '评分', width: 80}
      , {field: 'classify', title: '职业', width: 80}
      , {field: 'score', title: '评分', width: 80}
      , {field: 'classify', title: '职业', width: 80}
      , {field: 'score', title: '评分', width: 80}
      , {field: 'classify', title: '职业', width: 80}
      , {field: 'score', title: '评分', width: 80}
      , {field: 'classify', title: '职业', width: 80}
      , {field: 'score', title: '评分', width: 80}
      , {field: 'classify', title: '职业', width: 80}
      , {field: 'score', title: '评分', width: 80}
      , {field: 'classify', title: '职业', width: 80}
      , {field: 'wealth', title: '财富', width: 135}
      , {
        field: '', title: '操作', width: 135, fixed: 'right', templet: function () {
          return "删除"
        }
      }
    ]]
  });


  /* 监听提交 */
  form.on('submit(component-form-demo1)', function (data) {
    parent.layer.alert(JSON.stringify(data.field), {
      title: '最终的提交信息'
    });
    return false;
  });
});