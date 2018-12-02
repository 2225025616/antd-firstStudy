import React, { Component } from 'react'
import { Popconfirm, message } from 'antd'

class App extends Component {
  state = {
    visible: false,
    condition: false
  }
  confirm = () => {
    this.setState({ visible: false, condition: true })
    message.success('Next step.')
  }
  cancel = () => {
    this.setState({ visible: false })
    message.error('Click on cancel.')
  }
  handleVisibleChange = (visible) => {
    console.log('1212 ' + visible)
    if (!visible) {
      this.setState({ visible })
      return
    }
    console.log(this.state.condition)
    if (this.state.condition) {
      this.confirm() // next step
    } else {
      this.setState({ visible }) // show the popconfirm
    }
  }
  render () {
    return (
      <div>
        <Popconfirm
          title="你确定要禁用该用户吗?"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
          onConfirm={this.confirm}
          onCancel={this.cancel}
          okText="确定"
          cancelText="取消"
        >
          <a href="#">Delete a task</a>
        </Popconfirm>
        <br />
      </div>
    )
  }
}
export default App
