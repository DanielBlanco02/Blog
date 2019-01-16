var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session')
var mongoose = require('mongoose');
var expressValidator = require('express-validator');

var app = express();

const SESSION_SECRET = process.env.SESSION_SECRET || "AS80D7AHha771h";

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(cookieParser(SESSION_SECRET));

const SESSION_CONFIGS = {
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 60000}
};

app.use(session(SESSION_CONFIGS));

app.use(expressValidator());

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/blog";


var connection = mongoose.connect(MONGO_URL, {});

var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);


app.use(function(req, res, next) {

    app.locals.range = function(start, end) {
        var foo = [];
        for (var i = start; i <= end; i++) {
            foo.push(i);
        }
        return foo;
    };

    next();
});


let moment = require('moment');

app.use(function(req, res, next) {
    if (req.user != undefined) {
        app.locals.user = req.user;
    }
    app.locals.moment = moment;
    app.locals.today_formated = moment().format('YYYY-MM-DD');
    next();
});

require('./routes/index.routes')(app);

app.use(function(err, req, res, next) {

    console.log("ERROOO1!");
    console.log(err);

    if (err.code && err.code == 11000) {
        req.flash('danger', "Erro - Não é possível inserir um registro duplicado. <br>("+err.message+")");
        res.redirect('back');
    }

    if (err.type && err.type == 'RemoveReferenceError') {
        req.flash('danger', err.message);
        res.redirect('back');
    }

    if (err.errors) {
        for (error of Object.keys(err.errors)) {
            if (err.errors[error].kind == "mongoose-unique-validator") {
                console.log(err.errors[error]);
                req.flash('danger', `Operação negada. O campo ${err.errors[error].path} deve ser único no banco de dados.`);
                res.redirect('back');

            }
        }
    }

    if (err.type == "ValidationError") {
        for (var x in err.errors) {
            console.log(err.errors[x].msg);
            req.flash('danger', err.errors[x].msg);
        }
        return res.redirect('back');
    }
    next(err);
});

app.use(function(req, res, next) {
    app.locals.old = {};
    req.session.old = {};
    next();
});

const port = process.env.PORT || 8080;

var server_http = http.createServer(app);

server_http.listen(port, function() {
    console.log("Server running on port:", port)
});
