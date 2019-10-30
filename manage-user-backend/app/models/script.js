// Script add 500 user with role user to mongodb
// please run $node script.js after run mongodb



const User = require('./user.model.js');
const UserFunctions = require('./userfunction.model.js');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/quanlynguoidung';

var users = []
for (var i = 1; i <= 500; i++) {
	var user = new User();
    user.email = "user" + i + "@gmail.com";
    user.password = user.generateHash('password');
    user.fullname = "user" + i;
    user.phone =  "123456789";
    user.status = true;
    if(i%2==0){
        user.avatar = "https://loremflickr.com/320/240";
    }
    else {
        user.avatar = "https://loremflickr.com/320/240/girl";
    }
    user.bio = "I am user" + i;
    user.role = "5db65e50467ad955560a7981"; //id of role user
    user.functions = ["5db65cee467ad955560a797b", "5db65cf9467ad955560a797c"]; //if you add one by one in postman, you dont need this field.
    users.push(user);
}
var createNewEntries = function(db, users, callback) {
    // Get the collection and bulk api artefacts
    var collection = db.collection('users'),          
        bulkUpdateOps = [];    

    users.forEach(function(doc) {
        bulkUpdateOps.push({ "insertOne": { "document": doc } });

        if (bulkUpdateOps.length === 1000) {
            collection.bulkWrite(bulkUpdateOps).then(function(r) {
                console.log(r);
            });
            bulkUpdateOps = [];
        }
    });

    if (bulkUpdateOps.length > 0) {
        collection.bulkWrite(bulkUpdateOps).then(function(r) {
            console.log(r);
        });
    }
};

MongoClient.connect(url, function(err, client) {
    if (err) return console.log(err);
    createNewEntries(client, users, function() {
        client.close();
    });
});
