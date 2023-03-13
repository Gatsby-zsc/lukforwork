import { BACKEND_PORT } from "./config.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from "./helpers.js";

import { login, registration, errorPopup } from "./login_regis.js";

let signInButton = document.getElementById("sign-in-button");

signInButton.addEventListener("click", () => {
    login();
});
