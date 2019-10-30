var jwt = require('express-jwt');
var auth = jwt({
  secret: 'SECRET',
  userProperty: 'payload'
});


module.exports = (app) => {
    const userfunction = require('../controllers/userfunction.controller.js');

    // Create a new User
    app.post('/userfunction', auth, userfunction.create);

    // Retrieve all userfunction
    app.get('/userfunction', auth, userfunction.findAll);

    // Retrieve a single UserFunction with userfunctionId
    app.get('/userfunction/:userfunctionId', auth,  userfunction.findOne);

    // Update a UserFunction with userfunctionId
    app.put('/userfunction/:userfunctionId', auth, userfunction.update);

    // Delete a UserFunction with userfunctionId
    app.delete('/userfunction/:userfunctionId', auth, userfunction.delete);
}
