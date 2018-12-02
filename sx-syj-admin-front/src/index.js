import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import zhCN from 'antd/lib/locale-provider/zh_CN'
// import registerServiceWorker from './registerServiceWorker'
import reducers from './store'
import { BrowserRouter, Route } from 'react-router-dom'
import App from './containers/App/App'
import 'antd/dist/antd.css'
import './assets/css/index.css'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { message, LocaleProvider } from 'antd'
import { publicPath } from './config'

moment.locale('zh-cn')

message.config({
  duration: 2
})

let store = createStore(reducers)

let Router = BrowserRouter

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <Provider store={store}>
      <Router basename={publicPath}>
        <Route path="/" component={App}/>
      </Router>
    </Provider>
  </LocaleProvider>
  , document.getElementById('root')
)

// registerServiceWorker()
