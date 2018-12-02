import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message, Modal, Form, Button, Input, Icon } from 'antd'
import SearchTable from '../../../../components/SearchTable'
import { adminSearchRequest, addUserRequest, abandonUser } from '../../../../utils/request'
import './UserList.css'
const FormItem = Form.Item

let ref = null
class AddForm extends Component {
  handleSubmit = (e) => {
    const { submit } = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        ref.destroy()
        submit(values)
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入用户名!' }]
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('mobile', {
            rules: [
              {
                required: true, message: '请输入手机号!'
              }
            ]
          })(
            <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email', message: '请输入合法的邮箱!'
              },
              {
                required: true, message: '请输入邮箱!'
              }
            ]
          })(
            <Input prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }]
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            确定
          </Button>
        </FormItem>
      </Form>
    )
  }
}
const MyForm = Form.create()(AddForm)

class UserList extends Component {
  addUser = (FormData) => {
    addUserRequest({
      ...FormData
    }).then((data) => {
      if (data.errorNo === 200) {
        message.success('添加成功', 4)
        this.setState(prveState => {
          prveState.data.push(
            {name: FormData.name, mobile: FormData.mobile, email: FormData.email, password: FormData.password, type: 0, key: 'add', status: '正常'}
          )
          return prveState.data
        })
      } else {
        message.error('添加不成功，请联系管理员')
        return false
      }
    })
  }
  showModal = () => {
    ref = Modal.info({
      title: '新增检查员',
      maskClosable: true,
      // getForm 通过把form作为对象传向父组件？
      content: <MyForm submit={this.addUser}></MyForm>,
      // content: <MyForm getForm={this.getForm}></MyForm>,
      okText: ' ',
      okType: 'none'
    })
  }
  options = {
    form: [
      {
        element: 'rangePicker',
        name: 'time'
      },
      {
        element: 'input',
        name: 'keyWords',
        placeholder: '请输入用户名/手机号/邮箱'
      }
    ],
    // buttons: [
    //   {
    //     text: '新增检察员',
    //     onClick: this.showModal
    //   }
    // ],
    table: {
      columns: [
        {
          title: '用户类别',
          dataIndex: 'intro',
          key: 'intro',
          render: (text, record) => {
            return (
              <span>
                {record.intro ? record.intro : '检查员'}
              </span>
            )
          }
        },
        {
          title: '用户名',
          dataIndex: 'name',
          key: 'name',
          render: (text, record) => {
            return (
              <span>
                {record.username ? record.username : record.name}
              </span>
            )
          }
        }, {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email'
        }, {
          title: '最近登录',
          dataIndex: 'updated_at',
          key: 'updated_at'
        }
      ]
    }
  }
  confirm = (index, type, id) => {
    abandonUser({
      users_id: id, type: type === 2 ? 1 : 2
    }).then((data) => {
      if (data) {
        this.setState(prveState => {
          prveState.visible[index] = false
          prveState.data[index].type = type === 2 ? 1 : 2
          return {
            visible: prveState.visible,
            data: prveState.data
          }
        })
      } else {
        message.error('添加不成功，请联系管理员')
        return true
      }
    })
  }
  handleVisibleChange = (visible, type, index, id) => {
    this.setState(prveState => {
      prveState.visible[index] = visible
      return {
        visible: prveState.visible
      }
    })
  }
  state = {
    visible: [false, false, false],
    confirmLoading: false,
    data: [],
    pagination: {
      current: 1,
      total: 0
    }
  }
  search = (values, page) => {
    console.log(page)
    console.log(values)
    adminSearchRequest({
      page,
      ...values
    }).then((data) => {
      if (data) {
        this.setState({
          data: data.list,
          pagination: {
            total: data.count
          }
        })
      }
    })
  }
  render () {
    return (
      <div>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    )
  }
}

export default connect()(UserList)
