const menu = document.getElementById("menu");
const nav = document.querySelector("nav.mobile");

if (menu) {
    menu.addEventListener("click", (e) => {
        if (!nav) {
            return;
        }

        if (nav.style.display == "block") {
            nav.style.display = "none";
            menu.querySelector("i.fa-bars").style.display = "inline";
            menu.querySelector("i.fa-x").style.display = "none";
        } else {
            nav.style.display = "block";
            menu.querySelector("i.fa-bars").style.display = "none";
            menu.querySelector("i.fa-x").style.display = "inline";

        }
    });
}

const loginButtons = document.querySelectorAll(
    ".login-btn"
);

const userMenus = document.querySelectorAll(
    ".user-menu"
);

const user = localStorage.getItem("account");

loginButtons.forEach((button) => {
    button.classList.toggle("is-logged-in", user ? true : false);
});

userMenus.forEach((menu) => {
    menu.classList.toggle("is-logged-in", user ? true : false);
    const data = JSON.parse(user);
    menu.querySelector("h5").textContent = `${user.firstName} ${user.lastName}`;
});