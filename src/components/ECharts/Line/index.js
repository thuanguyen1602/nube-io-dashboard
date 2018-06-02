import React, { Component, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Button } from 'antd';
import moment from 'moment';
import Json2csv from 'json2csv';
import FileSaver from 'file-saver';
import numeral from 'numeral';

class Line extends Component {
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
      colour = ['#339999', '#333333', '#fbbc07', '#666666'],
      style = {},
      exportCsv = true,
    } = this.props;

    const series = [];
    let yValuesNew = [];
    let showMagicType = true;
    let accumulated = 0;

    if (datasets === 1) {
      yValuesNew[0] = yValues[0];
      for (let i = 1; i < yValues.length; i++) {
        yValuesNew[i] = yValuesNew[i - 1] + yValues[i];
      }

      accumulated = yValuesNew[yValuesNew.length - 1];
      showMagicType = false;

      series.push({
        name: yNames,
        type: 'line',
        smooth: true,
        data: yValuesNew,
      });
    } else {
      yValuesNew = {};
      for (const prop in yValues) {
        yValuesNew[prop] = [];
        yValuesNew[prop][0] = yValues[prop][0];
        for (let i = 1; i < yValues[prop].length; i++) {
          yValuesNew[prop][i] = yValuesNew[prop][i - 1] + yValues[prop][i];
        }
        accumulated += yValuesNew[prop][yValuesNew[prop].length - 1];
      }

      let i = 0;
      for (const prop in yValues) {
        series.push({
          name: yNames[i],
          type: 'line',
          stack: 'stackGroupOne',
          smooth: true,
          data: yValuesNew[prop],
        });
        i++;
      }
    }

    function generateCsv() {
      const jsonData = [];

      if (datasets === 1) {
        for (let i = 0; i < yValuesNew.length; i++) {
          jsonData.push({
            Date: xValues[i],
            [yNames]: yValuesNew[i],
          });
        }
      } else {
        for (let i = 0; i < yValuesNew[Object.keys(yValuesNew)[0]].length; i++) {
          const newObj = {
            Date: xValues[i],
          };

          let j = 0;
          for (const prop in yValuesNew) {
            newObj[yNames[j]] = yValuesNew[prop][i];
            j++;
          }

          jsonData.push(newObj);
        }
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

    const option = {
      title: [
        {
          text: title,
          textStyle: {
            fontWeight: 'normal',
          },
        },
      ],
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
      legend: {
        data: yNames,
        bottom: 0,
      },
      grid: {
        left: 50,
        right: 50,
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
        },
      },
      xAxis: {
        data: xValues,
        name: xTitle,
      },
      yAxis: {
        name: yTitle,
      },
      series,
    };

    return (
      <Fragment>
        {exportCsv && (
          <Button
            icon="download"
            size="small"
            onClick={generateCsv}
            style={{ float: 'right', zIndex: 100 }}
          >
            Export CSV
          </Button>
        )}
        <ReactEcharts option={option} theme="standard" style={style} notMerge lazyUpdate />
      </Fragment>
    );
  }
}

export default Line;
