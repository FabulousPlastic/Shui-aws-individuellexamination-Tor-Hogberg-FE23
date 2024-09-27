import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './App.css'; 

function App() {
  const [userId, setUserId] = useState('');
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [newContent, setNewContent] = useState('');
  const [searchUserId, setSearchUserId] = useState(''); // New state for user search

  // Fetch all messages from the API
  useEffect(() => {
    axios.get(`${API_BASE_URL}/messages`)
      .then(response => setMessages(response.data))
      .catch(error => console.error("Error fetching messages:", error));
  }, []);

  // Handle new message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${API_BASE_URL}/message`, { userId, content })
      .then(response => {
        setMessages([...messages, response.data]);  // Add new message to the list
        setUserId('');
        setContent('');
      })
      .catch(error => console.error("Error creating message:", error));
  };

  // Handle editing a message
  const handleEditClick = (message) => {
    setEditingMessageId(message.messageId);
    setNewContent(message.content);
  };

  // Handle saving the edited message
  const handleSaveClick = (messageId) => {
    axios.put(`${API_BASE_URL}/message/${messageId}`, { content: newContent })
      .then(() => {
        setMessages(
          messages.map((message) =>
            message.messageId === messageId
              ? { ...message, content: newContent }
              : message
          )
        );
        setEditingMessageId(null);
        setNewContent('');
      })
      .catch(error => console.error("Error updating message:", error));
  };

  // Fetch messages for a specific user
  const handleUserSearch = (e) => {
    e.preventDefault();
    if (!searchUserId) return;
    
    axios.get(`${API_BASE_URL}/messages/user/${searchUserId}`)
      .then(response => setMessages(response.data))
      .catch(error => console.error("Error fetching messages for user:", error));
  };

  return (
    <div className="container">
      <h1>Message Board</h1>
      
      {/* New Message Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <textarea
          placeholder="Message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Send Message</button>
      </form>

      {/* User Search Form */}
      <form onSubmit={handleUserSearch}>
        <input
          type="text"
          placeholder="Enter User ID to Search"
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
        />
        <button type="submit">Search Messages by User</button>
      </form>

      {/* Messages List */}
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message) => (
            <li key={message.messageId}>
              {editingMessageId === message.messageId ? (
                // Edit message input
                <div>
                  <textarea
                    className="edit-message"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                  <button onClick={() => handleSaveClick(message.messageId)}>Save</button>
                </div>
              ) : (
                // Display message content
                <div>
                  <strong>{message.userId}</strong>: {message.content}
                  <button className="edit-btn" onClick={() => handleEditClick(message)}>Edit</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
