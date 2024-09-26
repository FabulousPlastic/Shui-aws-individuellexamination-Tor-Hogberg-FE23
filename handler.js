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
    res.json({ messageId, userId, content });
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
