import React, { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }
  componentDidCatch (error, info) {
    this.setState({ hasError: true })
    console.log(error, info)
  }
  render () {
    if (this.state.hasError) {
      return <div style={{'fontSize': '30px', 'text-align': 'center', 'color': '#c50b0b', 'margin-top': '60px'}}>发生错误,请尝试刷新页面或联系管理员</div>
    }
    return this.props.children
  }
}

export default ErrorBoundary
