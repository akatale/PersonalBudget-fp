
var event = require("../models/event");
var eventDb = require("./eventDB");

//User Profile related Operations:
var saveUserProfile = async function (user, usereventList) {
    let result;
    try {
        var newUserProfile = new UserProfile({
            userObject: user,
            userevents: usereventList
        });
        result = await newUserProfile.save();
        if (result == newUserProfile) {
            console.log("User profile Added");
            result = true;
        } else {
            console.log("User profile Adding failed");
            result = false;
        }
    } catch (error) {
        console.log("Error while saving User profile : " + error);
        result = false;
    }
    return result;
};


// Function to remove the event from the userevent list.
var removeUserevent = async function (budgetID, userId) {
    // ok: 1 if no errors occurred
    // deletedCount: the number of documents deleted
    try {
        var eventDetails = await eventDb.getevent(budgetID);
        const res = await event.deleteOne({
            budgetId: budgetID,
            userId: userId
        });
        console.log("event deleted.");

        return res.ok > 0 && res.deletedCount > 0;
    } catch (error) {
        console.log("Error while removing user event : " + error);
        return false;
    }
};


//Add a new event to DB
var addevent = async function (
    userId,
    cType,
    cAmount,
    cMonth,
    cYear
) {
    try {
        let randomId = Math.floor(Math.random() * Math.floor(100000000)); //Generate a 8 digit random Id for the event.
        var newevent = new event({
            budgetId: randomId,
            userId: userId,
            type: cType,
            amount: cAmount,
            month: cMonth,
            year: cYear
        });
        let result = await newevent.save();
        if (result == newevent) {
            console.log("Budget Added");
            return randomId;
        } else {
            console.log("Budget Adding failed");
        }
    } catch (error) {
        console.log("Error while saving budget : " + error);
    }
};

module.exports = {
    addevent: addevent,
    saveUserProfile: saveUserProfile,
    removeUserevent: removeUserevent
};