import $ from 'jquery'
import { message } from 'antd'
import { serverErrorMsg } from '../config'
import apiUrl from '../config/apiUrl'

export const deepCopy = (source, object = this) => {
  const type = typeof source
  if (type === 'object') {
    let obj = []
    if (typeof source.length === 'undefined') {
      obj = {}
    }
    for (let key in source) {
      obj[key] = deepCopy(source[key], object)
    }
    return obj
  } else if (type === 'function') {
    return source.bind(object)
  } else {
    return source
  }
}

export const compare = (obj1, obj2) => {
  let result = true
  if (obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined) {
    return obj1 === obj2
  }
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
      result = false
    }
    for (let key in obj1) {
      const type = typeof obj1[key]
      if (type === 'object') {
        if (!compare(obj1[key], obj2[key])) {
          result = false
        }
      } else if (type === 'function') {
      } else {
        if (obj1[key] !== obj2[key]) {
          result = false
        }
      }
    }
  } else {
    return obj1 === obj2
  }
  return result
}

export const filterNull = (obj) => {
  let filterObj = {}
  for (let key in obj) {
    if (obj[key] !== null) {
      filterObj[key] = obj[key]
    }
  }
  return filterObj
}

export const judgeCode = (obj, num, api) => {
  let times = 0
  if (!obj) {
    if (obj !== undefined) {
      message.error(serverErrorMsg)
    }
    return Promise.reject(new Error(serverErrorMsg))
  }
  if (num === 200) {
    times = 0
    if (obj.data) {
      return obj.data
    } else {
      return obj
    }
  } else if (num === 407) {
    message.error(serverErrorMsg)
    return Promise.reject(new Error(serverErrorMsg))
  } else if (num === 402) {
    message.error('传递参数出错')
    // obj = null
    return Promise.reject(new Error('传递参数出错'))
  } else if (num === 406) {
    message.error('传递token出错')
    return Promise.reject(new Error('传递token出错'))
  } else if (num === 401) {
    times++
    if (times < 5) {
      api.post(apiUrl.refreshToken).then((data) => {
        localStorage.setItem('user', JSON.stringify(data))
      }).then(value => value, err => {
        console.log(err)
      })
    } else {
      message.error('请重新登陆')
      window.reactHistory.push('/login')
      return Promise.reject(new Error(serverErrorMsg))
    }
  } else if (num === 403 || num === 400 || num === 405) {
    message.error('请重新登录', () => {
      localStorage.removeItem('user')
      window.reactHistory.push('/login')
    })
  } else {
    message.error(obj.errorMsg)
  }
}
export const showDetail = (e, template) => {
  const colspan = $(e.target).parents('tr').children('td').length
  if (!$(e.target).parents('tr').next('.detail').length) {
    $(e.target).parents('tbody').find('.detail').remove()
    // $(e.target).html('收起')
    $(e.target).parents('tr').after(`<tr class="detail"><td colspan="${colspan}">${template}</td></tr>`)
  } else {
    // console.log('sssss')
    // $(e.target).html('查看详情')
    $(e.target).parents('tbody').find('.detail').remove()
  }
}

export const transformDate = (k, val = k) => {
  if (typeof val === 'object') {
    for (let key in val) {
      if (val.length && typeof val[key] === 'number' && String(val[key]).length === 10) {
        val[key] = transformDate(k, val[key])
      } else {
        val[key] = transformDate(key, val[key])
      }
    }
  } else if (typeof val === 'number' && String(val).length === 10 && (k.indexOf('time') !== -1 || k.indexOf('dateline') !== -1 || k.indexOf('occur') !== -1)) {
    let now = new Date(val * 1000)
    val = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + ' ' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2)
  }
  return val
}
