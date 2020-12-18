/*
This file is used for managing the routes to the event page. 
*/
var express = require('express');
var router1 = express.Router();
var moment = require("moment");
var bodyParser = require("body-parser");
var validator = require('validator');

var compression = require('compression');

router1.use(compression());

const {
    check,
    validationResult
} = require('express-validator');
var eventDb = require("../utility/eventDB");
var userDb = require("../utility/userDB");
var userProfileDb = require("../utility/UserProfileDB");


var urlencodedParser = bodyParser.urlencoded({
    extended: false
});


router1.get("/", async function (req, res) {

    // Check if the eventId is passed in the req query and if the passed eventId is valid.
    if (validator.isNumeric(req.query.eventId)) {

        var eventData = await eventDb.getevent(
            req.query.eventId
        );

        if (eventData) {
            res.render("event.ejs", {
                eventDetails: eventData,
                currentUser: req.session.theUser
            });

            // if the eventId is not found in the Database , return fault page.
        } else {
            res.render("fault.ejs", {
                currentUser: req.session.theUser
            });
        }

        // If eventId is not passed in the req query or event Id did not pass the validation, render all the events.
    } else {
        
    }
});

router1.get("/newevent", async function (req, res) {

    if (req.session.theUser) {
        res.render("newevent.ejs", {
            currentUser: req.session.theUser,
            errors: null
        });

    } else {
        res.render("login_fault.ejs", {
            currentUser: ""
        });

    }
});

router1.post("/newevent", urlencodedParser, [

    check('Type').custom((value) => {
        if (!value.split(' ').every(function (word) {
                return validator.isAlphanumeric(word);
            })) {

            throw new Error('Type field must consists of alphabetical chars.')
            return false;
        }
        return true;
    }).not().isEmpty().withMessage('Type Value Cannot be left blank'),

    check('Amount').custom((value) => {
        if (!value.split(' ').every(function (word) {
                return validator.isNumeric(word);
            })) {

            throw new Error('Amount field must consists of numerical values')
            return false;
        }
        return true;
    }).not().isEmpty().withMessage('Amount Value Cannot be left blank')

], async function (req, res) {

    if (req.session.theUser) {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.render("newevent.ejs", {
                currentUser: req.session.theUser,
                errors: errors.array()
            });

        } else {
            
            var host = String(req.session.theUser.firstName + " " + req.session.theUser.lastName);
            if (req.session.theUser.isAdmin){
                await userProfileDb.addevent(req.session.theUser.userId,
                    req.body.Type,
                    req.body.Amount,
                    req.body.Month,
                    req.body.Year,
                );
            }else{
                await userProfileDb.addevent(req.session.theUser.userId,
                    req.body.Type,
                    req.body.Amount,
                    req.body.Month,
                    req.body.Year
                );
            }
            
            var savedevents = await eventDb.getUsereventList(req.session.theUser.userId);
        
            if (savedevents) {
                res.render("savedevents.ejs", {
                    savedevents: savedevents,
                    currentUser: req.session.theUser,
                });
            } else {
                res.render("Error fetching savedevents")
            }
        }

    } else {
        res.render("login_fault.ejs", {
            currentUser: ""
        });

    }
});

module.exports = router1;