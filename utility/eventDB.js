var group = require("lodash"); //for grouping events.
var event = require("../models/event");
var eventModel = require("../models/event");

// Function to fetch all the user events.
var getUsereventList = async function (userId) {
  try {
      let result = await event.find({
          userId: userId
      });
      return result;
  } catch (error) {
      console.log("Error while getting all user events : " + error);
      return [];
  }
};

var getUserevent_month = async function (userId, month, year) {
  try {
      let result = await event.find({
          userId: userId,
          month: month,
          year: year
      });
      return result;
  } catch (error) {
      console.log("Error while getting all user events : " + error);
      return [];
  }
};

var getevent = async function getevent(budgetID) {
  try {
    let result = await eventModel.findOne({
      budgetId: budgetID
    });
    if (result != null) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error while getting single event : " + error);
    return null;
  }
};

var deleteEvent = async function (eventId) {
  const result = await eventModel.deleteOne({
    eventId: eventId
  });
  return result.n > 0 && result.ok == 1;
};

module.exports = {
  getevent: getevent,
  getUsereventList: getUsereventList,
  getUserevent_month: getUserevent_month,
  deleteEvent: deleteEvent
};