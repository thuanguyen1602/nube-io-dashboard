import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, Spin, Icon, InputNumber } from 'antd';
import uuid from 'uuid';
import { connect } from 'dva';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { Bar, Guage, Area, Line } from 'components/ECharts';
import _ from 'lodash';
import './index.less';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const FormItem = Form.Item;
const { Option } = Select;

// Need to move this component into it's own separate file
const ItemCreateForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator, getFieldValue } = form;

      const datasets = getFieldValue('datasets') || 1;

      function generateYNameInputs() {
        const inputs = [];
        for (let i = 0; i < datasets; i++) {
          inputs.push(
            <FormItem key={i} label={`yName ${i + 1}`}>
              {getFieldDecorator(`yNames[${i}]`, {
                rules: [{ required: true, message: 'Please input Y name!', whitespace: true }],
              })(<Input />)}
            </FormItem>
          );
        }
        return inputs;
      }

      return (
        <Modal
          visible={visible}
          title="Add a new Chart"
          okText="Add"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="Chart Type">
              {getFieldDecorator('type', { initialValue: 'Bar' })(
                <Select>
                  <Option value="Bar">Bar</Option>
                  <Option value="Area">Area</Option>
                  <Option value="Line">Line</Option>
                  <Option value="Guage">Guage</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="Title">{getFieldDecorator('title')(<Input />)}</FormItem>
            <FormItem label="File Name">{getFieldDecorator('fileName')(<Input />)}</FormItem>
            <FormItem label="Datasets">
              {getFieldDecorator('datasets', { initialValue: 1 })(<InputNumber min={1} />)}
            </FormItem>
            {generateYNameInputs()}
            <FormItem label="Unit">{getFieldDecorator('unit')(<Input />)}</FormItem>
            <FormItem label="API Address">
              {getFieldDecorator('api', { initialValue: '/api/gas_data' })(<Input />)}
            </FormItem>
            <FormItem label="Colour(s)">
              {getFieldDecorator('colour', { initialValue: '#339999' })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

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
    };

    this.onAddItem = this.onAddItem.bind(this);
    this.onSaveGrid = this.onSaveGrid.bind(this);
    this.onLoadGrid = this.onLoadGrid.bind(this);
    this.onResetGrid = this.onResetGrid.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.saveFormRef = this.saveFormRef.bind(this);
  }

  static get defaultProps() {
    return {
      className: 'layout',
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
              api: item.component.props.api,
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
              api: item.component.props.api,
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

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleCreate() {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.onAddItem(values);
      form.resetFields();
      this.setState({
        visible: false,
      });
    });
  }

  saveFormRef(formRef) {
    this.formRef = formRef;
  }

  handleCancel() {
    const { form } = this.formRef.props;
    form.resetFields();
    this.setState({
      visible: false,
    });
  }

  onAddItem(values) {
    const grid = Object.assign({}, this.props.grid);
    const newId = uuid();

    // Adds the new item to all the layouts for each breakpoint,
    // adding to the bottom of the grid for the current layout and
    // to y = 0 for the others.
    for (const col in this.props.cols) {
      if (Object.prototype.hasOwnProperty.call(this.props.cols, col)) {
        let y = 0;
        if (this.props.cols[col] === this.state.cols) {
          y = Infinity;
        }
        const newItem = {
          i: newId,
          x: (grid.layouts[col].length * 2) % (this.props.cols[col] || 24),
          y,
          w: 8,
          h: 8,
        };
        grid.layouts[col].push(newItem);
      }
    }

    const newItem = {
      i: newId,
      component: {
        type: values.type,
        props: {
          title: values.title,
          fileName: values.fileName,
          datasets: values.datasets,
          yNames: values.yNames,
          unit: values.unit,
          colour: values.colour.split(','),
          style: {
            height: '100%',
            width: '100%',
          },
          exportCsv: false,
          api: values.api,
        },
      },
    };

    grid.items.push(newItem);

    this.props.dispatch({
      type: 'grid/updateState',
      payload: { ...grid },
    });

    this.props.dispatch({
      type: 'http/fetch',
      payload: {
        id: newId,
        api: newItem.component.props.api,
        params: {
          start: this.props.rangePickerValue[0].valueOf(),
          end: this.props.rangePickerValue[1].valueOf(),
        },
      },
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
    const { i } = el;
    const item = this.props.grid.items.find(anItem => {
      return anItem.i === i;
    });
    let ComponentType = null;
    let data = {};
    if (item && 'component' in item && 'type' in item.component) {
      ComponentType = this.components[item.component.type];
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
              <Icon type="loading-3-quarters" style={{ fontSize: 30, color: '#339999' }} spin />
            }
            delay={300}
          >
            {React.createElement(
              ComponentType,
              {
                ...item.component.props,
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
    const { cols, grid } = this.props;

    return (
      <div>
        <button onClick={this.showModal}>Add item</button>
        <button onClick={this.onSaveGrid}>Save</button>
        <button onClick={this.onLoadGrid}>Load</button>
        <button onClick={this.onResetGrid}>Reset</button>
        <ResponsiveReactGridLayout
          className="layout"
          cols={cols}
          rowHeight={30}
          layouts={grid.layouts}
          onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)}
          onBreakpointChange={this.onBreakpointChange}
          draggableHandle=".nube-drag-handle"
        >
          {_.map(grid.layouts[this.state.breakpoint], el => this.createElement(el))}
        </ResponsiveReactGridLayout>
        <ItemCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}
