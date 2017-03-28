#!/usr/bin/env nodejs

var bodyParser          = require('body-parser');
var cookieParser        = require('cookie-parser');
var express             = require('express');
var LocalStrategy       = require('passport-local').Strategy;
var passport            = require('passport');
var session             = require('express-session');

var app = express();
var data = {};

// tell passport to use a local strategy and tell it how to validate a username and password
passport.use(new LocalStrategy(function(username, password, done) {
    if (username && password) return done(null, { username: username });
    return done(null, false);
}));

// tell passport how to turn a user into serialized data that will be stored with the session
passport.serializeUser(function(user, done) {
    done(null, user.username);
});

// tell passport how to go from the serialized data back to the user
passport.deserializeUser(function(id, done) {
    done(null, { username: id });
});

// tell the express app what middleware to use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

var apiRouter = express.Router();

app.get('/health', function(req, res) {
    res.sendStatus(200);
});

app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        /*fs.readFile('./keys.json', 'utf8', function(err, data) {
            if(err) throw err;
            var keys = JSON.parse(data);
            var values = keys[req.user.username];
            if(!values) {
                var key = req.user.username;
                var new_user = {};
                new_user[req.user.username] = {};
                keys[req.user.username].push(new_user);
                fs.writeFile('./keys.json', JSON.stringify(keys), function(err, data) {
                    res.status(200);
                    res.send(values);
                });
            }
            res.status(200);
            res.send(values);
            //var values = keys[req.user];
        });*/
        if(!req.user) return res.sendStatus(401);

        if(!data[req.user.username]) {
            data[req.user.username] = {};
        }

        res.send(data[req.user.username]);
    }
);

app.get('/logout', function(req, res) {
    req.logout();
    res.sendStatus(200);
});

app.get('/', function(req, res) {
    /*if(!req.user) {
        res.status(401);
        res.send();
    } else {
        fs.readFile('./keys.json', 'utf8', function(err, data) {
            if(err) throw err;
            var keys = JSON.parse(data);
            res.status(200);
            res.send(keys[req.user.username]);
        });
    }*/
    if(!req.user) return res.sendStatus(401);

    res.send(data[req.user.username]);
});

app.put('/', function(req, res) {
    if(!req.user) {
        res.status(401);
        res.send();
    } else {
        fs.readFile('./keys.json', 'utf8', function(err, data) {
            if(err) throw err;
            var keys = JSON.parse(data);
            var pair = {};
            pair[req.query.key] = req.query.value;
            keys[req.user.username].push(pair);
            var values = keys[req.user.username];
            fs.writeFile('./keys.json', JSON.stringify(keys), function(err, data) {
                res.status(200);
                res.send(values);
            })
        });
    }
});

app.listen(3000, function() {});