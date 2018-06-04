import React, { Component, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import numeral from 'numeral';

class Guage extends Component {
  render() {
    const {
      title = '',
      name = '',
      min = 0,
      max = 400,
      value = 0,
      radius = '90%',
      splitNumber = 6,
      unit = '',
      colour = ['#399', '#333333', '#fbbc07'],
      style = {},
    } = this.props;

    const fakeValue = (Math.random() * max).toFixed(0);
    const formattedColours = [];

    colour.forEach((aColour, index) => {
      formattedColours.push([(index + 1) / colour.length, colour[index]]);
    });

    const option = {
      title: {
        text: title,
        textStyle: {
          fontWeight: 'normal',
        },
      },
      tooltip: {
        formatter(params) {
          return `${params.seriesName}<br />
            ${numeral(params.value).format('0,0')} ${unit}`;
        },
      },
      grid: {
        left: 50,
        right: 50,
      },
      series: {
        name: title,
        type: 'gauge',
        detail: {
          formatter(val) {
            return `${numeral(val).format('0,0')} ${unit}`;
          },
          fontSize: 16,
          fontWeight: 'bolder',
        },
        min,
        max,
        splitNumber,
        radius,
        axisLine: {
          lineStyle: {
            color: formattedColours,
            width: 16,
          },
        },
        axisTick: {
          lineStyle: {
            color: '#fff',
          },
        },
        splitLine: {
          lineStyle: {
            color: '#fff',
          },
          length: 16,
        },
        axisLabel: {
          formatter(val) {
            return numeral(val).format('0,0');
          },
          color: '#000000',
          padding: 3,
          fontSize: 14,
        },
        title: {
          fontWeight: 'bolder',
          fontSize: 14,
        },
        data: [
          {
            value: fakeValue,
            name,
          },
        ],
      },
    };

    return (
      <Fragment>
        <ReactEcharts option={option} theme="standard" style={style} />
      </Fragment>
    );
  }
}

export default Guage;
