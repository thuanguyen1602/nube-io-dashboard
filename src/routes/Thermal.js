import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs } from 'antd';
import numeral from 'numeral';
import styles from './Home.less';
import { Bar, Guage, Area, Line, Doughnut } from 'components/ECharts';
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
@connect(({ home, global, loading }) => ({
  home,
  rangePickerValue: global.rangePickerValue,
  loading: loading.effects['home/fetch']
}))

export default class Thermal extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'home/fetch',
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
        type: 'home/fetch',
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
      type: 'home/clear',
    });
  }

  render() {
    const { home, rangePickerValue, loading } = this.props;

    const {  
      electrical,
      water,
      gas,
      thermal
    } = home;

    var lastUpdate = moment().minute(Math.floor(moment().minute() / 15) * 15).second(0).toString();

    return (
      <Fragment>
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="Thermal" key="thermal">
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar 
                        title="Per Day Usage"
                        fileName="Thermal Usage"
                        xValues={thermal.xValues}
                        yValues={thermal.yValues}
                        yNames="Thermal"
                        unit="kWh"
                        colour={"#fbbc07"}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Guage 
                        title='Current Usage'
                        name='Kilowatts'
                        min={0}
                        max={600}
                        value={500}
                        unit='kW'
                      />
                    </div>
                  </Col>
                  <Col xl={16} lg={16} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Line 
                        title="Accumulated Usage"
                        fileName="Accumulated Thermal Usage"
                        xValues={thermal.xValues}
                        yValues={thermal.yValues}
                        yNames="Thermal"
                        unit="kWh"
                        colour={"#fbbc07"}
                      />
                    </div>
                  </Col>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Area 
                        title="Per Day Usage"
                        fileName="Thermal Usage"
                        xValues={thermal.xValues}
                        yValues={thermal.yValues}
                        yNames="Thermal"
                        unit="kWh"
                        colour={"#fbbc07"}
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
