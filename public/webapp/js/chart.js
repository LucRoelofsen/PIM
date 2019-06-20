google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawCurveTypes);

function drawCurveTypes() {
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'Date');
  data.addColumn('number', 'Docs submitted');
  data.addColumn('number', 'Reports received');


  data.addRows([
    [new Date(2018, 11, 1), 423, 65],
    [new Date(2018, 12, 1), 492, 54],
    [new Date(2019, 1, 1), 546, 52],
    [new Date(2019, 2, 1), 487, 49],
    [new Date(2019, 3, 1), 590, 51],
    [new Date(2019, 4, 1), 542, 45],
    [new Date(2019, 5, 1), 564, 43],

  ]);

  var options = {
    title: 'Activity over the past months',
    hAxis: {
      title: 'Date'
    },
    vAxis: {
      title: 'Amount'
    },

  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}
