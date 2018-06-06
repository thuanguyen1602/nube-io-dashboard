import React, { Component, Fragment } from 'react';
import { Switch as AntSwitch } from 'antd';
import styled from 'styled-components';

class Switch extends Component {
  onChange = value => {
    this.props.onChange(value, this.props);
  };

  render() {
    const {
      title = '',
      height = 44,
      width,
      onColour = '#399',
      offColour = '#c1c1c0',
      value,
    } = this.props;

    let formattedWidth = width;

    if (!width) {
      formattedWidth = '100%';
    } else {
      formattedWidth = `${width}px`;
    }

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
        margin-left: ${-height + 2}px !important;
      }
    `;

    const style = {
      height: `${height}px`,
      width: formattedWidth,
      display: 'block',
      margin: '0 auto',
    };

    return (
      <Fragment>
        {title && <h2>{title}</h2>}
        <StyleWrapper>
          <AntSwitch checked={value} style={style} onChange={this.onChange} />
        </StyleWrapper>
      </Fragment>
    );
  }
}

export default Switch;
