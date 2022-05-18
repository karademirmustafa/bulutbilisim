
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({

    room:{type:String,ref:"Conversation"},
    sender:{type:String},
    message:{type:String},
    message_time:{type:Date,default:Date.now()},
    
},{versionKey:false});

const Message = mongoose.model("Message",MessageSchema);

module.exports = Message;