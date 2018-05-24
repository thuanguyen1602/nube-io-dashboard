import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import ReactGridLayout from 'components/ReactGridLayout';

export default class Trends extends Component {

  render() {
    return (
      <Fragment>
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
        </Card>
        <ReactGridLayout />
      </Fragment>
    );
  }
}