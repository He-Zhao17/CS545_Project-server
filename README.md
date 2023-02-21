# Folder Structure

    .
    ├── config                # Contains Mongo connection and collections information, required settings and schema
    │ ├── mongoCollections.js # Contains function that gets a collection from mongoDB
    │ ├── mongoConnection.js  # Contains function to establish connection with mongoDB instance
    │ ├── settings.js         # Contains mongo configs, age requirement metadata, gender metadata and question schema
    ├── data                  # Functions that handle API related logic
    │ ├── index.js            # Contains global exports
    │ ├── questions.js        # Code required to handle queries regarding questions
    │ ├── user.js             # Code required to handle queries regarding user
    │ ├── quiz.js             # Code required to handle queries regarding quiz
    ├── errors                # A collection of functions for error checks
    │ ├── index.js            # Contains functions to handle different types of errors
    ├── routes                # A collection of API endpoints
    │ ├── index.js            # Contains a function to generate the API endpoints
    │ ├── auth.js             # Contains API endpoints related to Authentication
    │ ├── questions.js        # Contains API endpoints related to Quiz Questions
    │ ├── quiz.js             # Contains API endpoints related to Quiz Answers submission
    ├── services              # A collection of functions to handle services
    │ ├── index.js            # Contains global exports
    │ ├── hashing.js          # Contains functions to encrpyt and decrypt the function
    │ ├── token.js            # Contains functions to generate JWT Token & Validate Token used for Authorization
    │ ├── uuid.js             # Contains function to generate UUID
    ├── tasks                 # A collection of files used to test data functions
    │ ├── questions.js        # An array of dummy question used to test insertion into the database
    │ ├── quiz.js             # An array of dummy quiz answers used to test insertion into database
    │ ├── test.js             # A function to test the data functions
    ├── app.js                # Entry point for server. Initilization of server is done here.
    └── README.md

# Configuration

## Settings.js

Copy the following into config/settings.json

```json
{
  "mongoConfig": {
    "serverUrl": "mongodb://localhost:27017/",
    "database": "Quizial"
  },
  "age": {
    "min": "17",
    "max": "100"
  },
  "gender": ["Male", "Female", "Non Binary", "Bisexual"],
  "questionSchema": [
    {
      "key": "type",
      "type": "string",
      "hasChildren": false
    },
    {
      "key": "hasImage",
      "type": "boolean",
      "hasChildren": false
    },
    {
      "key": "imageMeta",
      "type": "object",
      "hasChildren": true,
      "children": [
        {
          "key": "type",
          "type": "string"
        },
        {
          "key": "ref",
          "type": "string"
        }
      ]
    },
    {
      "key": "question",
      "type": "string",
      "hasChildren": false
    },
    {
      "key": "options",
      "type": "array",
      "hasChildren": false
    },
    {
      "key": "answer",
      "type": "string",
      "hasChildren": false
    },
    {
      "key": "difficulty",
      "type": "string",
      "hasChildren": false
    }
  ],
  "quizSchema": [
    {
      "key": "userId",
      "type": "string",
      "hasChildren": false
    },
    {
      "key": "quizId",
      "type": "string",
      "hasChildren": false
    },
    {
      "key": "totalScore",
      "type": "number",
      "hasChildren": false
    },
    {
      "key": "answers",
      "type": "array",
      "hasChildren": true,
      "children": [
        {
          "key": "questionId",
          "type": "string"
        },
        {
          "key": "score",
          "type": "number"
        }
      ]
    }
  ]
}
```

## .env

Create a .env file in root directory and paste the following:

```env
TOKEN_KEY = randomKeyWillBeHere
SALT_ROUNDS = 16
```

- `TOKEN_KEY` can be any value you want.
- `SALT_ROUNDS` determines how many rounds of hashing you want to use. The higher the number the more rounds of hashing. It will take a while to hash if the number is high.

# Routes

Base URL on local env: http://localhost:3000/api

## Auth

Endpoints:

- /auth/login
  - Method: `POST`
  - Body:
    ```json
    {
      "email": "example@email.com",
      "password": "Password"
    }
    ```
  - Response:
    - 200 OK:
      ```json
      {
        "_id": "UUID",
        "username": "username",
        "password": "HashedPasswordString",
        "email": "example@email.com",
        "age": 28,
        "gender": "Male",
        "quizzes": [],
        "highestScore": null,
        "lastLogin": "10/28/2022, 10:36:19 PM",
        "firstLogin": "10/28/2022, 10:35:42 PM",
        "activePeriod": 0,
        "lifetimeCorrectAnswers": 0,
        "totalQuestionsAnswered": 0,
        "token": "JWT Token"
      }
      ```
    - 400 Bad Request:
      ```json
      {
        "status": 400,
        "message": "Please check your email or password and try again"
      }
      ```
    - 404 Not Found:
      ```json
      {
        "status": 404,
        "message": "User not found"
      }
      ```
- /auth/register
  - Method: `POST`
  - Body:
    ```json
    {
      "username": "username",
      "password": "PlainTextPassword",
      "gender": "Gender",
      "age": 28,
      "email": "example@email.com"
    }
    ```
  - Response:
    - 200 OK:
      ```json
      {
        "status": 200,
        "userId": "UUID",
        "token": "JWT Token"
      }
      ```
    - 400 Bad Request:
      ```json
      {
        "status": 400,
        "message": "Message with error details"
      }
      ```

## Questions

Endpoints

- /questions/get:
  - Method: `GET `
  - Query Parameters:
    - id
      ```http
      GET /api/questions/get?_id=fff4a2a0-9736-4dd1-a41c-37de163689f5
      ```
  - Response:
    - 200 OK:
      ```json
      {
        "status": 200,
        "question": {
          "_id": "fff4a2a0-9736-4dd1-a41c-37de163689f5",
          "type": "singe",
          "hasImage": false,
          "imageMeta": {
            "type": null,
            "ref": null
          },
          "question": "Question for the quiz",
          "options": ["a", "b", "c", "d"],
          "answer": "Correct answer for the question",
          "difficulty": "easy"
        }
      }
      ```
    - 404 Not Found:
      ```json
      {
        "status": 404,
        "message": "Question not found"
      }
      ```
- /questions/add:
  - Method: `POST `
  - Body:
    ```json
    [
      {
        "type": "singe",
        "hasImage": true,
        "imageMeta": {
          "type": "image/jpg",
          "ref": "URL"
        },
        "question": "Question for the quiz",
        "options": ["a", "b", "c", "d"],
        "answer": "Correct answer for the question",
        "difficulty": "easy"
      }
    ]
    ```
  - Response:
    - 200 OK:
      ```json
      {
        "status": 200,
        "message": "Added questions"
      }
      ```
    - 400 Bad Request:
      ```json
      {
        "status": 400,
        "message": "Incorrect schema",
        "inputLength": 6,
        "requiredlength": 7
      }
      ```

## Quiz

Endpoints:

- /quiz/submit:

  - Method: `POST`
  - Body:

    ```json
    [
        {
          "userId": "123",
          "quizId": "hdsgjahsdg",
          "totalScore": 22,
          "answers": [
            {
              "questionId": "saghgd",
              "score": 1
            },
            {
              "questionId": "saghasdasdgd",
              "score": 0
            },
            {
              "questionId": "bnncv",
              "score": 1
            }
          ]
        }
      ]
    ```

  - Response:

    - 200 OK:

      ```json
      {
        "status": 200,
        "message": "Quiz submitted"
      }
      ```

    - 403 Forbidden:
      ```json
      {
        "status": 403,
        "message": "A token is required to access this data"
      }
      ```
