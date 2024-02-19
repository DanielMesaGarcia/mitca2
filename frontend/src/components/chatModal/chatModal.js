// Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Button, Input, List, Avatar } from 'antd';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import './chatModal.css';
import messageService from '../../services/messageService';
import { SendOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
const { Content } = Layout;

const Chat = () => {
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [allMessagesLoaded, setAllMessagesLoaded] = useState(false);
  const [running, setRunning] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);

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

        if (messageData.type === 'delete') {
          setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== messageData.id));
        } else if (messageData.type === 'update') {
          // Si es un mensaje de actualización, buscamos el mensaje correspondiente y lo actualizamos
          setMessages((prevMessages) => {
            const updatedMessages = prevMessages.map(msg => {
              if (msg._id === messageData.id) {
                const newmsg = { ...msg, message: messageData.editedMessage };
                console.log(newmsg)
                return newmsg;
              } else {
                return msg;
              }
            });
            console.log("Mensajes actualizados:", updatedMessages);

            return updatedMessages;
          });
        } else {
          // Si no es un mensaje de eliminación, lo añadimos a los mensajes existentes
          if (messageData.sender !== localStorage.getItem("name")) {
            setMessages((prevMessages) => [...prevMessages, messageData]);
          }
        }
      });
    }
  }, [running]);

  useEffect(() => {
    if (running) {
      const fetchMessages = async () => {
        try {
          setAllMessagesLoaded(false); // Set loading state to true
          const fetchedMessages = await messageService.getAllMessages();
          const simplifiedMessages = fetchedMessages.map(({ _id, sender, message }) => ({ _id, sender, message }));
          setMessages(simplifiedMessages);
          setAllMessagesLoaded(true); // Set loading state to false after successful fetch
        } catch (error) {
          console.error('Error fetching messages:', error);
          setAllMessagesLoaded(true); // Set loading state to false even if there's an error
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
    try {
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
        if (editingMessage) {
          const updateMessageData = {
            id: editingMessage,
            editedMessage: message,
            type: 'update',
          };

          if (socket) {
            socket.send(JSON.stringify(updateMessageData));
          }
          const updatedMessage = await messageService.updateMessage(editingMessage, message.trim());
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg._id === editingMessage ? { ...msg, message: updatedMessage.message.message } : msg
            )
          );

          setEditingMessage(null);
          setMessage('');
        } else {
          const messageData = {
            sender: localStorage.getItem('name'),
            message: message.trim(),
            type: 'sent',
          };
          const newMessage = await messageService.sendMessage(messageData);
          if (socket) {
            socket.send(JSON.stringify(newMessage));
          }
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setMessage('');
        }
      }
    } catch (error) {
      console.error('Error sending or updating message:', error);
    }
  };

  useEffect(() => {
    if (running) {
      const pendingMessages = JSON.parse(localStorage.getItem('pendingMessages')) || [];
      const sendPendingMessages = async () => {
        try {
          for (const pendingMessage of pendingMessages) {
            if (pendingMessage.type === 'pending') {
              setAllMessagesLoaded(false);
              if (socket) {
                socket.send(JSON.stringify(pendingMessage));
              }
              const newmsg = await messageService.sendMessage(pendingMessage);
              const simplifiedNewMessages = Array.isArray(newmsg) ? newmsg.map(({ _id, sender, message }) => ({ _id, sender, message })) : [];
              setMessages((prevMessages) => [...prevMessages, ...simplifiedNewMessages]);
            }
          }
        } catch (error) {
          console.error('Error sending pending messages:', error);
        } finally {
          setAllMessagesLoaded(true);
          localStorage.setItem('pendingMessages', JSON.stringify([]));
        }
      };

      const pendingDeletes = JSON.parse(localStorage.getItem('mensajesEliminados')) || [];
      const sendDeleteMessages = async () => {
        try {
          for (let pendingDelete of pendingDeletes) {
            if (socket) {
              pendingDelete = {type: "delete", id: pendingDelete.toString() };
                socket.send(JSON.stringify(pendingDelete));
              }
              const newmsg = await messageService.deleteMessage(pendingDelete.id);
              setMessages(newmsg);
          }
        } catch (error) {
          console.error('Error sending pending messages:', error);
        } finally {
          setAllMessagesLoaded(true);
          localStorage.setItem('mensajesEliminados', JSON.stringify([]));
        }
      };

      sendDeleteMessages();
      sendPendingMessages();
    }
  }, [running]);


  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Función para hacer scroll al final de la lista
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    scrollToBottom(); // Llama a la función al iniciar para hacer scroll al final de la lista

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);


  const borrarMensaje = async (id) => {
    try {
      if(!socket){
        let mensajesEliminados = localStorage.getItem('mensajesEliminados') ? JSON.parse(localStorage.getItem('mensajesEliminados')) : [];
mensajesEliminados.push(id);
localStorage.setItem('mensajesEliminados', JSON.stringify(mensajesEliminados));

        setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== id));
      }else{
        const response = await messageService.deleteMessage(id)
        const deleteMessageData = {
          id: id,
          type: 'delete',
        };
  
        socket.send(JSON.stringify(deleteMessageData));
        
        const data = response;
        setMessages(data);
      }
    } catch (error) {
      setSocket(false);
      console.error('Error deleting message:', error);
    }
  };

  const handleEditMessage = (id, editedMessage) => {
    setEditingMessage(id);
    setMessage(editedMessage);
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
        <Content className="layout-content" >
          <List
            itemLayout="horizontal"
            dataSource={messages}
            key={forceUpdate}
            style={{ maxWidth: '100%', paddingBottom: '18%' }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<MessageOutlined />} />}
                  title={item.sender}
                  description={<span>{typeof item.message === 'object' ? item.message.message : item.message}</span>}
                  style={{ width: '100%', wordWrap: 'break-word' }}
                />
                {/* Mostrar el icono de basura solo si el rol es admin */}
                {(localStorage.getItem('role') === 'admin' || localStorage.getItem('name') === item.sender) && (
                  <DeleteOutlined
                    style={{ color: 'red', fontSize: 16, cursor: 'pointer', marginLeft: '10px' }}
                    onClick={() => borrarMensaje(item._id)}
                  />
                )}
                {(localStorage.getItem('name') === item.sender) && (
                  <EditOutlined
                    style={{ color: 'green', fontSize: 16, cursor: 'pointer', marginLeft: '10px' }}
                    onClick={() => handleEditMessage(item._id, item.message)}
                  />
                )}
              </List.Item>
            )}
          />
          {/* Referencia para el último elemento de la lista */}
          <div ref={messagesEndRef} />

          <div style={{ display: 'flex', position: 'fixed', bottom: 0, backgroundColor: 'white' }}>
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