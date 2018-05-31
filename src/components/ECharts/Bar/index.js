import React, { Component, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Button } from 'antd';
import moment from 'moment';
import Json2csv from 'json2csv';
import FileSaver from 'file-saver';
import numeral from 'numeral';

class Bar extends Component {
  render() {
    const {
      title = '',
      fileName = 'download',
      xTitle = '',
      yTitle = '',
      datasets = 1,
      xValues = [],
      yValues = [],
      yNames = [],
      xNames = [],
      unit = '',
      colour = ['#339999','#333333', '#fbbc07', '#666666'],
      style = {},
      exportCsv = true
    } = this.props;

    var series = [];
    var showMagicType = true;
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

    if(datasets === 1) {
      showMagicType = false;
      series.push({
        name: yNames,
        type: 'bar',      
        itemStyle: itemStyle,
        data: yValues
      });
    } else {
      let i = 0;
      for(var prop in yValues) {
        series.push({
          name: yNames[i],
          type: 'bar',
          stack: 'stackGroupOne',         
          itemStyle: itemStyle,
          data: yValues[prop]
        });
        i++;
      }
    }

    function generateCsv() {
      var jsonData = [];

      if(datasets === 1) {
        for(let i = 0; i < yValues.length; i++){
          jsonData.push({
            "Date": xValues[i],
            [yNames]: yValues[i],
          });
        }
      } else {
        for(let i = 0; i < yValues[Object.keys(yValues)[0]].length; i++) {
          
          var newObj = {
            "Date": xValues[i]
          };

          let j = 0;
          for(var prop in yValues) {
            newObj[yNames[j]] = yValues[prop][i];
            j++;
          }

          jsonData.push(newObj);
        }
      }
      
      var json2csvParser = new Json2csv.Parser(['Date', yNames]);

      try {
        var csv = json2csvParser.parse(jsonData);
        var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, `${fileName}.csv`);
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
            type: 'png',
            name: fileName,
            title: 'image'
          },
        }
      },
      tooltip: {
        formatter: function (params) {
          return (
            `${params.name}<br />
            ${params.marker}${params.seriesName}: ${numeral(params.value).format('0,0')} ${unit}`
          );
        },
      },
      xAxis: {
        data: xValues,
        name: xTitle,
      },
      yAxis: {
        name: yTitle,
      },
      grid: {
        left: 50,
        right: 50
      },
      series: series
    };

    return (
      <Fragment>
        {exportCsv && <Button icon="download" size={"small"} onClick={generateCsv} style={{float:'right', zIndex:100}}>Export CSV</Button>}
        <ReactEcharts
          option={option}
          theme='standard'
          style={style}
        />
      </Fragment>
    );
  }
}

export default Bar;