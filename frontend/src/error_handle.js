export function errorPopup(errorMessage = "error happens") {
  // for testing this function, please modify the predefined value in email/password field
  document.getElementById("error-message").textContent = errorMessage;
  const errorBox = document.getElementById("error-box");
  errorBox.classList.remove("Hidden");
  const closeButton = document.getElementById("close-error-window");
  closeButton.addEventListener("click", () => {
    errorBox.classList.add("Hidden");
  });
  // resume from error
}
