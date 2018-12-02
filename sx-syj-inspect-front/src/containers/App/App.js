import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import AsyncBundle from '../../components/AsyncBundle'
import { Route, Switch, Redirect } from 'react-router-dom'
import { loginSuccessPage } from '../../config'
import { BackTop } from 'antd'
import './App.css'
import Main from './Main/Main'
import ErrorBoundary from '../../components/ErrorBoundary'
const Login = () => import('./Login/Login')
const Forget = () => import('./Login/ForgetPsd')

class App extends PureComponent {
  render () {
    const { history } = this.props
    window.reactHistory = history
    return (
      <ErrorBoundary>
        <Switch>
          <Route exact path="/" render={(props) => {
            return localStorage.getItem('user') ? <Redirect to={loginSuccessPage}/> : <AsyncBundle {...props} load={Login}/>
          }}/>
          <Route path="/login" render={(props) => <AsyncBundle {...props} load={Login}/>}/>
          <Route path="/forget" render={(props) => <AsyncBundle {...props} load={Forget}/>}/>
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
