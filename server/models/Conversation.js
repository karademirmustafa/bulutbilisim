const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    room : {type:String},
    members:{type:Array},


},{timestamps:true,versionKey:false})

const Conversation = mongoose.model("Conversation",ConversationSchema);

module.exports = Conversation;