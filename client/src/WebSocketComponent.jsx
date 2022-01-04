import React, { useRef, useState } from 'react';

const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const socket = useRef();
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('')

  function connect() {
    socket.current = new WebSocket('ws://localhost:5000')

    socket.current.onopen = () => {
      setConnected(true)
      const message = {
        event: 'connection',
        username,
        id: Date.now()
      }
      socket.current.send(JSON.stringify(message))
    }
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages(prev => [...prev, message])
    }
    socket.current.onclose = () => {
      console.log('Socket closed')
    }
    socket.current.onerror = () => {
      console.log('Socket error')
    }
  }

  const sendMessage = async () => {
    const message = {
      username,
      message: value,
      id: Date.now(),
      event: 'message'
    }
    socket.current.send(JSON.stringify(message));
    setValue('')
  }


  if (!connected) {
    return (
      <div className="container">
        <div className="form">
          <input
            className="form__input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            type="text"
            placeholder="please, enter your name" />
          <button onClick={connect} className="form__button">Connect to the chat</button>
        </div>
      </div>
    )
  }


  return (
    <div className="container">
      <div>
        <div className="form">
          <input className="form__input" value={value} onChange={e => setValue(e.target.value)} type="text" />
          <button className="form__button" onClick={sendMessage}>Send message</button>
        </div>
        <div className="messages">
          {messages.map(mess =>
            <div key={mess.id}>
              {mess.event === 'connection'
                ? <div className="message__connection">
                  User {mess.username} has connected
                </div>
                : <div className="message">
                  {mess.username}. {mess.message}
                </div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebSocketComponent;