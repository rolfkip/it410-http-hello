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

app.get('/health', function(req, res) {
    res.status(200);
    res.send();
});

app.post('/login', passport.authenticate('local'), function(req, res) {
        if(!req.user) return res.sendStatus(401);

        if(!data[req.user.username]) {
            data[req.user.username] = {};
        }

        res.status(200);
        res.send(data[req.user.username]);
    }
);

app.get('/logout', function(req, res) {
    req.logout();
    res.status(200);
    res.send();
});

app.get('/', function(req, res) {
    if(!req.user) return res.sendStatus(401);

    res.send(data[req.user.username]);
});

app.put('/', function(req, res) {
    if(!req.user) return res.sendStatus(401);

    data[req.user.username][req.query.key] = req.query.value;
    res.status(200);
    res.send(data[req.user.username]);
});

app.delete('/', function(req, res) {
    if(!req.user) return res.sendStatus(401);

    delete data[req.user.username][req.query.key];
    res.status(200);
    res.send(data[req.user.id]);
})

app.listen(3000, function() {
    console.log('Server listening on port 3000.')
});