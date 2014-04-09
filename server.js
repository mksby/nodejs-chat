var express = require('express'),
	http = require('http'),
	path = require('path'),
	config = require(__dirname + '/config'),
	log = require(__dirname + '/libs/log')(module),
	mongoose = require(__dirname + '/libs/mongoose'),
	HttpError = require(__dirname + '/error').HttpError;

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

var sessionStore = require(__dirname + '/libs/sessionStore');

app.use(express.session({
	secret: config.get('session:secret'),
	key: config.get('session:key'),
	cookie: config.get('session:coockie'),
	store: sessionStore
}));

app.use(require(__dirname + '/middleware/sendHttpError'));
app.use(require(__dirname + '/middleware/loadUser'));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

require(__dirname + '/routes')(app);

app.use(function(err, req, res, next) {
	if (typeof err === 'number') {
		err = new HttpError(err);
	};

	if (err instanceof HttpError) {
		res.sendHttpError(err);
	} else {
		if (app.get('env') === 'development') {
			express.errorHandler()(err, req, res, next);
		} else {
			log.error(err);
			err = new HttpError(500);
			res.sendHttpError(err);
		}
	}

});

var server = http.createServer(app);
server.listen(config.get('port'), function() {
	log.info('Express server listening in port ' +  config.get('port'))
});

var io = require(__dirname + '/socket')(server);
app.set('io', io);