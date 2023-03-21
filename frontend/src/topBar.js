import { updateProfile, watchUserByBar } from "./viewProfile.js";

export function homeButton() {
  const homeButton = document.getElementById("home-button");

  homeButton.addEventListener("click", () => {
    const homePage = document.getElementById("homepage-content").classList;
    if (homePage.contains("Hidden") === true) {
      homePage.remove("Hidden");
    }

    const profilePage = document.getElementById("real-profile");
    // need to delete whole real profile instead of hiding it
    if (profilePage) {
      profilePage.remove();
    }

    const updateProfilePage =
      document.getElementById("update-profile").classList;
    if (updateProfilePage.contains("Hidden") === false) {
      updateProfilePage.add("Hidden");
    }
  });
}

// export function networkButton();

// export function jobsButton();

export function updateProfileButton() {
  updateProfile();
}

export function searchBar() {
  watchUserByBar();
}
