import React, {Component} from 'react'
import Chatkit from '@pusher/chatkit-client'
import MessageList from './MessageList'

class ChatScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: {},
      currentRoom: {},
      messages: []
    }
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: 'v1:us1:89d1b499-0d13-44e1-94eb-1bfacb823194',
      userId: this.props.currentUsername,
      tokenProvider: new Chatkit.TokenProvider({
        url: 'http://localhost:3001/authenticate'
      })
    })

    chatManager.connect().then(currentUser => {
      this.setState({currentUser})
      return currentUser.subscribeToRoom({
        roomId: '398fb67b-fa88-4a5c-88fe-34b881e767c7',
        messageLimit: 100,
        hooks: {
          onMessage: message => {
            this.setState({messages: [...this.state.messages, message]})
          }}
      })
    }).then(currentRoom => {
      this.setState({currentRoom})
    }).catch(error => console.error('error', error))
  }

  render() {
    const styles = {
      container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      },
      chatContainer: {
        display: 'flex',
        flex: 1
      },
      onlineListContainer: {
        width: '300px',
        flex: 'none',
        padding: 20,
        backgroundColor: '#2c303b',
        color: 'white'
      },
      chatListContainer: {
        padding: 20,
        width: '85%',
        display: 'flex',
        flexDirection: 'column'
      }
    }

    return (
      <div style={styles.container}>
        <div style={styles.chatContainer}>
          <aside style={styles.onlineListContainer}>
            <h2>Online:</h2>
          </aside>
          <section style={styles.chatListContainer}>
            <MessageList
              messages={this.state.messages}
              style={styles.chatList}/>
          </section>
        </div>
      </div>
    )
  }
}

export default ChatScreen