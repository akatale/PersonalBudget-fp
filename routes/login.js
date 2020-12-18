const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
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
// var userProfile = require("../utility/UserProfileDB");
// var userModel = require("../models/userModel");
const { JsonWebTokenError } = require('jsonwebtoken');

var compression = require('compression');

router.use(compression());
//ADD
const secretKey = 'My super secret key';
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

//END
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

// To handle the GET request for Login.
router.get('/', function (req, res) {
    if (req.session.theUser == null) {
        res.render('login', {
            errors: null
        });
    } else {
        res.render('index', {
            currentUser: req.session.theUser
        });
    }
});

// To handle the POST request for Login.
router.post("/", urlencodedParser, [
    // Username must be consist of alphanumerics and at least 4 chars long.
    // check('username').isAlphanumeric().withMessage('Username field must consists of alphabetical chars')
    // .isLength({
    //     min: 4
    // }).withMessage("Username field must be 4 or more characters")
    // .not().isEmpty().withMessage('Username  Value Cannot be left blank'),
    // // Password must be consist of alphanumerics and at least 6 chars long.
    // check('password').isAlphanumeric().withMessage('Password field must consists of alphabetical chars')
    // .isLength({
    //     min: 6
    // }).withMessage("Password field must be 6 or more characters")
    // .not().isEmpty().withMessage('Username  Value Cannot be left blank')
], async function (req, res) {


    if (req.session.theUser == null) {

        //check for login validation errors.
        var login_errors = validationResult(req);
        if (!login_errors.isEmpty()) {

            console.log(login_errors.array());

            return res.render("login", {
                currentUser: req.session.theUser,
                errors: login_errors.array()
            });

        } else {
            //check if the username exists in the DB.
            var valid_user = await userDb.check_user(req.body.username);

            if (valid_user) {

                var userdetails = await userDb.getUserPassword(req.body.username); // Fetch a user details with username.

                if (userdetails) {

                    //match the password for the user
                    if (req.body.password == userdetails.password) {
                        
                        //ADD
                        token = await jwt.sign({username: req.body.username}, secretKey, {expiresIn: '2000'});
                        var tokenDetails = {
                            success: true,
                            err: null,
                            token
                        };

                        //END
                        // load the user details in the session
                        req.session.theUser = userdetails;

                        //fetch the saved events from DB
                        // var savedevents = await usereventDb.getUsereventList(
                            var savedevents = await eventDb.getUsereventList(
                            req.session.theUser.userId
                        );

                        // Add the list of saved events to the session object as "currentProfile".
                        req.session.currentProfile = []
                        savedevents.forEach(value => {
                            req.session.currentProfile.push({
                                ...value.eventObject,
                                ...{
                                    rsvp: value.rsvp
                                }
                            });
                        });

                        var userProfile = await usereventDb.saveUserProfile(
                            req.session.theUser,
                            savedevents
                        );
                        if (userProfile) {

                            req.session.userProfile = userProfile;
                        }
                        
                        

                        res.render("savedevents.ejs", {
                            savedevents: savedevents,
                            currentUser: req.session.theUser,
                            token:tokenDetails
                        });
                    } else {
                        errors = [{
                            value: "",
                            msg: 'Invalid Password',
                            param: 'password',
                            location: 'body'
                        }];
                        console.log(errors);

                        return res.render("login", {
                            currentUser: req.session.theUser,
                            errors: errors
                            
                        });
                    }
                }
            } else {
                errors = [{
                    value: req.body.username,
                    msg: 'Invalid Username',
                    param: 'username',
                    location: 'body'
                }];
                console.log(errors);

                return res.render("login", {
                    currentUser: req.session.theUser,
                    errors: errors
                });
            }
        }

    }
});


//To handle GET request for saved events
router.get("/savedevents", async function (req, res) {

    if (req.session.theUser) {

        var savedevents = await eventDb.getUsereventList(
            req.session.theUser.userId
        );
        // console.log(savedevents);
        res.render("savedevents.ejs", {
            savedevents: savedevents,
            currentUser: req.session.theUser
        });
    } else {
        res.render("login_fault.ejs", {
            currentUser: ""
        });
        // res.render('login');
    }
});


router.get("/dashboard", async function (req, res) {

    if (req.session.theUser) {
        var budgetdetails = await eventDb.getUsereventList(req.session.theUser.userId);
        if (budgetdetails) 
        {
            var dataSource = {
                datasets: [
                    {
                        data: [],
                        backgroundColor: [
                            '#ffcd56',
                            '#ff6384',
                            '#36a2eb',
                            '#fd6b19',
                            'green',
                            'violet',
                            'black',
                            'brown',
                            'pink',
                            'gray',
                        ],
                    }
                ],
                labels: []
            };

            dataSource.labels = budgetdetails.map(value => value.type)
            budgetdetails.forEach(value => {
                dataSource.datasets[0].data.push(value.amount)
            });
        
        }
        res.render("dashboard.ejs", {
            currentUser: req.session.theUser,
            dataSource: dataSource,
            month: " ",
            year: " "
        });
    } else {
        res.render("login_fault.ejs", {
            currentUser: ""
        });
    }
});

//ADD
router.post("/dashboard", urlencodedParser, [

    check('Month').custom((value) => {
        return true;
    }),

    check('Year').custom((value) => {
        return true;
    })
], async function (req, res) {

    if (req.session.theUser) {
        var month = req.body.Month;
        var year = req.body.Year;
        var budgetdetails = await eventDb.getUserevent_month(req.session.theUser.userId, month, year);
        if (budgetdetails) 
        {
            var dataSource = {
                datasets: [
                    {
                        data: [],
                        backgroundColor: [
                            '#ffcd56',
                            '#ff6384',
                            '#36a2eb',
                            '#fd6b19',
                            'green',
                            'violet',
                            'black',
                            'brown',
                            'pink',
                            'gray',
                        ],
                    }
                ],
                labels: []
            };

            dataSource.labels = budgetdetails.map(value => value.type)
            budgetdetails.forEach(value => {
                dataSource.datasets[0].data.push(value.amount)
            });
        
        }
        res.render("dashboard.ejs", {
            currentUser: req.session.theUser,
            dataSource: dataSource,
            month: month,
            year: year
        });
        
    }
});
//END

// To handle the sign-out request by user.
router.get("/signout", async function (req, res) {

    req.session.destroy();

    res.render('index', {
        currentUser: ""
    });

});

module.exports = router;
