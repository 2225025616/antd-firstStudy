import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import './Login.css'
import { loginSuccessPage } from '../../../config'
import { Link } from 'react-router-dom'
import { Form, Input, Icon, Button } from 'antd'
import { loginRequest } from '../../../utils/request'
const FormItem = Form.Item

class LoginForm extends PureComponent {
  state = {
    isLogin: false
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const { history } = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        loginRequest(values).then((data) => {
          if (data) {
            localStorage.setItem('user', JSON.stringify(data))
            history.push(loginSuccessPage)
          }
        })
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login-container">
        <div className="head">药品品种档案区块链管理平台</div>
        <Form className="login-form" onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: '邮箱是必需的'
                }
              ]
            })(
              <Input size="large" prefix={<Icon type="user" style={{ fontSize: 20 }} />} placeholder="请输入用户名/手机号/邮箱" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '密码是必需的'
                },
                {

                }
              ]
            })(
              <Input size="large" prefix={<Icon type="lock" style={{ fontSize: 20 }} />} type="password" placeholder="请输入密码" />
            )}
          </FormItem>
          <FormItem className="flex">
            <Link to="/">忘记密码？</Link>
          </FormItem>
          <FormItem>
            <Button className="login-btn" size="large" type="primary" htmlType="submit">登录</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

const Login = Form.create()(LoginForm)

export default connect()(Login)
