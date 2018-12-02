import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import AsyncBundle from '../../components/AsyncBundle'
import { Route, Switch, Redirect } from 'react-router-dom'
import { loginSuccessPage1, loginSuccessPage2, loginSuccessPage3, loginSuccessPage4 } from '../../config'
import { BackTop } from 'antd'
import './App.css'
import Main from './Main/Main'
import ErrorBoundary from '../../components/ErrorBoundary'
const ChainColud = () => import('../../components/ChainColud')
const Login = () => import('../App/Login/Login')
const Propaganda = () => import('../App/Login/Propaganda')
// const Main = () => import('./Main/Main') Propaganda

class App extends PureComponent {
  render () {
    const { history } = this.props
    window.reactHistory = history
    return (
      <ErrorBoundary>
        <Switch>
          <Route exact path="/" render={(props) => {
            const user = JSON.parse(localStorage.getItem('adminUser'))
            return user ? <Redirect to={user.type === 1 ? loginSuccessPage1 : (user.type === 2 ? loginSuccessPage2 : (user.type === 3 ? loginSuccessPage3 : loginSuccessPage4))}/> : <AsyncBundle {...props} load={Propaganda}/>
          }}/>
          <Route path="/login" render={(props) => <AsyncBundle {...props} load={Login}/>}/>
          <Route path="/chainColud" render={(props) => <AsyncBundle {...props} load={ChainColud}/>}/>
          <Route path="/main" component={Main}/>
          <Redirect to="/404" />
          <div>
            <BackTop />
          </div>
        </Switch>
      </ErrorBoundary>
    )
  }
}

export default connect()(App)
