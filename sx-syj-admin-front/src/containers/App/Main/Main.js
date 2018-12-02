import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import './Main.css'
import { Menu, Icon, Avatar, Dropdown } from 'antd'
import { Link, Route, Switch, Redirect } from 'react-router-dom'
import menu, { list, useList, testList } from '../../../config/menu'
import AsyncBundle from '../../../components/AsyncBundle'
import { loginSuccessPage1, loginSuccessMenu1, loginSuccessPage2, loginSuccessMenu2, loginSuccessPage3, loginSuccessMenu3, loginSuccessPage4, loginSuccessMenu4 } from '../../../config/index'
import img from '../../../assets/logo.png'

const SubMenu = Menu.SubMenu
const Item = Menu.Item

const Statistics = () => import('./Center/Statistics')
const Cloud = () => import('./Center/Cloud')
// const Template = () => import('./Chain/Template')
const InsideQuery = () => import('./Information/InsideQuery')
const OutsideQuery = () => import('./Information/OutsideQuery')
const LoginLog = () => import('./Information/LoginLog')
const Database = () => import('./Information/Database')
const TaskList = () => import('./Task/TaskList')
const UserList = () => import('./User/UserList')
const AdminList = () => import('./User/MngUser')
// const Drug = () => import('./DrugInfo/Drug')
const Instructions = () => import('./DrugInfo/Instructions')
const Comprehensive = () => import('./DrugInfo/Comprehensive')
const Supervise = () => import('./DrugInfo/Supervise')
const ComprehensiveDetail = () => import('./DrugInfo/ComprehensiveDetail')
const InstructionsType = () => import('./DrugInfo/InstructionsType')
const SuperviseType = () => import('./DrugInfo/SuperviseType')
const ChangePwd = () => import('./ChangePwd')
const TaskListType = () => import('./Task/TaskListType')
const FirstInfo = () => import('./Business/FirstInfo')

const components1 = [
  [
    Statistics,
    Cloud
  ],
  [
    // Drug,
    Comprehensive,
    Instructions,
    Supervise
  ],
  [
    InsideQuery,
    OutsideQuery,
    LoginLog,
    Database
  ],
  [
    FirstInfo
  ],
  [
    TaskList
  ],
  [
    UserList,
    AdminList
  ]
]

const components2 = [
  [
    // Drug,
    Comprehensive,
    Instructions,
    Supervise
  ]
]

const components3 = [
  [
    TaskList
  ]
]

const components4 = [
  [
    Comprehensive,
    Instructions,
    Supervise
  ]
]
class Main extends PureComponent {
  state = {
    collapsed: false,
    openKeys: [],
    selectedKeys: [],
    menuList: menu,
    components: components1,
    loginSuccessPage: loginSuccessPage1,
    loginSuccessMenu: loginSuccessMenu1
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
  onOpenChange = (openKeys) => {
    const rootSubmenuKeys = this.state.menuList.filter(item => item.children).map(i => i.key)
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf('' + key) === -1)
    if (rootSubmenuKeys.indexOf('' + latestOpenKey) === -1) {
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
  setUserUI = (cb = () => {}) => {
    const user = JSON.parse(localStorage.getItem('adminUser'))
    if (user && user.type === 2) {
      this.setState({
        menuList: list,
        components: components2,
        loginSuccessMenu: loginSuccessMenu2,
        loginSuccessPage: loginSuccessPage2
      }, cb)
    } else if (user && user.type === 3) {
      this.setState({
        menuList: useList,
        components: components3,
        loginSuccessMenu: loginSuccessMenu3,
        loginSuccessPage: loginSuccessPage3
      }, cb)
    } else if (user && user.type === 5) {
      this.setState({
        menuList: testList,
        components: components4,
        loginSuccessMenu: loginSuccessMenu4,
        loginSuccessPage: loginSuccessPage4
      }, cb)
    } else {
      this.setState({
        menuList: menu,
        components: components1,
        loginSuccessMenu: loginSuccessMenu1,
        loginSuccessPage: loginSuccessPage1
      }, cb)
    }
  }
  filter = (pathname) => {
    let openKey = this.state.menuList.filter(item => {
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
    this.setUserUI(() => {
      const { history } = this.props
      let openKey = this.filter(history.location.pathname)
      let selectedKeys = []
      selectedKeys = [history.location.pathname]
      if (!openKey.length) {
        let arr = history.location.pathname.split('/')
        if (arr.length > 2) {
          let parentPath = '/' + arr[1] + '/' + arr[2]
          openKey = this.filter(parentPath)
          selectedKeys = [parentPath]
        } else {
          openKey = [{
            key: this.state.loginSuccessMenu
          }]
          selectedKeys = [this.state.loginSuccessPage]
        }
      }
      if (openKey[0]) {
        this.setState({
          openKeys: [openKey[0].key],
          selectedKeys: selectedKeys
        })
      }
    })
  }
  componentWillUpdate () {
    this.setUserUI()
  }
  exit = () => {
    const { history } = this.props
    localStorage.removeItem('adminUser')
    history.push('/login')
  }
  changePwd = () => {
    const { history } = this.props
    history.push('/main/changePwd')
  }
  render () {
    const { history } = this.props
    let style = history.location.pathname.indexOf('statistics') > 0 ? {backgroundColor: '#323a4c'} : {}
    const user = JSON.parse(localStorage.getItem('adminUser'))
    if (!user) {
      return <Redirect to="/login"></Redirect>
    }
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={this.changePwd}>修改密码</a>
          <a onClick={this.exit}>退出</a>
        </Menu.Item>
      </Menu>
    )
    return (
      <div className="main-container">
        <div className="header">
          <div className="logo"><img src={img}/></div>
          <span className="title" id="headTitle">药品品种档案区块链管理平台</span>
          <div className="right-msg-box">
            <Dropdown overlay={menu}>
              <Avatar className="avatar" size="large" icon="user" />
            </Dropdown>
            <span className="username">{user.user_name}</span>
          </div>
        </div>
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
            {this.state.menuList.map((item) => {
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
        <div className="content" style={style}>
          <Switch>
            <Route exact path="/main" render={() => <Redirect to={this.state.loginSuccessPage} />} />
            <Route path="/main/changePwd" render={(props) => <AsyncBundle key='/main/changePwd' {...props} load={ChangePwd}></AsyncBundle>} />
            <Route path="/main/supervise/:type" render={(props) => <AsyncBundle key='/main/supervise/:type' {...props} load={SuperviseType}></AsyncBundle>} />
            <Route path="/main/comprehensive/:type" render={(props) => <AsyncBundle key='/main/comprehensive/:type' {...props} load={ComprehensiveDetail}></AsyncBundle>} />
            <Route path="/main/instructions/:type" render={(props) => <AsyncBundle key='/main/instructions/:type' {...props} load={InstructionsType}></AsyncBundle>} />
            <Route path="/main/taskList/add" render={(props) => <AsyncBundle key='/main/taskList/add' {...props} load={TaskListType}></AsyncBundle>} />
            {this.state.menuList.map((item, index) => {
              if (item.children) {
                return item.children.map((i, index2) => <Route key={i.key} path={i.key} render={(props) => {
                  return <AsyncBundle key={i.key} {...props} load={this.state.components[index][index2]}></AsyncBundle>
                }}></Route>)
              } else {
                return (<Route key={item.key} path={item.key} render={(props) => {
                  return <AsyncBundle key={item.key} {...props} load={this.state.components[index]}></AsyncBundle>
                }}></Route>)
              }
            })}
          </Switch>
        </div>
      </div>
    )
  }
}

export default connect()(Main)
