$(document).ready(function () {
    var socket = io.connect("/");

    var userName = localStorage.getItem('username');
    var password = localStorage.getItem('password');

    if (!userName) {
        window.location.href = 'login.html'; 
    }

    socket.emit("newuser", userName);
    socket.emit("password", password);


    socket.on('connection.success', function (res) {
        $('#messages').append(`<li>${res.UserName}: ${res.Message}</li>`);
    });

    socket.on('connection.others', function (res) {
        $('#messages').append(`<li>${res.UserName}: ${res.Message}</li>`);
    });

    $('#btnSend').on('click', function () {
        var message = $('#txtInput').val().trim();
        if (message) {
            socket.emit("send", message);
        }
        $('#txtInput').val('').focus();
    });

    socket.on('SendClient', function (res) {
        $('#messages').append(`<li>${res.UserName}: ${res.Message}</li>`);
    });

    $('#dropbox').on('dragenter', (evt) => evt.preventDefault());
    $('#dropbox').on('dragover', (evt) => evt.preventDefault());

    $('#dropbox').on('drop', function (evt) {
        evt.preventDefault();
        var file = evt.originalEvent.dataTransfer.files[0];
        if (file.size > 1 * 1024 * 1024) {
            alert("1MB를 넘는 사진은 전송 불가능합니다");
            return;
        }
        if (file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg') {
            var reader = new FileReader();
            reader.onload = function (e) {
                socket.emit('uploadImage', e.target.result);
            }
            reader.readAsDataURL(file);
        } else {
            alert("파일의 타입이 맞지 않습니다.PNG, JPG, JPGE만 가능합니다");
        }
    });

    socket.on('SendImage', function (res) {
        var img = document.createElement('img');
        img.src = res.Message;
        var li = document.createElement('li');
        li.innerHTML = `${res.UserName}: `;
        li.innerHTML = `${res.password}: `;
        li.appendChild(img);
        $('#messages').append(li);
    });
});
