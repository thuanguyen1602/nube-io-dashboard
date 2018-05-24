import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Col, DatePicker, Icon, Row, Tabs, Tooltip } from 'antd';
import { ChartCard, Field, MiniProgress } from 'components/Charts';
import { Bar, Guage, Area, Line, Doughnut } from 'components/ECharts';
import Trend from 'components/Trend';
import numeral from 'numeral';
import { getTimeDistance, randInt } from '../utils/utils';
import styles from './Electrical.less';
import moment from 'moment';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const FormatkWh = function({ children }) {
  const kWh = val => `${numeral(val).format('0,0')} kWh`;
  return <span dangerouslySetInnerHTML={{ __html: kWh(children) }} /> /* eslint-disable-line react/no-danger */
  // return <span dangerouslySetInnerHTML={{ __html: `${numeral(children).format('0,0')} kWh` }} /> /* eslint-disable-line react/no-danger */
}

@connect(
  function({ electrical, loading }) {
    return {
      electrical,
      loading: loading.effects['electrical/fetch'],
    }
  }
)

export default class Electrical extends Component {
  state = {
    rangePickerValue: getTimeDistance('month'),
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'electrical/fetch',
      payload: {
        start: this.state.rangePickerValue[0].valueOf(),
        end: this.state.rangePickerValue[1].valueOf()
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'electrical/clear',
    });
  }

  handleRangePickerChange = rangePickerValue => {
    this.setState({
      rangePickerValue,
    });

    this.props.dispatch({
      type: 'electrical/fetch',
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
      type: 'electrical/fetch',
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
    const { electrical, loading } = this.props;

    var {  
      club,
      carpark,
      seniorsCommon,
      seniorsLiving,
    } = electrical;

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

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    return (
      <Fragment>
       <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              loading={loading}
              bordered={false}
              title="Club"
              action={
                <Tooltip title="Club Electrical Usage">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <FormatkWh>{club.sum}</FormatkWh>}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              loading={loading}
              bordered={false}
              title="Carpark"
              action={
                <Tooltip title="Carpark Electrical Usage">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <FormatkWh>{carpark.sum}</FormatkWh>}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              loading={loading}
              bordered={false}
              title="Seniors Common"
              action={
                <Tooltip title="Seniors Common Electrical Usage">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <FormatkWh>{seniorsCommon.sum}</FormatkWh>}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              loading={loading}
              bordered={false}
              title="Seniors Living"
              action={
                <Tooltip title="Seniors Living Electrical Usage">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <FormatkWh>{seniorsLiving.sum}</FormatkWh>}
              contentHeight={46}
            >
              
            </ChartCard>
          </Col>
        </Row>
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={usageDate} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="Club" key="club">
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar 
                        title="Per Day Usage"
                        fileName="Club Electrical Usage"
                        range={rangePickerValue}
                        xValues={club.xValues}
                        yValues={club.yValues}
                      />
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Carpark" key="carpark">
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar 
                        title="Per Day Usage"
                        fileName="Carpark Electrical Usage"
                        range={rangePickerValue}
                        xValues={carpark.xValues}
                        yValues={carpark.yValues}
                      />
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Seniors Common" key="seniorsCommon">
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar 
                        title="Per Day Usage"
                        fileName="Seniors Common Electrical Usage"
                        range={rangePickerValue}
                        xValues={seniorsCommon.xValues}
                        yValues={seniorsCommon.yValues}
                      />
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Seniors Living" key="seniorsLiving">
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar 
                        title="Per Day Usage"
                        fileName="Seniors Living Electrical Usage"
                        range={rangePickerValue}
                        xValues={seniorsLiving.xValues}
                        yValues={seniorsLiving.yValues}
                      />
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </Fragment>
    );
  }
}
