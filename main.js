const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('newuser', (user) => {
        socket.username = user;

        socket.emit('connection.success', ResponseMessage("Server", `안녕하세요 ${socket.username}님, 서버와 정상 연결 되었습니다.`));
        socket.broadcast.emit('connection.others', ResponseMessage("Server", `${socket.username}님이 입장 하셨습니다.`));
    });

    socket.on('send', (msg) => {
        io.emit("SendClient", ResponseMessage(socket.username, msg));
    });

    socket.on('uploadImage', (msg) => {
        io.emit("SendImage", ResponseMessage(socket.username, msg));
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit("connection.others", ResponseMessage("Server", `${socket.username} 님이 떠났습니다.`));
    });
});

function ResponseMessage(u, msg) {
    return { UserName: u, Message: msg, Time: new Date().toTimeString() };
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`앱이 ${port} 포트로 열렸습니다.`);
});

