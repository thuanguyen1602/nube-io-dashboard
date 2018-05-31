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

export default class Home extends Component {
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
      type: 'home/clear'
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
              <TabPane tab="Electrical" key="electrical">
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar
                        title="Per Day Usage"
                        fileName="Electrical Usage"
                        datasets={3}
                        xValues={electrical.xValues}
                        yValues={electrical.yValues}
                        yNames={["Peak", "Off-Peak", "Shoulder"]}
                        unit="kWh"
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
                  <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Line 
                        title="Accumulated Usage"
                        fileName="Accumulated Electrical Usage"
                        datasets={3}
                        xValues={electrical.xValues}
                        yValues={electrical.yValues}
                        yNames={["Peak", "Off-Peak", "Shoulder"]}
                        unit="kWh"
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Doughnut 
                        title="Accumulated Usage"
                        names={['Peak', 'Off-Peak', 'Shoulder']}
                        values={electrical.yValues}
                        datasets={3}
                        unit='kWh'
                      />
                    </div>
                  </Col>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Area 
                        title="Per Day Usage"
                        fileName="Electrical Usage"
                        datasets={3}
                        xValues={electrical.xValues}
                        yValues={electrical.yValues}
                        yNames={["Peak", "Off-Peak", "Shoulder"]}
                        unit="kWh"                      
                      />
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Water" key="water">
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar 
                        title="Per Day Usage"
                        fileName="Water Usage"
                        xValues={water.xValues}
                        yValues={water.yValues}
                        yNames="Water"
                        unit="kL"
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Guage 
                        title='Current Usage'
                        name='Liters/Hour'
                        min={0}
                        max={100}
                        value={50}
                        unit='L/H'
                      />
                    </div>
                  </Col>
                  <Col xl={16} lg={16} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Line 
                        title="Accumulated Usage"
                        fileName="Accumulated Water Usage"
                        xValues={water.xValues}
                        yValues={water.yValues}
                        yNames="Water"
                        unit="kL"
                      />
                    </div>
                  </Col>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Area 
                        title="Per Day Usage"
                        fileName="Water Usage"
                        xValues={water.xValues}
                        yValues={water.yValues}
                        yNames="Water"
                        unit="kL"
                      />
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Gas" key="gas">
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar 
                        title="Per Day Usage"
                        fileName="Gas Usage"
                        xValues={gas.xValues}
                        yValues={gas.yValues}
                        yNames="Gas"
                        unit="MJ"
                        colour={"#333333"}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Guage 
                        title='Current Usage'
                        name='Kilowatts'
                        min={0}
                        max={200}
                        value={100}
                        unit='kW'
                      />
                    </div>
                  </Col>
                  <Col xl={16} lg={16} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Line 
                        title="Accumulated Usage"
                        fileName="Accumulated Gas Usage"
                        xValues={gas.xValues}
                        yValues={gas.yValues}
                        yNames="Gas"
                        unit="MJ"
                        colour={"#333333"}
                      />
                    </div>
                  </Col>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Area 
                        title="Per Day Usage"
                        fileName="Gas Usage"
                        xValues={gas.xValues}
                        yValues={gas.yValues}
                        yNames="Gas"
                        unit="MJ"
                        colour={"#333333"}
                      />
                    </div>
                  </Col>
                </Row>
              </TabPane>
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
