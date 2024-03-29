layui.config({
  base: '../../layuiadmin/' //静态资源所在路径
}).extend({
  index: 'lib/index' //主入口模块
}).use(['index', 'server'], function () {
  var $ = layui.$;
  // 指定图表的配置项和数据


  var today = new Date(),
    day = 1000 * 60 * 60 * 24,
    each = Highcharts.each,
    reduce = Highcharts.reduce,
    btnShowDialog = document.getElementById('btnShowDialog'),
    btnRemoveTask = document.getElementById('btnRemoveSelected'),
    btnAddTask = document.getElementById('btnAddTask'),
    btnCancelAddTask = document.getElementById('btnCancelAddTask'),
    addTaskDialog = document.getElementById('addTaskDialog'),
    inputName = document.getElementById('inputName'),
    selectDepartment = document.getElementById('selectDepartment'),
    selectDependency = document.getElementById('selectDependency'),
    chkMilestone = document.getElementById('chkMilestone'),
    isAddingTask = false;
// Set to 00:00:00:000 today
  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);
  today = today.getTime();
// Update disabled status of the remove button, depending on whether or not we
// have any selected points.
  function updateRemoveButtonStatus(e) {
    var chart = this.series.chart;
    // Run in a timeout to allow the select to update
    setTimeout(function () {
      btnRemoveTask.disabled = !chart.getSelectedPoints().length ||
        isAddingTask;
    }, 10);
  }


  var arry = [
    {
      start: today + 2 * day,
      end: today + day * 5,
      name: 'Prototype',
      id: 'prototype',
      y: 0
    }, {
      start: today + day * 6,
      name: 'Prototype done',
      milestone: true,
      dependency: 'prototype',
      id: 'proto_done',
      y: 0
    }, {
      start: today + day * 7,
      end: today + day * 11,
      name: 'Testing',
      dependency: 'proto_done',
      y: 0
    }, {
      start: today + day * 5,
      end: today + day * 8,
      name: 'Product pages',
      y: 1
    }, {
      start: today + day * 9,
      end: today + day * 10,
      name: 'Newsletter',
      y: 1
    }, {
      start: today + day * 9,
      end: today + day * 11,
      name: 'Licensing',
      id: 'testing',
      y: 2
    }, {
      start: today + day * 11.5,
      end: today + day * 12.5,
      name: 'Publish',
      dependency: 'testing',
      y: 2
    }
  ];
// Create the chart
  Highcharts.setOptions({
    lang: {
      months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      shortWeekdays: ["周天", "周一", "周二", "周三", "周四", "周五", "周六"],
      weekdays: ["周天", "周一", "周二", "周三", "周四", "周五", "周六"]
    }
  });

  var chart = Highcharts.ganttChart('container', {
    chart: {
      spacingLeft: 1
    },
    title: {
      text: 'Interactive Gantt Chart'
    },
    subtitle: {
      text: 'Drag and drop points to edit'
    },
    plotOptions: {
      series: {
        animation: false, // Do not animate dependency connectors
        dragDrop: {
          draggableX: true,
          draggableY: true,
          dragMinY: 0,
          dragMaxY: 2,
          dragPrecisionX: day / 3 // Snap to eight hours
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          style: {
            cursor: 'default',
            pointerEvents: 'none'
          }
        },
        allowPointSelect: true,
        point: {
          events: {
            select: updateRemoveButtonStatus,
            unselect: updateRemoveButtonStatus,
            remove: updateRemoveButtonStatus,
            update: modifyData
          }
        }
      }
    },
    yAxis: {
      type: 'category',
      categories: ['Tech', 'Marketing', 'Sales'],
      min: 0,
      max: 2
    },
    xAxis: {
      currentDateIndicator: true
    },
    tooltip: {
      xDateFormat: '%a %b %d, %H:%M'
    },
    series: [{
      name: 'Project 1',
      data: arry
    }]
  });

  function modifyData(e) {
    arry[e.target.index].end = e.target.options.end;
    arry[e.target.index].start = e.target.options.start;
    if (arry[e.target.index].end <= arry[e.target.index].start) {
      var servers = chart.series[0];
      window.onmouseup = function (event) {
        if (arry[e.target.index].end <= arry[e.target.index].start) {
          arry[e.target.index].end = arry[e.target.index].start + 0.5 * day;
          console.log("我促发了")
          console.log(arry)
          servers.setData(arry)
        }
      };
      return false
    }
  }

  /* Add button handlers for add/remove tasks */
  btnRemoveTask.onclick = function () {
    var points = chart.getSelectedPoints();
    each(points, function (point) {
      point.remove();
    });
  };
  btnShowDialog.onclick = function () {
    // Update dependency list
    var depInnerHTML = '<option value=""></option>';
    each(chart.series[0].points, function (point) {
      depInnerHTML += '<option value="' + point.id + '">' + point.name +
        ' </option>';
    });
    selectDependency.innerHTML = depInnerHTML;
    // Show dialog by removing "hidden" class
    addTaskDialog.className = 'overlay';
    isAddingTask = true;
    // Focus name field
    inputName.value = '';
    inputName.focus();
  };
  btnAddTask.onclick = function () {
    // Get values from dialog
    var series = chart.series[0],
      name = inputName.value,
      undef,
      dependency = chart.get(
        selectDependency.options[selectDependency.selectedIndex].value
      ),
      y = parseInt(
        selectDepartment.options[selectDepartment.selectedIndex].value,
        10
      ),
      maxEnd = reduce(series.points, function (acc, point) {
        return point.y === y && point.end ? Math.max(acc, point.end) : acc;
      }, 0),
      milestone = chkMilestone.checked || undef;
    // Empty category
    if (maxEnd === 0) {
      maxEnd = today;
    }
    // Add the point
    series.addPoint({
      start: maxEnd + (milestone ? day : 0),
      end: milestone ? undef : maxEnd + day,
      y: y,
      name: name,
      dependency: dependency ? dependency.id : undef,
      milestone: milestone
    });
    // Hide dialog
    addTaskDialog.className += ' hidden';
    isAddingTask = false;
  };
  btnCancelAddTask.onclick = function () {
    // Hide dialog
    addTaskDialog.className += ' hidden';
    isAddingTask = false;
  };


});