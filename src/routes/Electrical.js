import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Col, Icon, Row, Tabs, Tooltip } from 'antd';
import { ChartCard, Field, MiniProgress } from 'components/Charts';
import { Bar, Guage, Area, Line, Doughnut } from 'components/ECharts';
import Trend from 'components/Trend';
import numeral from 'numeral';
import styles from './Electrical.less';
import moment from 'moment';

const { TabPane } = Tabs;

const FormatkWh = function({ children }) {
  const kWh = val => `${numeral(val).format('0,0')} kWh`;
  return <span dangerouslySetInnerHTML={{ __html: kWh(children) }} /> /* eslint-disable-line react/no-danger */
}

/* 
  Connects this react component to the model's state tree.
  Allows the state from the models to be received as props.
*/
@connect(({ electrical, global, loading }) => ({
  electrical,
  rangePickerValue: global.rangePickerValue,
  loading: loading.effects['electrical/fetch']
}))

export default class Electrical extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'electrical/fetch',
      payload: {
        start: this.props.rangePickerValue[0].valueOf(),
        end: this.props.rangePickerValue[1].valueOf()
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.rangePickerValue[0].valueOf() !== this.props.rangePickerValue[0].valueOf() && 
      nextProps.rangePickerValue[1].valueOf() !== this.props.rangePickerValue[1].valueOf()) {
       this.props.dispatch({
        type: 'electrical/fetch',
        payload: {
          start: nextProps.rangePickerValue[0].valueOf(),
          end: nextProps.rangePickerValue[1].valueOf()
        }
     });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'electrical/clear'
    });
  }

  render() {
    const { electrical, loading, rangePickerValue } = this.props;

    var {  
      club,
      carpark,
      seniorsCommon,
      seniorsLiving
    } = electrical;

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
            <Tabs size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="Club" key="club">
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar 
                        title="Per Day Usage"
                        fileName="Electrical Usage"
                        datasets={3}
                        xValues={club.xValues}
                        yValues={club.yValues}
                        yNames={["Peak", "Off-Peak", "Shoulder"]}
                        unit="kWh"
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
                        fileName="Electrical Usage"
                        datasets={3}
                        xValues={carpark.xValues}
                        yValues={carpark.yValues}
                        yNames={["Peak", "Off-Peak", "Shoulder"]}
                        unit="kWh"
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
                        fileName="Electrical Usage"
                        datasets={3}
                        xValues={seniorsCommon.xValues}
                        yValues={seniorsCommon.yValues}
                        yNames={["Peak", "Off-Peak", "Shoulder"]}
                        unit="kWh"
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
                        fileName="Electrical Usage"
                        datasets={3}
                        xValues={seniorsLiving.xValues}
                        yValues={seniorsLiving.yValues}
                        yNames={["Peak", "Off-Peak", "Shoulder"]}
                        unit="kWh"
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
