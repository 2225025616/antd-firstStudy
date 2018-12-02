import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import MyChart from '../../../components/MyChart'
import '../Main/Main.css'
import './Propaganda.css'
import { Icon } from 'antd'

class Propaganda extends PureComponent {
  state = {
    isLogin: false
  }
  lineData = {
    noTitleKey: 'today',
    data: [],
    queryTotal: 0,
    taskCount: 0,
    taskTotal: 0,
    series: [120, 982, 191, 234, 90, 12, 45]
  }
  option = {
    title: '药品品种档案数据增量图',
    xData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    type: 'line',
    height: 340
  }
  open = (e) => {
    // const { history } = this.props
    console.log(e.target)
    // history.push('/main/supervise/show?id=' + id)
  }
  render () {
    return (
      <div className="main-container">
        <div className="banner">
          <div className="ctner">
            <div className="logo"></div>
            <Link to="/login">登录</Link>
          </div>
        </div>
        <div className="instru">
          <div className="ctner">
            <h3>系统介绍</h3>
            <div>
              <span></span>
              <div>
                <p>本系统实时跟踪药品品种档案的构建、发展和使用情况。所有药品数据均在区块链上形成唯一的记录，实现药品数据防篡改和可追溯。</p>
                <p>系统针对药品品种档案数据的所有操作，包括新增、更新、修改、调用等，均会产生不可删除的区块链记录，并被食药监相关部门掌握，明确每一条药品数据谁经手、谁负责，实现穿透式监管。</p>
                <p>本系统还提供链上数据统计功能。食药监管理人员能够依据区块链上的药品档案存量和增量数据、药品数据调用情况、药品检查监督情况等信息，充分把握药品品种档案信息系统的建设和使用情况，为食药监的决策提供数据支撑。</p>
              </div>
            </div>
          </div>
        </div>
        <div className="info instru">
          <div className="ctner">
            <h3>
              数据统计
              <Link to="/chainColud">实时上链云图</Link>
            </h3>
            <div>
              <div style={{width: 500}}>
                <MyChart option={this.option} data={this.lineData.series} style={{width: '100%'}}></MyChart>
              </div>
              <div className="datas">
                <p>
                  <Icon type="folder" className="iconBox"/>
                  <span>药品品种档案总数</span>
                  <span>184819 个</span>
                </p>
                <p>
                  <Icon type="solution" className="iconBox"/>
                  <span>药企企业总数</span>
                  <span>7226 家</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="ctner">
            <div>
              <p>药品品种档案区块链应用前端</p>
              {/* <p>
                <span>任务列表</span>
                <span>文件查验</span>
                <span>首营资料申请</span>
                <span>我的申请</span>
              </p> */}
            </div>
            <div>
              <p><span>食品药品监督总局</span><span>热线电话 010-8832021</span></p>
              <p>**公安备网***********</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Propaganda)
