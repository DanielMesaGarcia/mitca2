// Chat.js
import React, { useState, useEffect } from 'react';
import { Layout, Button, Input, List, Avatar } from 'antd';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import './chatModal.css';
import messageService from '../../services/messageService';

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
  
    const checkConnection = () => {
      try {
        newSocket = new WebSocket('ws://localhost:3001');
        newSocket.onopen = () => {
          setRunning(true);
        };
        newSocket.onclose = () => {
          setRunning(false);
          clearInterval(interval);
        };
        setSocket(newSocket);
      } catch (error) {
        console.error('Error creating WebSocket:', error);
        setRunning(false);
      }
    };
  
    // Realizar la comprobación de la conexión cada 15 segundos
    const interval = setInterval(() => {
      checkConnection();
    }, 15000);
  
    // Limpieza del intervalo al desmontar el componente
    return () => {
      
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);
  
  

  useEffect(() => {
    if (running) {
      socket.addEventListener('message', (event) => {
        const messageData = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, messageData]);
      });
    }
  }, [running]);

  useEffect(() => {
    if(running){
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
        <Content className="layout-content">
          <Button
            type="ghost"
            shape="circle"
            icon={<CloseOutlined />}
            size="large"
            onClick={handleCollapse}
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}
          />

          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<MessageOutlined />} />}
                  title={item.sender}
                  description={item.message}
                />
              </List.Item>
            )}
          />

          <Input
            placeholder="Escribe tu mensaje"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="primary" onClick={handleSendMessage}>
            Enviar Mensaje
          </Button>
        </Content>
      </Layout>
    </div>
  );
};

export default Chat;
