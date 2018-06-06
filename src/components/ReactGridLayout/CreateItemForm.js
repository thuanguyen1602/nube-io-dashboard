import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, InputNumber } from 'antd';
import RGL, { WidthProvider } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL);

const FormItem = Form.Item;
const { Option } = Select;

export default Form.create({
  // Maps the inputValues props to the form, used when editing an existing chart
  mapPropsToFields(props) {
    if (props.inputValues) {
      const formFields = {};
      for (const key in props.inputValues) {
        if (Object.prototype.hasOwnProperty.call(props.inputValues, key)) {
          let value = props.inputValues[key];
          if (Array.isArray(value)) {
            value = value.join(',');
          }
          formFields[key] = Form.createFormField({
            value,
          });
        }
      }
      return formFields;
    }
  },
  onValuesChange(props, changedValues, allValues) {
    const inputValues = JSON.parse(JSON.stringify(allValues));

    for (const key in inputValues) {
      if (Object.prototype.hasOwnProperty.call(inputValues, key)) {
        if (inputValues[key] === '') {
          inputValues[key] = undefined;
        }
      }
    }
    if (inputValues.yNames) {
      inputValues.yNames = inputValues.yNames.split(',');
    }

    if (inputValues.colour) {
      inputValues.colour = inputValues.colour.split(',');
    }

    props.onFormChange(inputValues);
  },
})(
  class CreateItemForm extends Component {
    constructor(props) {
      super(props);

      this.state = {
        layout: [
          {
            i: 'nube-form-item',
            w: 25,
            h: 15,
            x: 34,
            y: 2,
          },
        ],
      };

      this.onLayoutChange = this.onLayoutChange.bind(this);
    }

    static get defaultProps() {
      return {
        className: 'nube-form-grid',
        cols: 60,
        rowHeight: 30,
        compactType: null,
      };
    }

    componentWillReceiveProps(nextProps) {
      // Passes data to parent if the form is visible and it just changed from
      // visible = false to visible = true.
      if (nextProps.visible && nextProps.visible !== this.props.visible) {
        setTimeout(() => {
          const fieldsValue = this.props.form.getFieldsValue();

          for (const key in fieldsValue) {
            if (Object.prototype.hasOwnProperty.call(fieldsValue, key)) {
              if (fieldsValue[key] === '') {
                fieldsValue[key] = undefined;
              }
            }
          }

          if (fieldsValue.yNames) {
            fieldsValue.yNames = fieldsValue.yNames.split(',');
          }

          if (fieldsValue.colour) {
            fieldsValue.colour = fieldsValue.colour.split(',');
          }

          this.props.onFormChange(fieldsValue);
        }, 100);
      }
    }

    onLayoutChange(layout) {
      this.setState({ layout });
    }

    render() {
      const { visible, onCancel, onSubmit, form, inputValues } = this.props;
      const { getFieldDecorator, getFieldValue } = form;

      const type = getFieldValue('type') || 1;

      const barForm = (
        <Fragment>
          <FormItem label="File Name">{getFieldDecorator('fileName')(<Input />)}</FormItem>
          <FormItem label="yName(s)">
            {getFieldDecorator('yNames', {
              rules: [{ required: false, message: 'Please input Y name!', whitespace: true }],
            })(<Input />)}
          </FormItem>
          <FormItem label="Unit">{getFieldDecorator('unit')(<Input />)}</FormItem>
          <FormItem label="Colour(s)">{getFieldDecorator('colour')(<Input />)}</FormItem>
        </Fragment>
      );

      const switchForm = (
        <Fragment>
          <FormItem label="Width">
            {getFieldDecorator('width', { initialValue: 88 })(<InputNumber />)}
          </FormItem>
          <FormItem label="Height">
            {getFieldDecorator('height', { initialValue: 44 })(<InputNumber />)}
          </FormItem>
          <FormItem label="On Colour">{getFieldDecorator('onColour')(<Input />)}</FormItem>
          <FormItem label="Off Colour">{getFieldDecorator('offColour')(<Input />)}</FormItem>
        </Fragment>
      );

      const guageForm = (
        <Fragment>
          <FormItem label="Name">{getFieldDecorator('name')(<Input />)}</FormItem>
          <FormItem label="Minimum">
            {getFieldDecorator('min', { initialValue: 0 })(<InputNumber />)}
          </FormItem>
          <FormItem label="Maximum">
            {getFieldDecorator('max', { initialValue: 100 })(<InputNumber />)}
          </FormItem>
          <FormItem label="Unit">{getFieldDecorator('unit')(<Input />)}</FormItem>
          <FormItem label="Colour(s)">{getFieldDecorator('colour')(<Input />)}</FormItem>
        </Fragment>
      );

      const forms = {
        Bar: barForm,
        Area: barForm,
        Line: barForm,
        Guage: guageForm,
        Switch: switchForm,
        Doughnut: barForm,
        Slider: guageForm,
      };

      return (
        <Fragment>
          {visible && (
            <ReactGridLayout
              layout={this.state.layout}
              onLayoutChange={this.onLayoutChange}
              draggableHandle=".nube-form-item-drag-handle"
              {...this.props}
            >
              <div key="nube-form-item" className="nube-form-item">
                <span className="nube-form-item-drag-handle" />
                <span className="nube-form-item-remove" onClick={onCancel}>
                  x
                </span>
                <div className="nube-form-item-container">
                  <Form layout="vertical">
                    <FormItem label="Chart Type">
                      {getFieldDecorator('type', { initialValue: 'Bar' })(
                        <Select>
                          <Option value="Bar">Bar</Option>
                          <Option value="Area">Area</Option>
                          <Option value="Line">Line</Option>
                          <Option value="Guage">Guage</Option>
                          <Option value="Switch">Switch</Option>
                          <Option value="Doughnut">Doughnut</Option>
                          <Option value="Slider">Slider</Option>
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label="API Address">
                      {getFieldDecorator('api', { initialValue: '/api/water_data' })(<Input />)}
                    </FormItem>
                    <FormItem label="Title">{getFieldDecorator('title')(<Input />)}</FormItem>
                    {forms[type]}
                  </Form>
                </div>
                <div className="nube-form-item-footer">
                  <Button type="primary" onClick={onSubmit} className="add-button-nube-form">
                    {inputValues.new ? 'Save' : 'Update'}
                  </Button>
                  <Button type="default" onClick={onCancel} className="cancel-button-nube-form">
                    Cancel
                  </Button>
                </div>
              </div>
            </ReactGridLayout>
          )}
        </Fragment>
      );
    }
  }
);
