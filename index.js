var app = require("express")();
var http = require("http").createServer(app);
var io = require('socket.io')(http);
let question = {};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/admin.html");
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('setQuestion', (data) => {
        question = JSON.parse(data);
        console.log('setQuestion: ', question);
        io.emit('start', question);
    });
    socket.on('answer', (response) => {
        console.log('answer: ', response);
        question.options[+response].answer += 1;
        io.emit('stats', question);
    });
});
http.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});
