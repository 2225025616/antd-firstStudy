import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message } from 'antd'
import SearchTable from '../../../../components/SearchTable'
import { getComprehensive1, getComprehensive2, report1 } from '../../../../utils/request'
import pageData from '../../../../utils/pageData'

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
      },
      {
        element: 'hidden',
        name: 'result'
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
        {
          title: '批准文号',
          dataIndex: 'drug_no',
          key: 'drug_no',
          render: (value) => {
            return (<span>国药准字<br/>{value}</span>)
          }
        },
        {
          title: '生产单位',
          dataIndex: 'firma_name',
          key: 'firma_name',
          render: (text, record) => {
            return (
              <span title={record.firma_name}>{record.firma_name}</span>
            )
          }
        },
        {
          title: 'Hash值',
          dataIndex: 'hash',
          key: 'hash',
          render: (value, record) => {
            if (record.type !== 1) {
              return (
                <span title={record.hash}>{value.substr(0, 4) + '...' + value.substr(value.length - 4, 4)}</span>
              )
            } else {
              return '——'
            }
          }
        },
        // {
        //   title: '关键信息Hash值',
        //   dataIndex: 'key_val_hash',
        //   key: 'key_val_hash'
        // },
        {
          title: '上链时间',
          dataIndex: 'security_time',
          key: 'security_time',
          render: (value, record) => {
            if (record.type !== 1) {
              return (
                <span title={value}>{value}</span>
              )
            } else {
              return '——'
            }
          }
        },
        // {
        //   title: '状态',
        //   dataIndex: 'result',
        //   key: 'result',
        //   filters: [
        //     { text: '通过', value: 0 },
        //     { text: '不通过', value: 1 }
        //   ],
        //   // filteredValue: ['0'],
        //   filterMultiple: false,
        //   render: (text, record) => (
        //     <span>
        //       {record.result ? '未通过' : '通过'}
        //     </span>
        //   )
        // },
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
      total: 0,
      showTotal: (total) => '共 ' + total + ' 条数据'
    },
    data: []
  }
  search = (values, page) => {
    const user = JSON.parse(localStorage.getItem('adminUser'))
    let search = getComprehensive1
    if (user.type === 2) {
      search = getComprehensive2
    }
    if (user.type === 5) {
      search = getComprehensive2
    }
    search({
      page,
      ...values
    }).then((data) => {
      if (data) {
        // console.log(data.list)
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
    history.push('/main/comprehensive/show?id=' + id)
  }
  report = (id) => {
    report1({
      id
    }).then((data) => {
      if (data && data.errorNo === 200) {
        message.success('报送并上链成功')
        const { page = 1, ...values } = pageData.get(this.props.history)
        this.search(values, page)
      }
    })
  }
  llMount () {
    const { history } = this.props
    const data = pageData.get(history)
    if (data.result !== undefined) {
      this.options.table.columns[6].filteredValue = [data.result]
    } else {
      this.options.table.columns[6].filteredValue = []
    }
  }
  componentWillUpdate () {
    const { history } = this.props
    const data = pageData.get(history)
    if (data.result !== undefined) {
      this.options.table.columns[6].filteredValue = [data.result]
    } else {
      this.options.table.columns[6].filteredValue = []
    }
  }
  render () {
    const user = JSON.parse(localStorage.getItem('adminUser'))
    if (user.type === 2) {
      this.options.table.columns[6] = {
        title: '状态',
        dataIndex: 'type',
        key: 'type',
        render: (value, row) => {
          return value === 1 ? '未报送' : '已报送'
        }
      }
      this.options.table.columns[7] = {
        title: '操作',
        key: 'action',
        render: (text, row) => (
          <span>
            {
              row.type === 1 ? <a className="mt-10" onClick={() => this.report(row.id)}>报送并上链</a> : <span className="mt-10">——</span>
            }
          </span>
        )
      }
    }
    if (user.type === 5) {
      this.options.table.columns[6] = {
        title: '状态',
        dataIndex: 'type',
        key: 'type',
        render: (value, row) => {
          return value === 1 ? '未报送' : '已报送'
        }
      }
      this.options.table.columns[7] = {
        title: '操作',
        key: 'action',
        render: (text, row) => (
          <span>
            <span className="mt-10">——</span>
          </span>
        )
      }
    }
    return (
      <div className="drug-container">
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    )
  }
}

export default connect()(Drug)
