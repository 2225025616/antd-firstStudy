import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import './Login.css'
import { loginSuccessPage1, loginSuccessPage2, loginSuccessPage3, loginSuccessPage4 } from '../../../config'
import { Form, Input, Icon, Button } from 'antd'
import { loginRequest } from '../../../utils/request'
import logo from '../../../assets/logo.png'
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
            localStorage.setItem('adminUser', JSON.stringify(data))
            // history.push(data.type === 5 ? loginSuccessPage4 : (data.type === 2 ? loginSuccessPage2 : loginSuccessPage3))
            history.push(data.type === 1 ? loginSuccessPage1 : (data.type === 2 ? loginSuccessPage2 : (data.type === 3 ? loginSuccessPage3 : loginSuccessPage4)))
          }
        })
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login-container">
        <div className="head"></div>
        <div className="login-box">
          <img src={logo}/>
          <h1>药品品种档案区块链应用管理平台</h1>
          <Form className="login-form" onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '用户名是必需的'
                  }
                ]
              })(
                <Input size="large" prefix={<Icon type="user" style={{ fontSize: 13 }} size="large"/>} placeholder="用户名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '密码是必需的'
                  }
                ]
              })(
                <Input size="large" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
              )}
            </FormItem>
            <FormItem>
              <Button className="login-btn" size="large" type="primary" htmlType="submit">登录</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}
const Login = Form.create()(LoginForm)
export default connect()(Login)
