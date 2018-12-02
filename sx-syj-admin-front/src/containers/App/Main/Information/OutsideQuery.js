import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchTable from '../../../../components/SearchTable'
import { outsideQuerySearchRequest } from '../../../../utils/request'

class OutsideQuery extends Component {
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
        title: '任务编号',
        dataIndex: 'task_no',
        key: 'task_no'
      }, {
        title: '检查员',
        dataIndex: 'task_name',
        key: 'task_name'
      }, {
        title: '批准文号',
        dataIndex: 'drug_no',
        key: 'drug_no',
        render: (value) => {
          return (<span>国药准字<br/>{value}</span>)
        }
      }, {
        title: '上传文件hash',
        dataIndex: 'now_hash',
        key: 'now_hash',
        render: (value) => {
          if (value && value !== '-') {
            return value.substr(0, 4) + '...' + value.substr(value.length - 4, 4)
          } else {
            return '-'
          }
        }
      }, {
        title: '链上hash',
        dataIndex: 'chain_hash',
        key: 'chain_hash',
        render: (value) => {
          if (value === '-') {
            return value
          }
          return value.substr(0, 4) + '...' + value.substr(value.length - 4, 4)
        }
      }, {
        title: '比对结果',
        dataIndex: 'result',
        key: 'result',
        render: (text, row) => {
          return row.result === '-' ? '-' : row.result === 0 ? '一致' : '不一致'
        }
      },
      // {
      //   title: '是否下载原文件',
      //   dataIndex: 'is_download',
      //   key: 'is_download',
      //   render: (text, row) => {
      //     return row.result === '-' ? '-' : row.result === 0 ? '否' : '是'
      //   }
      // },
      {
        title: '上链时间',
        dataIndex: 'success_time',
        key: 'success_time'
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
    outsideQuerySearchRequest({
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

export default connect()(OutsideQuery)
