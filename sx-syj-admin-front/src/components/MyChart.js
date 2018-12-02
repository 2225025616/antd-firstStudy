import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts'
import { compare } from '../utils/common'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/title'

class MyChart extends Component {
  myChart = null
  componentDidMount () {
    const { type } = this.props.option // { type }取option下的type
    // console.log(type)
    // 我们要定义一个setPieOption函数将data传入option里面
    this.myChart = echarts.init(this.refs.lineChart) // 初始化echarts
    let options = type === 'map' ? this.setItem(this.props.data) : this.axisOption(this.props.data, this.props.option)
    // console.log(options)
    this.myChart.setOption(options)
  }

  componentWillReceiveProps (nextProps) {
    const hasPropsChange = !compare(nextProps, this.props)
    if (hasPropsChange) {
      // console.log(nextProps)
      this.myChart.setOption(this.axisOption(nextProps.data, nextProps.option))
    }
  }

  // handleRef = (n) => {
  //   this.node = n
  //   console.log(n)
  // }
  axisOption (data, option) {
    // console.log(option)
    // const myChart=echarts.init(document.getElementsByClassName('demo'))
    return { // 柱状图或者折线图
      title: { // 图表标题设置
        text: option.title,
        textStyle: {
          color: '#33a7ae',
          align: 'center'
        },
        x: '',
        top: 0,
        left: 0
      },
      tooltip: { // 提示框设置
        trigger: 'axis'
      },
      legend: {
        x: 'auto',
        left: 'auto',
        top: 'auto',
        height: 'auto',
        align: 'left', // 文本对齐方式
        data: option.legend
      },
      xAxis: [
        {
          type: 'category', // category:离散数据；value：连续数据；time：时间；log：对数
          name: '时间', // 坐标轴名称
          splitLine: {show: false}, // 是否显示分割线
          data: option.xData,
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#33a7ae'
            }
          }
        }
      ],
      yAxis: [
        {
          show: true, // 是否显示Y轴
          type: 'value', // 同xAxis的type一样
          name: '次数',
          // splitNumber: 10, // 分割端数
          splitLine: {show: false},
          axisLine: {
            lineStyle: {
              color: '#33a7ae'
            }
          }
        }
      ],
      toolbox: { // 工具栏
        show: false,
        feature: {
          mark: {
            show: false
          },
          dataView: {
            // readOnly: true,
            show: false
          },
          restore: {
            show: false
          },
          saveAsImage: {
            show: false
          }
        }
      },
      series: [
        {
          type: option.type,
          lineStyle: {
            normal: {
              color: '#33a7ae'
            }
          },
          areaStyle: {
            normal: {
              color: '#33a7ae'
            }
          },
          data: data
        }
      ]
    }
  }
  render () {
    const { height } = this.props.option
    return (
      <div ref='lineChart' style={{height}}></div>
    )
  }
}

export default MyChart
