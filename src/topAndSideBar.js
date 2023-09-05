import { updateProfile, watchUserByBar } from "./viewProfile.js";
import { renderUserImge } from "./feed.js";

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

export function updateProfileButton() {
  updateProfile();
}

export function searchBar() {
  watchUserByBar();
}

export function sideBar() {
  const myImg = document.getElementById("my-img");
  const userId = localStorage.getItem("loginUser");

  renderUserImge(myImg, userId);

  // wait for other asynchornise operation to set up local storage
  setTimeout(() => {
    const userName = localStorage.getItem(userId);
    const myName = document.getElementById("my-name");
    myName.textContent = userName;
  }, 50);
}
