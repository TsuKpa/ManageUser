# User Management Application

A simple NodeJS application using REST API to manage user

Some features:
 - Register with email confirmation
 - Login as role (authentication with passport local in express rest nodejs server):
  + admin: can manage all user ( include admin)
  + manager: can manage all user with role user
  + user: can see its profile
 - CRUD user with permission of user

a script file to add many user in model folder.

## Prerequisites

NodeJS
```
https://nodejs.org/en/download/
```

MongoDB
```
https://www.mongodb.com/
```

## Running the application
Download or clone the respository and cd to them

``bash
$cd manage-user-backend
``

Run the server

``bash
$node server.js
``



## Built With

* [ExpressJS](https://expressjs.com/) - The web framework used
* [Mongoose](https://mongoosejs.com/docs/) - It provides you with a simple validation and query API to help you interact with your MongoDB database.
* [MongoDB](https://www.tutorialspoint.com/mongodb/) - A NoSQL Database





