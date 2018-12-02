import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Breadcrumb, Row, Col } from 'antd'
import queryString from 'query-string'
import { getComprehensiveDetail } from '../../../../utils/request'

class ComprehensiveDetail extends Component {
  state = {
    data: {}
  }
  componentWillMount () {
    const { location } = this.props
    getComprehensiveDetail({
      drug_no: queryString.parse(location.search).id
    }).then(data => {
      this.setState({
        data: data.list ? data.list : {}
      })
    })
  }
  render () {
    const { match } = this.props
    const type = match.params.type === 'add' ? '新增' : '查看'
    return (
      <div className="type-container">
        <Breadcrumb>
          <Breadcrumb.Item><a onClick={this.goBack}>综合信息</a></Breadcrumb.Item>
          <Breadcrumb.Item>{type}</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Row>
            <Col span={4}>药品同用名称</Col>
            <Col span={8} className="textV">{this.state.data.drug_name}</Col>
            <Col span={4}>药品类型</Col>
            <Col span={8} className="textV">{this.state.data.type}</Col>
          </Row>
          <hr/>
          {/* <Row>
            <Col span={4}>药品英文名称</Col>
            <Col span={8} className="textV">{this.state.data.drug_en_name}</Col>
            <Col span={4}>药品名称汉语拼音</Col>
            <Col span={8} className="textV">{this.state.data.drug_zh_name}</Col>
          </Row>
          <hr/> */}
          <Row>
            <Col span={4}>剂型</Col>
            <Col span={8} className="textV">{this.state.data.dosage}</Col>
            <Col span={4}>规格</Col>
            <Col span={8} className="textV">{this.state.data.size}</Col>
          </Row>
          <hr/>
          <Row>
            <Col span={4}>国药准字批准文号</Col>
            <Col span={8} className="textV">{this.state.data.drug_no}</Col>
            <Col span={4}>批准日期</Col>
            <Col span={8} className="textV">{this.state.data.approve_time}</Col>
          </Row>
          <hr/>
          {/* <Row>
            <Col span={4}>包装规格</Col>
            <Col span={8} className="textV">{this.state.data.package_size}</Col>
            <Col span={4}>国药准字批准文号有效期</Col>
            <Col span={8} className="textV">{this.state.data.drug_end_time}</Col>
          </Row>
          <hr/> */}
          <Row>
            <Col span={4}>生产单位</Col>
            <Col span={8} className="textV">{this.state.data.product_company}</Col>
            <Col span={4}>生产地址</Col>
            <Col span={8} className="textV">{this.state.data.address}</Col>
          </Row>
          <hr/>
          <Row>
            <Col span={4}>药品编号</Col>
            <Col span={8} className="textV">{this.state.data.drug_code}</Col>
            <Col span={4}>批准文号状况</Col>
            <Col span={8} className="textV">{this.state.data.product_status}</Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect()(ComprehensiveDetail)
