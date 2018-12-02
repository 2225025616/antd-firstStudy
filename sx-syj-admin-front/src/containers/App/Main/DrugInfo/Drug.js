import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchTable from '../../../../components/SearchTable'
import { drugSearchRequest } from '../../../../utils/request'

class Drug extends Component {
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
          dataIndex: 'data_source',
          key: 'data_source'
        },
        {
          title: '批准文号',
          dataIndex: 'drug_no',
          key: 'drug_no',
          render: (value) => {
            return (<span>国药准字<br/>{value}</span>)
          }
        },
        {
          title: '药品名称',
          dataIndex: 'drug_name',
          key: 'drug_name'
        },
        {
          title: 'Hash值',
          dataIndex: 'hash',
          key: 'hash'
        },
        {
          title: '关键信息Hash值',
          dataIndex: 'key_val_hash',
          key: 'key_val_hash'
        },
        {
          title: '上链时间',
          dataIndex: 'success_time',
          key: 'success_time'
        },
        {
          title: '操作',
          key: 'action',
          render: (text, row) => (
            <span>
              <a className="mt-10" onClick={() => this.showBlank(row.drug_no)} target="_blank">查看</a>
            </span>
          )
        }
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
    drugSearchRequest({
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
  showBlank = (id) => {
    const { history } = this.props
    history.push('/main/drug/show?id=' + id)
  }
  render () {
    return (
      <div>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    )
  }
}

export default connect()(Drug)
