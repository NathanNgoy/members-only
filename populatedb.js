#! /usr/bin/env node
console.log('This script populates some test user and message to your database.');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
var async = require('async')
var moment = require('moment');
var Message = require('./models/message')
var User = require('./models/user')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var messages = []

function userCreate(first, last, email, password, isAdmin, cb) {
  userDetail = { 
    firstName: first, 
    lastName: last,   
    email: email, 
    password: password, 
    isAdmin: isAdmin};
  
  var user = new User(userDetail);
       
  user.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New user: ' + user);
    users.push(user)
    cb(null, user);
  }  );
}

function messageCreate(title, content, author, date, cb) {
  messageDetail = {
      title: title,
      content: content,
      author: author,
      date: date
  }

  var message = new Message(messageDetail);

  message.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Message: ' + message);
    messages.push(message)
    cb(null, message);
  }   );
}

function createUser(cb) {
    async.series([
        function(callback) {
          userCreate(
            "Jason",
            "Bout",
            "thisisatest@gmail.com",
            "abc123",
            false,
            callback);
        },
        function(callback) {
          userCreate(
            "Nathan",
            "Luna",
            "testemail2@test.com",
            "abc123", 
            true,
            callback);
        }],
        // optional callback
        cb);
}

function createMessage(cb) {
    async.parallel([
        function(callback) {
          messageCreate(
            "First message of the day WOOO",
            "This is a test hohoho",
            users[0],
            moment(),
          callback);
        },
        function(callback) {
          messageCreate(
          "Sushi Go", 
          "Pass The Sushi! In this fast-playing card game, the goal is to grab the best combination of sushi dishes as they whiz by. Score points for making the most maki rolls or for collecting a full set of sashimi.", 
          users[1],
          moment(),
          callback);
        }],
        // optional callback
        cb);
}

console.log("Inserting into database");
async.series([
    createUser,
    createMessage
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
      console.log("Inserted")
    }
    // All done, disconnect from database
    mongoose.connection.close();
});