import React, { Component, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import numeral from 'numeral';

class Doughnut extends Component {
  render() {
    var {
      title = '',
      name = '',
      names = ['Peak', 'Off-Peak', 'Shoulder'],
      values = {
        peak: 0, 
        offPeak: 0,
        shoulder: 0,
      },
      range,
      unit = '',
      colour = ['#339999','#333333', '#fbbc07', '#666666'],
    } = this.props;

    // TO REMOVE - Random data generation based on date range
    var startDate = moment(range[0]);
    var endDate = moment(range[1]);
    var numDays = Math.abs(startDate.diff(endDate, 'days')) + 1;

    values.peak = parseFloat(((Math.random() * 200 * numDays) + 500 * numDays).toFixed(2));
    values.offPeak = parseFloat(((Math.random() * 200 * numDays) + 100 * numDays).toFixed(2));
    values.shoulder = parseFloat(((Math.random() * 200 * numDays) + 200 * numDays).toFixed(2));

    var imgName = "";

    if(title) {
      imgName = title;
    } else {
      imgName = "download";
    }

    var option = {
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return (
            params.name + '<br/>' +
            numeral(params.value).format('0,0') + ' ' + unit  + '<br/>' +
            params.percent + '%'
          );
        },
      },
      grid: {
        left: 50,
        right: 50
      },
      legend: {
        data: names,
        bottom: 0
      },
      color: colour,
      series: {
        name:'Accumulated Tariffs',
        type:'pie',
        radius: ['55%', '75%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '24',
              fontWeight: 'bold'
            }
          }
        },
        lableLine: {
            normal: {
              show: true
            },
            emphasis: {
              show: false
            }
        },
        data:[
        {value:values.peak, name:names[0]},
        {value:values.offPeak, name:names[1]},
        {value:values.shoulder, name:names[2]},
        ]
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

export default Doughnut;