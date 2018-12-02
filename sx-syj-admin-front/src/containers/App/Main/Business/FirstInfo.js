import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchTable from '../../../../components/SearchTable'
import { getFirstInfo } from '../../../../utils/request'

class FirstInfo extends Component {
  detailButtons = []
  options = {
    form: [
      {
        element: 'rangePicker',
        name: 'time'
      },
      {
        element: 'input',
        name: 'keyWords',
        placeholder: '请输入批准文号'
      }
    ],
    table: {
      columns: [{
        title: '批准文号',
        dataIndex: 'drug_no',
        key: 'drug_no',
        render: (value) => {
          return (<span>国药准字<br/>{value}</span>)
        }
      }, {
        title: '申请企业名称',
        dataIndex: 'firm_name',
        key: 'firm_name'
      }, {
        title: '申请日期',
        dataIndex: 'create_time',
        key: 'operate_type'
      }, {
        title: '被申请企业名称',
        dataIndex: 'be_firm_name',
        key: 'be_firm_name'
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          return record.status === 1 ? '已完成' : '待验证'
        }
      }]
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
    getFirstInfo({
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

export default connect()(FirstInfo)
