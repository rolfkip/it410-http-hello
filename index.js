#!/usr/bin/env nodejs

var express = require('express');
var passport = require('passport');
var strategy = require('passport-local').Strategy;

var app = express();

var apiRouter = express.Router();

var healthRoute = require('./routes/health')(apiRouter);
var loginRoute = require('./routes/login')(apiRouter);
var indexRoute = require('./routes/index')(apiRouter);
app.use(apiRouter);

app.listen(3000, function() {});