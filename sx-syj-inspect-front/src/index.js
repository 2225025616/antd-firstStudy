import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
// import registerServiceWorker from './registerServiceWorker'
import reducers from './store'
import { BrowserRouter, Route } from 'react-router-dom'
import App from './containers/App/App'
import 'antd/dist/antd.css'
import './assets/css/index.css'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { message } from 'antd'
import { publicPath } from './config'

moment.locale('zh-cn')

message.config({
  duration: 2
})

let store = createStore(reducers)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={publicPath}>
      <Route path="/" component={App}/>
    </BrowserRouter>
  </Provider>
  , document.getElementById('root')
)

// registerServiceWorker()
