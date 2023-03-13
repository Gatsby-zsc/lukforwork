export function login() {
    // need to be modified later for fetch
    const eamilField = document.getElementById("email").value;
    console.log(eamilField);
    const passwordField = document.getElementById("password").value;
    console.log(passwordField);

    fetch(`http://localhost:5005/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
            email: "betty@email.com",
            password: "cardigan",
            // email: eamilField,
            // password: passwordField,
        }),
    })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((data) => {
            console.log(data.token);
            console.log(data.userId);
        })
        .catch(() => {
            errorPopup(
                "Your email and password don't match!!! Please try again"
            );
        });
}

export function registration() {
    console.log("hello world");
}

export function errorPopup(errorMessage = "error happens") {
    // for testing this function, please modify the predefined value in email/password field
    document.getElementById("error-message").textContent = errorMessage;
    const errorBox = document.getElementById("error-box");
    errorBox.classList.remove("hidden");
    const closeButton = document.getElementById("close-error-window");
    closeButton.addEventListener("click", () => {
        errorBox.classList.add("hidden");
    });
    // resume from error
}
