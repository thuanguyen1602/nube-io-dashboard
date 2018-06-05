import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import numeral from 'numeral';

class Doughnut extends Component {
  render() {
    const {
      title = '',
      fileName = 'download',
      yNames = [],
      yValues = {},
      unit = '',
      colour = ['#399', '#333333', '#fbbc07', '#666666'],
      style = {},
    } = this.props;

    const data = [];
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    let i = 0;
    for (const key in yValues) {
      if (Object.prototype.hasOwnProperty.call(yValues, key)) {
        data.push({
          value: yValues[key].reduce(reducer),
          name: yNames[i],
        });
        i += 1;
      }
    }

    const option = {
      title: {
        text: title,
        textStyle: {
          fontWeight: 'normal',
        },
      },
      tooltip: {
        formatter(params) {
          return `${params.name}<br />
            ${params.percent} %<br />
            ${params.marker}${numeral(params.value).format('0,0')} ${unit}`;
        },
      },
      grid: {
        left: 50,
        right: 50,
      },
      legend: {
        data: yNames,
        bottom: 0,
      },
      color: colour,
      toolbox: {
        feature: {
          saveAsImage: {
            type: 'png',
            name: fileName,
            title: 'image',
          },
        },
      },
      series: {
        name: title,
        type: 'pie',
        radius: ['55%', '75%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '24',
              fontWeight: 'bold',
            },
          },
        },
        lableLine: {
          normal: {
            show: true,
          },
          emphasis: {
            show: false,
          },
        },
        data,
      },
    };

    return <ReactEcharts option={option} theme="standard" style={style} />;
  }
}

export default Doughnut;
