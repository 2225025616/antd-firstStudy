import axios from 'axios'
import qs from 'qs'
import { baseURL, serverErrorMsg } from '../config'
import apiUrl from '../config/apiUrl'
import { message } from 'antd'
import { transformDate } from './common'
let times = 0
let api = axios.create({
  baseURL: baseURL + '/api',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  responseType: 'json'
})
api.defaults.validateStatus = (status) => {
  return true
}
api.interceptors.request.use(config => {
  let token = JSON.parse(localStorage.getItem('user') || '{}').token
  if (token && (config.url !== apiUrl.login)) {
    config.headers.common['Authorization'] = 'Bearer ' + token
  }
  // 去除''选项
  let data = {}
  for (let key in config.data) {
    if (config.data[key] !== '') {
      data[key] = config.data[key]
    }
  }
  config.data = data
  config.data = qs.stringify(config.data)
  return config
}, error => {
  return Promise.reject(error)
})
// 修改返回数据格式
api.defaults.transformResponse = (res) => {
  if (res) {
    // 处理时间戳
    res = transformDate(res)
    return res
  }
}
api.interceptors.response.use(response => {
  if (response.request.responseURL.includes('download_sourcefile')) {
  // 判断response。data是否为json对象如果不为json对象
    var decodedString = String.fromCharCode.apply(null, new Uint8Array(response.data))
    console.log(decodedString.length)
    if (decodedString.length < 100) {
      response.data = JSON.parse(decodedString)
      if (!response.data || !response) {
        if (response.data !== undefined) {
          message.error(serverErrorMsg)
        }
        return Promise.reject(new Error(serverErrorMsg))
      } else {
        let code = parseInt(response.data.errorNo)
        if (code === 420) {
          message.error(response.data.errorMsg)
          return Promise.reject(new Error(response.data.errorMsg))
        } else if (code === 407) {
          message.error(serverErrorMsg)
          return Promise.reject(new Error(serverErrorMsg))
        } else if (code === 402) {
          message.error('传递参数出错')
          response.data = null
          return Promise.reject(new Error('传递参数出错'))
        } else if (code === 406) {
          message.error('传递token出错')
          return Promise.reject(new Error('传递token出错'))
        } else if (code === 401) {
          times++
          if (times < 5) {
            api.post(apiUrl.refreshToken).then((data) => {
              localStorage.setItem('user', JSON.stringify(data))
            }).then(value => value, err => {
              console.log(err)
            })
          } else {
            // message.error('请重新登陆')
            window.reactHistory.push('/login')
            return Promise.reject(new Error(serverErrorMsg))
          }
        } else if (code === 403 || code === 400 || code === 405) {
          message.error('请重新登录', () => {
            localStorage.removeItem('user')
            window.reactHistory.push('/login')
          })
        } else {
          message.error(response.data.errorMsg)
        }
      }
    } else {
      return response.data
    }
  }
  if (!response.data || !response) {
    if (response.data !== undefined) {
      message.error(serverErrorMsg)
    }
    return Promise.reject(new Error(serverErrorMsg))
  } else {
    let code = parseInt(response.data.errorNo)
    if (code === 200) {
      times = 0
      if (response.data.data) {
        return response.data.data
      } else {
        return response.data
      }
    } else if (code === 407) {
      message.error(serverErrorMsg)
      return Promise.reject(new Error(serverErrorMsg))
    } else if (code === 402) {
      message.error('传递参数出错')
      // response.data = null
      return Promise.reject(new Error('传递参数出错'))
    } else if (code === 406) {
      message.error('传递token出错')
      return Promise.reject(new Error('传递token出错'))
    } else if (code === 401) {
      times++
      if (times < 5) {
        api.post(apiUrl.refreshToken).then((data) => {
          localStorage.setItem('user', JSON.stringify(data))
        }).then(value => value, err => {
          console.log(err)
        })
      } else {
        // message.error('请重新登陆')
        window.reactHistory.push('/login')
        return Promise.reject(new Error(serverErrorMsg))
      }
    } else if (code === 403 || code === 400 || code === 405) {
      message.error('请重新登录', () => {
        localStorage.removeItem('user')
        window.reactHistory.push('/login')
      })
    } else {
      message.error(response.data.errorMsg)
    }
  }
  return Promise.reject(new Error(response.data.errorMsg))
}, error => {
  return Promise.reject(error)
})
export default api
