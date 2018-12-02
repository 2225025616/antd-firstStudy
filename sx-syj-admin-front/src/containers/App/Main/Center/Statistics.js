import React, { Component } from 'react'
import { connect } from 'react-redux'
import MyChart from '../../../../components/MyChart'
import Pie from '../../../../components/Pie'
import Map from '../../../../components/Map'
import './Statistics.css'
import { Table, Radio } from 'antd'
import { compare } from '../../../../utils/common'
import { initIndex, showPie, statisticsDatas, showLineDatas1, showLineDatas2, showLineDatas3, getMap } from '../../../../utils/request'

const styles = {
  width: '100%',
  height: 450
}
class Statistics extends Component {
  flag = false
  state = {
    tab: 'week',
    index: 0,
    shouquannum: 0,
    data: [],
    xData: [],
    pieData1: 0,
    pieData2: 0,
    mapData1: [],
    mapData2: [],
    mapData3: [],
    mapName: [],
    dataSource: [],
    current: 1,
    drugChangeNum: 0,
    networkNum: 0,
    total: 1
  }
  componentWillMount () {
    this.showDatas()
    this.showPie()
    this.getMap()
    this.showReaultsData()
    this.tragger(0)
  }
  shouldComponentUpdate (nextProps, nextState) {
    const hasPropsChange = !compare(nextProps, this.props)
    if (hasPropsChange) {
      this.showDatas()
    }
    return true
  }
  showReaultsData = () => {
    statisticsDatas().then((data) => {
      if (data) {
        this.setState({
          drugChangeNum: data.yaopinnum,
          shouquannum: data.shouquannum,
          networkNum: data.zhuanwangnum
        })
      }
    })
  }
  showPie = (type, page = 1) => {
    if (type) {
      this.flag = true
    } else {
      this.flag = false
    }
    let data0 = {}
    data0 = Object.assign(data0, {
      type,
      page
    })
    showPie(data0).then((data) => {
      if (data) {
        this.setState({
          pieData1: data.update,
          pieData2: data.down,
          current: parseInt(data.curPage),
          total: data.total,
          dataSource: data.list
        })
      }
    })
  }
  showDatas = (values) => {
    initIndex({
      type: 30
    }).then((data) => {
      if (data) {
        this.setState({
          data: data.list,
          queryTotal: data.queryTotal,
          taskCount: data.taskCount,
          taskTotal: data.taskTotal
        })
      }
    })
  }

  getMap = (values) => {
    getMap().then((data) => {
      if (data) {
        this.setState({
          mapData1: data.yaopin,
          mapData2: data.yaoqi,
          mapData3: data.diao,
          mapName: data.name
        })
      }
    })
  }
  handleSizeChange = (e) => {
    this.setState({tab: e.target.value})
    let apiArr = [showLineDatas1, showLineDatas2, showLineDatas3]
    apiArr[this.state.index]({
      type: e.target.value
    }).then((data) => {
      if (data) {
        this.setState({data: data.count, xData: data.times})
      }
    })
  }
  pieOption = {
    name: '访问方式',
    legend: ['更新', '下载'],
    height: 200
  }
  // columns = ['drug_name', 'drug_no', 'user_name', 'create_time']
  columns = ['drug_name', 'drug_no', 'user_name', 'security_time']
  onTabChange = (key, type) => {
    this.setState({ [type]: key })
  }
  onChange = (e) => {
    this.setState({ size: e.target.value })
  }
  tragger = (i) => {
    let apiArr = [showLineDatas1, showLineDatas2, showLineDatas3]
    apiArr[i]({
      type: this.state.tab
    }).then((data) => {
      if (data) {
        this.setState({data: data.count, xData: data.times, index: i})
      }
    })
  }
  columns = [
    {
      title: '药品名称',
      dataIndex: 'drug_name',
      key: 'drug_name'
    },
    {
      title: '国药准字号',
      dataIndex: 'drug_no',
      key: 'drug_no'
    },
    {
      title: '时间',
      dataIndex: 'security_time',
      key: 'security_time',
      render: (value) => {
        return (<span title={value}>{value}</span>)
      }
    },
    {
      title: '类型',
      dataIndex: 'operate_type',
      key: 'operate_type'
    },
    {
      title: '操作人员',
      dataIndex: 'user_name',
      key: 'user_name'
    }
  ]
  render () {
    const pieData = [
      {
        value: this.state.pieData1,
        name: '更新',
        itemStyle: {
          normal: {
            color: '#398CDA'
          }
        }
      },
      {
        value: this.state.pieData2,
        name: '下载',
        itemStyle: {
          normal: {
            color: '#666'
          }
        }
      }
    ]
    const key = this.state.tab
    let lineData = {
      noTitleKey: key,
      queryTotal: 0,
      taskCount: 0,
      taskTotal: 0,
      series: this.state.data
    }
    let option = {
      title: '趋势图',
      xData: this.state.xData,
      type: 'line',
      height: 350
    }
    const pagination = {
      current: this.state.current,
      total: this.state.total,
      defaultPageSize: 3,
      onChange: (page) => this.showPie(this.flag ? 1 : null, page)
    }
    return (
      <div className="centerModal">
        <div className="ctn1">
          <div>
            <p className="title1"></p>
            <div className="infoList">
              <div className="greenBorder">
                <p className={this.state.index === 0 ? 'active' : ''} onClick={() => this.tragger(0)}>
                  <span>药品数据变更次数</span>
                  <span>{this.state.drugChangeNum}</span>
                  <i></i>
                </p>
                <p className={this.state.index === 1 ? 'active' : ''} onClick={() => this.tragger(1)}>
                  <span>专网查询次数</span>
                  <span>{this.state.networkNum}</span>
                  <i></i>
                </p>
                <p className={this.state.index === 2 ? 'active' : ''} onClick={() => this.tragger(2)}>
                  <span>授权外网查询次数</span>
                  <span>（检查员）</span>
                  <span>{this.state.shouquannum}</span>
                  <i></i>
                </p>
              </div>
            </div>
            <div className="chart">
              <Radio.Group onChange={this.handleSizeChange} value={key} className="tab">
                <Radio.Button value="week">最近7天</Radio.Button>
                <Radio.Button value="month">按月</Radio.Button>
                <Radio.Button value="year">按年</Radio.Button>
              </Radio.Group>
              <MyChart option={option} data={lineData.series} style={{width: '105%'}}></MyChart>
            </div>
          </div>
        </div>
        <div className="modalCt">
          <div className="inTime">
            <span></span>
            <Pie option={this.pieOption} data={pieData} show={this.showPie}></Pie>
            <Table dataSource={this.state.dataSource} columns={this.columns} pagination={pagination}/>
          </div>
          <div className="mapCtn">
            <span></span>
            <Map name={this.state.mapName} mapData1={this.state.mapData1} mapData2={this.state.mapData2} mapData3={this.state.mapData3} style={styles}></Map>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Statistics)
