const express = require('express');
const bodyParser =  require('body-parser');
var cors = require('cors')
var passport = require('passport');
var expressJwt = require('express-jwt');
const middleware = expressJwt({secret: 'SECRET'});

//create express app
const app = express();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());


// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('./config/passport');
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());



// Catch unauthorised errors

// app.use(middleware);
// app.use(function (err, req, res, next) {
//   if (err.name === 'UnauthorizedError') {
//     res.status(401).json({"message": "Invalid token!"});
//   } else {
//     next(err);
//   }
// });


// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to our world!"});
});


require('./app/routes/user.routes.js')(app);
require('./app/routes/functions.routes.js')(app);
require('./app/routes/userfunction.routes.js')(app);


// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
