import React, { PureComponent, Fragment } from 'react';
import { Spin, Icon } from 'antd';
import uuid from 'uuid';
import { connect } from 'dva';
import { Responsive, WidthProvider } from 'react-grid-layout';
import _ from 'lodash';
import CreateItemForm from './CreateItemForm';
// import WidthProvider from './WidthProvider';
import { Bar, Guage, Area, Line, Switch } from './../ECharts';

import './index.less';

let ResponsiveReactGridLayout = WidthProvider(Responsive);

/*
  Connects this react component to the model's state tree.
  Allows the state from the models to be received as props.
*/
@connect(({ http, grid, global, loading }) => ({
  http,
  grid,
  rangePickerValue: global.rangePickerValue,
  loadingGrid: loading.effects['grid/fetch'],
}))
export default class ReactGridLayoutTest extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      breakpoint: 'lg',
      cols: 24,
      visible: false,
    };

    this.components = {
      Area,
      Bar,
      Line,
      Guage,
      Switch,
    };

    this.addGridItem = this.addGridItem.bind(this);
    this.onSaveGrid = this.onSaveGrid.bind(this);
    this.onLoadGrid = this.onLoadGrid.bind(this);
    this.onResetGrid = this.onResetGrid.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.saveFormRef = this.saveFormRef.bind(this);
    this.onUpdateItem = this.onUpdateItem.bind(this);
  }

  static get defaultProps() {
    return {
      cols: { lg: 24, md: 12, sm: 8, xs: 4, xxs: 2 },
      rowHeight: 50,
      grid: {
        layouts: {
          lg: [],
          md: [],
          sm: [],
          xs: [],
          xxs: [],
        },
        items: [],
      },
      http: {},
    };
  }

  componentDidMount() {
    ResponsiveReactGridLayout = WidthProvider(Responsive);
    this.props
      .dispatch({
        type: 'grid/fetch',
      })
      .then(() => {
        this.props.grid.items.forEach(item => {
          this.props.dispatch({
            type: 'http/fetch',
            payload: {
              id: item.i,
              api: item.api,
              params: {
                start: this.props.rangePickerValue[0].valueOf(),
                end: this.props.rangePickerValue[1].valueOf(),
              },
            },
          });
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.rangePickerValue[0].valueOf() !== this.props.rangePickerValue[0].valueOf() ||
      nextProps.rangePickerValue[1].valueOf() !== this.props.rangePickerValue[1].valueOf()
    ) {
      if (this.props.grid.items) {
        this.props.grid.items.forEach(item => {
          this.props.dispatch({
            type: 'http/fetch',
            payload: {
              id: item.i,
              api: item.api,
              params: {
                start: nextProps.rangePickerValue[0].valueOf(),
                end: nextProps.rangePickerValue[1].valueOf(),
              },
            },
          });
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'grid/clearState',
    });

    this.props.dispatch({
      type: 'http/clearState',
    });
  }

  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint,
      cols,
    });
  }

  onLayoutChange(layout, layouts) {
    this.props.dispatch({
      type: 'grid/updateState',
      payload: {
        layouts,
        items: this.props.grid.items,
      },
    });
  }

  showModal(id) {
    const state = JSON.parse(JSON.stringify(this.state));
    state.visible = true;
    state.currId = id;
    this.setState(state);
  }

  handleFormChange(values) {
    this.onUpdateItem(values);
  }

  handleSubmit() {
    const { form } = this.formRef.props;
    const state = JSON.parse(JSON.stringify(this.state));

    form.validateFields(err => {
      if (err) {
        return;
      }

      form.resetFields();
      state.visible = false;
      state.currId = null;
      this.setState(state);
    });
  }

  handleCancel() {
    const { form } = this.formRef.props;
    const state = JSON.parse(JSON.stringify(this.state));

    this.onRemoveItem(state.currId);

    form.resetFields();
    state.visible = false;
    state.currId = null;
    this.setState(state);
  }

  saveFormRef(formRef) {
    this.formRef = formRef;
  }

  addGridItem() {
    const grid = JSON.parse(JSON.stringify(this.props.grid));
    const newId = uuid();

    // Adds the new item to all the layouts for each breakpoint
    for (const col in this.props.cols) {
      if (Object.prototype.hasOwnProperty.call(this.props.cols, col)) {
        const newItem = {
          i: newId,
          x: 0,
          y: 0,
          w: 8,
          h: 8,
        };
        grid.layouts[col].push(newItem);
      }
    }

    const newItem = {
      i: newId,
    };

    grid.items.push(newItem);

    this.props.dispatch({
      type: 'grid/updateState',
      payload: { ...grid },
    });

    this.showModal(newId);
  }

  onUpdateItem(values) {
    const grid = JSON.parse(JSON.stringify(this.props.grid));
    const itemIndex = grid.items.findIndex(anItem => anItem.i === this.state.currId);

    grid.items[itemIndex] = {
      ...grid.items[itemIndex],
      ...values,
      style: {
        height: '100%',
        width: '100%',
      },
      exportCsv: false,
    };

    if (
      grid.items[itemIndex].api &&
      this.props.grid.items[itemIndex].api !== grid.items[itemIndex].api
    ) {
      this.props.dispatch({
        type: 'http/fetch',
        payload: {
          id: this.state.currId,
          api: grid.items[itemIndex].api,
          params: {
            start: this.props.rangePickerValue[0].valueOf(),
            end: this.props.rangePickerValue[1].valueOf(),
          },
        },
      });
    }

    this.props.dispatch({
      type: 'grid/updateState',
      payload: { ...grid },
    });
  }

  onRemoveItem(i) {
    this.props.dispatch({
      type: 'grid/updateState',
      payload: {
        layouts: {
          lg: _.reject(this.props.grid.layouts.lg, { i }),
          md: _.reject(this.props.grid.layouts.md, { i }),
          sm: _.reject(this.props.grid.layouts.sm, { i }),
          xs: _.reject(this.props.grid.layouts.xs, { i }),
          xxs: _.reject(this.props.grid.layouts.xxs, { i }),
        },
        items: _.reject(this.props.grid.items, { i }),
      },
    });
  }

  onSaveGrid() {
    this.props.dispatch({
      type: 'grid/post',
      payload: this.props.grid,
    });
  }

  onLoadGrid() {
    this.props.dispatch({
      type: 'grid/fetch',
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
          xxs: [],
        },
        items: [],
      },
    });
  }

  createElement(el) {
    let ComponentType = null;
    let data = {};
    const { i } = el;

    const item = this.props.grid.items.find(anItem => {
      return anItem.i === i;
    });

    if (item && 'type' in item) {
      ComponentType = this.components[item.type];
      if (this.props.http[item.i]) {
        data = this.props.http[item.i];
      }
    }

    return (
      <div key={i} data-grid={el} className="nube-grid-item">
        <span className="nube-drag-handle" />
        <span className="nube-grid-remove" onClick={this.onRemoveItem.bind(this, i)}>
          x
        </span>

        {ComponentType && (
          <Spin
            wrapperClassName="nube-spinner"
            spinning={data.loading}
            indicator={
              <Icon type="loading-3-quarters" style={{ fontSize: 30, color: '#399' }} spin />
            }
            delay={300}
          >
            {React.createElement(
              ComponentType,
              {
                ...item,
                ...data,
              },
              null
            )}
          </Spin>
        )}
      </div>
    );
  }

  render() {
    const { cols, grid, loadingGrid } = this.props;

    return (
      <Fragment>
        <button onClick={this.addGridItem}>Add item</button>
        <button onClick={this.onSaveGrid}>Save</button>
        <button onClick={this.onLoadGrid}>Load</button>
        <button onClick={this.onResetGrid}>Reset</button>
        <ResponsiveReactGridLayout
          className="nube-grid-layout"
          cols={cols}
          rowHeight={30}
          layouts={grid.layouts}
          onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)}
          onBreakpointChange={this.onBreakpointChange}
          draggableHandle=".nube-drag-handle"
        >
          {_.map(grid.layouts[this.state.breakpoint], el => this.createElement(el))}
        </ResponsiveReactGridLayout>
        <CreateItemForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          handleFormChange={this.handleFormChange}
          handleCancel={this.handleCancel}
          handleSubmit={this.handleSubmit}
        />
      </Fragment>
    );
  }
}
