import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts'
import { compare } from '../utils/common'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/title'

class MyChart extends Component {
  componentDidMount () {
    // console.log(this.props.option.type)
    const { type } = this.props.option // { type }取option下的type
    let myChart = echarts.init(this.refs.pieChart) // 初始化echarts
    // 我们要定义一个setPieOption函数将data传入option里面
    let options = type === 'map' ? this.setItem(this.props.data) : this.axisOption(this.props.data)
    console.log(myChart, options)
    myChart.setOption(options)
  }

  componentWillReceiveProps (nextProps) {
    const hasPropsChange = !compare(nextProps, this.props)
    if (hasPropsChange) {
      this.setOption(nextProps.data)
    }
  }

  // handleRef = (n) => {
  //   this.node = n
  //   console.log(n)
  // }
  axisOption (data) {
    const {option} = this.props
    // const myChart=echarts.init(document.getElementsByClassName('demo'))
    return { // 柱状图或者折线图
      title: { // 图表标题设置
        text: option.title,
        x: '',
        top: 0,
        left: 0
      },
      tooltip: { // 提示框设置
        trigger: 'axis'
      },
      color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'], // 绘制图表颜色
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
          name: 'x', // 坐标轴名称
          splitLine: {show: false}, // 是否显示分割线
          data: option.xData
        }
      ],
      yAxis: [
        {
          show: true, // 是否显示Y轴
          type: 'value', // 同xAxis的type一样
          name: 'y',
          // splitNumber: 10, // 分割端数
          splitLine: {show: false}
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
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 0, color: '#83bff6'},
                  {offset: 0.5, color: '#188df0'},
                  {offset: 1, color: '#188df0'}
                ]
              )
            },
            emphasis: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 0, color: '#2378f7'},
                  {offset: 0.7, color: '#2378f7'},
                  {offset: 1, color: '#83bff6'}
                ]
              )
            }
          },
          data: data
        }
      ]
    }
  }
  itemOption (data) {
    const {option} = this.props
    return { // 地图
      backgroundColor: '#efefef',
      title: {
        text: option.text,
        x: 'center' // 标题位置
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}'
      },
      visualMap: {
        show: false,
        x: 'left',
        y: 'bottom',
        splitList: [
          {start: 500, end: 600}, {start: 400, end: 500},
          {start: 300, end: 400}, {start: 200, end: 300},
          {start: 100, end: 200}, {start: 0, end: 100}
        ],
        color: ['#66CC33', '#00FF00', '#66FF33', '#339900', '#33CC00', '#00CC00']
      },
      series: [
        {
          name: '分布',
          type: 'map',
          mapType: 'china',
          roam: true,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
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
      <div ref='pieChart' style={{height}}></div>
    )
  }
}

export default MyChart
