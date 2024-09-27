// src/components/MessageList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const MessageList = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages from the API
    axios.get(`${API_BASE_URL}/messages`)
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the messages!", error);
      });
  }, []);

  return (
    <div>
      <h2>Messages</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.messageId}>
            <strong>{message.userId}</strong>: {message.content} (Created at: {message.createdAt})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
