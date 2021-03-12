const path = require("path");
const express = require("express");
const app = express();
const http = require("http").Server(app);

// Сокет на http-сервер
const io = require("socket.io")(http);

// Раздаём статику
app.use(express.static(path.resolve(__dirname, "public")));

// Истроия пользователей
const chatHistory = [];

// Слушаем подключения
io.on("connection", (socket) => {
  socket.emit("user/connected", chatHistory);

  socket.on("chat/newMessage", (data) => {
    data = JSON.parse(data);

    const entry = {
      author: data.author,
      message: data.massage,
      timestamp: Date.now(),
    };

    chatHistory.push(entry);
    io.emit("chat/newMessage", entry);
  });
});

const port = process.env.PORT || 1000;
http.listen(port);