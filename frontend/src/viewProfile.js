// this file is for mileston4, related to how to render user profile
import { errorPopup } from "./errorHandle.js";
import { fetchGET, fetchPut } from "./fetch.js";
import { fileToDataUrl } from "./helpers.js";
import { analyzeTime } from "./feed.js";
import { delPost, modiPost } from "./addAndUpdateContent.js";

// copy and process the template
function getWatchingUser(userId, watchedList, newProfile) {
  const userNode = document
    .getElementById("like-user-template")
    .cloneNode(true);
  userNode.removeAttribute("id");
  userNode.classList.remove("Hidden");

  const userImgNode = userNode.childNodes[1];
  const userNameNode = userNode.childNodes[3];
  function suecessFecthUserId(data) {
    // get info of all user watching this profile
    localStorage.setItem(data.name, data.id);
    localStorage.setItem(data.id, data.name);
    userNameNode.textContent = data.name;
    if (data.image !== undefined) {
      userImgNode.src = data.image;
    } else {
      userImgNode.src = "./../sample-user.png";
    }
    watchedList.appendChild(userNode);

    // remove current profile to render an new profile
    userNameNode.addEventListener("click", () => {
      newProfile.remove();
      renderProfile(userNameNode.textContent);
    });
  }

  fetchGET(
    `user?userId=${userId}`,
    suecessFecthUserId,
    "error happens when fetching user info"
  );
}

// set up all user info
function processUserInfo(data, newProfile) {
  const userInfo = newProfile.childNodes[1];
  const userImg = userInfo.childNodes[1];
  // if user doesn't have img, replace with a sample img
  if (data.image !== undefined) {
    userImg.src = data.image;
  } else {
    userImg.src = "./../sample-user.png";
  }

  // process user info
  const userName = userInfo.childNodes[3];
  userName.textContent = "Name: " + data.name;

  const userId = userInfo.childNodes[5];
  userId.textContent = "Id: " + data.id;

  const userEmail = userInfo.childNodes[7];
  userEmail.textContent = "Email: " + data.email;

  const userWatchBy = userInfo.childNodes[9];
  userWatchBy.textContent = "Followers: " + data.watcheeUserIds.length;
}

// process all watch user
function processWatchList(data, newProfile) {
  const watchedList = newProfile.childNodes[1].childNodes[13];
  let watcheeListIds = data.watcheeUserIds;
  // update user info for each watching user
  for (const user of watcheeListIds) {
    getWatchingUser(user, watchedList, newProfile);
  }
}

// process watch button
function processWatchButton(data, newProfile) {
  const watchButton = newProfile.childNodes[1].childNodes[11];
  let watcheeListIds = data.watcheeUserIds;
  const myId = Number(localStorage.getItem("loginUser"));

  // set the default field of button to watch
  watchButton.textContent = "+ Follow";

  // check whether the current profile we view is our own profile
  if (data.id === myId) {
    // hide this button, since we cannot watch/unwatch ourselves
    watchButton.classList.add("Hidden");
  } else {
    // show button when we view other user profile
    watchButton.classList.remove("Hidden");
  }

  for (const id of watcheeListIds) {
    // initialise button field
    if (myId === id) {
      watchButton.textContent = "✔ Following";
    }
  }

  watchButton.addEventListener("click", () => {
    if (watchButton.textContent == "✔ Following") {
      // send put request to server
      fetchPut(
        "user/watch",
        { email: data.email, turnon: false },
        "error happens when sending Following request to server"
      );
      setTimeout(() => {
        newProfile.remove();
        renderProfile(data.name);
      }, 100);
    } else {
      // send put request to server
      fetchPut(
        "user/watch",
        { email: data.email, turnon: true },
        "error happens when sending watch request to server"
      );

      setTimeout(() => {
        newProfile.remove();
        renderProfile(data.name);
      }, 100);
    }
  });
}

// process each job
function processJob(data, newProfile) {
  const jobs = data.jobs;
  for (let job of jobs) {
    const newJob = document.createElement("div");
    newJob.classList.add("each-post");

    const newJobNode = document
      .getElementById("profile-post-template")
      .cloneNode(true);
    newJobNode.classList.remove("Hidden");

    // clone necessary node from post-template
    const PostContent = newJobNode.childNodes[1].cloneNode(true);
    const PostImg = newJobNode.childNodes[3].cloneNode(true);
    const postDel = newJobNode.childNodes[5].cloneNode(true);
    const postModi = newJobNode.childNodes[7].cloneNode(true);

    // Job-post-date
    PostContent.childNodes[1].textContent =
      "Post at: " + analyzeTime(job.createdAt);

    // Job-title
    PostContent.childNodes[3].textContent = job.title;

    // Start-date
    PostContent.childNodes[5].textContent =
      "Start at: " + analyzeTime(job.start);

    // Job-description
    PostContent.childNodes[7].textContent = job.description;

    // Job-image
    PostImg.src = job.image;

    newJob.append(PostContent);
    newJob.append(PostImg);

    // check we are the person to delete our own posts
    const myId = localStorage.getItem("loginUser");

    // do not show delete button and modify post button
    if (myId == job.creatorId) {
      newJob.append(postDel);
      delPost(job.id, postDel, newJob);
      newJob.append(postModi);
      modiPost(job.id, postModi);
    }

    // append new job to container
    newProfile.childNodes[3].append(newJob);
  }
}

export function renderProfile(userName) {
  function suecessFecthInfo(data) {
    // bug exists when jump and watch between different users
    // remove homepage and show profile
    document.getElementById("homepage-content").classList.add("Hidden");

    const newProfile = document.getElementById("profile-page").cloneNode(true);
    newProfile.classList.remove("Hidden");
    newProfile.removeAttribute("id");
    newProfile.setAttribute("id", "real-profile");
    // build a new profile from template profile

    processUserInfo(data, newProfile);
    processWatchList(data, newProfile);
    processWatchButton(data, newProfile);
    processJob(data, newProfile);

    document.getElementById("homepage").append(newProfile);
  }

  const userId = localStorage.getItem(userName);
  fetchGET(
    `user?userId=${userId}`,
    suecessFecthInfo,
    "error happens when render user profile"
  );
}

// config every element with User-name class name in post section
export function addEventForEachName(newPost) {
  const userArr = newPost.getElementsByClassName("User-name");
  for (const ele of userArr) {
    // add evenelister for each user name
    ele.addEventListener("click", () => {
      renderProfile(ele.textContent);
    });
  }
}

// config profile for element at side bar
export function addEventForMyname() {
  // config "my profile" of side bar to render my own profile
  const myProfile = document.getElementById("my-profile");
  myProfile.addEventListener("click", () => {
    const userId = localStorage.getItem("loginUser");
    const userName = localStorage.getItem(userId);
    renderProfile(userName);
  });

  const myName = document.getElementById("my-name");
  myName.addEventListener("click", () => {
    const userId = localStorage.getItem("loginUser");
    const userName = localStorage.getItem(userId);
    renderProfile(userName);
  });
}

// config update user profile button at top bar
export function updateProfile() {
  const updateProfileButton = document.getElementById("update-profile-button");
  const closeProfileButton = document.getElementById("close-upload-window");
  const uploadProfileButton = document.getElementById("upload-info");

  updateProfileButton.addEventListener("click", () => {
    // pop up update profile window
    const updateProfile = document.getElementById("update-profile");
    updateProfile.classList.remove("Hidden");

    // refresh content of all fields, to re-enter new info
    document.getElementById("new-eamil").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("new-name").value = "";
  });

  closeProfileButton.addEventListener("click", () => {
    // close update profile window
    const updateProfile = document.getElementById("update-profile");
    updateProfile.classList.add("Hidden");
  });

  uploadProfileButton.addEventListener("click", () => {
    // collect all new information for uploading
    const newEmail = document.getElementById("new-eamil").value;
    const newPassword = document.getElementById("new-password").value;
    const newName = document.getElementById("new-name").value;
    const newImg = document.querySelector('input[id="update-profile-button"]')
      .files[0];

    fileToDataUrl(newImg)
      .then((data) => {
        fetchPut(
          "user",
          {
            email: newEmail,
            password: newPassword,
            name: newName,
            image: data,
          },
          "error happens when upload uesr info"
        );
      })
      .then(() => {
        errorPopup("New info upload successfully!!!");
        // refresh all info after successfully upload
        document.getElementById("new-eamil").value = "";
        document.getElementById("new-password").value = "";
        document.getElementById("new-name").value = "";
        document.querySelector('input[id="update-profile-button"]').value = "";
      });
  });
}

// config search bar to watch specific user via email
export function watchUserByBar() {
  const watchUserButton = document.getElementById("watch-user");
  const searchBarDiv = document.getElementById("search-div");
  const searchBar = document.getElementById("search-bar");

  let valid = false;

  watchUserButton.addEventListener("click", () => {
    searchBarDiv.classList.remove("Hidden");
    valid = true;
  });

  window.addEventListener("click", () => {
    if (valid) {
      valid = false;
    } else {
      // everytime when we click outside of search bar, it will be reset and hiden
      searchBar.value = "";
      searchBarDiv.classList.add("Hidden");
    }
  });

  searchBar.addEventListener("click", () => {
    searchBarDiv.classList.remove("Hidden");
    valid = true;
  });

  searchBar.addEventListener("keydown", (key) => {
    // when we press enter on key board, the email we enter will be sent to server via PUT request
    if (key.code === "Enter") {
      const emailField = searchBar.value;
      if (emailField !== "") {
        fetchPut(
          "user/watch",
          { email: emailField, turnon: true },
          "error happens when watch user via email"
        );
      } else {
        errorPopup("please enter email for watching user");
      }
    }
  });
}
