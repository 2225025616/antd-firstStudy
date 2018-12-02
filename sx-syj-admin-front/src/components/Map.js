import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/geo'
import chinaJson from 'echarts/map/json/china.json'
import { compare } from '../utils/common'
import star from '../assets/star2.png'

class MyChart extends Component {
  map = null
  myChart = null
  getOptions = (name, arr1, arr2, arr3) => {
    let mapData = []
    for (let i = 0; i < name.length; i++) {
      mapData.push({
        name: name[i],
        yaopin: parseInt(arr1[i]),
        yaoqi: parseInt(arr2[i]),
        diao: parseInt(arr3[i])
      })
    }
    // console.log(mapData)
    const options = {
      tooltip: {
        trigger: 'item'
      },
      geo: {
        map: 'china',
        roam: false,
        regions: [
          {
            name: '北京',
            label: {
              show: true,
              backgroundColor: {
                image: star
              },
              width: 15,
              height: 15,
              rich: {}
            }
          }
        ],
        label: {
          normal: {
            show: false,
            textStyle: {
              color: '#fff'
            }
          },
          emphasis: {
            show: false,
            textStyle: {
              color: '#1890ff'
            }
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#323c48',
            borderColor: '#00ffff',
            borderWidth: 1
          },
          emphasis: {
            areaColor: '#00ffff',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 30,
            borderWidth: 1,
            shadowColor: 'rgba(0, 255, 255, 0.5)'
          }
        }
      },
      series: [
        {
          type: 'map',
          roam: false,
          geoIndex: 0,
          data: mapData,
          tooltip: {
            formatter: (params) => {
              const { data = {} } = params
              const { name, yaopin, yaoqi, diao } = data
              if (yaopin !== undefined) {
                return `${name}<br />药品品种档案数量:${parseInt(yaopin)}<br />药企数量:${parseInt(yaoqi)}<br />授权调用次数:${parseInt(diao)}`
              }
            }
          }
        }
      ]
    }
    return options
  }
  componentDidMount () {
    const {name, mapData1, mapData2, mapData3} = this.props
    echarts.registerMap('china', chinaJson)
    this.myChart = echarts.init(this.map) // 初始化echarts
    // 我们要定义一个setPieOption函数将data传入option里面
    const options = this.getOptions(name, mapData1, mapData2, mapData3)
    // console.log(options)
    this.myChart.setOption(options)
  }
  componentWillReceiveProps (nextProps) {
    const hasPropsChange = !compare(nextProps, this.props)
    if (hasPropsChange) {
      this.myChart.setOption(this.getOptions(nextProps.name, nextProps.mapData1, nextProps.mapData2, nextProps.mapData3))
    }
  }
  render () {
    const {style} = this.props
    return (
      <div ref={ele => { this.map = ele }} style={style}></div>
    )
  }
}

export default MyChart
