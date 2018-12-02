import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import { downFile } from '../../../utils/request'
import { Divider } from 'antd'
import './Result.css'

class Result extends Component {
  state = {
    src: ''
  }
  downFile = () => {
    const name = sessionStorage.getItem('name')
    const id = sessionStorage.getItem('id')
    const taskid = sessionStorage.getItem('taskid')
    downFile({
      id: parseInt(id),
      drug_no: name,
      taskid
    }).then(
      (data) => {
        if (data) {
          let binaryData = []
          binaryData.push(data)
          console.log(data)
          let url = window.URL.createObjectURL(
            new Blob(binaryData)
          )
          if (window.navigator.msSaveOrOpenBlob) { // msSaveOrOpenBlob方法返回bool值
            navigator.msSaveBlob(binaryData, name + '.pdf') // 本地保存
          } else {
            var link = document.createElement('a') // a标签下载
            link.href = url
            link.download = name + '.pdf'
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
        } else {
        }
      }
    )
  }
  trager = () => {
    sessionStorage.clear()
    const {history} = this.props
    history.push('/main/index')
  }
  render () {
    const option = JSON.parse(sessionStorage.getItem('resultData'))
    // console.log(option.localhash)
    // console.log(option.localhash.length < 9)
    return (
      <div className="resultCtn">
        <div className="resultText">
          <div>
            <p>
              本地文件hash：
              <span style={option.state ? {color: ''} : {color: 'red'}} title={option.localhash}>
                {option.localhash.length < 9 ? option.localhash : option.localhash.slice(0, 4) + '....' + option.localhash.slice(-4)}
              </span>
            </p>
            <p>链上文件hash：<span title={option.chainhash}>{option.chainhash.slice(0, 4) + '....' + option.chainhash.slice(-4)}</span></p>
          </div>
          <span style={option.state === 1 ? {color: '#00CC00'} : {color: 'red'}}>
            <i style={option.state === 1 ? {borderColor: '#00CC00'} : {borderColor: 'red'}}>VS</i>
            {option.state === 1 ? '比对一致' : (option.state === 0 ? '比对不一致' : (option.state === 2 ? '不在规定时间内，比对一致' : '不在规定时间内，比对不一致'))}
          </span>
        </div>
        <Divider/>
        <p className="texts">
          {option.state === 1 ? '已确认药品档案库内生产工艺原文件未被修改' : (option.state === 0 ? '与药品档案库内生产工艺源文件不一致！' : (option.state === 2 ? '已确认药品档案库内生产工艺原文件未被修改' : '与药品档案库内生产工艺源文件不一致！'))}
          <a style={option.state ? {display: 'none'} : {display: 'inlineBlock'}} onClick={this.downFile}>下载文件</a>
        </p>
        <p>
          <a onClick={this.trager} to="/main/index">完成检验</a>
        </p>
      </div>
    )
  }
}

export default connect()(Result)
