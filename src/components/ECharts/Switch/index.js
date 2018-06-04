import React, { Component, Fragment } from 'react';
import { Switch as AntSwitch } from 'antd';
import styled from 'styled-components';

class Switch extends Component {
  state = {
    checked: true,
  };

  onChange = value => {
    this.setState({
      checked: value,
    });
  };

  render() {
    const {
      title = '',
      height = 44,
      width = 88,
      onColour = '#399',
      offColour = '#c1c1c0',
    } = this.props;

    const StyleWrapper = styled.div`
      .ant-switch {
        background-color: ${offColour};
      }
      .ant-switch::after {
        height: ${height - 4}px;
        width: ${height - 4}px;
        border-radius: ${height - 4}px;
        margin-left: 0px;
      }
      .ant-switch-checked {
        background-color: ${onColour} !important;
      }
      .ant-switch-checked::after {
        margin-left: ${-height + 4}px !important;
      }
    `;

    const style = {
      height: `${height}px`,
      width: `${width}px`,
      display: 'block',
      margin: '0 auto',
    };

    return (
      <Fragment>
        {title && <h2>{title}</h2>}
        <StyleWrapper>
          <AntSwitch style={style} checked={this.state.checked} onChange={this.onChange} />
        </StyleWrapper>
      </Fragment>
    );
  }
}

export default Switch;
