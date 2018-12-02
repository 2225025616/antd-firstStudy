import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Button} from 'antd'
import SearchTable from '../../../../components/SearchTable'

class LoginLog extends Component {
  options = {
    form: [
      {
        element: 'input'
      }
    ],
    table: {
      columns: [{
        title: '用户名',
        dataIndex: 'name',
        key: 'name'
      }, {
        title: '手机号码',
        dataIndex: 'telPhone',
        key: 'telPhone'
      }, {
        title: '企业名称',
        dataIndex: 'username',
        key: 'username'
      }, {
        title: '注册地址',
        dataIndex: 'address',
        key: 'address'
      }, {
        title: '用户类别',
        dataIndex: 'type',
        key: 'type'
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button type="primary" ghost href="#">查看</Button> &nbsp;
            <Button type="danger" ghost>删除</Button> &nbsp;
            <Button type="primary" ghost href="#">编辑</Button>
          </span>
        )
      }]
    }
  }
  state = {
    data: [{
      key: '1',
      name: 'John Brown',
      telPhone: 32,
      username: '企业名称',
      address: 'New York No. 1 Lake Park',
      type: ''
    }, {
      key: '2',
      name: 'Jim Green',
      telPhone: 42,
      username: '企业名称',
      address: 'London No. 1 Lake Park',
      type: ''
    }, {
      key: '3',
      name: 'Joe Black',
      telPhone: 32,
      username: '企业名称',
      address: 'Sidney No. 1 Lake Park',
      type: ''
    }]
  }
  render () {
    return (
      <div>
        <SearchTable options={this.options} data={this.state.data}/>
      </div>
    )
  }
}

export default connect()(LoginLog)
