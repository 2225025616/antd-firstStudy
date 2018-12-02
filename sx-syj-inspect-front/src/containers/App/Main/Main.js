import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import './Main.css'
import logo from '../../../assets/logo.png'
import { Menu, Icon, Avatar, Dropdown, Badge } from 'antd'
import { Link, Route, Switch, Redirect } from 'react-router-dom'
import menuList from '../../../config/menu'
import AsyncBundle from '../../../components/AsyncBundle'
import { getMsgNum, changeNotices } from '../../../utils/request'
import { loginSuccessPage, loginSuccessMenu } from '../../../config/index'

const Item = Menu.Item
const TaskList = () => import('./TaskList')
const Revise = () => import('./Revise')
const MsgList = () => import('./MsgList')
const TaskListType = () => import('./TaskListType')
const Result = () => import('./Result')
const SubMenu = Menu.SubMenu
class Main extends PureComponent {
  userId = JSON.parse(localStorage.getItem('user') || '{}').user_id
  userName = JSON.parse(localStorage.getItem('user') || '{}').user_name
  rootSubmenuKeys = menuList.filter(item => item.children).map(i => i.key)
  state = {
    collapsed: false,
    openKeys: [],
    count: 0,
    selectedKeys: []
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
  getTips = (id) => {
    getMsgNum({user_id: id}).then(
      data => {
        if ((typeof data) === 'number') {
          this.setState({
            count: data
          })
        } else {
          this.setState({
            count: 0
          })
        }
      }
    )
  }
  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf('' + key) === -1)
    if (this.rootSubmenuKeys.indexOf('' + latestOpenKey) === -1) {
      this.setState({ openKeys })
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      })
    }
  }
  onSelect = ({selectedKeys}) => {
    this.setState({
      selectedKeys: selectedKeys
    })
  }
  filter = (pathname) => {
    let openKey = menuList.filter(item => {
      if (item.children) {
        return !item.children.every(i => {
          if (i.key !== pathname) {
            return true
          }
          return false
        })
      }
      return true
    })
    return openKey
  }
  componentWillMount () {
    const { history } = this.props
    let openKey = this.filter(history.location.pathname)
    let selectedKeys = []
    selectedKeys = [history.location.pathname]
    // console.log(selectedKeys)
    if (!openKey.length) {
      let arr = history.location.pathname.split('/')
      if (arr.length > 2) {
        let parentPath = '/' + arr[1] + '/' + arr[2]
        openKey = this.filter(parentPath)
        selectedKeys = [parentPath]
      } else {
        openKey = [{
          key: loginSuccessMenu
        }]
        selectedKeys = [loginSuccessPage]
      }
    }
    this.getTips(this.userId)
    if (openKey[0]) {
      this.setState({
        openKeys: [openKey[0].key],
        selectedKeys: selectedKeys
      })
    }
  }
  exit = () => {
    const { history } = this.props
    localStorage.removeItem('user')
    history.push('/login')
  }
  change = () => {
    const { history } = this.props
    changeNotices({user_id: this.userId}).then(
      data => {
        if ((typeof data) === 'number') {
          this.setState({
            count: data
          })
        } else {
          this.setState({
            count: 0
          })
        }
      }
    )
    history.push('/main/message')
  }
  render () {
    if (!localStorage.getItem('user')) {
      return <Redirect to="/login"></Redirect>
    }
    const menu = (
      <Menu>
        <Menu.Item>
          <Badge count={this.state.count}>
            <a onClick={this.change}>
              <Icon type='mail'/>
              <span> 我的消息</span>
            </a>
          </Badge>
        </Menu.Item>
        <Menu.Item>
          <Link to='/main/revise'>
            <Icon type='user'/>
            <span> 修改密码</span>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Icon type='logout'/>
          <span onClick={this.exit}> 退出</span>
        </Menu.Item>
      </Menu>
    )
    const { history } = this.props
    const opacity = history.location.pathname.includes('handle')
    return (
      <div className="main-container">
        <div className="top">
          <div className="header">
            <div>
              <div className="logo"><img src={logo} style={{width: 200}}/></div>
              <span className="title">药品品种档案区块链应用前端</span>
              <Badge count={this.state.count} className="right-msg-box">
                <Dropdown overlay={menu}>
                  <Avatar className="avatar" size="large" icon="user" />
                </Dropdown>
                <span className="username">{this.userName}</span>
              </Badge>
            </div>
          </div>
          <div className="banner" style={opacity ? {display: 'none'} : {display: 'block'}}/>
        </div>
        <div className="container">
          <div className="sider">
            <Menu
              openKeys={this.state.openKeys}
              selectedKeys={this.state.selectedKeys}
              onOpenChange={this.onOpenChange}
              onSelect={this.onSelect}
              mode="inline"
              theme="dark"
              inlineCollapsed={this.state.collapsed}
            >
              {menuList.map((item) => {
                if (item.children) {
                  return (
                    <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
                      {item.children.map((i) => <Item key={i.key}><Link to={i.key}>{i.title}</Link></Item>)}
                    </SubMenu>
                  )
                } else {
                  return (
                    <Item key={item.key}>
                      <Link to={item.key}>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                      </Link>
                    </Item>
                  )
                }
              })}
            </Menu>
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/main" render={() => <Redirect to={loginSuccessPage} />} />
              <Route path="/main/handle" render={(props) => <AsyncBundle key='/main/handle' {...props} load={TaskListType}></AsyncBundle>} />
              <Route path="/main/result" render={(props) => <AsyncBundle key='/main/result' {...props} load={Result}></AsyncBundle>} />
              <Route path="/main/message" render={(props) => <AsyncBundle key='/main/message' {...props} load={MsgList}></AsyncBundle>} />
              <Route path="/main/revise" render={(props) => <AsyncBundle key='/main/revise' {...props} load={Revise}></AsyncBundle>} />
              <Route path="/main/index" render={(props) => <AsyncBundle key='/main/index' {...props} load={TaskList}></AsyncBundle>} />
            </Switch>
          </div>
        </div>
        <div className="pageFooter">
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
    )
  }
}

export default connect()(Main)
