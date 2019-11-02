layui.config({
  base: '../../layuiadmin/' //静态资源所在路径
}).extend({
  index: 'lib/index' //主入口模块
}).use(['index', 'server'], function () {

// 百度地图API功能
  var map = new BMap.Map("allmap");
  map.centerAndZoom(new BMap.Point(116.331398, 39.897445), 11);
  map.enableScrollWheelZoom(true);

  // 用经纬度设置地图中心点
  map.clearOverlays();
  var new_point = new BMap.Point("116.40", "39.90");
  var marker = new BMap.Marker(new_point);  // 创建标注
  map.addOverlay(marker);              // 将标注添加到地图中
  map.panTo(new_point);


});