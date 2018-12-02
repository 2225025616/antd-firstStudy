import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchTable from '../../../../components/SearchTable'
import { databaseSearchRequest } from '../../../../utils/request'
import { showDetail } from '../../../../utils/common'

class Database extends Component {
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
      columns: [
        {
          title: '数据来源',
          dataIndex: 'drug_source',
          key: 'drug_source'
        },
        {
          title: '药品通用名称',
          dataIndex: 'drug_name',
          key: 'drug_name'
        },
        // {
        //   title: '操作内容',
        //   dataIndex: 'handle_type',
        //   key: 'handle_type'
        // },
        {
          title: '批准文号',
          dataIndex: 'drug_no',
          key: 'drug_no',
          render: (value) => {
            return (<span>国药准字<br/>{value}</span>)
          }
        // }, {
        //   title: '风险等级',
        //   dataIndex: 'rank',
        //   key: 'rank',
        //   render: (text, row) => '无'
        },
        {
          title: '数据类型',
          dataIndex: 'data_type',
          key: 'data_type'
        },
        {
          title: 'Hash值',
          dataIndex: 'hash',
          key: 'hash',
          render: (value) => {
            if (value === '-') {
              return value
            }
            return value.substr(0, 4) + '...' + value.substr(value.length - 4, 4)
          }
          /* render: (value) => {
            return <span title={value}>{value}</span>
          } */
        },
        {
          title: '上链时间',
          dataIndex: 'security_time',
          key: 'security_time'
          /* render: (value) => {
            return <span title={value}>{value}</span>
          } */
        }
        /* {
          title: '操作',
          key: 'action',
          render: (text, record, index) => (
            <span>
              <a ref={element => { this.detailButtons[index] = element }} onClick={() => this.show(index, record)}>查看详情</a>
            </span>
          )
        } */
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
    databaseSearchRequest({
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
  show = (index, row) => {
    const detailButton = this.detailButtons[index]
    const template = `<div style="padding-left: 100px;">
                        <div style="text-align: left"><div style="display: inline-block;margin-right:50px;">操作人：${row.user_name}</div><div style="display: inline-block;margin-right:50px;">操作对象：${row.drug_no}</div><div style="display: inline-block;margin-right:50px;">操作时间：${row.handle_time}</div></div>
                      </div>`
    showDetail(detailButton, template)
  }
  render () {
    return (
      <div>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    )
  }
}

export default connect()(Database)
