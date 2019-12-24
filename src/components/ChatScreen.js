import React, { Component } from 'react'
import Chatkit from '@pusher/chatkit-server'

class ChatScreen extends Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     currentUser: {}
  //   }
  // }
  //
  // componentDidMount() {
  //   const chatManager = new Chatkit.ChatManager({
  //     instanceLocator: 'v1:us1:89d1b499-0d13-44e1-94eb-1bfacb823194',
  //     userId: this.props.currentUsername,
  //     tokenProvider: new Chatkit.TokenProvider({
  //       url: 'http://localhost:3001/authenticate'
  //     })
  //   })
  //
  //   chatManager.connect().then(currentUser => {
  //     this.setState({ currentUser })
  //   }).catch(error => console.error('error', error))
  // }

  render() {
    return (
      <div>
        <h1>Chat</h1>
      </div>
    )
  }
}

export default ChatScreen