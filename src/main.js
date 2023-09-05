import { login, registration, swap } from "./loginRegis.js";

const signInButton = document.getElementById("sign-in-button");
const userEmail = localStorage.getItem("rememberUserEmail");
const userPassword = localStorage.getItem("rememberUserPassword");

// set up default email and password if we already click remember me last time we login
if (userEmail !== null || userPassword !== null) {
  document.getElementById("email").value = userEmail;
  document.getElementById("password").value = userPassword;
  document.getElementById("remember-me").checked = true;
}

// initialize local storage
localStorage.clear();
localStorage.setItem("Page", 0);

function checkRemember() {
  const rememberMeBtn = document.getElementById("remember-me");

  if (rememberMeBtn.checked) {
    // if checkbox is clicked, set the user email and password to localstroage
    localStorage.setItem(
      "rememberUserEmail",
      document.getElementById("email").value
    );
    localStorage.setItem(
      "rememberUserPassword",
      document.getElementById("password").value
    );
  }
}

signInButton.addEventListener("click", () => {
  checkRemember();
  login();
});

// when press Enter at login window, we dont't need to press login button
window.addEventListener("keydown", (key) => {
  const loginWindow = document.getElementById("login");
  if (key.code === "Enter" && !loginWindow.classList.contains("Hidden")) {
    checkRemember();
    login();
  }
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
