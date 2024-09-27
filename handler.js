// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
// const {
//   DynamoDBDocumentClient,
//   GetCommand,
//   PutCommand,
//   UpdateCommand,
//   QueryCommand,
//   ScanCommand,
// } = require("@aws-sdk/lib-dynamodb");
// const { v4: uuidv4 } = require('uuid');
// const express = require("express");
// const serverless = require("serverless-http");

// const app = express();
// const MESSAGES_TABLE = process.env.MESSAGES_TABLE;

// const client = new DynamoDBClient();
// const docClient = DynamoDBDocumentClient.from(client);

// // Use CORS middleware for all routes
// const cors = require('cors');
// app.use(cors({
//   origin: '*',  // Allow all origins
//   methods: ['GET', 'POST', 'PUT', 'OPTIONS'],  // Allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Amz-Date', 'X-Api-Key', 'X-Amz-Security-Token'],  // Allowed headers
// }));

// app.use(express.json());  // Middleware to parse JSON bodies

// // Helper function for sending consistent error responses
// const sendErrorResponse = (res, message, statusCode = 500) => {
//   console.error(message);
//   res.status(statusCode).json({ error: message });
// };

// // Create a new message
// app.post("/message", async (req, res) => {
//   const { userId, content } = req.body;

//   if (!userId || !content) {
//     return sendErrorResponse(res, '"userId" and "content" must be provided', 400);
//   }

//   const messageId = uuidv4();  // Generate a unique messageId
//   const newMessage = {
//     messageId,
//     userId,
//     content,
//     createdAt: new Date().toISOString(),
//   };

//   const params = {
//     TableName: MESSAGES_TABLE,
//     Item: newMessage,
//   };

//   try {
//     await docClient.send(new PutCommand(params));
//     res.json(newMessage);
//   } catch (error) {
//     sendErrorResponse(res, "Could not create message");
//   }
// });

// // Update an existing message
// // app.put("/message/:messageId", async (req, res) => {
// //   const { messageId } = req.params;
// //   const { content } = req.body;

// //   if (!content) {
// //     return sendErrorResponse(res, '"content" must be provided', 400);
// //   }

// //   const params = {
// //     TableName: MESSAGES_TABLE,
// //     Key: { messageId },
// //     UpdateExpression: "set content = :content",
// //     ExpressionAttributeValues: {
// //       ":content": content,
// //     },
// //     ReturnValues: "UPDATED_NEW",
// //   };

// //   try {
// //     const result = await docClient.send(new UpdateCommand(params));
// //     if (result.Attributes) {
// //       res.json(result.Attributes);
// //     } else {
// //       sendErrorResponse(res, "Message not found", 404);
// //     }
// //   } catch (error) {
// //     sendErrorResponse(res, "Could not update message");
// //   }
// // });

// app.use(express.json());  // Middleware to parse JSON bodies

// app.put("/message/:messageId", async (req, res) => {
//   const { messageId } = req.params;
//   const content = req.body?.content || req.body.content;

//   console.log("Request Params:", req.params);  // Log params for debugging
//   console.log("Request Body:", req.body);      // Log body for debugging

//   if (!content) {
//     return res.status(400).json({ error: '"content" must be provided' });
//   }

//   const params = {
//     TableName: MESSAGES_TABLE,
//     Key: { messageId },
//     UpdateExpression: "set content = :content",
//     ExpressionAttributeValues: {
//       ":content": content,
//     },
//     ReturnValues: "UPDATED_NEW",
//   };

//   try {
//     const command = new UpdateCommand(params);
//     const result = await docClient.send(command);
//     res.json(result.Attributes);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Could not update message" });
//   }
// });



// // Get all messages
// app.get("/messages", async (req, res) => {
//   const params = {
//     TableName: MESSAGES_TABLE,
//   };

//   try {
//     const { Items } = await docClient.send(new ScanCommand(params));
//     res.json(Items);
//   } catch (error) {
//     sendErrorResponse(res, "Could not retrieve messages");
//   }
// });

// // Get messages by user
// app.get("/messages/user/:userId", async (req, res) => {
//   const { userId } = req.params;

//   const params = {
//     TableName: MESSAGES_TABLE,
//     IndexName: "userId-index",
//     KeyConditionExpression: "userId = :userId",
//     ExpressionAttributeValues: {
//       ":userId": userId,
//     },
//   };

//   try {
//     const { Items } = await docClient.send(new QueryCommand(params));
//     res.json(Items);
//   } catch (error) {
//     sendErrorResponse(res, "Could not retrieve messages for user");
//   }
// });

// // Catch-all for undefined routes
// app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// // Export the handler to be used by serverless
// exports.handler = serverless(app);
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require('uuid');  // Import the UUID library
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const MESSAGES_TABLE = process.env.MESSAGES_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

// Create a new message
app.post("/message", async (req, res) => {
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: '"userId" and "content" must be provided' });
  }

  const messageId = uuidv4();  // Generate a unique messageId

  const params = {
    TableName: MESSAGES_TABLE,
    Item: { messageId, userId, content, createdAt: new Date().toISOString() },
  };

  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    res.json({ messageId, userId, content, createdAt: params.Item.createdAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create message" });
  }
});

// Update an existing message
app.put("/message/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: '"content" must be provided' });
  }

  const params = {
    TableName: MESSAGES_TABLE,
    Key: { messageId },
    UpdateExpression: "set content = :content",
    ExpressionAttributeValues: {
      ":content": content,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const command = new UpdateCommand(params);
    const result = await docClient.send(command);
    res.json(result.Attributes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update message" });
  }
});

// Get all messages
app.get("/messages", async (req, res) => {
  const params = {
    TableName: MESSAGES_TABLE,
  };

  try {
    const command = new ScanCommand(params);
    const { Items } = await docClient.send(command);
    res.json(Items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve messages" });
  }
});

// Get messages by user
app.get("/messages/user/:userId", async (req, res) => {
  const { userId } = req.params;

  const params = {
    TableName: MESSAGES_TABLE,
    IndexName: "userId-index",  // Assuming you have a GSI for querying by userId
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  try {
    const command = new QueryCommand(params);
    const { Items } = await docClient.send(command);
    res.json(Items);
    console.log(Items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve messages for user" });
  }
});

// Catch-all for undefined routes
app.use((req, res) => {
  return res.status(404).json({ error: "Not Found" });
});

exports.handler = serverless(app);
