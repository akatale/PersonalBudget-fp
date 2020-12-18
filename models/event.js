var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
    budgetId: {
        type: String,
        required: [true, "required"]
    },
    userId: {
        type: String,
        required: [true, "required"]
    },
    type: {
        type: String,
        required: [true, "required"]
    },
    amount: {
        type: Number,
        required: [true, "required"]
    },
    month: {
        type: String,
        required: [true, "required"]
    },
    year: {
        type: String,
        required: [true, "required"]
    }
});


module.exports = mongoose.model("budget", eventSchema);