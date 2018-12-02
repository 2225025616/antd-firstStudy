import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchTable from '../../../../components/SearchTable'
import { insideQuerySearchRequest } from '../../../../utils/request'
import { showDetail } from '../../../../utils/common'

class InsideQuery extends Component {
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
        title: '部门名称',
        dataIndex: 'name',
        key: 'name'
      }, {
        title: '访问IP',
        dataIndex: 'ip',
        key: 'ip'
      }, {
        title: '操作',
        dataIndex: 'operate_type',
        key: 'operate_type',
        render: (text, record) => {
          return record.operate_type === 1 ? '查询' : '下载'
        }
      }, {
        title: '批准文号',
        dataIndex: 'drug_no',
        key: 'drug_no',
        render: (value) => {
          return (<span>国药准字<br/>{value}</span>)
        }
      // }, {
      //   title: '操作对象',
      //   dataIndex: 'operate',
      //   key: 'operate'
      // }, {
      //   title: '结果',
      //   dataIndex: 'result',
      //   key: 'result',
      //   render: (text, row, index) => {
      //     return row.result === 1 ? '正常' : <span ref={element => { this.detailButtons[index] = element }} style={{color: 'red', cursor: 'pointer'}} onClick={() => this.show(index, row)}>异常</span>
      //   }
      }, {
        title: '上链时间',
        dataIndex: 'security_time',
        key: 'security_time'
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
  show = (index, row) => {
    const detailButton = this.detailButtons[index]
    const template = `<div style="padding-left: 100px;">
                        <div style="text-align: left"><div style="display: inline-block;margin-right:50px;">返回文件hash：${row.file_hash}</div><div style="display: inline-block;margin-right:50px;">链上hash：${row.chain_hash}</div><div style="display: inline-block;margin-right:50px;">比对结果：<span style="color: red">不一致</span></div></div>
                        <div style="color: red;text-align: left">请联系管理员进行异常排查！</div>
                      </div>`
    showDetail(detailButton, template)
  }
  search = (values, page) => {
    insideQuerySearchRequest({
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

export default connect()(InsideQuery)
