const mongoose = require("mongoose");

const blackListSchema = mongoose.Schema({
    tokens: { type: [String], required: true }
});

const BlackListModel = mongoose.model("BlackList", blackListSchema);

module.exports = BlackListModel;
