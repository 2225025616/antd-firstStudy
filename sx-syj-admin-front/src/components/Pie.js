import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts'
import { compare } from '../utils/common'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/title'

class MyChart extends Component {
  myChart = null
  componentDidMount () {
    const { show } = this.props
    this.myChart = echarts.init(this.refs.pieChart) // 初始化echarts
    let options = this.axisOption(this.props.data)
    this.myChart.setOption(options)
    this.myChart.on('click', function (params) {
      // 控制台打印数据的名称
      let type = (params.data.name === '下载') ? 1 : null
      show(type)
    })
  }

  componentWillReceiveProps (nextProps) {
    const hasPropsChange = !compare(nextProps, this.props)
    if (hasPropsChange) {
      this.myChart.setOption(this.axisOption(nextProps.data, nextProps.option))
    }
  }

  axisOption (data) {
    const {option} = this.props
    // const myChart=echarts.init(document.getElementsByClassName('demo'))
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}'
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        data: option.legend
      },
      series: [
        {
          name: option.name,
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
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
