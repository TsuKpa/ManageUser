const User = require('../models/user.model.js');
const UserFunctions = require('../models/userfunction.model.js');
var passport = require('passport');
var nodemailer = require('nodemailer');

// Create and Save a new User
exports.create = (req, res) => {
    // Create a User
	User.findOne({ email: req.body.email }).then(value => {
		if (value){
			res.status(404).send({
				message: "Email alreay taken!"
			});
		}
		else {
			const user = new User({
				email: req.body.email,
				phone: req.body.phone,
				avatar: req.body.avatar,
				fullname: req.body.fullname,
				bio: req.body.bio,
				status: true,
				role: req.body.role
			});

			UserFunctions.findById(req.body.role).then(f => {
				user.functions = f.listFunction; //save user functions with role
				user.password = user.generateHash(req.body.password);
				//Save User in the database
				user.save()
					.then(data => {
						console.log(data);
						res.status(200).send({
								message: "Success create user."
							}
						);
						// var token;
						// token = user.generateJwt();
						// res.status(200);
						// res.json({
						// 	"token": token,
						// 	"user": data
						// });
					}).catch(err => {
					res.status(500).send({
						message: err.message || "Some error occurred while creating the User."
					});
				});
			});
		}
	}).catch(err => {
		console.log(err);
		res.status(500).send({
			message: err.message || "Some error occurred while creating the User."
		});
	});
};

// Register and Save a new User
exports.register = (req, res) => {
	// Create a User
	User.findOne({ email: req.body.email }).then(value => {
		if (value){
			res.status(404).send({
				message: "Email alreay taken!"
			});
		}
		else {
			const user = new User({
				email: req.body.email,
				phone: req.body.phone,
				avatar: req.body.avatar,
				fullname: req.body.fullname,
				bio: req.body.bio,
				status: false,
				role: req.body.role
			});

			UserFunctions.findById(req.body.role).then(f => {
				user.functions = f.listFunction; //save user functions with role
				user.password = user.generateHash(req.body.password);
				//console.log(user.password);
				//Save User in the database
				user.save()
					.then(data => {
						var transporter = nodemailer.createTransport({
							service: 'gmail',
							auth: {
								user: 'namb1400641@student.ctu.edu.vn',
								pass: 'p@5aemNp'
							}
						});

						var mailOptions = {
							from: 'namb1400641@student.ctu.edu.vn',
							to: req.body.email,
							subject: 'Verify your Manage User App account',
							html: '<h1>Welcome user '+req.body.email+'!</h1><p>Please click the link below to active your account:</p><b>'+'http://localhost:3000/verify/'+req.body.email+'?name='+ user.password+'</b>'
						};

						transporter.sendMail(mailOptions, function(error, info){
							if (error) {
								console.log(error);
							} else {
								console.log('Email sent: ' + info.response);
								console.log(data);
								res.status(200).send({
									message: "Success create user. Please check your email to active your account."
								});
							}
						});
					}).catch(err => {
					res.status(500).send({
						message: err.message || "Some error occurred while register the User."
					});
				});
			});
		}
	}).catch(err => {
		console.log(err);
		res.status(500).send({
			message: err.message || "Some error occurred while register the User."
		});
	});
};



exports.verify = (req,res) => {
	var email = req.params.email;
	User.findOne({ email: email }).then(user => {
		if (user.status === false){
			//console.log(user);
			console.log(user.password, req.query.name);
			if (user.password === req.query.name){
				User.findByIdAndUpdate(user._id, {
					$set: {
						'status': true
					}
				}).then(value => {
					res.status(200).send(
						"<h2>Your account actived. Try login again.</h2>"
					);
				}).catch(err => {
					res.status(500).send(
						{ message: "Some error when set status for your account!"}
					)
				});
			}
			else {
				res.status(404).send({
					message: "Your link is invalid. Please try again"
				});
			}
		}
	})
};
// exports.login = (req, res) => {
//     User.findOne({
//         email: req.body.email
//     }, function (err, user) {
//         if (!user.validPassword(req.body.password)) {
//             res.status(500).send({
//                 message: "Invalid password, please check again."
//             });
//         } else {
//             const token = jwt.sign(user, 'secret', {
//                 expiresIn: 604800
//             });
//             res.status(200).send({
//                 auth: true,
//                 token: token
//             });
//         }
//     });
// }


exports.login = (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        var token;
        // If Passport throws/catches an error
        if (err) {
            res.status(404).send(err);
            return;
        }
        // If a user is found
        if (user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        } else {
            // If user is not found
            res.status(401).send(info);
        }
    })(req, res);
};




// Retrieve and return all User from the database.
exports.findAll = (req, res) => {
    if (!req.payload._id) {
        res.status(401).send({
            message: "UnauthorizedError: private users"
        });
    } else {
        User.find()
            .then(users => {
                res.send(users);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving users."
                });
            });
    }
};



// Retrieve and return all User from the database.
exports.findAllRoleUser = (req, res) => {
    if (!req.payload._id) {
        res.status(401).send({
            message: "UnauthorizedError: private users"
        });
    } else {
        User.find({ $where: 'this.role == "5db65e50467ad955560a7981"'})
            .then(users => {
                res.send(users);
            }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users with role user."
            });
        });
    }
};

// Find a single user with a userId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.userId
            });
        });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {


    // Find user and update it with the request body
    User.findByIdAndUpdate(req.params.userId, {
            password: req.body.password,
            email: req.body.email,
            fullname: req.body.fullname,
            phone: req.body.phone,
            avatar: req.body.avatar,
            bio: req.body.bio,
            status: req.body.status,
            role: req.body.role,
            functions: req.body.functions
        }, {
            new: true
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
		console.log(err);
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id ! " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error updating user with id " + req.params.userId
            });
        });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send({
                message: "User deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.userId
            });
        });
};
