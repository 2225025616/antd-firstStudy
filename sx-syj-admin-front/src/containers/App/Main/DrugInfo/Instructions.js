import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message } from 'antd'
import SearchTable from '../../../../components/SearchTable'
import { getInstructions1, getInstructions2, report2, downFile, downFiletwo } from '../../../../utils/request'
import { baseURL } from '../../../../config/index'
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
        // {
        //   title: '剂型',
        //   dataIndex: 'drug_name',
        //   key: 'drug_name'
        // },
        // {
        //   title: '规格',
        //   dataIndex: 'drug_name',
        //   key: 'drug_name'
        // },
        {
          title: '生产单位',
          dataIndex: 'firma_name',
          key: 'firma_name',
          render: (value) => {
            return (
              <span title={value}>{value}</span>
            )
          }
        },
        // {
        //   title: '修订日期',
        //   dataIndex: 'drug_name',
        //   key: 'drug_name'
        // }
        {
          title: 'Hash值',
          dataIndex: 'hash',
          key: 'hash',
          render: (value, record) => {
            if (record.type !== 1) {
              if (value) {
                return <span title={value}>{value.substr(0, 4) + '...' + value.substr(value.length - 4, 4)}</span>
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
          render: (value) => {
            return (
              <span title={value}>{value}</span>
            )
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
        // {
        //   title: '关键信息Hash值',
        //   dataIndex: 'key_val_hash',
        //   key: 'key_val_hash'
        // },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          // render: (text, record) => (
          //   <span>
          //     <a className="mt-10" href={baseURL + '/' + record.pdf_public_path} target="_blank">查看</a>
          //   </span>
          // )
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
    let search = getInstructions1
    if (user.type === 2) {
      search = getInstructions2
    }
    if (user.type === 5) {
      search = getInstructions2
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
  showBlank = (id) => {
    const { history } = this.props
    history.push('/main/instructions/show?id=' + id)
  }
  report = (id) => {
    report2({
      id
    }).then((data) => {
      if (data && data.errorNo === 200) {
        message.success('报送并上链成功')
        const { page = 1, ...values } = pageData.get(this.props.history)
        this.search(values, page)
      }
    })
  }
  downFile = (drugNo) => {
    downFile({
      drugNo
    }).then(
      (data) => {
        console.log(data)
        window.open(baseURL + '/' + data)
        /* if (data) {
          alert(1)
          console.log(data)
          let binaryData = []
          binaryData.push(data)
          let url = window.URL.createObjectURL(
            new Blob(binaryData)
          )
          if (window.navigator.msSaveOrOpenBlob) { // msSaveOrOpenBlob方法返回bool值
            navigator.msSaveBlob(binaryData, name + '.pdf') // 本地保存
          } else {
            console.log(1)
            var link = document.createElement('a') // a标签下载
            link.href = url
            link.download = name
            link.click()
            window.URL.revokeObjectURL(link.href)
            console.log(link)
          }
          // const { ...values } = pageData.get(this.props.history)
          // console.log(this.props.history)
        } else {
          alert(1)
        } */
      }
    )
  }
  downFiletwo = (drugNo) => {
    downFiletwo({
      drugNo
    }).then(
      (data) => {
        console.log(data)
        window.open(baseURL + '/' + data)
        /* this.setState({
          data: data
        }) */
        // href={baseURL + '/' + this.state.data.pdf_public_path}
        /* if (data) {
          console.log(data)
          let binaryData = []
          binaryData.push(data)
          console.log(data)
          let url = window.URL.createObjectURL(
            new Blob(binaryData)
          )
          if (window.navigator.msSaveOrOpenBlob) { // msSaveOrOpenBlob方法返回bool值
            navigator.msSaveBlob(binaryData, name + '.pdf') // 本地保存
            console.log(binaryData)
          } else {
            var link = document.createElement('a') // a标签下载
            link.href = url
            link.download = name + '.pdf'
            link.click()
            window.URL.revokeObjectURL(link.href)
            console.log(link)
          }
          alert(2)
        } else {
        } */
      }
    )
  }
  componentWillMount () {
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
      this.options.table.columns[5] = {
        title: '状态',
        dataIndex: 'type',
        key: 'type',
        render: (value, row) => {
          return value === 1 ? '未报送' : '已报送'
        }
      }
      this.options.table.columns[6] = {
        title: '操作',
        key: 'action',
        render: (text, row) => (
          <span>
            {
              row.type === 1 ? <a className="mt-10" onClick={() => this.report(row.id)}>报送并上链</a> : <a className="mt-10" onClick={() => this.downFile(row.drug_no)} target="_blank">下载</a>
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
            {/* <a className="mt-10" onClick={() => this.downFiletwo(row.drug_no)}>下载</a> */}
            <a className="mt-10" onClick={() => this.downFiletwo(row.drug_no)} target="_blank">下载</a>
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
