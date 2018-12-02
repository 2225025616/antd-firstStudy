import React, { Component } from 'react'
import { Button, Table } from 'antd'
import './MyTable.css'
import pageData from '../utils/pageData'
import { compare } from '../utils/common'
import $ from 'jquery'

class MyTable extends Component {
  sendRequest = (value) => {
    // value:   0 - 换页   1 - 刷新
    const { history, show } = this.props
    const query = pageData.get(history)
    let current = null
    current = parseInt(query.page || 1)
    show(query, current)
  }
  componentWillMount () {
    const { getForm, form } = this.props
    getForm(form)
    this.sendRequest(1)
  }
  shouldComponentUpdate (nextProps, nextState) {
    const hasPropsChange = !compare(nextProps, this.props)
    if (hasPropsChange) {
      this.sendRequest(0)
    }
    return true
    // const hasStateChange = !compare(nextState, this.state)
    // console.log(nextProps, this.props, hasPropsChange)
    // console.log(nextState, this.state)
    // return hasPropsChange || hasStateChange
  }
  state = {
    pagination: {}
  }
  form = null
  getForm = (form) => {
    this.form = form
  }
  setPagination = (data) => {
    this.setState(prevState => {
      return {
        pagination: {
          ...prevState.pagination,
          ...data
        }
      }
    })
  }
  componentWillMount () {
    const { pagination, history } = this.props
    const defaultPagination = {
      defaultPageSize: 15,
      onChange: (page, pageSize) => {
        pageData.save(history, {
          page
        })
      }
    }
    const query = pageData.get(history)
    this.setState({
      pagination: {
        ...defaultPagination,
        ...pagination
      }
    })
    if (parseInt(query.page)) {
      this.setPagination({
        current: parseInt(query.page)
      })
    }
  }
  componentWillReceiveProps (nextProps) {
    let current = null
    const { history, pagination } = this.props
    const isPaginationChange = !compare(pagination, nextProps.pagination)
    if (isPaginationChange) {
      current = parseInt(nextProps.pagination)
    } else {
      const query = pageData.get(history)
      current = parseInt(query.page) || 1
    }
    // 移除详情项
    $('tr.detail').remove()
    this.setPagination({
      current: current
    })
  }
  render () {
    const { options: {form, buttons, table}, pagination, data, search = () => {}, ...props } = this.props
    return (
      <div className="search-table-container">
        <WrappedSearchForm getForm={this.getForm} formList={form} buttons={buttons} setPagination={this.setPagination} search={search} {...props}/>
        <Table className="search-table" dataSource={data} pagination={this.state.pagination} search={search} rowKey='id' {...table}/>
      </div>
    )
  }
}

export default MyTable
