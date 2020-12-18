var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: [true, "UserId is mandatory to enter"]
    },

    firstName: {
        type: String,
        required: [true, "First name is mandatory to enter"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is mandatory to enter"]
    },
    username: String,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        required: [true],
        default: false
    }
});

module.exports = mongoose.model("User", userSchema);