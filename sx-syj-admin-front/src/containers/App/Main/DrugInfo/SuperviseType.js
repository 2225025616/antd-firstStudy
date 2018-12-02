import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Breadcrumb, Row, Col, Divider } from 'antd'
import queryString from 'query-string'
import { showSupervise } from '../../../../utils/request'

class ComprehensiveDetail extends Component {
  state = {
    data: {}
  }
  componentWillMount () {
    const { location } = this.props
    showSupervise({
      id: queryString.parse(location.search).id
    }).then(data => {
      this.setState({
        data: data.list
      })
    })
  }
  render () {
    return (
      <div className="type-container">
        <Breadcrumb>
          <Breadcrumb.Item><a onClick={this.goBack}>药品说明书</a></Breadcrumb.Item>
          <Breadcrumb.Item>查看</Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={16}>
          <Col span={3}>药品同用名称</Col>
          <Col span={9} className="textV">{this.state.data.drug_name}</Col>
          <Col span={3}>生产单位</Col>
          <Col span={9} className="textV">{this.state.data.firma_name}</Col>
        </Row>
        <Divider dashed />
        <Row gutter={16}>
          <Col span={3}>药品关键词</Col>
          <Col span={9} className="textV">{this.state.data.key}</Col>
          <Col span={3}>药品成分</Col>
          <Col span={9} className="textV">{this.state.data.key_val}</Col>
        </Row>
        <Divider dashed />
        <Row gutter={16}>
          <Col span={3}>药品上链hash</Col>
          <Col span={9} className="textV">{this.state.data.hash}</Col>
          <Col span={3}>药品关键词hash</Col>
          <Col span={9} className="textV">{this.state.data.key_val_hash}</Col>
        </Row>
        <Divider dashed />
        <Row gutter={16}>
          <Col span={3}>更新时间</Col>
          <Col span={9} className="textV">{this.state.data.update_time}</Col>
          <Col span={3}>国药准字批准文号</Col>
          <Col span={9} className="textV">{this.state.data.drug_no}</Col>
        </Row>
      </div>
    )
  }
}

export default connect()(ComprehensiveDetail)
