import React, { Component, Fragment } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
// import { Slider } from 'antd';
import styled from 'styled-components';

class NubeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 50,
    };
  }

  onSliderChange = value => {
    // console.log("onSliderChange:", value);
    // this.setState({
    //   value,
    // });
  };

  render() {
    const { title = '', height = 44, width, min = 0, max = 100, colour = '#399' } = this.props;

    let formattedWidth = width;

    if (!width) {
      formattedWidth = '100%';
    } else {
      formattedWidth = `${width}px`;
    }

    const StyleWrapper = styled.div``;

    // const style = {
    //   height: `${height}px`,
    //   width: formattedWidth,
    //   display: 'block',
    //   margin: '0 auto',
    // };

    const style = { width: 600, margin: 50 };

    return (
      <Fragment>
        {title && <h2>{title}</h2>}
        <StyleWrapper>
          <Slider
            min={min}
            max={max}
            // value={this.state.value}
            onChange={this.onSliderChange}
          />
        </StyleWrapper>
      </Fragment>
    );
  }
}

export default NubeSlider;
