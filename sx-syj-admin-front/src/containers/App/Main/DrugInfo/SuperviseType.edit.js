import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Breadcrumb, Form, Input, Button, message, Upload, Icon, Table } from 'antd'
import { baseURL } from '../../../../config/index'
import queryString from 'query-string'
import { responseHandle, getUniqueKey } from '../../../../utils/common'
import { superviseIdSearchRequest } from '../../../../utils/request'

class SuperviseType extends Component {
  rules1 = [{
    required: true,
    message: '请输入国药准字批准文号'
  }]
  rules2 = [{
    required: true,
    message: '请输入药品名称'
  }]
  uploadProps = {
    name: 'file',
    accept: '.pdf',
    beforeUpload: () => {
      const { form, match } = this.props
      let result = true
      if (match.params.type === 'add') {
        form.validateFields(err => {
          if (!err) {
            result = true
            const data = this.state.dataSource.filter(item => {
              if (item.key && item.value) {
                return true
              }
            })
            if (!data.length) {
              result = false
            }
          } else {
            result = false
          }
        })
      }
      return result
    },
    headers: {
      authorization: 'Bearer ' + JSON.parse(localStorage.getItem('adminUser') || '{}').token
    },
    onChange: (info) => {
      const { history } = this.props
      if (info.file.status === 'uploading' || info.file.status === 'removed') {
        return false
      }
      if (!info.file.response) {
        message.error('关键信息是必需的')
        return false
      }
      if (info.file.response && info.file.response.errorNo === 200) {
        message.success(`${info.file.name} 文件上传成功`, history.goBack)
      } else {
        responseHandle(info.file.response, message).catch((err) => message.error(err.message))
      }
    }
  }
  columns = [
    {
      title: 'key',
      dataIndex: 'key',
      key: 'key',
      render: (text, row, index) => <Input value={text} placeholder="请输入参数，如：温度" onChange={e => this.change('key', index, e.target.value)}/>
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
      render: (text, row, index) => <Input value={text} placeholder="请输入值，如：13" onChange={e => this.change('value', index, e.target.value)}/>
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, row, index) => {
        return (
          <div>
            <a onClick={() => this.add(index)} style={{marginRight: '10px'}}>增加</a>
            <a onClick={() => this.delete(index)}>删除</a>
          </div>
        )
      }
    }
  ]
  state = {
    drug_no: null,
    drug_name: null,
    data: {},
    dataSource: [
      {
        id: 0,
        key: '',
        value: ''
      }
    ],
    editdata: {}
  }
  change = (target, index, value) => {
    this.setState(prevState => {
      prevState.dataSource[index][target] = value.replace('|', '').replace(':', '')
      const keyValue = prevState.dataSource.filter(item => !(item.key === '' || item.value === ''))
      let keyValueStr = ''
      let keyStr = ''
      keyValue.forEach((item, index) => {
        keyValueStr += `${index === 0 ? '' : '|'}${item.key}:${item.value}`
        keyStr += `${index === 0 ? '' : '|'}${item.key}:`
      })
      return {
        dataSource: prevState.dataSource,
        data: {
          ...prevState.data,
          key_val: keyValueStr,
          key: keyStr
        }
      }
    })
  }
  add = (index) => {
    this.setState(prevState => {
      prevState.dataSource.push({
        id: getUniqueKey(prevState.dataSource, 'id', 0, true),
        key: '',
        value: ''
      })
      return {
        dataSource: prevState.dataSource
      }
    })
  }
  delete = (index) => {
    if (index === 0 && this.state.dataSource.length === 1) {
      message.error('仅剩一行无法删除')
      return false
    }
    this.setState(prevState => {
      return {
        dataSource: prevState.dataSource.filter((item, i) => {
          if (index === i) {
            return false
          }
          return true
        })
      }
    })
  }
  change1 = (key, value) => {
    this.setState(prevState => {
      return {
        data: {
          ...prevState.data,
          [key]: value
        }
      }
    })
  }
  goBack = () => {
    const { history } = this.props
    history.goBack()
  }
  componentWillMount () {
    const { match, location } = this.props
    if (match.params.type === 'edit') {
      superviseIdSearchRequest({
        drug_id: queryString.parse(location.search).id
      }).then(data => {
        if (data && data.key_val) {
          let initDataSource = []
          data.key_val.split('|').forEach((item, index) => {
            const arr = item.split(':')
            initDataSource.push({
              id: index,
              key: arr[0],
              value: arr[1]
            })
          })
          this.setState({
            dataSource: initDataSource,
            editdata: {
              drug_no: data.drug_no,
              firma_name: data.firma_name,
              drug_name: data.drug_name
            }
          })
        }
      })
      this.setState(prevState => {
        return {
          data: {
            ...prevState.data,
            drug_id: queryString.parse(location.search).id
          }
        }
      })
    }
  }
  render () {
    const { form, match } = this.props
    const type = match.params.type === 'add' ? '新增' : '编辑'
    const action = baseURL + '/web/' + (match.params.type === 'add' ? 'add_drug_supervise' : 'update_drug_supervise')
    return (
      <div className="type-container">
        <Breadcrumb>
          <Breadcrumb.Item><a onClick={this.goBack}>药品工艺管理</a></Breadcrumb.Item>
          <Breadcrumb.Item>{type}</Breadcrumb.Item>
        </Breadcrumb>
        <Form>
          {
            match.params.type === 'add' ? (
              <Form.Item
                label="国药准字批准文号"
              >
                {form.getFieldDecorator('drug_no', {
                  rules: this.rules1
                })(
                  <Input onChange={(e) => this.change1('drug_no', e.target.value)}/>
                )}
              </Form.Item>
            ) : (
              <Form.Item
                label="国药准字批准文号"
              >
                {this.state.editdata.drug_no}
              </Form.Item>
            )
          }
          {
            match.params.type === 'add' ? (
              <Form.Item
                label="企业名称"
              >
                {form.getFieldDecorator('firma_name', {
                  rules: this.rules2
                })(
                  <Input onChange={(e) => this.change1('firma_name', e.target.value)}/>
                )}
              </Form.Item>
            ) : (
              <Form.Item
                label="企业名称"
              >
                {this.state.editdata.firma_name}
              </Form.Item>
            )
          }
          {
            match.params.type === 'add' ? (
              <Form.Item
                label="药品名称"
              >
                {form.getFieldDecorator('drug_name', {
                  rules: this.rules2
                })(
                  <Input onChange={(e) => this.change1('drug_name', e.target.value)}/>
                )}
              </Form.Item>
            ) : (
              <Form.Item
                label="药品名称"
              >
                {this.state.editdata.drug_name}
              </Form.Item>
            )
          }
          <Form.Item
            label="关键信息"
            className="table-form-item"
            required
          >
            <span style={{color: 'red'}}>: 符号和 | 符号被禁止输入</span>
            <Table pagination={false} rowKey="id" dataSource={this.state.dataSource} columns={this.columns} />
          </Form.Item>
          <Form.Item
            label="档案文件"
            required
          >
            <Upload {...this.uploadProps} data={this.state.data} action={action}>
              <Button>
                <Icon type="upload" /> 上传pdf文件
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item style={{width: (this.labelWidth + 260) + 'px'}}>
            <Button type="default" onClick={this.goBack}>取消</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const WrappedSuperviseType = Form.create()(SuperviseType)

export default connect()(WrappedSuperviseType)
