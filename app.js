const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

// Set view engine as EJS
app.set("view engine", "ejs");
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("connected");
    socket.on("send-location", (data) => {
        console.log("Location received:", data); // Added for debugging
        io.emit("receive-location", { id: socket.id, ...data });
    });
    socket.on("disconnect", function (){
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
