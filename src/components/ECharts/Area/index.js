import React, { Component, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Button } from 'antd';
import moment from 'moment';
import Json2csv from 'json2csv';
import FileSaver from 'file-saver';

class Area extends Component {
  render() {
    // Need to change back to const after setting up API for data
    var {
      title = '',
      xName = '',
      yName = '',
      yNames = ['Peak', 'Off-Peak', 'Shoulder'],
      xValues = [],
      yValues = {
        peak: [],
        offPeak: [],
        shoulder: [],
      },
      range,
      unit,
      colour = ['#339999','#333333', '#fbbc07', '#666666'],
    } = this.props;

    // TO REMOVE - Random data generation based on date range
    var startDate = moment(range[0]);
    var endDate = moment(range[1]);
    var numDays = Math.abs(startDate.diff(endDate, 'days')) + 1;
    var day = startDate.startOf('day');

    for (var i = 0; i < numDays; i++) {
      xValues.push(day.format("DD-MM-YYYY"));
      day = moment(day.add(1, 'day'));
      yValues.peak.push(((Math.random() * 200) + 500).toFixed(2));
      yValues.offPeak.push(((Math.random() * 200) + 100).toFixed(2));
      yValues.shoulder.push(((Math.random() * 200) + 200).toFixed(2));
    }

    var itemStyle = {
      normal: {},
      emphasis: {
        barBorderWidth: 1,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0,0,0,0.5)'
      }
    };

    var csvName = "";
    var imgName = "";

    if(title) {
      csvName = title + ".csv";
      imgName = title;
    } else {
      csvName = "download.csv";
      imgName = "download";
    }

    function generateCsv() {
      var jsonData = [];

      for(let i = 0; i < yValues.peak.length; i++){
        jsonData.push({
          'Date': xValues[i],
          'Peak': yValues.peak[i],
          'Off-Peak': yValues.offPeak[i],
          'Shoulder': yValues.shoulder[i]
        });
      }

      var json2csvParser = new Json2csv.Parser([xName, yNames]);

      try {
        var csv = json2csvParser.parse(jsonData);
        var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, csvName);
      } catch (err) {
        alert("Error generating csv file.");
      }          
    }

    var option = {
      title: {
        text: title,
        textStyle: {
          fontWeight: 'normal'
        }
      },
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        }
      },
      legend: {
        data: yNames,
        bottom: 0
      },
      dataZoom: {
        type: 'inside'
      },
      color: colour,
      toolbox: {
        feature: {
          magicType: {
            type: ['stack', 'tiled'],
            title: {
              stack: 'stack',
              tiled: 'tile'
            }
          },
          restore: {
            title: 'reset view'
          },
          saveAsImage: {
            type: 'png',
            name: imgName,
            title: 'image'
          },
        }
      },
      xAxis:   {
        data: xValues,
        name: xName,
      },
      yAxis: {
        name: xName,
      },
      grid: {
        left: 50,
        right: 50
      },
      series: [
      {
        name: yNames[0],
        type:'line',
        stack: 'stackGroupOne',
        areaStyle: {normal: {}},
        smooth: true,
        data: yValues.peak
      },
      {
        name: yNames[1],
        type:'line',
        stack: 'stackGroupOne',
        areaStyle: {normal: {}},
        smooth: true,
        data: yValues.offPeak
      },
      {
        name: yNames[2],
        type:'line',
        stack: 'stackGroupOne',
        areaStyle: {normal: {}},
        smooth: true,
        data: yValues.shoulder
      }
      ]
    };

    return (
      <Fragment>
        <Button icon="download" size={"small"} onClick={generateCsv} style={{float:'right', zIndex:100}}>Export CSV</Button>
        <ReactEcharts
          option={option}
          theme='standard'
        />
      </Fragment>
    );
  }
}

export default Area;