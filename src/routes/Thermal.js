import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Tabs,
  DatePicker,
} from 'antd';
import numeral from 'numeral';
import { getTimeDistance } from '../utils/utils';
import styles from './Home.less';
import { Bar, Guage, Area, Line, Doughnut } from 'components/ECharts';
import moment from 'moment';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const FormatkWh = function({ children }) {
  const kWh = val => `${numeral(val).format('0,0')} kWh`;
  return <span dangerouslySetInnerHTML={{ __html: kWh(children) }} /> /* eslint-disable-line react/no-danger */
  // return <span dangerouslySetInnerHTML={{ __html: `${numeral(children).format('0,0')} kWh` }} /> /* eslint-disable-line react/no-danger */
}

@connect(({ home, loading }) => ({
  home,
  loading: loading.effects['home/fetch'],
}))
export default class Thermal extends Component {
  state = {
    rangePickerValue: getTimeDistance('month'),
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'home/fetch',
      payload: {
        start: this.state.rangePickerValue[0].valueOf(),
        end: this.state.rangePickerValue[1].valueOf()
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/clear',
    });
  }

  handleRangePickerChange = rangePickerValue => {
    this.setState({
      rangePickerValue,
    });

    this.props.dispatch({
      type: 'home/fetch',
      payload: {
        start: rangePickerValue[0].valueOf(),
        end: rangePickerValue[1].valueOf()
      },
    });
  };

  selectDate = type => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    this.props.dispatch({
      type: 'home/fetch',
      payload: {
        start: getTimeDistance(type)[0].valueOf(),
        end: getTimeDistance(type)[1].valueOf()
      },
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  render() {
    const { rangePickerValue } = this.state;
    const { home, loading } = this.props;

    const {  
      electrical,
      water,
      gas,
      thermal,
    } = home;

    const usageDate = (
      <div className={styles.usageDateWrap}>
        <div className={styles.usageDate}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            Today
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            This Week
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            This Month
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            This Year
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          format="DD-MM-YYYY"
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    var lastUpdate = moment().minute(Math.floor(moment().minute() / 15) * 15).second(0).toString();

    return (
      <Fragment>
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={usageDate} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="Thermal" key="thermal">
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar 
                        title="Per Day Usage"
                        fileName="Thermal Usage"
                        range={rangePickerValue}
                        yNames="Thermal"
                        xValues={thermal.xValues}
                        yValues={thermal.yValues}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Guage 
                        name="Kilowatts"
                        unit='KW'
                        value={500}
                        min={0}
                        max={600}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Line 
                        title="Accumulated Usage"
                        range={rangePickerValue}
                        unit='kWh'
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Doughnut 
                        title="Accumulated Usage"
                        range={rangePickerValue}
                        unit='kWh'
                      />
                    </div>
                  </Col>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Area 
                        title="Per Day Usage"
                        range={rangePickerValue}
                      />
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>
        {lastUpdate && (
          <div className={styles.lastUpdate}>
            <span>Last Updated: {lastUpdate}</span>
          </div>
        )}
      </Fragment>
    );
  }
}
