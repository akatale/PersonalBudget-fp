var group = require("lodash"); //for grouping events.
var User = require("../models/userModel");

var getUser = async function getUser(user_Id) {
  try {
    var result = await User.findOne({
      userId: user_Id
    });
    return result;
  } catch (error) {
    console.log("Error while getting user : " + error);
    return [];
  }
};

var getUserPassword = async function getUserPassword(username) {
  try {
    var result = await User.findOne({
      username: username
    });

    return result;
  } catch (error) {
    console.log("Error while getting user based on username: " + error);
    return [];
  }
};

var add_user = async function add_user(firstname,
  lastname,
  username,
  email,
  password
  ) {
  try {
    // var userId;
    var userId = await User.find({}, {
      userId: 1,
      _id: 0
    }).sort({
      userId: -1
    }).limit(1)
    console.log(userId);
    var newUser = new User({
      userId: userId[0].userId + 1,
      firstName: firstname,
      lastName: lastname,
      username: username,
      email: email,
      password: password
    });
    let result = await newUser.save();
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error while adding user: " + error);
    return false;
  }
};

var check_user = async function check_user(username) {
  try {
    var result = await User.findOne({
      username: username
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error while getting user based on username: " + error);
    return false;
  }
};




module.exports = {
  getUserPassword: getUserPassword,
  getUser: getUser,
  check_user: check_user,
  add_user: add_user
};