var passport = require('passport');
var jwt = require('express-jwt');

var auth = jwt({
  secret: 'SECRET',
  userProperty: 'payload'
});


module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/users', auth, users.create);
    app.post('/register', users.register);

	app.get('/verify/:email', users.verify);

    //login
    app.post('/login', users.login);


    // Retrieve all User
    app.get('/users', auth, users.findAll);

    // Retrieve all normal User
    app.get('/usersByRoleUser', auth, users.findAllRoleUser);


    app.get('/', (req, res) => {
        res.send("invalid endpoint");
    });

    // Retrieve a single User with userId
    app.get('/users/:userId', auth, users.findOne);

    // Update a User with userId
    app.put('/users/:userId', auth, users.update);

    // Delete a User with userId
    app.delete('/users/:userId', auth, users.delete);
}
