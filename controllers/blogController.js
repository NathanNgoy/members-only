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
    res.render("create_message", { currentUser: req.user });
}

exports.messsage_create_post = [
    expressValidator.body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    expressValidator.body('content', 'Content must not be empty.').trim().isLength({ min: 1 }),
   
    expressValidator.sanitizeBody('*').escape(),

    (req, res, next) => {
        const errors = expressValidator.validationResult(req);

        if (!errors.isEmpty()) {
            res.render('create_message', { currentUser: req.user, errors: errors.array()});
            return;
        } 
        else {
            console.log(req.body.title);
            console.log(req.body.content);
            console.log(req.user);
            const message = new Message({
                title: req.body.title,
                content: req.body.content,
                author: req.user.id,
                date: Date.now()
            });

            console.log(message)

            message.save(function(err) {
                if (err) { return next(err) }
                res.redirect('/home');
            })
        }
    }
];

exports.message_delete_post = function (req, res, next){
    console.log(req.params.id);
    Message.findById(req.params.id).exec(function(err, message) {
        if (err) { return next(err); }
        Message.findByIdAndRemove(req.params.id, function deleteMessage (err) {
            if (err) { return next(err); }
            res.redirect("/home");
        } )
    })
}