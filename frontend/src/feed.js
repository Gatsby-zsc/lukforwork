import { fetchGET, fetchPut } from "./fetch.js";
import { addEventForEachName, addEventForMyname } from "./viewProfile.js";

import {
  homeButton,
  updateProfileButton,
  searchBar,
  sideBar,
} from "./topAndSideBar.js";

import {
  makePost,
  makeComment,
  closePostWindow,
  updatePostButton,
} from "./addAndUpdateContent.js";

import { infiniteScroll, liveUpdate, pushNotification } from "./challenge.js";

export let jobsPerUser = {};

// we can't get creator name by "GET Job/feed", we need to send another request to get creator name
export function processCreatorId(creatorId, creatorName, creatorFollowers) {
  function getAllInfo(data) {
    // each name-id, id-name pair into localstorage, to reuse later
    localStorage.setItem(data.name, data.id);
    localStorage.setItem(data.id, data.name);
    creatorName.textContent = data.name;

    // update key-value pair into map
    jobsPerUser[data.id] = data.jobs.length;

    data.watcheeUserIds.length == 1
      ? (creatorFollowers.textContent =
          data.watcheeUserIds.length + " follower")
      : (creatorFollowers.textContent =
          data.watcheeUserIds.length + " followers");
  }

  fetchGET(
    `user?userId=${creatorId}`,
    getAllInfo,
    "error when getting cretator info"
  );
}

// parse time
export function analyzeTime(date) {
  const currentTime = Date.now();
  const postTime = Date.parse(date);
  const timeStamp = currentTime - postTime;

  if (timeStamp > 86_400_000) {
    // post 24 hours ago
    let retTime = new Date(postTime).toISOString();
    retTime = retTime.substring(0, 10).split("-");
    retTime = retTime[2] + "/" + retTime[1] + "/" + retTime[0];
    return retTime;
  } else if (timeStamp > 3_600_000 && timeStamp < 86_400_000) {
    // post within 24 hours
    const minutes = Math.trunc((timeStamp % 3_600_000) / 60_000);
    const hours = Math.trunc(timeStamp / 3_600_000);
    return hours + " hours " + minutes + " minutes ago";
  } else {
    // post within last 1 hour
    const minutes = Math.trunc((timeStamp % 3_600_000) / 60_000);
    return minutes + " minutes ago";
  }
}

// add user to like list
export function processUserLikes(user, likeUsers) {
  const userNode = document
    .getElementById("like-user-template")
    .cloneNode(true);
  userNode.removeAttribute("id");
  userNode.classList.remove("Hidden");

  const userImgNode = userNode.childNodes[1];
  const userNameNode = userNode.childNodes[3];

  const userId = localStorage.getItem(user);
  renderUserImge(userImgNode, userId);

  userNameNode.textContent = user;

  likeUsers.appendChild(userNode);
}

// add each comment into comment section of each post
export function processEachComment(comment, commentContent) {
  let commentNode = document.getElementById("comment-template").cloneNode(true);
  commentNode.removeAttribute("id");
  commentNode.classList.remove("Hidden");

  const userImgNode = commentNode.childNodes[1];
  const userId = localStorage.getItem(comment.userName);
  renderUserImge(userImgNode, userId);
  // add user img for each user
  commentNode.childNodes[3].childNodes[1].textContent = comment.userName;
  commentNode.childNodes[3].childNodes[3].textContent = comment.comment;
  commentContent.appendChild(commentNode);
}

// get number of user who like this post
export function getNumberUserLikes(likeStr) {
  const processedStr = likeStr.split(" ");
  let currentNumber = Number(processedStr[1]);
  return currentNumber;
}

// get list of users who like this post from local storage
export function getMemberLikeList(postInfoid) {
  let rawArr = localStorage.getItem(`${postInfoid} Member List`).split(" ");
  let retArr = [];
  for (const item of rawArr) {
    if (item !== "") {
      retArr.push(item);
    }
  }
  return retArr;
}

// remove the user from list and store back to local storage
export function removeUserFromLikes(loginUser, likeList, postInfoid) {
  let retStr = "";
  for (const item of likeList) {
    if (item !== loginUser) {
      retStr = retStr + " " + item;
    }
  }

  const likeMemberList = postInfoid + " Member List";
  localStorage.setItem(likeMemberList, retStr);
}

// add the user into list and store back to local storage
export function addUserintoLikes(loginUser, likeList, postInfoid) {
  let retStr = "";
  retStr = retStr + " " + loginUser;
  for (const item of likeList) {
    retStr = retStr + " " + item;
  }

  const likeMemberList = postInfoid + " Member List";
  localStorage.setItem(likeMemberList, retStr);
}

// change user according to like and unlike
function likeJob(likeButton, postInfo, numberOfLikes, likeUsers) {
  // request like this post to server
  const loginUser = localStorage.getItem("loginUser");
  const likeList = getMemberLikeList(postInfo.id);

  // initialize default field for like button
  if (!likeList.includes(loginUser)) {
    likeButton.textContent = "Like";
  } else {
    likeButton.textContent = "Unlike";
  }

  likeButton.addEventListener("click", () => {
    const loginUser = localStorage.getItem("loginUser");
    const userName = localStorage.getItem(loginUser);
    const likeList = getMemberLikeList(postInfo.id);
    const userList = likeUsers.querySelectorAll("div");
    if (likeList.includes(loginUser)) {
      fetchPut(
        "job/like",
        { id: postInfo.id, turnon: false },
        "Error happens when sending unlike request"
      );
      removeUserFromLikes(loginUser, likeList, postInfo.id);
      likeButton.textContent = "Like";
      let currentNumberUserLike =
        getNumberUserLikes(numberOfLikes.textContent) - 1;

      for (let item of userList) {
        if (item.childNodes[3].textContent == userName) {
          item.remove();
          // delete user who just like the post
        }
      }

      numberOfLikes.textContent = "Likes: " + currentNumberUserLike;
    } else {
      fetchPut(
        "job/like",
        { id: postInfo.id, turnon: true },
        "Error happens when sending like request"
      );
      addUserintoLikes(loginUser, likeList, postInfo.id);
      likeButton.textContent = "Unlike";
      let currentNumberUserLike =
        getNumberUserLikes(numberOfLikes.textContent) + 1;

      processUserLikes(userName, likeUsers);

      numberOfLikes.textContent = "Likes: " + currentNumberUserLike;
    }
  });
}

// if user didn't upload their image, we set a deault image for them
export function renderUserImge(imgNode, userId) {
  function successFetchImg(data) {
    if (data.image !== undefined) {
      imgNode.src = data.image;
    } else {
      imgNode.src = "./../sample-user.png";
    }
  }

  fetchGET(
    `user?userId=${userId}`,
    successFetchImg,
    "error happens when fetch user img"
  );
}

// render all information for each post
function renderEachPost(postInfo) {
  // create an new node and delete the id attribute
  let oldPost = document.getElementById("post-template");
  let newPost = oldPost.cloneNode(true);
  newPost.removeAttribute("id");
  let liTem = document.getElementById("li-template");
  let newLi = liTem.cloneNode(true);
  newLi.removeAttribute("id");
  newLi.classList.remove("Hidden");

  const creatorContent = newPost.childNodes[1];
  const postContent = newPost.childNodes[3];

  const creatorImg = creatorContent.childNodes[1];
  renderUserImge(creatorImg, postInfo.creatorId);

  const creatorName = creatorContent.childNodes[3].childNodes[1];
  creatorName.classList.add("User-name");

  const followers = creatorContent.childNodes[3].childNodes[3];
  processCreatorId(postInfo.creatorId, creatorName, followers);

  const postDate = creatorContent.childNodes[3].childNodes[5];
  postDate.textContent = analyzeTime(postInfo.createdAt);

  const jobTitle = postContent.childNodes[1];
  jobTitle.textContent = postInfo.title;

  // News --->
  const newLiTitle = newLi.childNodes[1];
  newLiTitle.textContent = postInfo.title;
  const newLiDate = newLi.childNodes[3];
  newLiDate.textContent = analyzeTime(postInfo.createdAt);
  document.getElementById("work-news").insertBefore(newLi, liTem);
  // <---

  const startDate = postContent.childNodes[3];
  startDate.textContent = "Start at " + analyzeTime(postInfo.start);

  const jobDescription = postContent.childNodes[5];
  jobDescription.textContent = postInfo.description;

  // image of this job
  const jobImage = newPost.childNodes[5];
  jobImage.src = postInfo.image;

  const likeAndComment = newPost.childNodes[7];

  // like & comment
  // number of users who like this post
  const numberOfLikes = likeAndComment.childNodes[1].childNodes[1];
  numberOfLikes.textContent = "Likes: " + postInfo.likes.length;

  // list of users who like this post
  const likeUsers = likeAndComment.childNodes[3];
  let userStr = "";
  for (const user of postInfo.likes) {
    userStr = userStr + " " + user.userId;
    localStorage.setItem(user.userName, user.userId);
    localStorage.setItem(user.userId, user.userName);
    processUserLikes(user.userName, likeUsers);
  }
  const likeMemberList = postInfo.id + " Member List";
  localStorage.setItem(likeMemberList, userStr);

  // implement a toggle to switch between hide and show
  numberOfLikes.addEventListener("click", () => {
    if (likeUsers.classList.contains("Hidden")) {
      likeUsers.classList.remove("Hidden");
    } else {
      likeUsers.classList.add("Hidden");
    }
  });

  // number of comments on this post
  const numberOfComments = likeAndComment.childNodes[1].childNodes[3];
  numberOfComments.textContent = "Comments: " + postInfo.comments.length;

  // list of comments made by different user
  const commentContent = likeAndComment.childNodes[5];
  for (const comment of postInfo.comments) {
    processEachComment(comment, commentContent);
  }

  // implement a toggle to switch between hide and show
  numberOfComments.addEventListener("click", () => {
    if (commentContent.classList.contains("Hidden")) {
      commentContent.classList.remove("Hidden");
    } else {
      commentContent.classList.add("Hidden");
    }
  });

  // likes and comment button
  const functionSection = likeAndComment.childNodes[7];
  const likeButton = functionSection.childNodes[1];
  const commentBtn = functionSection.childNodes[3];

  commentBtn.addEventListener("click", () => {
    const commentDiv = document.getElementById("make-comment");
    commentDiv.classList.remove("Hidden");
    document.getElementById("new-comment").value = "";
    makeComment(postInfo.id, commentDiv);
  });

  // At local page (i.e ignoring polling the request from server to check the latest infomation)
  // we directly modify the number of users who like this post each time we press the like button
  // and it will immediately send PUT request to server
  likeJob(likeButton, postInfo, numberOfLikes, likeUsers);

  // live update "likes" and "comments" by polling server
  liveUpdate(
    likeButton,
    postInfo,
    numberOfLikes,
    likeUsers,
    numberOfComments,
    commentContent
  );

  // process every name in this post so that we can view their profile when we click their name
  addEventForEachName(newPost);

  document.getElementById("post").insertBefore(newPost, oldPost);
  // insert the newly created node ahead of template node each time
}

// render each post after we fetch 5 posts from server
export function renderPost(data) {
  for (let item of data) {
    renderEachPost(item);
  }
}

// render all elements in homepage
export function renderHomePage() {
  document.getElementById("login").classList.add("Hidden");
  document.getElementById("homepage").classList.remove("Hidden");

  // config search bar
  homeButton();
  updateProfileButton();
  searchBar();

  // config make post&comment button
  makePost();
  // make new post div
  const myImg = document.getElementById("post-head-pic");
  const userId = localStorage.getItem("loginUser");
  renderUserImge(myImg, userId);
  console.log(userId);

  closePostWindow();
  updatePostButton();

  // config side bar
  addEventForMyname();
  sideBar();

  // infinite scroll of milestone 6
  window.addEventListener("scroll", infiniteScroll);
  pushNotification();

  // update page to retrieve next 5 Posts next time
  let currentPage = localStorage.getItem("Page");
  localStorage.setItem("Page", Number(currentPage) + 5);

  fetchGET(
    `job/feed?start=${currentPage}`,
    renderPost,
    "error happen when render posts"
  );
}
