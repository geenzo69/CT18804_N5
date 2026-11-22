const menu = document.getElementById("menu");
const nav = document.querySelector(".nav-mobile");

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

const loginButtons = document.querySelectorAll(".login-btn");

const userMenus = document.querySelectorAll(".user-info");

const user = localStorage.getItem("account");

try {
    const parsed = JSON.parse(user);

    loginButtons.forEach((button) => {
        button.classList.toggle("is-logged-in", parsed.isLoggedIn ? true : false);
    });
    
    userMenus.forEach((menu) => {
        menu.classList.toggle("is-logged-in", parsed.isLoggedIn ? true : false);
        menu.querySelector("h5").textContent = `${parsed.firstName} ${parsed.lastName}`;
    });
} catch(err) {}