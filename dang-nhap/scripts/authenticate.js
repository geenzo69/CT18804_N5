// B2404889 - Bùi Lê Quang Vinh
const username = document.getElementById("numberPhone");
const password = document.getElementById("password");
const form = document.querySelector(".login__form");
const Lstatus = document.querySelector(".login__status");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = localStorage.getItem("account");
    const account = JSON.parse(data);

    if (account == null) {
        Lstatus.textContent = "Mật khẩu hoặc tài khoản bị sai!";
        return;
    }

    if (username.value == account.numberPhone && password.value == account.password) {
        account.isLoggedIn = true;
        localStorage.setItem("account", JSON.stringify(account));
        Lstatus.style.color = "green";
        Lstatus.textContent = "Đăng nhập thành công";
        setTimeout(function () {
            window.location.href = "/";
        }, 1500);
    }
    else {
        Lstatus.textContent = "Mật khẩu hoặc tài khoản bị sai!";
    }
})