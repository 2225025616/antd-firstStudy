import React, { Component } from 'react'
import { Col, Row } from 'antd'

class MyData extends Component {
  fillIn = (obj) => {
    const {columns} = this.props
    let arr = []
    columns.map(
      (v, j) => {
        for (let k in obj) {
          if (k === v) {
            arr.push(obj[k])
          }
        }
      }
    )
    return arr.map(
      (subItem, i) => {
        // console.log(arr.length)
        return <Col span={i < 3 ? 5 : 9} key={i}>{subItem}</Col>
      }
    )
  }
  render () {
    const { dataSource } = this.props
    return (
      <div>
        {
          dataSource.map(
            (item, k) => {
              return <Row gutter={8} key={k}>{this.fillIn(item)}</Row>
            }
          )
        }
      </div>
    )
  }
}

export default MyData
