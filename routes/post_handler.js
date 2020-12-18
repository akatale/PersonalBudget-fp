//This file is being used to handle all the post request (RSVP, Update, Delete Buttons)

var express = require('express');
var router1 = express.Router();
var bodyParser = require("body-parser");

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
var eventDb = require("../utility/eventDB");
var userDb = require("../utility/userDB");
var userProfile = require("../utility/UserProfileDB");
var userModel = require("../models/userModel");

var compression = require('compression');

router1.use(compression());

router1.post("/", urlencodedParser, async function (req, res) {
    
    // Check if the action is an update request.
    if (req.body.update) {
        if (req.session.theUser) {
            var eventData = await eventDb.getevent(req.body.update);
            if (eventData) {
                res.render("event.ejs", {
                    eventDetails: eventData,
                    currentUser: req.session.theUser
                });

                // if the eventId is not found in the Database, return fault page.
            } else {
                res.render("fault.ejs", {
                    currentUser: req.session.theUser
                });
            }
        } else {
            res.render("login_fault.ejs", {
                currentUser: ""
            });
            // res.render('login');
        }

        // Check if the action is delete request.
    } else if (req.body.delete) {
        if (req.session.theUser) {
            var eventData = await eventDb.getevent(req.body.delete);
            if (eventData) {
                await userProfile.removeUserevent(req.body.delete, req.session.theUser.userId);
                var savedevents = await eventDb.getUsereventList(req.session.theUser.userId);
                
                res.render("savedevents.ejs", {
                    savedevents: savedevents,
                    currentUser: req.session.theUser
                });
            }
        } else {
            res.render("login_fault.ejs", {
                currentUser: ""
            });
            // res.render('login');
        }

        // Check if the action is RSVP request.
    } else {
        res.render("savedevents.ejs", {
            savedevents: savedevents,
            currentUser: req.session.theUser
        });
    }

});


module.exports = router1;