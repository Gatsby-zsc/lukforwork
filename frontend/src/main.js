import { BACKEND_PORT } from "./config.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from "./helpers.js";

import { login, registration, errorPopup, swap } from "./login_regis.js";

const signInButton = document.getElementById("sign-in-button");

signInButton.addEventListener("click", () => {
    login();
});

const registerButton = document.getElementById("register-button");
registerButton.addEventListener("click", () => {
    registration();
});

// sign in switch register
document.getElementById("switch-join-btn").addEventListener("click", () => {
    swap("login-interface", "registration-interface");
});

document.getElementById("switch-sign-btn").addEventListener("click", () => {
    swap("registration-interface", "login-interface");
});
