import $ from 'jquery'
// import { io } from 'socket'
import { serverErrorMsg } from '../config'

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

export const showDetail = (detailButton, template) => {
  const colspan = $(detailButton).parents('tr').children().length
  if (!$(detailButton).parents('tr').next().is('.detail')) {
    $(detailButton).parents('tbody').find('.detail').remove()
    $(detailButton).parents('tr').after(`<tr class="detail"><td colspan="${colspan}">${template}</td></tr>`)
  } else {
    $(detailButton).parents('tbody').find('.detail').remove()
  }
}

export const showMore = (e, template) => {
  const colspan = $(e).parents('tr').children().length
  if (!$(e).parents('tr').next().is('.detail')) {
    $(e).parents('tbody').find('.detail').remove()
    $(e).parents('tr').after(`<tr class="detail"><td colspan="${colspan}">${template}</td></tr>`)
  } else {
    $(e).parents('tbody').find('.detail').remove()
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

export const responseHandle = (response, message) => {
  if (typeof response === 'string') {
    response = JSON.parse(response)
  }
  if (!response) {
    if (response !== undefined) {
      message.error(serverErrorMsg)
    }
    return Promise.reject(new Error(serverErrorMsg))
  }
  if (response.errorNo === undefined) {
    return Promise.reject(new Error('返回数据格式存在问题,请联系管理员'))
  }
  let code = parseInt(response.errorNo)
  if (code === 200) {
    // times = 0
    if (response.data) {
      return response.data
    } else {
      return response
    }
  } else if (code === 407) {
    message.error(serverErrorMsg)
    return Promise.reject(new Error(serverErrorMsg))
  } else if (code === 402) {
    message.error('传递参数出错')
    return Promise.reject(new Error('传递参数出错'))
  } else if (code === 406) {
    message.error('传递token出错')
    return Promise.reject(new Error('传递token出错'))
  } else if (code === 401) {
    // times++
    // if (times < 5) {
    //   api.post(apiUrl.refreshToken).then((data) => {
    //     localStorage.setItem('adminUser', JSON.stringify(data))
    //   }).then(value => value, err => {
    //     console.log(err)
    //   })
    // } else {
    message.error('请重新登录')
    localStorage.removeItem('adminUser')
    window.reactHistory.push('/login')
    return Promise.reject(new Error('请重新登录'))
    // }
  } else if (code === 403 || code === 400 || code === 405) {
    message.error('请重新登录', () => {
      localStorage.removeItem('adminUser')
      window.reactHistory.push('/login')
    })
  } else {
    message.error(response.errorMsg)
  }
  return Promise.reject(new Error(response.errorMsg))
}
// export const Socket = (server, url) => {
//   let myWebsocket = io.listen(server)
//   // 添加一个连接监听器
//   myWebsocket.on(url, function (data) {
//     console.log(data)
//     myWebsocket.emit('my other event', { my: 'data' })
//   })
// }
export const getUniqueKey = (arr, type = 'key', key = null, isNumber = false) => {
  if (key === null) {
    if (isNumber) {
      key = 0
    } else {
      key = '0'
    }
  }
  let hasExist = arr.filter((item) => {
    if (item[type] === key) {
      return true
    }
  })
  if (hasExist.length) {
    return getUniqueKey(arr, type, isNumber ? key + 1 : parseInt(key) + 1 + '', isNumber)
  } else {
    return key
  }
}
