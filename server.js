var express = require('express'),
	http = require('http'),
	path = require('path'),
	config = require(__dirname + '/config'),
	log = require(__dirname + '/libs/log')(module);

app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

app.use(express.favicon());
if (app.get('env') === 'development') {
	app.use(express.logger('dev'));
} else {
	app.use(express.logger('default'));
};
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
	res.render('index')
});

var User = require(__dirname + '/models/user').User;
app.get('/users', function(req, res, next) {
	User.find({}, function(err, users) {
		if (err) return next(err);
		res.json(users);
	});
});

http.createServer(app).listen(config.get('port'), function() {
	log.info('Express server listening in port ' +  config.get('port'))
});

app.use(function(err, req, res, next) {
	if (app.get('env') === 'development') {
		var errorHandler = express.errorHandler();
		errorHandler(err, req, res, next);
	} else {
		res.end(500);
	}
});