// var User = require('../models/user').User,
// 	HttpError = require('../error').HttpError,
// 	ObjectID = require('mongodb').ObjectID;

// module.exports = function(app) {

// 	app.get('/', function(req, res, next) {
// 		res.render('index')
// 	});
	
// 	app.get('/users', function(req, res, next) {
// 		User.find({}, function(err, users) {
// 			if (err) return next(err);
// 			res.json(users);
// 		});
// 	});

// 	app.get('/user/:id', function(req, res, next) {
// 		try {
// 			var id = new ObjectID(req.params.id)
// 		} catch(e) {
// 			return next(404);
// 		};
// 		User.findById(id, function(err, user) {
// 			if (err) return next(err);
// 			if (!user) {
// 				next(new HttpError(404, 'User not found'));
// 			};
// 			res.json(user);
// 		});
// 	});

// };

var checkAuth = require('../middleware/checkAuth');

module.exports = function(app) {

	app.get('/', require('./frontpage').get);

	app.get('/login', require('./login').get);
	app.post('/login', require('./login').post);
	app.post('/logout', require('./logout').post);

	app.get('/chat', checkAuth, require('./chat').get);

};