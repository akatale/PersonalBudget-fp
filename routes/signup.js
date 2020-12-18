var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const {
    check,
    validationResult
} = require('express-validator');
var eventDb = require("../utility/eventDB");
var usereventDb = require("../utility/UserProfileDB");
var userDb = require("../utility/userDB");
var userProfile = require("../utility/userProfileDB");
var userModel = require("../models/userModel");

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var compression = require('compression');

router.use(compression());

// To handle the GET request for Login.
router.get('/', function (req, res) {
    if (req.session.theUser == null) {
        res.render('signup', {
            errors: null,
            success: false
        });
    } else {
        res.render('index', {
            currentUser: req.session.theUser
        });
    }
});


router.post("/", urlencodedParser, [
    // Username must be consist of alphanumerics and at least 4 chars long.
    check('username').isAlphanumeric().withMessage('Username field must consists of alphabetical chars')
    .isLength({
        min: 4
    }).withMessage("Username field must be 4 or more characters")
    .not().isEmpty().withMessage('Username Value Cannot be left blank'),
    // Password must be at least 6 chars long.
    check('password')
    .isLength({
        min: 6
    }).withMessage("Password field must be 6 or more characters")
    .not().isEmpty().withMessage('Password Value Cannot be left blank')
], async function (req, res) {

    //check for login validation errors.
    var signup = validationResult(req);
    if (!signup.isEmpty()) {

        console.log(signup.array());

        return res.render("signup", {
            currentUser: req.session.theUser,
            errors: signup.array(),
            success: false
        });

    } else {
        //check if the username exists in the DB.
        var user_name = await userDb.check_user(req.body.username);

        if (!user_name) {

            var eventId = await userDb.add_user(
                req.body.firstName,
                req.body.lastName,
                req.body.username,
                req.body.email,
                req.body.password
            );
            
            res.render('signup', {
                errors: null,
                success: true
            });

        } else {
            errors = [{
                value: req.body.username,
                msg: 'Username is taken',
                param: 'username',
                location: 'body'
            }];
            console.log(errors);

            return res.render("signup", {
                currentUser: req.session.theUser,
                errors: errors,
                success: false
            });
        }
    }
});

module.exports = router;