import apiUrl from '../config/apiUrl'
import api from './api'

const commonPost = (url, params, options = {}) => {
  return api.post(url, params, options).then(value => value, () => {})
}

export const loginRequest = (params) => {
  return commonPost(apiUrl.login, params)
}

export const getTasks = (params) => {
  return commonPost(apiUrl.taskList, params)
}

export const getMsg = (params) => {
  return commonPost(apiUrl.getMessage, params)
}

export const changePsd = (params) => {
  return commonPost(apiUrl.password, params)
}

export const getMsgNum = (params) => {
  return commonPost(apiUrl.getTipsNum, params)
}
export const downFile = (params) => {
  return commonPost(apiUrl.download, params, {responseType: 'arraybuffer'})
}
export const changeNotices = (params) => {
  return commonPost(apiUrl.changeNotices, params)
}
export const judgeFileHash = (params) => {
  return commonPost(apiUrl.hashFile, params)
}
export const judgeWordsHash = (params) => {
  return commonPost(apiUrl.hashWords, params)
}
export const callInnet = (params) => {
  return commonPost(apiUrl.callBack, params)
}
