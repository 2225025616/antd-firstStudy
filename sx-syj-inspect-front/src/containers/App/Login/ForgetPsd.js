import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changePsd } from '../../../utils/request'
import { Form, Input, Button, Icon, message } from 'antd'
const FormItem = Form.Item

class ChangeForm extends Component {
  handleSubmit = (e) => {
    const {history} = this.props
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        changePsd(values).then(
          (data) => {
            if (data) {
              message.success(data.errorMsg + '请重新登录！')
              history.push('/login')
            }
          }
        )
      }
    })
  }
  checkPassword = (rule, value, cb) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('new_password')) {
      cb(new Error('两次密码输入不一致！'))
    } else {
      cb()
    }
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="form">
          <FormItem>
            {getFieldDecorator('old_password', {
              rules: [{ required: true, message: '请输入正确的旧密码!' }]
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="旧密码" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('new_password', {
              rules: [{ required: true, message: '请输入新密码!' }]
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="新密码"/>
            )}
          </FormItem><FormItem>
            {getFieldDecorator('re_password', {
              rules: [{ required: true, message: '请再次输入新密码!' }, {validator: this.checkPassword}]
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="确认密码" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" style={{width: '100%'}}>
              确认修改
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
const Revise = Form.create()(ChangeForm)
export default connect()(Revise)
