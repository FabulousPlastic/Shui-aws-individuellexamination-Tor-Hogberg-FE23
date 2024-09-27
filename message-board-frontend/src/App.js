import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config'; // This should contain your API base URL

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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Message Board</h1>
      
      {/* New Message Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Username"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
        />
        <textarea
          placeholder="Message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px' }}>Send Message</button>
      </form>

      {/* User Search Form */}
      <form onSubmit={handleUserSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter User ID to Search"
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px' }}>Search Messages by User</button>
      </form>

      {/* Messages List */}
      <div>
        <h2>Messages</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {messages.map((message) => (
            <li key={message.messageId} style={{ marginBottom: '20px' }}>
              {editingMessageId === message.messageId ? (
                // Edit message input
                <div>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    style={{ width: '100%', padding: '10px' }}
                  />
                  <button onClick={() => handleSaveClick(message.messageId)} style={{ width: '100%', padding: '10px' }}>
                    Save
                  </button>
                </div>
              ) : (
                // Display message content
                <div>
                  <strong>{message.userId}</strong>: {message.content}
                  <br />
                  <button onClick={() => handleEditClick(message)} style={{ marginTop: '10px', padding: '5px' }}>
                    Edit
                  </button>
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
