import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Breadcrumb, Row, Col } from 'antd'
import queryString from 'query-string'
import { baseURL } from '../../../../config/index'
import icon from '../../../../assets/pdf.png'
import { showIntro } from '../../../../utils/request'

class ComprehensiveDetail extends Component {
  state = {
    data: {}
  }
  componentWillMount () {
    const { location } = this.props
    showIntro({
      drug_no: queryString.parse(location.search).id
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
        <div>
          <Row>
            <Col span={5}>药品同用名称</Col>
            <Col span={7} className="textV">{this.state.data.drug_name}</Col>
            <Col span={5}>生产单位</Col>
            <Col span={7} className="textV">{this.state.data.firma_name}</Col>
          </Row>
          <hr/>
          <Row>
            <Col span={5}>药品关键词</Col>
            <Col span={7} className="textV">{this.state.data.key}</Col>
            <Col span={5}>药品成分</Col>
            <Col span={7} className="textV">{this.state.data.key_val}</Col>
          </Row>
          <hr/>
          <Row>
            <Col span={5}>更新时间</Col>
            <Col span={7} className="textV">{this.state.data.update_time}</Col>
            <Col span={5}>国药准字批准文号</Col>
            <Col span={7} className="textV">{this.state.data.drug_no}</Col>
          </Row>
          <hr/>
          <Row>
            {/* <Col span={3}>药品上链hash</Col>
            <Col span={9} className="textV">{this.state.data.hash}</Col>
            <Col span={3}>药品关键词hash</Col>
            <Col span={9} className="textV">{this.state.data.key_val_hash}</Col> */}
            <Col span={24} className="textV"><a className="mt-10" href={baseURL + '/' + this.state.data.pdf_public_path} target="_blank"><img src={icon} style={{width: 30}}/> 在线查看药品说明书PDF</a></Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect()(ComprehensiveDetail)
