import { fetchGET, fetchPUT } from "./fetch.js";
import { addEventForEachName, addEventForMyname } from "./viewProfile.js";
import { homeButton, updateProfileButton, searchBar } from "./topBar.js";

export function processCreatorId(creatorId, creatorName, creatorFollowers) {
  function getAllInfo(data) {
    localStorage.setItem(data.name, data.id);
    localStorage.setItem(data.id, data.name);
    creatorName.textContent = data.name;

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
  } else if (3_600_000 < timeStamp < 86_400_000) {
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

function processEachComment(comment, commentContent) {
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

function getNumberUserLikes(likeStr) {
  const processedStr = likeStr.split(" ");
  let currentNumber = Number(processedStr[1]);
  return currentNumber;
}

function getMemberLikeList(postInfoid) {
  let rawArr = localStorage.getItem(`${postInfoid} Member List`).split(" ");
  let retArr = [];
  for (const item of rawArr) {
    if (item !== "") {
      retArr.push(item);
    }
  }
  return retArr;
}

function removeUserFromLikes(loginUser, likeList, postInfoid) {
  let retStr = "";
  for (const item of likeList) {
    if (item !== loginUser) {
      retStr = retStr + " " + item;
    }
  }

  const likeMemberList = postInfoid + " Member List";
  localStorage.setItem(likeMemberList, retStr);
}

function addUserintoLikes(loginUser, likeList, postInfoid) {
  let retStr = "";
  retStr = retStr + " " + loginUser;
  for (const item of likeList) {
    retStr = retStr + " " + item;
  }

  const likeMemberList = postInfoid + " Member List";
  localStorage.setItem(likeMemberList, retStr);
}

function likeJob(likeButton, postInfo, jobLikes, likeUsers) {
  // request like this post to server
  const loginUser = localStorage.getItem("loginUser");
  const likeList = getMemberLikeList(postInfo.id);

  // initialize default field for like button
  if (likeList.includes(loginUser) === false) {
    likeButton.textContent = "Like";
  } else {
    likeButton.textContent = "Unlike";
  }

  likeButton.addEventListener("click", () => {
    const loginUser = localStorage.getItem("loginUser");
    const userName = localStorage.getItem(loginUser);
    const likeList = getMemberLikeList(postInfo.id);
    const userList = likeUsers.querySelectorAll("div");
    if (likeList.includes(loginUser) === true) {
      fetchPUT(
        "job/like",
        { id: postInfo.id, turnon: false },
        "Error happens when sending unlike request"
      );
      removeUserFromLikes(loginUser, likeList, postInfo.id);
      likeButton.textContent = "Like";
      let currentNumberUserLike = getNumberUserLikes(jobLikes.textContent) - 1;

      for (let item of userList) {
        if (item.childNodes[3].textContent == userName) {
          item.remove();
          // delete user who just like the post
        }
      }

      jobLikes.textContent = "Like: " + currentNumberUserLike;
    } else {
      fetchPUT(
        "job/like",
        { id: postInfo.id, turnon: true },
        "Error happens when sending like request"
      );
      addUserintoLikes(loginUser, likeList, postInfo.id);
      likeButton.textContent = "Unlike";
      let currentNumberUserLike = getNumberUserLikes(jobLikes.textContent) + 1;

      processUserLikes(userName, likeUsers);

      jobLikes.textContent = "Like: " + currentNumberUserLike;
    }
  });
}

function renderUserImge(imgNode, userId) {
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

export function renderEachPost(postInfo) {
  // render all information for each post
  let oldPost = document.getElementById("post-template");
  let newPost = oldPost.cloneNode(true);
  newPost.removeAttribute("id");
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

  const startDate = postContent.childNodes[3];
  startDate.textContent = "Start at " + analyzeTime(postInfo.start);

  const jobDescription = postContent.childNodes[5];
  jobDescription.textContent = postInfo.description;

  const jobImage = newPost.childNodes[5];
  jobImage.src = postInfo.image;

  const likeAndComment = newPost.childNodes[7];

  // like & comment
  const jobLikes = likeAndComment.childNodes[1].childNodes[1];
  jobLikes.textContent = "Likes: " + postInfo.likes.length;

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

  jobLikes.addEventListener("click", () => {
    const getPostUser = localStorage
      .getItem(postInfo.id.toString() + " Member List")
      .split(" ");

    if (getPostUser.length === 1) {
      // don't need to show like list
      return;
    }

    // implement a toggle to switch between hide and show
    if (likeUsers.classList.contains("Hidden")) {
      likeUsers.classList.remove("Hidden");
    } else {
      likeUsers.classList.add("Hidden");
    }
  });

  const jobComments = likeAndComment.childNodes[1].childNodes[3];
  jobComments.textContent = "Comments: " + postInfo.comments.length;

  const commentContent = likeAndComment.childNodes[5];
  for (const comment of postInfo.comments) {
    processEachComment(comment, commentContent);
  }

  jobComments.addEventListener("click", () => {
    // implement a toggle to switch between hide and show
    if (commentContent.classList.contains("Hidden")) {
      commentContent.classList.remove("Hidden");
    } else {
      commentContent.classList.add("Hidden");
    }
  });

  const functionSection = likeAndComment.childNodes[7];
  const likeButton = functionSection.childNodes[1];
  const secondButton = functionSection.childNodes[3];
  likeJob(likeButton, postInfo, jobLikes, likeUsers);

  addEventForEachName(newPost);
  document.getElementById("post").insertBefore(newPost, oldPost);
  // insert the newly created node ahead of template node each time
}

export function renderHomePage() {
  document.getElementById("login").classList.add("Hidden");
  document.getElementById("homepage").classList.remove("Hidden");
  const renderPost = (data) => {
    // render each post after we fetch 5 posts from server
    for (let item of data) {
      renderEachPost(item);
    }
  };

  // config search bar
  homeButton();
  updateProfileButton();
  searchBar();

  // config side bar
  addEventForMyname();

  let currentPage = localStorage.getItem("Page");
  localStorage.setItem("Page", Number(currentPage) + 5);
  // update page to retrieve next 5 Posts next time

  // infinite scroll

  fetchGET(
    `job/feed?start=${currentPage}`,
    renderPost,
    "error happen when render"
  );
}
