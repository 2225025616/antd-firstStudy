import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchTable from '../../../../components/SearchTable'
import { taskListSearchRequest } from '../../../../utils/request'
import { showDetail } from '../../../../utils/common'

class TaskList extends Component {
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
    buttons: [
      {
        text: '新增任务',
        onClick: () => {
          const { history } = this.props
          history.push('/main/taskList/add')
        }
      }
    ],
    table: {
      columns: [{
        title: '任务编号',
        dataIndex: 'taskid',
        key: 'taskid',
        render: (value) => {
          return (
            <span title={value}>{value}</span>
          )
        }
      }, {
        title: '批准文号',
        dataIndex: 'drugnum',
        key: 'drugnum',
        render: (value) => {
          return (<span>国药准字<br/>{value}</span>)
        }
      },
      {
        title: '任务内容',
        dataIndex: 'taskcontent',
        key: 'taskcontent'
      },
      // {
      //   title: '药品名称',
      //   dataIndex: 'drug_name',
      //   key: 'drug_name'
      // },
      // {
      //   title: '企业名称',
      //   dataIndex: 'firma_name',
      //   key: 'firma_name'
      // },
      {
        title: '截止日期',
        dataIndex: 'end_date',
        key: 'end_date'
      }, {
        title: '检查员',
        dataIndex: 'user_name',
        key: 'user_name'
      }, {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, row) => {
          return row.status === 0 ? '未完成' : '完成'
        }
      }, {
        title: '操作',
        key: 'action',
        render: (text, row, index) => {
          return (
            <span>
              {
                row.status === 0 ? <span ref={element => { this.detailButtons[index] = element }}>-</span> : <a ref={element => { this.detailButtons[index] = element }} onClick={() => this.show(index, row)}>查看详情</a>
              }
            </span>
          )
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
    taskListSearchRequest({
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
    const isDownload = row.is_download_sourcefile === 0 ? '否' : '是'
    const result = row.hash_result === 1 ? '不一致' : (row.hash_result === 0 ? '一致' : (row.hash_result === 2 ? '一致' : '不一致'))
    const isUpload = row.hash_file_result.slice(0, 4) + '....' + row.hash_file_result.slice(-4)
    const template = `<div style="padding-left: 100px;">
                        <div style="text-align: left;"><div style="display: inline-block;margin-right:50px;width:190px;text-align: left">任务内容：${row.taskcontent}</div><div style="display: inline-block;margin-right:50px;width:190px;text-align: left">上传药企文件hash：${isUpload}</div></div>
                        <div style="text-align: left"><div style="display: inline-block;margin-right:50px;width:190px;text-align: left">Hash比对结果：${result}</div><div style="display: inline-block;margin-right:50px;width:190px;text-align: left">是否下载原文件：${isDownload}</div></div>
                      </div>`
    showDetail(detailButton, template)
  }
  render () {
    const user = JSON.parse(localStorage.getItem('adminUser'))
    if (user.type !== 3) {
      delete this.options.buttons
    }
    console.log(user)
    if (user.user_name === 'admintask') {
      document.getElementById('headTitle').innerHTML = '药品品种档案区块链管理平台（核查中心）'
    }
    return (
      <div>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    )
  }
}

export default connect()(TaskList)
