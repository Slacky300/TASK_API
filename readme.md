# Task Management System - Backend

## Overview

This repository contains the backend implementation of a comprehensive Task Management System built using Node.js, Express.js, and MongoDB. The system provides a RESTful API that allows users to perform CRUD (Create, Read, Update, Delete) operations on tasks. Users can also assign tasks to other users.

## Tech Stack

- **Node.js:** A JavaScript runtime for building scalable and high-performance applications.
- **Express.js:** A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **MongoDB:** A NoSQL database for storing task data.

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Slacky300/TASK_API
    ```

2. **Install the dependencies**

    ```bash
    cd TASK_API

    npm i
    ```

    This will install all the required dependencies for the project.



3. **Configure MongoDB and JWT_SECRET**

    Create a .env file and create two variables **MONGODB_URI** and **JWT SECRET** and assign them appropriate values 

4. **Run the server**

    ```bash
    npm run dev
    ```

    The server will be running at http://localhost:8000 (**BASE_URL** )


# Accessing the Endpoints of TASK API

    To secure the API,user authentication is implemented using a middleware like JWT (JSON Web Tokens). It ensures that only authenticated users can perform CRUD operations.


# API Endpoints


**User Routes**

**Url=BASE_URL/api/v1/users**

1. **Register**

    Endpoint /register

    json_body:{
        "name": "Sample"
        "email": "s@dev.com",
        "password": "12345678"
    }

2. **Login**
    Endpoint /login

    json_body:{
        "email": "s@dev.com",
        "password": "12345678"
    }


**TASK Routes**

**Url=BASE_URL/api/v1/tasks**

1. **Create Task**

    Endpoint /create

    json body: {
        "title": "Task Title",
        "description": "Task Description",
        "assignedTo": ["user_id", "user_id1"]  //not mandatory
    }

2. **Assign Task**

    Endpoint /assign

    json_body: {

        "listOfUsers": ["user_id", "user_id1"]
    }

3. **Get list of Assigned tasks** 

    Endpoint /assigned

4. **Get list of created tasks**

    Endpoint /created

5. **Get Analytics of Tasks**

    Endpoint /analytics

6. **Edit a Task**

    Endpoint /update/:id

7. **Delete a task**

    Endpoint /delete/:id

8. **Retrieve a single task**

    Endpoint /:id









