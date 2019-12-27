import React, {Component} from 'react'
import Chatkit from '@pusher/chatkit-client'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import TypingIndicator from './TypingIndicator'
import WhosOnlineList from './WhosOnlineList'

class ChatScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: {},
      currentRoom: {},
      messages: [],
      usersWhoAreTyping: []
    }
    this.sendMessage = this.sendMessage.bind(this)
    this.sendTypingEvent = this.sendTypingEvent.bind(this)
  }

  sendMessage(text) {
    this.state.currentUser.sendMessage({
      text,
      roomId: this.state.currentRoom.id
    })
  }

  sendTypingEvent() {
    this.state.currentUser.isTypingIn({
      roomId: this.state.currentRoom.id
    }).catch(error => console.error('error', error))
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: 'v1:us1:89d1b499-0d13-44e1-94eb-1bfacb823194',
      userId: this.props.currentUsername,
      tokenProvider: new Chatkit.TokenProvider({
        url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/89d1b499-0d13-44e1-94eb-1bfacb823194/token'
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
          },
          onUserStartedTyping: user => {
            this.setState({
              usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name]})
          },
          onUserStoppedTyping: user => {
            this.setState({
              usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
                username => username !== user.name)})
          },
          onPresenceChange: () => this.forceUpdate()
        }
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
            <WhosOnlineList
              currentUser={this.state.currentUser}
              users={this.state.currentRoom.users}/>
          </aside>
          <section style={styles.chatListContainer}>
            <MessageList
              messages={this.state.messages}
              style={styles.chatList}/>
            <TypingIndicator usersWhoAreTyping={this.state.usersWhoAreTyping} />
            <SendMessageForm
              onSubmit={this.sendMessage}
              onChange={this.sendTypingEvent}/>
          </section>
        </div>
      </div>
    )
  }
}

export default ChatScreen