// Chat.js
import React, { useState, useEffect } from 'react';
import { Layout, Button, Input, List, Avatar } from 'antd';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import './chatModal.css';
import UserService from '../../services/userService';

const { Content } = Layout;

const Chat = () => {
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:3001'); // Reemplaza con la URL de tu servidor
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', (event) => {
        const messageData = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, messageData]);
      });
    }
  }, [socket]);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const handleCollapse = () => {
    setExpanded(false);
  };

  const handleSendMessage = () => {
    if (socket && message.trim() !== '') {
      const messageData = {
        sender: localStorage.getItem('name'), // Reemplaza con la información del usuario actual
        message: message.trim(),
        type: 'sent', // Indica que es un mensaje enviado
      };

      socket.send(JSON.stringify(messageData));
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage('');
    }
  };

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
