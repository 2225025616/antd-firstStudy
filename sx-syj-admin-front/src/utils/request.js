import apiUrl from '../config/apiUrl'
import api from './api'

const commonPost = (url, params, options = {}) => {
  return api.post(url, params, options).then(value => value, () => {})
}

export const loginRequest = (params) => {
  return commonPost(apiUrl.login, params)
}

export const drugSearchRequest = (params) => {
  return commonPost(apiUrl.drug, params)
}

export const drugAuditSearchRequest = (params) => {
  return commonPost(apiUrl.drugAudit, params)
}

export const userSearchRequest = (params) => {
  return commonPost(apiUrl.searchUser, params)
}
export const adminSearchRequest = (params) => {
  return commonPost(apiUrl.searchAdmin, params)
}
export const showPie = (params) => {
  return commonPost(apiUrl.showPie, params)
}

export const showLineDatas1 = (params) => {
  return commonPost(apiUrl.showLineDatas1, params)
}

export const getMap = (params) => {
  return commonPost(apiUrl.getMap, params)
}

export const showLineDatas2 = (params) => {
  return commonPost(apiUrl.showLineDatas2, params)
}

export const showLineDatas3 = (params) => {
  return commonPost(apiUrl.showLineDatas3, params)
}

export const addUserRequest = (params) => {
  return commonPost(apiUrl.addUser, params)
}
export const abandonUser = (params) => {
  return commonPost(apiUrl.abandonUser, params)
}

export const initIndex = (params) => {
  return commonPost(apiUrl.showIndex, params)
}
export const insideQuerySearchRequest = (params) => {
  return commonPost(apiUrl.insideQuery, params)
}

export const outsideQuerySearchRequest = (params) => {
  return commonPost(apiUrl.outsideQuery, params)
}

export const loginLogSearchRequest = (params) => {
  return commonPost(apiUrl.loginLog, params)
}

export const databaseSearchRequest = (params) => {
  return commonPost(apiUrl.database, params)
}

export const taskListSearchRequest = (params) => {
  return commonPost(apiUrl.taskList, params)
}

export const taskListAddRequest = (params) => {
  return commonPost(apiUrl.taskListAdd, params)
}

export const inspectorSearchRequest = (params) => {
  return commonPost(apiUrl.inspector, params)
}

export const superviseSearchRequest1 = (params) => {
  return commonPost(apiUrl.supervise1, params)
}

export const superviseSearchRequest2 = (params) => {
  return commonPost(apiUrl.supervise2, params)
}

export const superviseIdSearchRequest = (params) => {
  return commonPost(apiUrl.superviseById, params)
}

export const statisticsDatas = (params) => {
  return commonPost(apiUrl.showAllDatas, params)
}

export const getComprehensive1 = (params) => {
  return commonPost(apiUrl.getComprehensive1, params)
}

export const getComprehensive2 = (params) => {
  return commonPost(apiUrl.getComprehensive2, params)
}

export const superviseNumSearchRequest = (params) => {
  return commonPost(apiUrl.superviseByNum, params)
}

export const getInstructions1 = (params) => {
  return commonPost(apiUrl.getInstructions1, params)
}

export const getInstructions2 = (params) => {
  return commonPost(apiUrl.getInstructions2, params)
}

export const getComprehensiveDetail = (params) => {
  return commonPost(apiUrl.getComprehensiveDetail, params)
}
export const getFirstInfo = (params) => {
  return commonPost(apiUrl.getFirstInfo, params)
}

export const changePwdRequest = (params) => {
  return commonPost(apiUrl.changePwd, params)
}
export const showSupervise = (params) => {
  return commonPost(apiUrl.showSupervise, params)
}
export const showIntro = (params) => {
  return commonPost(apiUrl.showIntro, params)
}

export const getNew = (params) => {
  return commonPost(apiUrl.getNew, params)
}

export const downFile = (params) => {
  return commonPost(apiUrl.downFile, params, {responseType: 'arraybuffer'})
}

export const downFiletwo = (params) => {
  return commonPost(apiUrl.downFile2, params, {responseType: 'arraybuffer'})
}

export const report1 = (params) => {
  return commonPost(apiUrl.report1, params)
}

export const report2 = (params) => {
  return commonPost(apiUrl.report2, params)
}

export const report3 = (params) => {
  return commonPost(apiUrl.report3, params)
}

export const searchTimes = (params) => {
  return commonPost(apiUrl.searchTimes, params)
}
