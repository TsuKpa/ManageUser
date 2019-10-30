var jwt = require('express-jwt');
var auth = jwt({
  secret: 'SECRET',
  userProperty: 'payload'
});

module.exports = (app) => {
    const functions = require('../controllers/functions.controller.js');

    // Create a new Function
    app.post('/functions', auth, functions.create);

    // Retrieve all Function
    app.get('/functions', auth, functions.findAll);

    // Retrieve a single Function with functionId
    app.get('/functions/:functionId', auth, functions.findOne);

    // Update a Function with functionId
    app.put('/functions/:functionId', auth, functions.update);

    // Delete a Function with functionId
    app.delete('/functions/:functionId', auth, functions.delete);
}
