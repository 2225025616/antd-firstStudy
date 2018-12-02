import React, { Component } from 'react'
import echarts from 'echarts'

class Main extends Component {
  componentDidMount () {
    let option = {
      tooltip: {trigger: 'axis'},
      legend: {
        data: ['满意', '非常满意', '可以忍受', '无法忍受', '抓狂'],
        bottom: '1%'
      },
      backgroundColor: '#fff',
      grid: {
        left: '3%',
        right: '4%',
        top: '4%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      series: [
        {
          name: '满意',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '可以忍受',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '非常满意',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '无法忍受',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '抓狂',
          type: 'line',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          areaStyle: {normal: {}},
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    }
    let myCharts = echarts.init(document.getElementById('demo'))
    myCharts.setOption(option) // 在此处可以请求后台数据，动态设置option
  }
  render () {
    return (
      <div id="demo" style={{'height': '250px'}}>
      </div>
    )
  }
}
export default Main