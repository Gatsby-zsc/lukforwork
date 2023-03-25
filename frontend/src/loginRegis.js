import { fetchPOST, fetchGET } from "./fetch.js";
import { errorPopup } from "./errorHandle.js";
import { renderHomePage } from "./feed.js";

// store user info to reuse later
function setUpUserName(userInfo) {
    localStorage.setItem(userInfo.id, userInfo.name);
    localStorage.setItem(userInfo.name, userInfo.id);
}

export function login() {
    const emailField = document.getElementById("email").value;
    const passwordField = document.getElementById("password").value;

    if (emailField === "" || passwordField === "") {
        errorPopup("Please input your email and password");
        return;
    }

    const successLogin = (data) => {
        if (localStorage.getItem("token") !== null) {
            // ensure the user logged in can access the data
            localStorage.removeItem("token", data.token);
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("loginUser", data.userId);
        fetchGET(
            `user?userId=${data.userId}`,
            setUpUserName,
            "error happens when logging"
        );
        renderHomePage();
    };

    fetchPOST(
        "auth/login",
        { email: emailField, password: passwordField },
        successLogin,
        "Invalid Email or Password."
    );
}

export function registration() {
    const userEmail = document.getElementById("regis-email").value;
    const userName = document.getElementById("regis-name").value;
    const userPassword = document.getElementById("regis-password").value;
    const confirmPassword = document.getElementById("password-confirm").value;
    if (userPassword !== confirmPassword) {
        errorPopup("Passwords do not match!");
        return;
    }

    if (userEmail === "") {
        errorPopup("Please enter your email!");
        return;
    }
    if (userName === "") {
        errorPopup("Please enter your user name!");
        return;
    }
    if (userPassword === "") {
        errorPopup("Please enter your password!");
        return;
    }

    const successRegister = (data) => {
        if (localStorage.getItem("token") !== null) {
            localStorage.removeItem("token", data.token);
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("loginUser", data.userId);
        fetchGET(
            `user?userId=${data.userId}`,
            setUpUserName,
            "error happens when log in"
        );
        document.getElementById("login").classList.add("Hidden");
        renderHomePage();
    };

    fetchPOST(
        "auth/register",
        { email: userEmail, password: userPassword, name: userName },
        successRegister,
        "Account exists or some infomation are not setup correctly"
    );
}

// sign in switch register
export function swap(page1, page2) {
    document.getElementById(page1).classList.add("Hidden");
    document.getElementById(page2).classList.remove("Hidden");
}
