import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Col, Row, Button, Icon } from 'antd'
import './Template.css'

class Template extends Component {
  templates = [
    {
      name: '药品档案信息',
      date: '2017-11-11'
    },
    {
      name: '药品档案信息',
      date: '2017-11-11'
    },
    {
      name: '药品档案信息',
      date: '2017-11-11'
    },
    {
      name: '药品档案信息',
      date: '2017-11-11'
    },
    {
      name: '药品档案信息',
      date: '2017-11-11'
    },
    {
      name: '药品档案信息',
      date: '2017-11-11'
    }
  ]
  renderCards = (templates) => {
    let arr = []
    let i = 0
    arr[0] = []
    templates = [null, ...templates]
    templates.forEach((item, index) => {
      arr[i].push(item)
      if ((index + 1) % 3 === 0) {
        i++
        arr[i] = []
      }
    })
    let index3 = 0
    return (
      arr.map((item, index) => {
        return (
          <Row key={index} gutter={16}>
            {
              item.map((item2, index2) => {
                index3++
                if (index === 0 && index2 === 0) {
                  return (
                    <Col key={index3} span={8}>
                      <div className="new">
                        <div className="add">
                          <Icon type="plus" />
                        </div>
                        <div>新建模板</div>
                      </div>
                    </Col>
                  )
                }
                return (
                  <Col key={index3} span={8}>
                    <Card className="template-card" title={item2.date} bordered={false}>
                      <div className="template-name">{item2.name}</div>
                      <Row>
                        <Col span={6}>
                          <Button type="primary">查看</Button>
                        </Col>
                        <Col span={6}>
                          <Button type="primary">重命名</Button>
                        </Col>
                        <Col span={6}>
                          <Button type="primary">提交</Button>
                        </Col>
                        <Col span={6}>
                          <Button type="primary">克隆</Button>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                )
              })
            }
          </Row>
        )
      })
    )
  }
  render () {
    return (
      <div className="template-container">
        {this.renderCards(this.templates)}
      </div>
    )
  }
}

export default connect()(Template)
