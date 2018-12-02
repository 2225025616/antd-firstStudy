import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changePwdRequest } from '../../../utils/request'
import { Form, message, Input, Button } from 'antd'

class ChangePwd extends Component {
  labelWidth = 100
  rules1 = [
    {
      required: true,
      message: '原密码是必需的'
    }
  ]
  rules2 = [
    {
      required: true,
      message: '新密码是必需的'
    }
  ]
  rules3 = [
    {
      required: true,
      message: '重复新密码是必需的'
    },
    {
      validator: (rule, value, callback) => {
        const { form } = this.props
        const newPwd = form.getFieldsValue().new_password
        if (newPwd === value) {
          callback()
        } else {
          callback(new Error('重复新密码必须和新密码一致'))
        }
      }
    }
  ]
  confirm = () => {
    const { form, history } = this.props
    const formValues = form.getFieldsValue()
    form.validateFields((err) => {
      if (!err) {
        changePwdRequest({
          old_password: formValues.old_password,
          new_password: formValues.new_password
        }).then((data) => {
          if (data) {
            message.success('修改成功', () => {
              history.goBack()
            })
          }
        })
      }
    })
  }
  goBack = () => {
    const { history } = this.props
    history.goBack()
  }
  render () {
    const { form } = this.props
    const style = {width: (this.labelWidth + 260) + 'px'}
    return (
      <div className="type-container">
        <Form>
          <Form.Item
            label="原密码"
            style={style}
          >
            {form.getFieldDecorator('old_password', {
              rules: this.rules1
            })(
              <Input type="password" />
            )}
          </Form.Item>
          <Form.Item
            label="新密码"
            style={style}
          >
            {form.getFieldDecorator('new_password', {
              rules: this.rules2
            })(
              <Input type="password" />
            )}
          </Form.Item>
          <Form.Item
            label="重复新密码"
            style={style}
          >
            {form.getFieldDecorator('re_new_password', {
              rules: this.rules3
            })(
              <Input type="password" />
            )}
          </Form.Item>
          <Form.Item style={{width: (this.labelWidth + 260) + 'px'}}>
            <Button type="primary" onClick={this.confirm}>确定</Button>
            <Button type="default" onClick={this.goBack} style={{marginLeft: '10px'}}>取消</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const WrappedChangePwd = Form.create()(ChangePwd)

export default connect()(WrappedChangePwd)
