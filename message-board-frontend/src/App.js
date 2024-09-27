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
  const [sortOrder, setSortOrder] = useState('newest'); // New state for sorting order
  const [searchResultEmpty, setSearchResultEmpty] = useState(false); // New state for empty search results

  // Fetch all messages from the API
  const fetchAllMessages = () => {
    axios.get(`${API_BASE_URL}/messages`)
      .then(response => {
        setMessages(response.data);
        setSearchResultEmpty(response.data.length === 0);
      })
      .catch(error => console.error("Error fetching messages:", error));
  };

  // Fetch all messages when the component loads
  useEffect(() => {
    fetchAllMessages();
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
      .then(response => {
        setMessages(response.data);
        setSearchResultEmpty(response.data.length === 0); // Check if no messages are returned
      })
      .catch(error => console.error("Error fetching messages for user:", error));
  };

  // Sort messages by createdAt (newest or oldest)
  const sortedMessages = [...messages].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  return (
    <div className="container" id="app-container">
      <h1 id="app-title">shuiMessages</h1>
      
      {/* New Message Form */}
      <form id="new-message-form" onSubmit={handleSubmit}>
        <input
          id="new-message-username"
          className="input"
          type="text"
          placeholder="Username"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <textarea
          id="new-message-content"
          className="textarea"
          placeholder="Message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button id="new-message-submit" className="button" type="submit">Send Message</button>
      </form>

      {/* User Search Form */}
      <form id="user-search-form" onSubmit={handleUserSearch}>
        <input
          id="search-user-id"
          className="input"
          type="text"
          placeholder="Enter User to Search"
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
        />
        <button id="search-user-submit" className="button" type="submit">Search Messages by User</button>
      </form>

      {/* Sort Order Selector */}
      <div id="sort-order-selector">
        <label>Sort by:</label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Display All Messages Button */}
      <button id="display-all-messages" className="button" onClick={fetchAllMessages}>
        Display All Messages
      </button>

      {/* Messages List */}
      <div id="messages-list-container">
        {searchResultEmpty ? (
          <p>No messages from that user.</p>  // Display message if no messages found
        ) : (
          <ul id="messages-list" className="messages-list">
            {sortedMessages.map((message) => (
              <li key={message.messageId} className="message-item">
                {editingMessageId === message.messageId ? (
                  // Edit message input
                  <div className="message-edit-container">
                    <textarea
                      id={`edit-message-${message.messageId}`}
                      className="edit-message textarea"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                    />
                    <button id={`save-message-${message.messageId}`} className="button" onClick={() => handleSaveClick(message.messageId)}>Save</button>
                  </div>
                ) : (
                  // Display message content
                  <div className="message-content">
                    <div>
                      <strong className="message-username">{message.userId}</strong>: {message.content}
                      <p className="message-timestamp">Posted at: {new Date(message.createdAt).toLocaleString()}</p>
                    </div>
                    <button id={`edit-message-btn-${message.messageId}`} className="edit-btn button" onClick={() => handleEditClick(message)}>Edit</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { API_BASE_URL } from './config';
// import './App.css'; 

// function App() {
//   const [userId, setUserId] = useState('');
//   const [content, setContent] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [newContent, setNewContent] = useState('');
//   const [searchUserId, setSearchUserId] = useState(''); // New state for user search

//   // Fetch all messages from the API
//   useEffect(() => {
//     axios.get(`${API_BASE_URL}/messages`)
//       .then(response => setMessages(response.data))
//       .catch(error => console.error("Error fetching messages:", error));
//   }, []);

//   // Handle new message submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios.post(`${API_BASE_URL}/message`, { userId, content })
//       .then(response => {
//         setMessages([...messages, response.data]);  // Add new message to the list
//         setUserId('');
//         setContent('');
//       })
//       .catch(error => console.error("Error creating message:", error));
//   };

//   // Handle editing a message
//   const handleEditClick = (message) => {
//     setEditingMessageId(message.messageId);
//     setNewContent(message.content);
//   };

//   // Handle saving the edited message
//   const handleSaveClick = (messageId) => {
//     axios.put(`${API_BASE_URL}/message/${messageId}`, { content: newContent })
//       .then(() => {
//         setMessages(
//           messages.map((message) =>
//             message.messageId === messageId
//               ? { ...message, content: newContent }
//               : message
//           )
//         );
//         setEditingMessageId(null);
//         setNewContent('');
//       })
//       .catch(error => console.error("Error updating message:", error));
//   };

//   // Fetch messages for a specific user
//   const handleUserSearch = (e) => {
//     e.preventDefault();
//     if (!searchUserId) return;
    
//     axios.get(`${API_BASE_URL}/messages/user/${searchUserId}`)
//       .then(response => setMessages(response.data))
//       .catch(error => console.error("Error fetching messages for user:", error));
//   };

//   return (
//     <div className="container" id="app-container">
//       <h1 id="app-title">shuiMessages</h1>
      
//       {/* New Message Form */}
//       <form id="new-message-form" onSubmit={handleSubmit}>
//         <input
//           id="new-message-username"
//           className="input"
//           type="text"
//           placeholder="Username"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           required
//         />
//         <textarea
//           id="new-message-content"
//           className="textarea"
//           placeholder="Message"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           required
//         />
//         <button id="new-message-submit" className="button" type="submit">Send Message</button>
//       </form>

//       {/* User Search Form */}
//       <form id="user-search-form" onSubmit={handleUserSearch}>
//         <input
//           id="search-user-id"
//           className="input"
//           type="text"
//           placeholder="Enter User to Search"
//           value={searchUserId}
//           onChange={(e) => setSearchUserId(e.target.value)}
//         />
//         <button id="search-user-submit" className="button" type="submit">Search Messages by User</button>
//       </form>

//       {/* Messages List */}
//       <div id="messages-list-container">
//         <h2 id="messages-list-title">Messages</h2>
//         <ul id="messages-list" className="messages-list">
//           {messages.map((message) => (
//             <li key={message.messageId} className="message-item">
//               {editingMessageId === message.messageId ? (
//                 // Edit message input
//                 <div className="message-edit-container">
//                   <textarea
//                     id={`edit-message-${message.messageId}`}
//                     className="edit-message textarea"
//                     value={newContent}
//                     onChange={(e) => setNewContent(e.target.value)}
//                   />
//                   <button id={`save-message-${message.messageId}`} className="button" onClick={() => handleSaveClick(message.messageId)}>Save</button>
//                 </div>
//               ) : (
//                 // Display message content
//                 <div className="message-content">
//                   <strong className="message-username">{message.userId}</strong>: {message.content}
//                   <button id={`edit-message-btn-${message.messageId}`} className="edit-btn button" onClick={() => handleEditClick(message)}>Edit</button>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default App;
