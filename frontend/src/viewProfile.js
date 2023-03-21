// this file is for mileston4, related to how to render user profile
import { errorPopup } from "./error_handle.js";
import { fetchGET, fetchPUT } from "./fetch.js";
import { fileToDataUrl } from "./helpers.js";
import { analyzeTime } from "./feed.js";

export function getWatchingUser(userId, watchedList) {
  // copy and process the template
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
    userImgNode.src = data.image;
    watchedList.appendChild(userNode);

    // userNameNode.addEventListener("click", () => {
    //     renderProfile(userNameNode.textContent);
    // });
  }

  fetchGET(
    `user?userId=${userId}`,
    suecessFecthUserId,
    "error happens when fetching user info"
  );
}

export function clearWatchList() {
  // clear watching list to re-render next time
  const childList = document
    .getElementById("profile-watched-by-list")
    .querySelectorAll("div");

  for (let item of childList) {
    item.remove();
  }
}

export function processUserInfo(data) {
  // remove homepage and render profile page
  document.getElementById("profile-page").classList.remove("Hidden");
  document.getElementById("homepage-content").classList.add("Hidden");

  document.getElementById("profile-user-img").src = data.image;
  document.getElementById("profile-user-name").textContent = data.name;
  document.getElementById("profile-user-id").textContent = data.id;

  document.getElementById("profile-user-email").textContent = data.email;
  document.getElementById("profile-user-watched-by").textContent =
    "watched by " +
    data.watcheeUserIds.length +
    (data.watcheeUserIds.length <= 1 ? " user" : " users");
  // process user info

  clearWatchList();
  const watchedList = document.getElementById("profile-watched-by-list");

  let watcheeListIds = data.watcheeUserIds;
  // update user info for each watching user
  for (const user of watcheeListIds) {
    getWatchingUser(user, watchedList);
  }

  // check whether we have watched this user
  const myId = Number(localStorage.getItem("loginUser"));

  // set the default field of button to watch
  const watchButton = document.getElementById("watch-and-unwatch-user");
  watchButton.textContent = "watch";

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
      watchButton.textContent = "unwatch";
    }
  }

  // statr process jobs
}

// export function processCloseButton() {
//   // config button to close profile
//   const closeButton = document.getElementById("close-profile");

//   // remove profile page and render homepage
//   closeButton.addEventListener("click", () => {
//     document.getElementById("profile-page").classList.add("Hidden");
//     document.getElementById("homepage-content").classList.remove("Hidden");
//   });
// }

export function processWatchButton(data) {
  const watchButton = document.getElementById("watch-and-unwatch-user");
  let watcheeListIds = data.watcheeUserIds;
  const watchedList = document.getElementById("profile-watched-by-list");
  const myId = Number(localStorage.getItem("loginUser"));

  function myfunc() {
    // define this function so that we can delete the eventhandler later
    if (watchButton.textContent == "unwatch") {
      // we have watched this user
      watchButton.textContent = "watch";

      clearWatchList();
      const index = watcheeListIds.indexOf(myId);
      watcheeListIds.splice(index, 1);
      // delete our userId in watch list array

      for (const user of watcheeListIds) {
        getWatchingUser(user, watchedList);
      }

      // send put request to server
      fetchPUT(
        "user/watch",
        { email: data.email, turnon: false },
        "error happens when sending unwatch request to server"
      );
    } else {
      watchButton.textContent = "unwatch";
      watcheeListIds.push(myId);

      // re-render watch
      clearWatchList();
      for (const user of watcheeListIds) {
        getWatchingUser(user, watchedList);
      }

      // send put request to server
      fetchPUT(
        "user/watch",
        { email: data.email, turnon: true },
        "error happens when sending watch request to server"
      );
    }
  }
  // remove event listerner for previous profile
  watchButton.removeEventListener("click", myfunc);

  // add event listerner for current profile
  watchButton.addEventListener("click", myfunc);

  setTimeout(() => {
    // we need to set timeout to wait for asynchronous operation
    const watchedList = document
      .getElementById("profile-watched-by-list")
      .getElementsByClassName("User-name");

    for (let item of watchedList) {
      item.addEventListener("click", () => {
        watchButton.removeEventListener("click", myfunc);
        // we need to delete the original event handler for watch button, otherwise we will send to
        // request to server after we switch to another user
        renderProfile(item.textContent);
      });
    }
  }, 100);
}

export function processJob(data) {
  const jobs = data.jobs;
  for (let job of jobs) {
    const newJob = document.createElement("div");

    const newJobNode = document
      .getElementById("profile-post-template")
      .cloneNode(true);
    newJobNode.classList.remove("Hidden");

    const PostContent = newJobNode.childNodes[1].cloneNode(true);
    const PostImg = newJobNode.childNodes[3].cloneNode(true);
    // clone necessary node from post-template

    // Job-post-date
    PostContent.childNodes[1].textContent = analyzeTime(job.createdAt);

    // Job-title
    PostContent.childNodes[3].textContent = job.title;

    // Start-date
    PostContent.childNodes[5].textContent = analyzeTime(job.start);

    // Job-description
    PostContent.childNodes[7].textContent = job.description;

    // Job-image
    PostImg.src = job.image;

    newJob.append(PostContent);
    newJob.append(PostImg);

    document.getElementById("profile-jobs-info").append(newJob);
    // append new job to container
  }
}

export function renderProfile(userName) {
  function suecessFecthInfo(data) {
    // bug exists when jump and watch between different users
    processUserInfo(data);
    processJob(data);
    processWatchButton(data);
    // processCloseButton();
  }

  const userId = localStorage.getItem(userName);
  fetchGET(
    `user?userId=${userId}`,
    suecessFecthInfo,
    "error happens when render user profile"
  );
}

export function addEventForEachName(newPost) {
  const userArr = newPost.getElementsByClassName("User-name");
  for (const ele of userArr) {
    // add evenelister for each user name
    ele.addEventListener("click", () => {
      renderProfile(ele.textContent);
    });
  }
}

export function addEventForMyname() {
  // config "my profile" of side bar to render my own profile
  const myProfile = document.getElementById("my-profile");
  myProfile.addEventListener("click", () => {
    const myId = localStorage.getItem("loginUser");
    const myName = localStorage.getItem(myId);
    renderProfile(myName);
  });
}

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
    const newImg = document.querySelector('input[type="file"]').files[0];

    fileToDataUrl(newImg)
      .then((data) => {
        fetchPUT(
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
        document.querySelector('input[type="file"]').value = "";
      });
  });
}

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
        fetchPUT(
          "user/watch",
          { email: emailField, turnon: true },
          "error happens when watch user via email"
        );
      } else {
        alert("please enter email for watching user");
      }
    }
  });
}
