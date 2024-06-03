// login.js
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;


    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    window.location.href = 'index.html';
});
