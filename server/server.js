const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { addUser, removeUser, getUser, getRoomUsers } = require("./entity");
const mongoose = require("mongoose");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

const mongo_uri =
  "mongodb+srv://dovizyorum:dovizyorum@cluster0.jlqcd.mongodb.net/bulutbilisim?retryWrites=true&w=majority";
mongoose.connect(mongo_uri, () => {
  console.log("veritabanı bağlantısı başarılı");
});
app.post("/chat", async (req, res, next) => {
  try {
    const { name, room } = req.query;
    const userExist = await Conversation.find({room,members:{$in:[name]}})
if(userExist.length>0){
  return res.status(200).json({
    message: "user already exist"
  });
}else{
  const chat = await Conversation.create({
    room,
    members: [name],
  });
}
    
  } catch (err) {
    next(err);
  }
});

app.post("/message", async (req, res) => {
  const { message, name, room } = req.query;

  const conversation = await Conversation.findOne({ room });
  if(!conversation){
    res.status(404).send("conversation not found");
  }
  const message_ = await Message.create({
    room,
    sender:name,
    message,
  });
  conversation.members.push(name);
  await conversation.save()

});

// Socket

io.on("connect", (socket) => {
  socket.on("join", ({ user, room }, callback) => {
    console.log(user, room);
    const { response, error } = addUser({
      id: socket.id,
      user: user,
      room: room,
    });

    console.log(response);

    if (error) {
      callback(error);
      return;
    }
    socket.join(response.room);
    socket.emit("message", {
      user: "Yönetici",
      text: `Hoşgeldin ${response.user} `,
    });
    socket.broadcast
      .to(response.room)
      .emit("message", {
        user: "Yönetici",
        text: `${response.user} sohbete katıldı.`,
      });

    io.to(response.room).emit("roomMembers", getRoomUsers(response.room));
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.user, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.user} has left`,
      });
    }
  });
});

server.listen(5000, () => console.log("Server başlatıldı port: 5000"));
