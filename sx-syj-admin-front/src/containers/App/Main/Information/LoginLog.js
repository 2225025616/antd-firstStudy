import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchTable from '../../../../components/SearchTable'
import { loginLogSearchRequest } from '../../../../utils/request'

class LoginLog extends Component {
  options = {
    form: [
      {
        element: 'rangePicker',
        name: 'time'
      }
      /* ,
      {
        element: 'input',
        name: 'keyWords',
        placeholder: '请输入批准文号/药品通用名称/数据来源'
      } */
    ],
    table: {
      columns: [{
        title: '登录时间',
        dataIndex: 'login_time',
        key: 'login_time'
      }, {
        title: '所属部门',
        dataIndex: 'use_branch',
        key: 'use_branch'
      }, {
        title: '用户名称',
        dataIndex: 'user_name',
        key: 'user_name'
      }, {
        title: '登录IP',
        dataIndex: 'ip',
        key: 'ip'
      }
      // , {
      //   title: '上链时间',
      //   dataIndex: 'success_time',
      //   key: 'success_time'
      // }
      ]
    }
  }
  state = {
    pagination: {
      current: 1,
      total: 0
    },
    data: []
  }
  search = (values, page) => {
    loginLogSearchRequest({
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

export default connect()(LoginLog)
