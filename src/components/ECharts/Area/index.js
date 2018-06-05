import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import Json2csv from 'json2csv';
import FileSaver from 'file-saver';
import numeral from 'numeral';

class Area extends Component {
  constructor(props) {
    super(props);
    this.generateCsv = this.generateCsv.bind(this);
  }

  generateCsv() {
    const {
      fileName = 'download',
      xValues = [],
      yValues = {},
      yNames = [],
      unit = '',
    } = this.props;

    const datasets = Object.keys(yValues).length;
    const jsonData = [];

    if (yNames.length !== datasets) {
      for (const key in yValues) {
        if (Object.prototype.hasOwnProperty.call(yValues, key)) {
          yNames.push(key);
        }
      }
    }

    for (let i = 0; i < yValues[Object.keys(yValues)[0]].length; i += 1) {
      const newObj = {
        Date: xValues[i],
      };

      let j = 0;
      for (const key in yValues) {
        if (Object.prototype.hasOwnProperty.call(yValues, key)) {
          newObj[yNames[j]] = yValues[key][i];
          j += 1;
        }
      }

      if (unit) {
        newObj.Units = unit;
      }

      jsonData.push(newObj);
    }

    const json2csvParser = new Json2csv.Parser(['Date', yNames]);

    try {
      const csv = json2csvParser.parse(jsonData);
      const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });
      FileSaver.saveAs(blob, `${fileName}.csv`);
    } catch (err) {
      alert('Error generating csv file.');
    }
  }

  render() {
    const { generateCsv } = this;

    const {
      title = '',
      fileName = 'download',
      xTitle = '',
      yTitle = '',
      xValues = [],
      yValues = {},
      yNames = [],
      xNames = [],
      unit = '',
      colour = ['#399', '#333333', '#fbbc07', '#666666'],
      style = {},
      exportCsv = true,
    } = this.props;

    const series = [];
    const datasets = Object.keys(yValues).length;

    const showMagicType = datasets > 1;

    if (datasets > 0) {
      let i = 0;
      for (const key in yValues) {
        if (Object.prototype.hasOwnProperty.call(yValues, key)) {
          series.push({
            name: yNames[i],
            type: 'line',
            stack: 'stackGroupOne',
            areaStyle: { opacity: 1 },
            smooth: true,
            data: yValues[key],
          });
          i += 1;
        }
      }
    }

    const option = {
      title: {
        text: title,
        textStyle: {
          fontWeight: 'normal',
        },
      },
      legend: {
        data: yNames,
        bottom: 0,
      },
      dataZoom: {
        type: 'inside',
      },
      color: colour,
      toolbox: {
        feature: {
          magicType: {
            show: showMagicType,
            type: ['stack', 'tiled'],
            title: {
              stack: 'stack',
              tiled: 'tile',
            },
          },
          restore: {
            title: 'reset view',
          },
          saveAsImage: {
            type: 'png',
            name: fileName,
            title: 'image',
          },
          myExportCsv: {
            show: exportCsv && datasets > 0,
            title: 'CSV',
            icon:
              'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
            onclick() {
              generateCsv();
            },
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter(params) {
          let tooltipHTML = `${params[0].name}<br />`;
          tooltipHTML += params
            .map(param => {
              return `${param.marker}${param.seriesName}: ${numeral(param.value).format(
                '0,0'
              )} ${unit}<br />`;
            })
            .join('');
          return tooltipHTML;
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
        right: 50,
      },
      series,
    };

    return <ReactEcharts option={option} theme="standard" style={style} notMerge lazyUpdate />;
  }
}

export default Area;
