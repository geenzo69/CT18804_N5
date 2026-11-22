const username = document.getElementById("numberPhone");
const password = document.getElementById("password");
const form = document.querySelector(".Login__form");
const Lstatus=document.querySelector(".Login__form--status");
form.addEventListener("submit",function (event){
    event.preventDefault();
    const data=localStorage.getItem("account");
    const account=JSON.parse(data);
    if(account===null){
        Lstatus.textContent="No Account in Local Storage";
        return;
    }
    if(username.value===account.numberPhone && password.value === account.password){
        account.isLoggedIn=true;
        localStorage.setItem("account",JSON.stringify(account));
        Lstatus.style.color="green";
        Lstatus.textContent="Login Successful";
        setTimeout(function () {
            window.location.href = "/";
        }, 1500);
    }
    else{
        Lstatus.textContent="Account information not correct";
    }
})