#!/usr/bin/env nodejs

var bodyParser          = require('body-parser');
var cookieParser        = require('cookie-parser');
var express             = require('express');
var LocalStrategy       = require('passport-local').Strategy;
var passport            = require('passport');
var session             = require('express-session');

var app = express();

passport.use(new LocalStrategy(function(username, password, done) {
    return done(null, { username: username });
    //return done(null, false);
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
    res.status(200);
    res.send();
});

app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        res.status(200);
        res.send();
    }
);

app.get('/logout', function(req, res) {
    req.logout();
    res.status(200);
    res.send();
});

app.listen(3000, function() {});