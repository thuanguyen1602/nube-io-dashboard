import React, { PureComponent, Fragment } from 'react';
import { Spin, Icon } from 'antd';
import uuid from 'uuid';
import { connect } from 'dva';
import { Responsive, WidthProvider } from 'react-grid-layout';
import _ from 'lodash';
import CreateItemForm from './CreateItemForm';
import { Bar, Guage, Area, Line, Switch, Doughnut } from './../ECharts';
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
      currItem: {
        new: false,
      },
      prevItem: {},
    };

    this.components = {
      Area,
      Bar,
      Line,
      Guage,
      Switch,
      Doughnut,
    };

    this.onSaveGrid = this.onSaveGrid.bind(this);
    this.onLoadGrid = this.onLoadGrid.bind(this);
    this.onResetGrid = this.onResetGrid.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.saveFormRef = this.saveFormRef.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.editGridItem = this.editGridItem.bind(this);
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

  onAddItem() {
    // Makes a deep copy of the grid state and component state to modify
    const grid = JSON.parse(JSON.stringify(this.props.grid));
    const state = JSON.parse(JSON.stringify(this.state));
    const newId = uuid();

    // Adds the new item to all the layouts for each breakpoint
    // y = -0.0001 so that the new item is inserted at the top left.
    for (const col in this.props.cols) {
      if (Object.prototype.hasOwnProperty.call(this.props.cols, col)) {
        const newItem = {
          i: newId,
          x: 0,
          y: -0.0001,
          w: 8,
          h: 8,
        };
        grid.layouts[col].push(newItem);
      }
    }

    // Creates new initial item with new id
    const newItem = {
      i: newId,
    };

    grid.items.push(newItem);

    // Updates the grid state
    this.props.dispatch({
      type: 'grid/updateState',
      payload: { ...grid },
    });

    state.visible = true;
    state.currItem = {
      i: newId,
      new: true,
    };
    this.setState(state);
  }

  onSubmit() {
    const { form } = this.formRef.props;
    const state = JSON.parse(JSON.stringify(this.state));

    form.validateFields(err => {
      if (err) {
        return;
      }

      this.updateItem();

      form.resetFields();
      state.visible = false;
      state.currItem = {
        new: false,
      };
      this.setState(state);
    });
  }

  onCancel() {
    const { form } = this.formRef.props;
    const state = JSON.parse(JSON.stringify(this.state));

    if (this.state.currItem.new) {
      this.onRemoveItem(state.currItem.i);
    } else {
      this.updateItem(state.prevItem);
    }

    form.resetFields();
    state.visible = false;
    state.currItem = {
      new: false,
    };
    state.prevItem = {};
    this.setState(state);
  }

  saveFormRef(formRef) {
    this.formRef = formRef;
  }

  editGridItem(item) {
    const state = JSON.parse(JSON.stringify(this.state));
    state.visible = true;
    state.currItem = {
      new: false,
      ...item,
    };
    state.prevItem = {
      ...item,
    };
    this.setState(state);
  }

  updateItem(values) {
    // Makes a deep copy of the grid state and component state to modify
    const grid = JSON.parse(JSON.stringify(this.props.grid));
    const state = JSON.parse(JSON.stringify(this.state));
    // Finds the current item in order to modify settings
    const itemIndex = grid.items.findIndex(anItem => anItem.i === this.state.currItem.i);

    if (grid.items[itemIndex]) {
      // Modifies the current item settings with new values from form and existing values
      grid.items[itemIndex] = {
        ...grid.items[itemIndex],
        ...values,
        style: {
          height: '100%',
          width: '100%',
        },
        exportCsv: true,
      };

      state.currItem = {
        ...state.currItem,
        ...values,
      };

      this.setState(state);

      // If no parameters are provided in updateItem, form must be submitting so update y positions in
      // the layouts from -0.0001 to 0 so that new items added later are added to the top of the page.
      if (!values && state.currItem.new) {
        for (const col in this.props.cols) {
          if (Object.prototype.hasOwnProperty.call(this.props.cols, col)) {
            const layoutItemIndex = grid.layouts[col].findIndex(
              anItem => anItem.i === this.state.currItem.i
            );
            if (layoutItemIndex !== -1) {
              grid.layouts[col][layoutItemIndex].y = 0;
            }
          }
        }
      }

      // If an api value is provided and it is different from the current value, dispatch
      // a http fetch to get the data from the api.
      if (
        grid.items[itemIndex].api &&
        this.props.grid.items[itemIndex].api !== grid.items[itemIndex].api
      ) {
        this.props.dispatch({
          type: 'http/fetch',
          payload: {
            id: grid.items[itemIndex].i,
            api: grid.items[itemIndex].api,
            params: {
              start: this.props.rangePickerValue[0].valueOf(),
              end: this.props.rangePickerValue[1].valueOf(),
            },
          },
        });
      }

      // Updates the grid state
      this.props.dispatch({
        type: 'grid/updateState',
        payload: { ...grid },
      });
    }
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

  createElement(el) {
    let ComponentType = null;
    let data = {};
    let isLoading = false;
    const { i } = el;

    const item = this.props.grid.items.find(anItem => {
      return anItem.i === i;
    });

    if (item && 'type' in item) {
      ComponentType = this.components[item.type];
      if (this.props.http[item.i]) {
        data = this.props.http[item.i];
        isLoading = this.props.http[item.i].loading || false;
      }
    }

    return (
      <div key={i} data-grid={el} className="nube-grid-item">
        <span className="nube-drag-handle" />
        <span className="nube-grid-edit" onClick={this.editGridItem.bind(this, item)}>
          <Icon type="edit" />
        </span>
        <span className="nube-grid-remove" onClick={this.onRemoveItem.bind(this, i)}>
          x
        </span>

        {ComponentType && (
          <Spin
            wrapperClassName="nube-spinner"
            spinning={isLoading}
            indicator={
              <Icon type="loading-3-quarters" style={{ fontSize: 30, color: '#399' }} spin />
            }
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
        <button onClick={this.onAddItem} disabled={this.state.visible}>
          Add
        </button>
        <button onClick={this.onSaveGrid} disabled={this.state.visible}>
          Save
        </button>
        <button onClick={this.onLoadGrid} disabled={this.state.visible}>
          Load
        </button>
        <button onClick={this.onResetGrid} disabled={this.state.visible}>
          Reset
        </button>
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
          inputValues={this.state.currItem}
          onFormChange={this.updateItem}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
        />
      </Fragment>
    );
  }
}
