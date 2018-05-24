import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

export default class Alerts extends Component {

  render() {
    return (
      <Fragment>
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
        </Card>
      </Fragment>
    );
  }
}