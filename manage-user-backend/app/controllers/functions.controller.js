const Functions = require('../models/functions.model.js');



// Create and Save a new Function
exports.create = (req, res) => {


    // Create a Function
    const functions = new Functions({
       codef: req.body.codef,
       byRole: req.body.byRole,
       description: req.body.description
    });

    // Save Function in the database
    functions.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Function."
        });
    });
};

// Retrieve and return all Functions from the database.
exports.findAll = (req, res) => {
    Functions.find()
    .then(functions => {
        res.send(functions);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving functions."
        });
    });
};

// Find a single function with a functionId
exports.findOne = (req, res) => {
    Functions.findById(req.params.functionId)
    .then(f => {
        if(!f) {
            return res.status(404).send({
                message: "Function not found with id " + req.params.functionId
            });            
        }
        res.send(f);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Function not found with id " + req.params.functionId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving function with id " + req.params.functionId
        });
    });
};

// Update a function identified by the functionId in the request
exports.update = (req, res) => {


    // Find function and update it with the request body
    Functions.findByIdAndUpdate(req.params.functionId, {
         codef: req.body.codef,
         byRole: req.body.byRole,
         description: req.body.description
    }, {new: true})
    .then(func => {
        if(!func) {
            return res.status(404).send({
                message: "Function not found with id " + req.params.functionId
            });
        }
        res.send(func);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Function not found with id " + req.params.functionId
            });                
        }
        return res.status(500).send({
            message: "Error updating function with id " + req.params.functionId
        });
    });
};

// Delete a function with the specified functionId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.functionId)
    .then(func => {
        if(!func) {
            return res.status(404).send({
                message: "Function not found with id " + req.params.functionId
            });
        }
        res.send({message: "Function deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Function not found with id " + req.params.functionId
            });                
        }
        return res.status(500).send({
            message: "Could not delete function with id " + req.params.functionId
        });
    });
};




