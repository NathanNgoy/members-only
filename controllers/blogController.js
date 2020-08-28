var User = require("../models/user")
var Message = require("../models/message");
const expressValidator = require("express-validator");
var async = require('async');
const bcrypt = require("bcryptjs");
const { insertMany } = require("../models/user");

exports.index = function(req, res) {   
    async.parallel({
        user_count: function(callback) {
            User.countDocuments({}, callback); 
        },
        blog_count: function(callback) {
            Message.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Blog Home', error: err, data: results });
    });
};

exports.list_blog = function(req, res) {
    async.parallel({
        messages: function(callback) {
            Message.find({}, callback).populate("author");
        }
    }, function (err, results) {
        console.log(req.user)
        res.render("message_list", {message_list: results.messages, currentUser: req.user})
    })
}

exports.message_create_get = function(req, res) {
    res.render("create_message", { user: req.user });
}

