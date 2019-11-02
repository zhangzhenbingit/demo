layui.config({
  base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
  index: 'lib/index', //主入口模块
  treetable: 'treetable-lay/treetable'
}).use(["index", "laytpl", "element", "form", "table", "laydate", "upload", "server", "treetable"], function () {
  var $ = layui.$;
  var form = layui.form;
  var laytpl = layui.laytpl;
  var server = layui.server;
  var element = layui.element;
  var laydate = layui.laydate;
  var table = layui.table;
  var upload = layui.upload;
  var treetable = layui.treetable;
  //普通图片上传
  var uploadInst = upload.render({
    elem: '#uploadImg'
    , url: './'
    , before: function (obj) {
      //预读本地文件示例，不支持ie8
      obj.preview(function (index, file, result) {
        $('#uploadImg').attr('src', result); //图片链接（base64）
      });
    }
    , done: function (res) {
      //如果上传失败
      if (res.code > 0) {
        return layer.msg('上传失败');
      }
      //上传成功
    }
    , error: function () {
      //演示失败状态，并实现重传
      var demoText = $('#demoText');
      demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
      demoText.find('.demo-reload').on('click', function () {
        uploadInst.upload();
      });
    }
  });
  // 渲染表格
  var renderTable = function () {
    treetable.render({
      treeColIndex: 1,
      treeSpid: -1,
      treeIdName: 'id',
      treePidName: 'pid',
      treeDefaultClose: false,
      treeLinkage: false,
      elem: '#dataList',
      url: '../../../json/table2.json',
      page: false,
      cols: [[
        { width: 30 },
        { field: 'name', title: '工序名称', width: 200 },
        { field: 'type', title: '物料类别', width: 100 },
        { field: '', title: '半成品管理', width: 110 },
        { field: '', title: '公式', width: 80 },
        { field: 'code', title: '物料代码', width: 100 },
        { field: 'type', title: '物料名称' },
        { field: 'xh', title: '型号', width: 100 },
        { field: 'gg', title: '规格', width: 80 },
        { field: 'ps', title: '配色方案', width: 90 },
        { field: 'ggsm', title: '规格说明', width: 90 },
        { field: 'yl', title: '用量', width: 90 },
        { field: 'dw', title: '单位', width: 60 },
        { templet: '#oper-col', title: 'oper' }
      ]],
      done: function () {
      }
    });
  };

  renderTable();



});