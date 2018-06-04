import React, { Component, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import numeral from 'numeral';

class Doughnut extends Component {
  render() {
    const {
      title = '',
      name = '',
      names = '',
      values = {},
      unit = '',
      colour = ['#399', '#333333', '#fbbc07', '#666666'],
      style = {},
    } = this.props;

    const data = [];
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    let i = 0;
    for (let prop in values) {
      data.push({
        value: values[prop].reduce(reducer),
        name: names[i],
      });
      i++;
    }

    var imgName = '';

    if (title) {
      imgName = title;
    } else {
      imgName = 'download';
    }

    var option = {
      tooltip: {
        formatter: function(params) {
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
        data: names,
        bottom: 0,
      },
      color: colour,
      series: {
        name: 'Accumulated Tariffs',
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
        data: data,
      },
    };

    return (
      <Fragment>
        <ReactEcharts option={option} theme="standard" style={style} />
      </Fragment>
    );
  }
}

export default Doughnut;
