import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message } from 'antd'
import SearchTable from '../../../../components/SearchTable'
import { superviseSearchRequest1, superviseSearchRequest2, report3 } from '../../../../utils/request'
import pageData from '../../../../utils/pageData'

class Supervise extends Component {
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
      },
      {
        element: 'hidden',
        name: 'result'
      }
    ],
    // buttons: [
    //   {
    //     text: '新增',
    //     onClick: () => {
    //       const { history } = this.props
    //       history.push('/main/supervise/add')
    //     }
    //   }
    // ],
    table: {
      columns: [
        {
          title: '数据来源',
          dataIndex: 'drug_source',
          key: 'drug_source'
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
          title: '药品通用名称',
          dataIndex: 'drug_name',
          key: 'drug_name'
        },
        {
          title: '药品分类',
          dataIndex: 'drug_type',
          key: 'drug_type'
        },
        {
          title: '处方工艺编号',
          dataIndex: 'recipe_no',
          key: 'recipe_no',
          render: (value) => {
            if (value) {
              const arr = value.split('；')
              if (arr.length > 1) {
                return (
                  <div>
                    {
                      arr.map(item => {
                        return <div>{item}；</div>
                      })
                    }
                  </div>
                )
              }
              return value
            }
          }
        },
        {
          title: 'hash值',
          dataIndex: 'hash',
          key: 'hash',
          render: (value, record) => {
            if (record.type !== 1) {
              if (value) {
                return value.substr(0, 4) + '...' + value.substr(value.length - 4, 4)
              }
              return '——'
            } else {
              return '——'
            }
          }
        },
        {
          title: '上链时间',
          dataIndex: 'update_time',
          key: 'update_time',
          render: (value, record) => {
            if (record.type !== 1) {
              return (
                <span title={value}>{value}</span>
              )
            } else {
              return '——'
            }
          }
        }
        // {
        //   title: '状态',
        //   dataIndex: 'result',
        //   key: 'result',
        //   filters: [
        //     { text: '通过', value: 0 },
        //     { text: '不通过', value: 1 }
        //   ],
        //   filterMultiple: false,
        //   render: (value) => {
        //     return !value ? '通过' : '未通过'
        //   }
        // }
        // {
        //   title: '企业名称',
        //   dataIndex: 'firma_name',
        //   key: 'firma_name'
        // },
        // {
        //   title: '创建时间',
        //   dataIndex: 'create_time',
        //   key: 'create_time'
        // },
        // {
        //   title: '更新时间',
        //   dataIndex: 'update_time',
        //   key: 'update_time'
        // },
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   key: 'action',
        //   render: (text, row, index) =>
        //     // (
        //     //   <span>
        //     //     <a className="mt-10" href={baseURL + '/' + row.pdf_public_path} target="_blank">查看档案</a>
        //     //     <a onClick={() => this.edit(row.id)}>编辑</a>
        //     //   </span>
        //     // )
        //     (
        //       <span>
        //         <a className="mt-10" onClick={() => this.showBlank(row.id)} target="_blank">查看</a>
        //       </span>
        //     )
        // }
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
  show = (id) => {
    const { history } = this.props
    history.push('/main/supervise/edit?id=' + id)
  }
  showBlank = (id) => {
    const { history } = this.props
    history.push('/main/supervise/show?id=' + id)
  }
  search = (values, page) => {
    const user = JSON.parse(localStorage.getItem('adminUser'))
    let search = superviseSearchRequest1
    if (user.type === 2) {
      search = superviseSearchRequest2
    }
    if (user.type === 5) {
      search = superviseSearchRequest2
    }
    search({
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
  report = (id) => {
    report3({
      id
    }).then((data) => {
      if (data && data.errorNo === 200) {
        message.success('报送并上链成功')
        const { page = 1, ...values } = pageData.get(this.props.history)
        this.search(values, page)
      }
    })
  }
  componentWillMount () {
    // const { history } = this.props
    // const data = pageData.get(history)
    // if (data.result !== undefined) {
    //   this.options.table.columns[7].filteredValue = [data.result]
    // } else {
    //   this.options.table.columns[7].filteredValue = []
    // }
  }
  componentWillUpdate () {
    // const { history } = this.props
    // const data = pageData.get(history)
    // if (data.result !== undefined) {
    //   this.options.table.columns[7].filteredValue = [data.result]
    // } else {
    //   this.options.table.columns[7].filteredValue = []
    // }
  }
  render () {
    const user = JSON.parse(localStorage.getItem('adminUser'))
    if (user.type === 2) {
      this.options.table.columns[7] = {
        title: '状态',
        dataIndex: 'type',
        key: 'type',
        render: (value, row) => {
          return value === 1 ? '未报送' : '已报送'
        }
      }
      this.options.table.columns[8] = {
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
    if (user.type !== 1) {
      delete this.options.table.columns[0]
    }
    return (
      <div>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    )
  }
}

export default connect()(Supervise)
