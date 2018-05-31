import React, { PureComponent } from 'react';
import uuid from 'uuid';
import { connect } from 'dva';
import { WidthProvider, Responsive } from "react-grid-layout";
import { Bar, Guage, Area, Line, Doughnut } from 'components/ECharts';
import _ from "lodash";
import './index.less';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

/* 
  Connects this react component to the model's state tree.
  Allows the state from the models to be received as props.
*/
@connect(({ grid, home, global, loading }) => ({
  grid,
  home,
  rangePickerValue: global.rangePickerValue,
  loadingData: loading.effects['home/fetch'],
  loadingGrid: loading.effects['grid/fetch']
}))

export default class ReactGridLayoutTest extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { 
      breakpoint: "lg",
      cols: 12
    };

    this.components = {
      Area: Area,
      Bar: Bar,
      Line: Line,
      Guage: Guage
    };

    this.onAddItem = this.onAddItem.bind(this);
    this.onSaveGrid = this.onSaveGrid.bind(this);
    this.onLoadGrid = this.onLoadGrid.bind(this);
    this.onResetGrid = this.onResetGrid.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
  }

  static get defaultProps() {
    return {
      className: "layout",
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      rowHeight: 50,
      grid: {
        layouts: {
          lg: [],
          md: [],
          sm: [],
          xs: [],
          xxs: []
        },
        items: {}
      }
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'grid/fetch'
    });

    this.props.dispatch({
      type: 'home/fetch',
      payload: {
        start: this.props.rangePickerValue[0].valueOf(),
        end: this.props.rangePickerValue[1].valueOf()
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.rangePickerValue[0].valueOf() !== this.props.rangePickerValue[0].valueOf() || 
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
    this.props.dispatch({
      type: 'grid/clearState'
    });

    this.props.dispatch({
      type: 'home/clear'
    });
  }

  createElement(el) {
    const i = el.i;
    const item = this.props.grid.items.find(function(item) { return item.i === i; });
    let ComponentType = null;
    if(item && 'component' in item && 'type' in item.component) {
      ComponentType = this.components[item.component.type];
    }
    return (
      <div key={i} data-grid={el} className="nube-grid-item">
        <span className="nube-drag-handle"></span>
        <span
          className="nube-grid-remove"
          onClick={this.onRemoveItem.bind(this, i)}
        >
          x
        </span>
        {ComponentType && React.createElement(ComponentType, {
          ...item.component.props, 
          xValues: this.props.home.electrical.xValues,
          yValues: this.props.home.electrical.yValues
        }, null)}
      </div>
    );
  }

  onAddItem() {
    let layouts = Object.assign({}, this.props.grid.layouts);

    // Adds the new item to all the layouts for each breakpoint,
    // adding to the bottom of the grid for the current layout and 
    // to y = 0 for the others.
    for (let col in this.props.cols) {
      let y = 0;
      if (this.props.cols[col] === this.state.cols) {
        y = Infinity;
      }
      let newItem = {
        i: uuid(),
        x: (layouts[col].length * 2) % (this.props.cols[col] || 12),
        y: y,
        w: 2,
        h: 2
      };

      layouts[col].push(newItem);
    }

    this.props.dispatch({
      type: 'grid/updateState',
      payload: {
        layouts,
        items: this.props.grid.items
      }
    });
  }

  onRemoveItem(i) {
    this.props.dispatch({
      type: 'grid/updateState',
      payload: {
        layouts: {
          lg: _.reject(this.props.grid.layouts.lg, { i: i }),
          md: _.reject(this.props.grid.layouts.md, { i: i }),
          sm: _.reject(this.props.grid.layouts.sm, { i: i }),
          xs: _.reject(this.props.grid.layouts.xs, { i: i }),
          xxs: _.reject(this.props.grid.layouts.xxs, { i: i })
        },
        items: _.reject(this.props.grid.items, { i: i })
      }
    });
  }

  onSaveGrid() {
    this.props.dispatch({
      type: 'grid/post',
      payload: this.props.grid
    });
  }

  onLoadGrid() {
    this.props.dispatch({
      type: 'grid/fetch'
    });
  }

  onResetGrid() {
    this.props.dispatch({
      type: 'grid/updateState',
      payload: {
        layouts: {
          lg: [],
          md: [],
          sm: [],
          xs: [],
          xxs: []
        },
        items: {}
      }
    });
  }

  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  onLayoutChange(layout, layouts) {
    this.props.dispatch({
      type: 'grid/updateState',
      payload: {
        layouts,
        items: this.props.grid.items
      }
    });
  }

  render() {
    const { home, rangePickerValue, loading, cols, grid, loadingData, loadingGrid } = this.props;

    const {  
      electrical,
      water,
      gas,
      thermal
    } = home;

    return (
      <div>
        <button onClick={this.onAddItem}>Add item</button>
        <button onClick={this.onSaveGrid}>Save</button>
        <button onClick={this.onLoadGrid}>Load</button>
        <button onClick={this.onResetGrid}>Reset</button>
        <ResponsiveReactGridLayout
          className="layout"
          cols={cols}
          rowHeight={30}
          layouts={grid.layouts}
          onLayoutChange={(layout, layouts) =>
            this.onLayoutChange(layout, layouts)
          }
          onBreakpointChange={this.onBreakpointChange}
          draggableHandle=".nube-drag-handle"
        >
          {_.map(grid.layouts[this.state.breakpoint], el => this.createElement(el))}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}