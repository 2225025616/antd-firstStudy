import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getMsg } from '../../../utils/request'
import { List, Breadcrumb, Row, Col } from 'antd'

const userId = JSON.parse(localStorage.getItem('user') || '{}').user_id
class MsgList extends Component {
  componentWillMount () {
    this.showData(1)
  }
  state = {
    listData: [],
    total: 0,
    current: 1,
    allOpacity: 0
  }
  showData = (page) => {
    getMsg({user_id: userId, page: page}).then(
      data => {
        let sum = 0
        for (let i in data) {
          sum += data[i].notice_status
        }
        this.setState({
          current: page,
          listData: data.result,
          total: data.count,
          allOpacity: sum < data.length ? 1 : 0
        })
      }
    )
  }
  mark =() => {
    console.log('1212')
  }
  changePage = (page) => {
    this.showData(page)
  }
  render () {
    const pagination = {
      current: this.state.current,
      total: this.state.total,
      defaultPageSize: 15,
      onChange: (page) => this.changePage(page)
    }
    return (
      <div>
        <Row type="flex" justify="space-between">
          <Col span={8}>
            <Breadcrumb>
              <Breadcrumb.Item><Link to="/main/index">首页</Link></Breadcrumb.Item>
              <Breadcrumb.Item>消息中心</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <List pagination={pagination} size="large" itemLayout="vertical"
          dataSource={this.state.listData}
          renderItem={item => (
            <List.Item key={item.drugnum}>
              <List.Item.Meta
                title={<a href={item.href}>{item.taskcontent}</a>}
                description={item.taskcontent}
              />
              {item.content}
            </List.Item>
          )}
        />
      </div>
    )
  }
}
export default connect()(MsgList)
