# Shui Message Board

Shui Message Board is a full-stack application using React for the frontend and AWS Serverless (Lambda, API Gateway, DynamoDB) for the backend.

## Technologies Used
- Frontend: React, Axios
- Backend: AWS Lambda, API Gateway, DynamoDB, Serverless Framework, Express
- Hosting: AWS S3 for frontend

## Installation

### Backend Setup
1. Clone the repo and navigate to `aws-individuellexamination-Tor-Hogberg-FE23/`
2. Install dependencies: `npm install`
3. Set up AWS credentials: `aws configure`

### Frontend Setup
1. Navigate to `message-board-frontend/`
2. Install dependencies: `npm install`

## Development

### Run the Backend Locally
Run the backend in offline mode using: `cd aws-individuellexamination-Tor-Hogberg-FE23` then `serverless offline`

### Run the Frontend Locally
Run the frontend with: `cd message-board-frontend` then `npm start`

## Deployment

### Deploy the Backend
Deploy the backend using Serverless: `cd aws-individuellexamination-Tor-Hogberg-FE23` then `serverless deploy`

### Deploy the Frontend
Build and sync the frontend to S3: `cd message-board-frontend` then `npm run build` then `aws s3 sync build/ s3://your-s3-bucket-name --delete`

## License
This project is licensed under the MIT License.
