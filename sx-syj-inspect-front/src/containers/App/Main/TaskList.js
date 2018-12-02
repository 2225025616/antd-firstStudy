import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import $ from 'jquery'
import { getTasks } from '../../../utils/request'
import { Table } from 'antd'
import { showDetail, compare } from '../../../utils/common'

class TaskList extends Component {
  componentWillMount () {
    this.initTable(1)
  }
  shouldComponentUpdate (nextProps, nextState) {
    const hasPropsChange = !compare(nextProps, this.props)
    if (hasPropsChange) {
      this.initTable(1)
    }
    return true
  }
  columns = [
    {
      title: '任务编号',
      dataIndex: 'taskid',
      key: 'taskid',
      render: (text, row, index) => {
        // console.log(row.created_date)
        // console.log(row.end_date)
        return (
          <span title={row.taskid}>
            {row.taskid}
          </span>
        )
      }
    }, {
      title: '批准文号',
      dataIndex: 'drugnum',
      key: 'drugnum',
      render: (value) => {
        return (<span>国药准字<br/>{value}</span>)
      }
    }, {
      title: '任务内容',
      dataIndex: 'taskcontent',
      key: 'taskcontent'
    }, {
      title: '起止日期',
      dataIndex: 'dates',
      render: (text, row, index) => {
        // console.log(row.created_date)
        // console.log(row.end_date)
        return (
          <span>
            {row.created_date.slice(0, 11)}
            <br/>
            {row.end_date.slice(0, 11)}
          </span>
        )
      }
    },
    // {
    //   title: '检查员',
    //   dataIndex: 'name',
    //   key: 'name'
    // },
    {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      filters: [{
        text: '已完成',
        value: '1'
      },
      {
        text: '未完成',
        value: '0'
      }],
      filterMultiple: false
    }, {
      title: '操作',
      key: 'action',
      render: (text, row, index) => {
        let params = row.status === '已完成' ? [index, row] : [row]
        return (
          <span>
            <a className="mt-10" ref='detailButtons' onClick={(e) => this.select(e, params)}>{row.status === '已完成' ? '查看详情' : '执行'}</a>
          </span>
        )
      }
    }
  ]
  state = {
    total: 0,
    current: 1,
    data: []
  }
  initTable = (page, filters) => {
    if ($('tbody').find('.detail').length) {
      $('tbody').find('.detail').remove()
    }
    let data = {page: page}
    console.log(filters && !!(filters.status))
    if (filters && !!(filters.status)) {
      console.log(filters)
      console.log(page)
      data = {status: filters.status[0], page: page}
      getTasks(data).then((data) => {
        if (data) {
          this.setState({
            data: data.tasks,
            current: page,
            total: data.count
          })
        }
      })
    } else {
      getTasks(data).then((data) => {
        if (data) {
          this.setState({
            data: data.tasks,
            current: page,
            total: data.count
          })
        }
      })
    }
  }
  select = (e, params) => {
    if (params.length > 1) {
      this.show(e, params[0], params[1])
    } else {
      this.handle(params[0])
    }
  }
  show = (e, row) => {
    const isDownload = row.is_download_sourcefile ? '是' : '否'
    // const result = row.hash_result ? '不一致' : '通过'
    const result = row.hash_result === 1 ? '不一致' : (row.hash_result === 0 ? '一致' : (row.hash_result === 2 ? '一致' : '不一致'))
    const hash = row.hash_file_result
    const template = `<div style="color: #666;">
                        <div style="text-align: left"><div style="display: inline-block;margin-right:50px;">上传文件hash：${hash.substr(0, 4) + '...' + hash.substr(hash.length - 4, 4)}</div><div style="display: inline-block;margin-right:50px;">Hash比对结果：${result}</div><div style="display: inline-block;margin-right:50px;">是否下载原文件：${isDownload}</div></div>
                      </div>`
    showDetail(e, template)
  }
  handle = (row) => {
    const {history} = this.props
    history.push('/main/handle?id=' + row.id + '&name=' + row.drugnum + '&taskid=' + row.taskid)
  }
  change = (pagination, filters) => {
    this.initTable(pagination.current, filters)
  }
  render () {
    const pagination = {
      current: this.state.current,
      total: this.state.total,
      defaultPageSize: 15,
      showTotal: (total) => '共 ' + total + ' 条数据'
      // onChange: (page) => this.initTable(page)
    }
    return (
      <div>
        {/* <Breadcrumb>
          <Breadcrumb.Item><Link to="/main/index">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>任务列表</Breadcrumb.Item>
        </Breadcrumb> */}
        <Table dataSource={this.state.data} columns={this.columns} rowKey='id' onChange={this.change} pagination={pagination}></Table>
      </div>
    )
  }
}

export default connect()(TaskList)
