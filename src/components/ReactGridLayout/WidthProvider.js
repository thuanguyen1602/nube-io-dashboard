import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const initialState = {
  width: 1280,
};

const WidthProvider = ComposedComponent =>
  class extends Component {
    static propTypes = {
      measureBeforeMount: PropTypes.bool,
    };

    static defaultProps = {
      measureBeforeMount: false,
    };

    constructor(props) {
      super(props);

      this.state = initialState;
    }

    componentDidMount() {
      this.mounted = true;

      window.addEventListener('resize', this.onWindowResize);

      this.onWindowResize();
    }

    componentWillUnmount() {
      this.mounted = false;

      window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {
      setTimeout(() => {
        this.calculateWidth();
      }, 0);
    };

    mounted = false;

    calculateWidth = () => {
      if (!this.mounted) return;
      const node = ReactDOM.findDOMNode(this);

      if (node instanceof HTMLElement) {
        this.setState({ width: node.offsetWidth });
      }
    };

    render() {
      if (this.props.measureBeforeMount && !this.mounted) {
        return <div className={this.props.className} style={this.props.style} />;
      }

      return <ComposedComponent {...this.props} {...this.state} />;
    }
  };

export default WidthProvider;
