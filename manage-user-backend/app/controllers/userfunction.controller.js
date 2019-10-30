const UserFunctions = require('../models/userfunction.model.js');



// Create and Save a new userFunction
exports.create = (req, res) => {


    // Create a userFunction
    const ufunctions = new UserFunctions({
      name: req.body.name,
      listFunction: req.body.listFunction,
       description: req.body.description
    });

    // Save userFunction in the database
    ufunctions.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User Function."
        });
    });
};

// Retrieve and return all User Functions from the database.
exports.findAll = (req, res) => {
    UserFunctions.find()
    .then(ufunctions => {
        res.send(ufunctions);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving User functions."
        });
    });
};

// Find a single user function with a userfunctionId
exports.findOne = (req, res) => {
    UserFunctions.findById(req.params.userfunctionId)
    .then(f => {
        if(!f) {
            return res.status(404).send({
                message: "UserFunction not found with id " + req.params.userfunctionId
            });            
        }
        res.send(f);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User Function not found with id " + req.params.userfunctionId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user function with id " + req.params.userfunctionId
        });
    });
};

// Update a user function identified by the userfunctionId in the request
exports.update = (req, res) => {


    // Find userfunction and update it with the request body
    UserFunctions.findByIdAndUpdate(req.params.userfunctionId, {
         name: req.body.name,
          listFunction: req.body.listFunction,
         description: req.body.description
    }, {new: true})
    .then(func => {
        if(!func) {
            return res.status(404).send({
                message: "UserFunction not found with id " + req.params.userfunctionId
            });
        }
        res.send(func);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "UserFunction not found with id " + req.params.userfunctionId
            });                
        }
        return res.status(500).send({
            message: "Error updating userfunction with id " + req.params.userfunctionId
        });
    });
};

// Delete a userfunction with the specified functionId in the request
exports.delete = (req, res) => {
    UserFunctions.findByIdAndRemove(req.params.userfunctionId)
    .then(func => {
        if(!func) {
            return res.status(404).send({
                message: "UserFunction not found with id " + req.params.userfunctionId
            });
        }
        res.send({message: "UserFunction deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "UserFunction not found with id " + req.params.userfunctionId
            });                
        }
        return res.status(500).send({
            message: "Could not delete userfunction with id " + req.params.userfunctionId
        });
    });
};




    
    
