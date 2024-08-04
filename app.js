const express = require('express');
const app = express();

const http = require("http");
const path = require("path");
const socketio = require('socket.io');

const server = http.createServer(app);

const io = socketio(server);

app.set("view engine" , "ejs");

app.set(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket){
    socket.on("send-location", function(data){
        io.emit("receive-location", {id: socket.id, ...data});
    });
    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id);
    });
    console.log("Connected");
})

app.use('/css', express.static(path.join(__dirname, 'public/css'), {
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.css')) {
        res.set('Content-Type', 'text/css');
      }
    }
  }));
  
app.use('/js', express.static(path.join(__dirname, 'public/js'), {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));


app.get("/", (req, res) => {
    res.render("index");
})

server.listen(3000);