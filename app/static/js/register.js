document.getElementById('registerForm').onsubmit = function (e) {
    console.log('注册按钮被点击');
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    var usernamePattern = /^[\u4e00-\u9fa5A-Za-z0-9_-][\u4e00-\u9fa5A-Za-z0-9_\u{1F600}-\u{1F64F}\u{2700}-\u{27BF}-]{1,31}$/u;
    var passwordPattern = /^[a-zA-Z0-9]{1,32}$/;

    if (!usernamePattern.test(username)) {
        document.getElementById('message_success').textContent = '';
        document.getElementById('message_error').textContent = '用户名只能包含字母、数字、下划线和连字符，长度为1-32个字符';
    }

    if(!passwordPattern.test(password)){
        document.getElementById('message_success').textContent = '';
        document.getElementById('message_error').textContent = '密码只能包含字母和数字，长度为1-32个字符';
    }

    if (password !== confirmPassword) {
        document.getElementById('message_success').textContent = '';
        document.getElementById('message_error').textContent = '两次输入的密码不一致';
        e.preventDefault();
        return false;
    }
    return true;
}