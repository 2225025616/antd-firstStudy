import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Breadcrumb, Form, Select, Input, Button, DatePicker, message, TimePicker } from 'antd'
import { taskListAddRequest, inspectorSearchRequest, superviseNumSearchRequest } from '../../../../utils/request'

class InputElement extends Component {
  render () {
    return (
      <div>
        <Input {...this.props} /><span style={{ lineHeight: 1, whiteSpace: 'nowrap', color: 'red', marginTop: '8px' }}>{this.props.righttip}</span>
      </div>
    )
  }
}

class SelectElement extends Component {
  render () {
    const { list, ...props } = this.props
    // console.log(list)
    return (
      <Select {...props}>
        {
          list.map((item, index) => {
            return <Select.Option key={index} value={item.value}>{item.label || item.value}</Select.Option>
          })
        }
      </Select>
    )
  }
}

class DatePickerElement extends Component {
  render () {
    return (
      <DatePicker {...this.props}/>
    )
  }
}

class TimePickerElement extends Component {
  render () {
    return (
      <TimePicker {...this.props}/>
    )
  }
}

class TextAreaElement extends Component {
  render () {
    return (
      <Input.TextArea {...this.props} />
    )
  }
}

class TaskListType extends Component {
  state = {
    formValue: {},
    users_idList: [],
    taskcontent: [{value: '检查药品工艺信息', label: '检查药品工艺信息'}, {value: '其他', label: '其他'}],
    drug_name: '',
    firma_name: ''
  }
  haveDrug = true
  timer = null
  labelWidth = 100
  formItems = [
    {
      name: 'drugnum',
      label: '国药准字批准文号',
      rightTip: '请务必选择药品工艺管理已存在的国药准字批准文号',
      rules: [
        {
          required: true,
          message: '请输入国药准字批准文号'
        }
      ],
      props: {
        onChange: (e) => {
          if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
          }
          if (e.target.value) {
            this.timer = setTimeout((value) => {
              superviseNumSearchRequest({
                drug_no: value
              }).then(data => {
                if (data) {
                  if (data.drug_name === undefined) {
                    this.haveDrug = false
                    message.error('该国药准字批准文号不存在')
                  } else {
                    this.haveDrug = true
                    this.setState({
                      drug_name: data.drug_name,
                      firma_name: data.firma_name
                    })
                  }
                }
              })
            }, 1000, e.target.value)
          } else {
            this.setState({
              drug_name: '',
              firma_name: ''
            })
          }
        }
      }
    },
    {
      name: 'drug_name',
      label: '药品名称',
      type: 'text',
      value: 'drug_name'
    },
    {
      name: 'firma_name',
      label: '企业名称',
      type: 'text',
      value: 'firma_name'
    },
    {
      name: 'taskcontent',
      label: '任务内容',
      type: 'select',
      props: {
        placeholder: '请选择任务内容',
        list: [{value: '检查药品工艺信息', label: '检查药品工艺信息'}, {value: '其他', label: '其他'}]
      },
      rules: [
        {
          required: true,
          message: '请选择任务内容'
        }
      ]
    },
    {
      name: 'end_date',
      label: '截止日期',
      type: 'datepicker',
      props: {
        showToday: false,
        placeholder: '请选择日期'
      },
      rules: [
        {
          required: true,
          message: '请选择截止日期'
        }
      ]
    },
    // {
    //   name: 'end_date_time',
    //   type: 'timepicker',
    //   props: {
    //     placeholder: '请选择时间'
    //   },
    //   rules: [
    //     {
    //       required: true,
    //       message: '请选择截止时间'
    //     }
    //   ]
    // },
    {
      name: 'users_id',
      label: '检查员',
      type: 'select',
      props: {
        placeholder: '请选择检查员'
      },
      rules: [
        {
          required: true,
          message: '请选择检查员'
        }
      ]
    }
    // {
    //   name: 'remark',
    //   label: '备注',
    //   type: 'textarea',
    //   props: {
    //     placeholder: '请填写500字以内'
    //   }
    // }
  ]
  goBack = () => {
    const { history } = this.props
    history.goBack()
  }
  confirm = () => {
    const { form, history } = this.props
    const formValue = form.getFieldsValue()
    const { end_date, end_date_time, ...otherFormValue } = formValue
    form.validateFields((err) => {
      if (!err) {
        if (!this.haveDrug) {
          message.error('该国药准字批准文号不存在')
          return false
        }
        taskListAddRequest({
          // end_date: end_date.format('YYYY-MM-DD') + ' ' + end_date_time.format('HH:mm:ss'),
          end_date: end_date.format('YYYY-MM-DD'),
          ...otherFormValue
        }).then((data) => {
          if (data) {
            message.success('新增成功', () => {
              history.goBack()
            })
          }
        })
      }
    })
  }
  componentWillMount () {
    inspectorSearchRequest().then(data => {
      if (data) {
        this.setState({
          users_idList: data.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
        })
      }
    })
  }
  render () {
    const { form } = this.props
    return (
      <div className="type-container">
        <Breadcrumb>
          <Breadcrumb.Item><a onClick={this.goBack}>任务列表</a></Breadcrumb.Item>
          <Breadcrumb.Item>新增任务</Breadcrumb.Item>
        </Breadcrumb>
        <Form>
          {
            this.formItems.map(item => {
              let { label, rightTip, name, value, type = 'input', rules = [], formItemProps = {}, options = {}, props = {} } = item
              let Element = null
              let className = null
              let style = {}
              let list = []
              switch (type) {
                case 'input':
                  Element = InputElement
                  style = {width: (this.labelWidth + 260) + 'px'}
                  break
                case 'select':
                  Element = SelectElement
                  list = this.state[name + 'List']
                  break
                case 'datepicker':
                  Element = DatePickerElement
                  break
                case 'timepicker':
                  Element = TimePickerElement
                  break
                case 'textarea':
                  Element = TextAreaElement
                  break
              }
              if (rightTip) {
                style = {
                  overflow: 'visible'
                }
              }
              return (
                <Form.Item
                  className={className}
                  key={name}
                  label={label}
                  style={style}
                  {...formItemProps}
                >
                  {type === 'text' ? this.state[value] : form.getFieldDecorator(name, {
                    rules: rules,
                    initialValue: this.state.formValue[name],
                    ...options
                  })(
                    <Element righttip={rightTip} list={list} {...props}/>
                  )}
                </Form.Item>
              )
            })
          }
          <Form.Item style={{width: (this.labelWidth + 260) + 'px'}}>
            <Button type="primary" onClick={this.confirm}>确定</Button>
            <Button type="default" onClick={this.goBack} style={{marginLeft: '10px'}}>取消</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const WrappedTaskListType = Form.create()(TaskListType)

export default connect()(WrappedTaskListType)
