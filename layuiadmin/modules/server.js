layui.define(function (exports) {

  var $ = layui.$;
  $.ajaxSetup({
    headers: {
      Accept: "application/json; charset=utf-8"
    },
    data: {id2: "你好"},
    beforeSend: function (jqXHR, settings) {
      console.log(settings);
      //在请求前给修改url（增加一个时间戳参数）
      settings.url += settings.url.match(/\?/) ? "&" : "?";
      settings.url += "token=" + new Date().getTime();
    },
    complete: function (XMLHttpRequest, textStatus) {
      console.log(XMLHttpRequest.responseJSON);
      console.log(textStatus)
    },
    statusCode: {
      404: function (data) {
        console.log(data)
        alert('数据获取/输入失败，没有此服务。404');
      },
      504: function () {
        alert('数据获取/输入失败，服务器没有响应。504');
      },
      500: function () {
        alert('服务器有误。500');
      }
    }
  });

  exports("server", {})

})