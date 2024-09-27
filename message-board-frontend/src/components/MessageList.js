// // src/components/MessageList.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { API_BASE_URL } from '../config';

// const MessageList = () => {
//   const [messages, setMessages] = useState([]);
//   const [editingMessage, setEditingMessage] = useState(null);
//   const [editedContent, setEditedContent] = useState('');

//   useEffect(() => {
//     // Fetch messages from the API
//     axios.get(`${API_BASE_URL}/messages`)
//       .then(response => {
//         setMessages(response.data);
//       })
//       .catch(error => {
//         console.error("There was an error fetching the messages!", error);
//       });
//   }, []);

//   const handleEditClick = (message) => {
//     setEditingMessage(message);
//     setEditedContent(message.content);
//   };

//   const handleSaveClick = () => {
//     axios.put(`${API_BASE_URL}/message/${editingMessage.messageId}`, { content: editedContent })
//       .then(response => {
//         // Update the message list with the edited message
//         setMessages((prevMessages) =>
//           prevMessages.map((msg) =>
//             msg.messageId === editingMessage.messageId ? { ...msg, content: editedContent } : msg
//           )
//         );
//         setEditingMessage(null);
//         setEditedContent('');
//       })
//       .catch(error => {
//         console.error("There was an error updating the message!", error);
//       });
//   };

//   return (
//     <div>
//       <h2>Messages</h2>
//       <ul>
//         {messages.map((message) => (
//           <li key={message.messageId}>
//             <strong>{message.userId}</strong>: {editingMessage && editingMessage.messageId === message.messageId ? (
//               <input
//                 type="text"
//                 value={editedContent}
//                 onChange={(e) => setEditedContent(e.target.value)}
//               />
//             ) : (
//               message.content
//             )}
//             (Created at: {message.createdAt})
//             {editingMessage && editingMessage.messageId === message.messageId ? (
//               <button onClick={handleSaveClick}>Save</button>
//             ) : (
//               <button onClick={() => handleEditClick(message)}>Edit</button>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MessageList;
