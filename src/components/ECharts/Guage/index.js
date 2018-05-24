import React, { Component, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import numeral from 'numeral';

class Guage extends Component {
  render() {
    var {
      name = '',
      unit = '',
      value = 0,
      time = null,
      min = 0,
      max = 400,
      splitNumber = 6,
      colour = [[0.2, '#339999'], [0.8, '#333333'], [1.0, '#fbbc07']],
    } = this.props;

    value = (Math.random() * max).toFixed(0);

    var option = {
      tooltip: {
        formatter: "{a} <br/>{c} {b}"
      },
      grid: {
        left: 50,
        right: 50
      },
      series: {
        name: 'Current Usage',
        type: 'gauge',
        detail: {
          formatter: function (value) {
            return numeral(value).format('0,0') + ' ' + unit;
          },
          fontSize: 16,
          fontWeight: 'bolder'
        },
        min: min,
        max: max,
        splitNumber: splitNumber,
        radius: '100%',
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
        />
      </Fragment>
    );
  }
}

export default Guage;