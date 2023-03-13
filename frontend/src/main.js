import { BACKEND_PORT } from "./config.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from "./helpers.js";

import { login, registration, errorPopup, swap } from "./login_regis.js";

let signInButton = document.getElementById("sign-in-button");

signInButton.addEventListener("click", () => {
  login();
});

// sign in switch register
document.getElementById("switch-join-btn").addEventListener("click", () => {
  swap("login-interface", "registration-interface");
});

document.getElementById("switch-sign-btn").addEventListener("click", () => {
  swap("registration-interface", "login-interface");
});
