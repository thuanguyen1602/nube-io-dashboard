import React, { Component, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Button } from 'antd';
import moment from 'moment';
import Json2csv from 'json2csv';
import FileSaver from 'file-saver';

class Bar extends Component {
  render() {
    const {
      title = '',
      fileName = '',
      xName = '',
      yName = '',
      yNames = ['Peak', 'Off-Peak', 'Shoulder'],
      xValues = [],
      yValues,
      range,
      // colour = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
      colour = ['#339999','#333333', '#fbbc07', '#666666']
    } = this.props;

    var series = [];
    var yValuesLength = 0;
    var showMagicType = true;

    // Determines if yValues is an object or an array of values. If an object, count how 
    // many objects in order to plot each one (only supports 3 at the moment).
    // If an array, must be an array of values.
    if(typeof yValues === 'object') {
      yValuesLength = Object.keys(yValues).length;
    }
    if (Array.isArray(yValues)) {
      yValuesLength = 1;
      showMagicType = false;
    }

    if(yValuesLength === 1) {
      series.push({
        name: yNames,
        type: 'bar',
        stack: 'one',         
        itemStyle: itemStyle,
        data: yValues
      });
    } else if (yValuesLength === 3) {
      series.push({
        name: yNames[0],
        type: 'bar',
        stack: 'one',         
        itemStyle: itemStyle,
        data: yValues.peak
      });

      series.push({
        name: yNames[1],
        type: 'bar',
        stack: 'one',
        itemStyle: itemStyle,
        data: yValues.offPeak
      });

      series.push({
        name: yNames[2],
        type: 'bar',
        stack: 'one',
        itemStyle: itemStyle,
        data: yValues.shoulder
      });
    } else {
      console.log("Wrong number of Y value keys! Only 1 or 3 at the moment!")
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

    if(fileName) {
      csvName = fileName + ".csv";
      imgName = fileName;
    } else {
      csvName = "download.csv";
      imgName = "download";
    }

    function generateCsv() {
      var jsonData = [];

      if(yValuesLength === 1) {
        for(let i = 0; i < yValues.length; i++){
          jsonData.push({
            'Date': xValues[i],
            [yNames]: yValues[i],
          });
        }
      } else if(yValuesLength === 3) {
        for(let i = 0; i < yValues.peak.length; i++){
          jsonData.push({
            'Date': xValues[i],
            'Peak': yValues.peak[i],
            'Off-Peak': yValues.offPeak[i],
            'Shoulder': yValues.shoulder[i]
          });
        }
      }
      
      var json2csvParser = new Json2csv.Parser(['Date', yNames]);

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
            show: showMagicType,
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
            icon: 'rect',
            type: 'png',
            name: imgName,
            title: 'image'
          },
        }
      },
      tooltip: {},
      xAxis: {
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
      series: series
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

export default Bar;