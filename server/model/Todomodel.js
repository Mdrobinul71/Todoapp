const mongoose = require("mongoose");

const TodomodelSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const Todomodel = mongoose.model("Todomodel", TodomodelSchema);
module.exports = Todomodel;
