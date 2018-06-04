import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, InputNumber } from 'antd';
import RGL, { WidthProvider } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL);

const FormItem = Form.Item;
const { Option } = Select;

export default Form.create()(
  class CreateItemForm extends Component {
    constructor(props) {
      super(props);

      this.state = {
        layout: [
          {
            i: 'nube-form-item',
            w: 22,
            h: 13,
            x: 22,
            y: 6,
          },
        ],
        inputTimeout: null,
      };

      this.handleLayoutChange = this.handleLayoutChange.bind(this);
      this.handleFormChange = this.handleFormChange.bind(this);
    }

    static get defaultProps() {
      return {
        className: 'nube-form-grid',
        cols: 60,
        rowHeight: 30,
        compactType: null,
      };
    }

    handleLayoutChange(layout) {
      this.setState({ layout });
    }

    handleFormChange() {
      // Timeout so that the values can be updated after input change and before
      // passing the data to the parent.
      setTimeout(() => {
        const fieldsValue = this.props.form.getFieldsValue();
        if (fieldsValue.colour) {
          fieldsValue.colour = fieldsValue.colour.split(',');
        }
        if (fieldsValue.colour === '') {
          fieldsValue.colour = undefined;
        }

        // const state = JSON.parse(JSON.stringify(this.state));

        // clearTimeout(this.state.inputTimeout);

        // Uncomment to set debounce for input. Causes updates to be passed
        // to the parent after the input fields haven't been edited for 500 ms.
        // state.inputTimeout = setTimeout(() => {
        this.props.handleFormChange(fieldsValue);
        // }, 500);

        // this.setState(state);
      }, 100);
    }

    render() {
      const { visible, handleCancel, handleSubmit, form } = this.props;
      const { getFieldDecorator, getFieldValue } = form;

      const datasets = getFieldValue('datasets') || 1;
      const type = getFieldValue('type') || 1;

      const yNameInputs = [];
      for (let i = 0; i < datasets; i++) {
        yNameInputs.push(
          <FormItem key={i} label={`yName ${i + 1}`}>
            {getFieldDecorator(`yNames[${i}]`, {
              rules: [{ required: false, message: 'Please input Y name!', whitespace: true }],
            })(<Input onChange={this.handleFormChange} />)}
          </FormItem>
        );
      }

      const barForm = (
        <Fragment>
          <FormItem label="File Name">
            {getFieldDecorator('fileName')(<Input onChange={this.handleFormChange} />)}
          </FormItem>
          <FormItem label="Datasets">
            {getFieldDecorator('datasets', { initialValue: 1 })(
              <InputNumber onChange={this.handleFormChange} min={1} />
            )}
          </FormItem>
          {yNameInputs}
          <FormItem label="Unit">
            {getFieldDecorator('unit')(<Input onChange={this.handleFormChange} />)}
          </FormItem>
          <FormItem label="Colour(s)">
            {getFieldDecorator('colour')(<Input onChange={this.handleFormChange} />)}
          </FormItem>
        </Fragment>
      );

      const switchForm = (
        <Fragment>
          <FormItem label="width">
            {getFieldDecorator('width', { initialValue: 88 })(
              <InputNumber onChange={this.handleFormChange} min={1} />
            )}
          </FormItem>
          <FormItem label="height">
            {getFieldDecorator('height', { initialValue: 44 })(
              <InputNumber onChange={this.handleFormChange} min={1} />
            )}
          </FormItem>
          <FormItem label="On Colour">
            {getFieldDecorator('onColour')(<Input onChange={this.handleFormChange} />)}
          </FormItem>
          <FormItem label="Off Colour">
            {getFieldDecorator('offColour')(<Input onChange={this.handleFormChange} />)}
          </FormItem>
        </Fragment>
      );

      const guageForm = (
        <Fragment>
          <FormItem label="name">
            {getFieldDecorator('name')(<Input onChange={this.handleFormChange} />)}
          </FormItem>
          <FormItem label="min">
            {getFieldDecorator('min', { initialValue: 0 })(
              <InputNumber onChange={this.handleFormChange} />
            )}
          </FormItem>
          <FormItem label="max">
            {getFieldDecorator('max', { initialValue: 100 })(
              <InputNumber onChange={this.handleFormChange} />
            )}
          </FormItem>
          <FormItem label="Unit">
            {getFieldDecorator('unit')(<Input onChange={this.handleFormChange} />)}
          </FormItem>
          <FormItem label="Colour(s)">
            {getFieldDecorator('colour')(<Input onChange={this.handleFormChange} />)}
          </FormItem>
        </Fragment>
      );

      const forms = {
        Bar: barForm,
        Area: barForm,
        Line: barForm,
        Guage: guageForm,
        Switch: switchForm,
      };

      return (
        <Fragment>
          {visible && (
            <ReactGridLayout
              layout={this.state.layout}
              onLayoutChange={this.handleLayoutChange}
              draggableHandle=".nube-form-item-drag-handle"
              {...this.props}
            >
              <div key="nube-form-item" className="nube-form-item">
                <span className="nube-form-item-drag-handle" />
                <span className="nube-form-item-remove" onClick={handleCancel}>
                  x
                </span>
                <Form onSubmit={handleSubmit} layout="vertical">
                  <FormItem label="Chart Type">
                    {getFieldDecorator('type', { initialValue: 'Bar' })(
                      <Select onChange={this.handleFormChange}>
                        <Option value="Bar">Bar</Option>
                        <Option value="Area">Area</Option>
                        <Option value="Line">Line</Option>
                        <Option value="Guage">Guage</Option>
                        <Option value="Switch">Switch</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem label="Title">
                    {getFieldDecorator('title')(<Input onChange={this.handleFormChange} />)}
                  </FormItem>
                  {forms[type]}
                  <FormItem label="API Address">
                    {getFieldDecorator('api', { initialValue: '/api/gas_data' })(
                      <Input onChange={this.handleFormChange} />
                    )}
                  </FormItem>
                  <Button type="primary" htmlType="submit" className="submit-form-button">
                    Create
                  </Button>
                  <Button type="primary" onClick={handleCancel} className="cancel-form-button">
                    Cancel
                  </Button>
                </Form>
              </div>
            </ReactGridLayout>
          )}
        </Fragment>
      );
    }
  }
);
