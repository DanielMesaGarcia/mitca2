// Chat.js
import React, { useState, useEffect } from 'react';
import { Layout, Button, Input, List, Avatar } from 'antd';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import './chatModal.css';
import messageService from '../../services/messageService';
import { SendOutlined } from '@ant-design/icons';
const { Content } = Layout;

const Chat = () => {
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [allMessagesLoaded, setAllMessagesLoaded] = useState(false);
  const [running, setRunning] = useState(false);


  useEffect(() => {
    let newSocket;
  
    const setupWebSocket = () => {
      try {
        newSocket = new WebSocket('ws://localhost:3001');
        newSocket.onopen = () => {
          setRunning(true);
        };
        newSocket.onclose = () => {
          setRunning(false);
        };
        setSocket(newSocket);
      } catch (error) {
        console.error('Error creating WebSocket:', error);
        setRunning(false);
      }
    };
  
    setupWebSocket(); // Set up WebSocket connection when component mounts
  
    // Clean up function when component unmounts or dependencies change
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once, when component mounts
  

  useEffect(() => {
    const setupWebSocket = () => {
      try {
        const newSocket = new WebSocket('ws://localhost:3001');
        newSocket.onopen = () => {
          setRunning(true);
        };
        newSocket.onclose = () => {
          setRunning(false);
        };
        setSocket(newSocket);
      } catch (error) {
        console.error('Error creating WebSocket:', error);
        setRunning(false);
      }
    };
  
    const interval = setInterval(() => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        setupWebSocket();
      }
    }, 15000);
  
    return () => {
      clearInterval(interval);
    };
  }, [socket]);
  


  useEffect(() => {
    if (running) {
      socket.addEventListener('message', (event) => {
        const messageData = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, messageData]);
      });
    }
  }, [running]);

  useEffect(() => {
    if (running) {
      const fetchMessages = async () => {
        try {
          const fetchedMessages = await messageService.getAllMessages();
          setMessages(fetchedMessages);
          setAllMessagesLoaded(true);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [running]);


  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const handleCollapse = () => {
    setExpanded(false);
  };

  const handleSendMessage = async () => {
    if (!running) {
      // Si no hay conexión con el backend, guardar el mensaje en localStorage
      const pendingMessages = JSON.parse(localStorage.getItem('pendingMessages')) || [];
      const messageData = {
        sender: localStorage.getItem('name'),
        message: message.trim(),
        type: 'pending',
      };
      localStorage.setItem('pendingMessages', JSON.stringify([...pendingMessages, messageData]));
      setMessage('');
      setMessages((prevMessages) => [...prevMessages, messageData]);
      return;
    }

    if (message.trim() !== '') {
      const messageData = {
        sender: localStorage.getItem('name'),
        message: message.trim(),
        type: 'sent',
      };
      if (socket) {
        socket.send(JSON.stringify(messageData));
      }
      await messageService.sendMessage(messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage('');
    }
  };

  useEffect(() => {
    if (running) {
      const pendingMessages = JSON.parse(localStorage.getItem('pendingMessages')) || [];
      const sendPendingMessages = async () => {
        for (const pendingMessage of pendingMessages) {
          if (pendingMessage.type === 'pending') {
            if (socket) {
              socket.send(JSON.stringify(pendingMessage));
            }
            await messageService.sendMessage(pendingMessage);
            setMessages((prevMessages) => [...prevMessages, pendingMessage]);
          }
        }
        // Limpiar los mensajes pendientes en localStorage después de enviarlos
        localStorage.setItem('pendingMessages', JSON.stringify([]));
      };
      sendPendingMessages();
    }
  }, [running]);



  return (
    <div>
      <Button
        type="primary"
        shape="circle"
        icon={<MessageOutlined />}
        size="large"
        onClick={handleExpand}
        style={{ position: 'fixed', bottom: 20, right: expanded ? 340 : 20, zIndex: 1 }}
      />

      <Layout className={`layout-chat${expanded ? ' expanded' : ''}`}>
        <Content className="layout-content" >
          

          <List
            itemLayout="horizontal"
            dataSource={messages}
            style={{ maxWidth: '100%', paddingBottom: '18%'}}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<MessageOutlined />} />}
                  title={item.sender}
                  description={item.message}
                  style={{ width: '100%', wordWrap: 'break-word' }}
                />
              </List.Item>
            )}
          />

          <div style={{ display: 'flex', position: 'fixed', bottom: 0, backgroundColor:'white' }}>
            <Input
              placeholder="Escribe tu mensaje"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ flex: 1, marginRight: '10px' }}
            />
            <Button type="primary" onClick={handleSendMessage} icon={<SendOutlined />} />
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default Chat;
