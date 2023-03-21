export function homeButton() {
  const homeButton = document.getElementById("home-button");

  homeButton.addEventListener("click", () => {
    const homePage = document.getElementById("homepage-content").classList;
    if (homePage.contains("Hidden") === true) {
      homePage.remove("Hidden");
    }

    const profilePage = document.getElementById("profile-page").classList;
    if (profilePage.contains("Hidden") === false) {
      profilePage.add("Hidden");
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

// export function updateProfileButton();
