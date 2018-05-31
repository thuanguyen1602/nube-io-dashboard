import React, { Component, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import numeral from 'numeral';

class Guage extends Component {
  render() {
    var {
      title = '',
      name = '',
      min = 0,
      max = 400,
      value = 0,
      radius = '90%',
      splitNumber = 6,
      unit = '',
      colour = [[0.2, '#339999'], [0.8, '#333333'], [1.0, '#fbbc07']],
      style = {}
    } = this.props;

    value = (Math.random() * max).toFixed(0);

    var option = {
      title: {
        text: title,
        textStyle: {
          fontWeight: 'normal'
        }
      },
      tooltip: {
        formatter: function (params) {
          return (
            `${params.seriesName}<br />
            ${numeral(params.value).format('0,0')} ${unit}`
          );
        }
      },
      grid: {
        left: 50,
        right: 50
      },
      series: {
        name: title,
        type: 'gauge',
        detail: {
          formatter: function (value) {
            return `${numeral(value).format('0,0')} ${unit}`;
          },
          fontSize: 16,
          fontWeight: 'bolder'
        },
        min: min,
        max: max,
        splitNumber: splitNumber,
        radius: radius,
        axisLine: {
          lineStyle: {
            color: colour,
            width: 16
          }
        },
        axisTick: {              
          lineStyle: {   
            color: '#fff'
          }
        },
        splitLine: {            
          lineStyle: {       
            color: '#fff'
          },
          length: 16
        },
        axisLabel: {
          formatter: function (value) {
            return numeral(value).format('0,0');
          },
          color: '#000000',
          padding: 3,
          fontSize: 14,
        },
        title : {
          fontWeight: 'bolder',
          fontSize: 14,
        },
        data:[{
          value: value,
          name: name
        }]
      }
    };

    return (
      <Fragment>
        <ReactEcharts
          option={option}
          theme='standard'
          style={style}
        />
      </Fragment>
    );
  }
}

export default Guage;