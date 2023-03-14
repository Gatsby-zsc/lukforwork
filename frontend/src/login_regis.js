import { fetch_request } from "./fetch.js";
import { errorPopup } from "./error_handle.js";

export function login() {
    // need to be modified later for fetch
    const eamilField = document.getElementById("email").value;
    console.log(eamilField);
    const passwordField = document.getElementById("password").value;
    console.log(passwordField);

    const successLogin = (data) => {
        console.log(data.token);
        console.log(data.userId);
        document.getElementById("login-interface").classList.add("hidden");
    };

    fetch_request(
        "auth/login",
        "POST",
        { email: "betty@email.com", password: "cardigan" },
        successLogin,
        "Your email and password don't match!!! Please try again"
    );
}

export function registration() {
    const userEmail = document.getElementById("regis-email").value;
    const userName = document.getElementById("regis-name").value;
    const userPassword = document.getElementById("regis-password").value;
    const confirmPassword = document.getElementById("password-confirm").value;
    if (userPassword !== confirmPassword) {
        errorPopup("Your two passwords don't match!!! Please try again");
        return;
    }

    const successRegister = (data) => {
        console.log(data.token);
        console.log(data.userId);
        document.getElementById("login-interface").classList.add("hidden");
    };

    fetch_request(
        "auth/register",
        "POST",
        { email: userEmail, password: userPassword, name: userName },
        successRegister,
        "Invalid input"
    );
}

// sign in switch register
export function swap(page1, page2) {
    document.getElementById(page1).classList.add("hidden");
    document.getElementById(page2).classList.remove("hidden");
}
