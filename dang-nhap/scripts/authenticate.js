const username = document.getElementById("numberPhone");
const password = document.getElementById("password");
const form = document.querySelector(".Login__form");
const Lstatus=document.querySelector(".Login__form--status");
form.addEventListener("submit",function (event){
    event.preventDefault();
    const data=localStorage.getItem("khoa");
    const account=JSON.parse(data);
    if(account===null){
        Lstatus.textContent="No Account in Local Storage";
        return;
    }
    if(username.value===account.numberPhone && password.value === account.password){
        account.isLoggedIn=true;
        localStorage.setItem("khoa",JSON.stringify(account));
        Lstatus.style.color="green";
        Lstatus.textContent="Login Successful";
    }
    else{
        Lstatus.textContent="Account information not correct";
    }
})