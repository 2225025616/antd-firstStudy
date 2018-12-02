import React, { Component } from 'react'
import { connect } from 'react-redux'
import { baseURL } from '../../../config'
import { downFile, judgeFileHash, judgeWordsHash } from '../../../utils/request'
import { Upload, Icon, Row, Col, Modal, Button, message, Form, Input } from 'antd'
import './TaskListType.css'
// const InputGroup = Input.Group
const FormItem = Form.Item
// import $ from 'jquery'

const URL = baseURL + '/api/do_task'
const downTool = baseURL + '/download/hash.rar'
const token = JSON.parse(localStorage.getItem('user') || '{}').token
const headers = {'Authorization': 'Bearer ' + token}

let ref = null
class Footer extends Component {
  state = {
    src: ''
  }
  downFile = () => {
    const {id, name} = this.props
    downFile({
      id: parseInt(id),
      drug_no: name
    }).then(
      (data) => {
        if (data) {
          let binaryData = []
          binaryData.push(data)
          // console.log(data)
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
  render () {
    const {option} = this.props
    // console.log(option)
    return (
      <div className="footer">
        <Row style={option.opacity ? {display: 'block'} : {display: 'none'}}>
          <Col span={7}>上传文件hash：</Col>
          <Col span={17} className="textOver">{option.localValue}</Col>
        </Row>
        <Row style={option.opacity ? {display: 'block'} : {display: 'none'}}>
          <Col span={7}>链上文件hash：</Col>
          <Col span={17} className="textOver">{option.chainValue}</Col>
        </Row>
        {/* <Row gutter={16}>
          <Col span={16} style={{color: option.opacity ? 'red' : '#999'}}>{option.tipsText}</Col>
          <Col span={8}><a onClick={this.downFile}>下载文件</a></Col>
        </Row> */}
      </div>
    )
  }
}

class MyUpload extends Component {
  state = {
    option: {
      opacity: 0,
      tipsText: '无法提供原文件',
      localValue: '',
      chainValue: ''
    }
  }
  setOptions = (option) => {
    if (option.data) {
      if (!option.data.state) {
        this.setState({
          option: {
            opacity: 1, // 比对不一致
            localValue: option.data.localhash,
            chainValue: option.data.chainhash,
            tipsText: option.errorMsg
          }
        })
      } else {
        this.setState({
          option: {
            opacity: 0, // 比对一致
            localValue: option.data.localhash,
            chainValue: option.data.chainhash,
            tipsText: option.errorMsg
          }
        })
      }
      message.success(option.errorMsg)
    } else {
      this.setState({
        option: {
          opacity: 0,
          tipsText: ''
        }
      })
      message.error(option.errorMsg)
      return false
    }
  }
  render () {
    const {id, name, taskid, path} = this.props // this.props.id / this.props.name 对象的解构
    const options = {
      action: URL,
      onChange: ({ file, fileList }) => {
        if (file.status !== 'uploading') {
          // this.setOptions(file.response)
          // console.log(file.status)
          // console.log(path)
          // console.log(file.response.data)
          sessionStorage.setItem('resultData', JSON.stringify(file.response.data))
          sessionStorage.setItem('id', id)
          sessionStorage.setItem('name', name)
          sessionStorage.setItem('taskid', taskid)
          path.push('/main/result')
          // console.log(JSON.stringify(file.response.data))
        }
      },
      defaultFileList: [],
      headers: headers,
      data: {
        id: parseInt(id),
        drugnum: name
      }
    }
    const uploadButton = (
      <Icon type="plus" />
    )
    // console.log(options.defaultFileList.length)
    return (
      <div>
        {/* <h3>文件上传：</h3> */}
        <Upload {...options} className="upload" accept='application/pdf' name='drug_pdf'>
          {options.defaultFileList.length >= 1 ? null : uploadButton}
        </Upload>
        <div className="ant-upload-text">上传批准文号 {name} 工艺的PDF文件</div>
        <Footer id={id} name={name} option={this.state.option}></Footer>
      </div>
    )
  }
}

class Hash extends Component {
  handleSubmit = (e) => {
    const { submit } = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        ref.destroy()
        submit(values)
      }
    })
  }
  // componentDidMount () {
  //   const { getForm, form } = this.props
  //   getForm(form)
  // }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('kewrod_hash', {
            rules: [{ required: true, message: '请输入要素字段Hash值!' }]
          })(
            <Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="要素字段Hash值" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            确定
          </Button>
        </FormItem>
      </Form>
    )
  }
}
const AddCheck = Form.create()(Hash)

class CheckForm extends Component {
  state = {
    selectedValue: 'file_hash',
    stateText: 2,
    myHash: '',
    oldHash: '',
    opacity: 0
  }
  hashFile = (e) => {
    const {id, name, taskid, path} = this.props
    e.preventDefault()
    let obj = {}
    this.props.form.validateFields((err, values) => {
      if (!err) {
        obj = values
      }
    })
    console.log(obj)
    if (!(obj.file_hash)) {
      message.error('请输入hash值', 4)
    } else {
      judgeFileHash({
        id: id,
        drugnum: name,
        ...obj
      }).then(
        (data) => {
          sessionStorage.setItem('resultData', JSON.stringify(data))
          sessionStorage.setItem('id', id)
          sessionStorage.setItem('name', name)
          sessionStorage.setItem('taskid', taskid)
          path.push('/main/result')
          // this.setState({
          //   stateText: 0,
          //   opacity: data.state ? 0 : 1,
          //   myHash: data.localhash,
          //   oldHash: data.chainhash
          // })
          // if (data.state) {
          //   message.success('文件Hash比对一致！')
          // } else {
          //   message.error('文件hash比对不一致，请尝试比对要素字段hash比对！')
          // }
        }
      )
    }
  }
  hashWords = (FormData) => {
    const {id, name} = this.props
    judgeWordsHash({
      id: id,
      drugnum: name,
      ...FormData
    }).then((data) => {
      // console.log(data)
      if (data) {
        if (data.state) {
          message.success('要素字段Hash比对成功', 4)
          const {history} = this.props
          history.push('/main/index')
        } else {
          message.error('要素字段Hash比对不成功，请选择方法一', 4)
        }
      }
    })
  }
  showModal = () => {
    ref = Modal.info({
      title: '要素文字比对',
      maskClosable: true,
      content: <AddCheck submit={this.hashWords}></AddCheck>,
      okText: ' ',
      okType: 'none'
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    // const selectedValue = this.state.selectedValue
    return (
      <Form style={{width: '100%'}}>
        <FormItem>
          {getFieldDecorator('file_hash', {
            required: true,
            rules: [{ required: true, message: '请输入对应的Hash值!' }]
          })(
            <Input prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Hash值" />
          )}
        </FormItem>
        <FormItem style={this.state.stateText ? {display: 'inlineBlock'} : {display: 'none'}}>
          <Button htmlType='submit' onClick={(e) => this.hashFile(e)}>执行比对</Button>
        </FormItem>
        <FormItem>
          <a href={downTool}>下载本地 hash 工具</a>
        </FormItem>
        <FormItem style={this.state.opacity ? {display: 'block'} : {display: 'none'}}>
          <span>本地hash值： {this.state.myHash}</span>
        </FormItem>
        <FormItem style={this.state.opacity ? {display: 'block'} : {display: 'none'}}>
          <span>链上hash值： {this.state.oldHash}</span>
        </FormItem>
        <FormItem style={this.state.opacity ? {display: 'block'} : {display: 'none'}}>
          {this.state.opacity ? '比对不一致' : '比对一致'}
        </FormItem>
        <FormItem style={this.state.opacity ? {display: 'block'} : {display: 'none'}}>
          <Button onClick={this.showModal}>要素文字比对</Button>
        </FormItem>
      </Form>
    )
  }
}
const JudgeHash = Form.create()(CheckForm)

class TaskListType extends Component {
  state = {
    response: {}
  }
  onChange = (activeKey) => {
    this.setState({ activeKey })
  }
  render () {
    const { history } = this.props
    const id = history.location.search.slice(1).split('&')[0].split('=')[1]
    const name = history.location.search.slice(1).split('&')[1].split('=')[1]
    const taskid = history.location.search.slice(1).split('&')[2].split('=')[1]
    return (
      <div className="type-container">
        <div className="flexCtn">
          <p>方法一：</p>
          <MyUpload id={id} name={name} taskid={taskid} response={this.state.response} path = {history}></MyUpload>
        </div>
        <div className="flexCtn">
          <p>方法二：</p>
          <JudgeHash id={id} name={name} taskid={taskid} path = {history}></JudgeHash>
        </div>
      </div>
    )
  }
}

export default connect()(TaskListType)
