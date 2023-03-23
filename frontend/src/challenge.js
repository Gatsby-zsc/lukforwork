import { fetchGET } from "./fetch.js";
import {
  renderPost,
  jobsPerUser,
  processUserLikes,
  processEachComment,
} from "./feed.js";
import { errorPopup } from "./errorHandle.js";
import { addEventForEachName } from "./viewProfile.js";

let valid = true;

// immediately send request to server to get next 5 posts each time we reach the end of page
export function infiniteScroll() {
  if (!valid) {
    // pervent trigger this event multiples times
    return;
  }

  const firstPos = window.innerHeight + window.pageYOffset;
  setTimeout(() => {
    // wait a short period to check the difference of two positions,
    // we only render next 5 posts when we scroll down
    const secondPos = window.innerHeight + window.pageYOffset;

    if (firstPos > secondPos) {
      // scroll up from the bottom of the page, should not send request
      // to get a better performance
      return;
    }
  }, 10);

  // if we are not in homepage, we cannot send request
  if (
    document.getElementById("homepage-content").classList.contains("Hidden")
  ) {
    return;
  }

  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  if (endOfPage && valid) {
    let currentPage = localStorage.getItem("Page");
    localStorage.setItem("Page", Number(currentPage) + 5);

    // request next 5 posts
    fetchGET(
      `job/feed?start=${currentPage}`,
      renderPost,
      "error happen when render posts"
    );
    valid = false;

    setTimeout(() => {
      // set back to true, so that we can render next 5 posts next time we get to the end of page
      valid = true;
    }, 1000);
  }
}

// modify each like of like list
function processLikes(likeButton, numberOfLikes, likeUsers, data, postId) {
  // get list of job
  const jobs = data.jobs;

  for (const job of jobs) {
    // find the corresponding job
    if (Number(job.id) === Number(postId)) {
      const listOfLikes = job.likes;

      // refresh list on local storage and prepare to prcoess user list
      let userArr = [];
      let listOfUser = "";

      for (const user of listOfLikes) {
        listOfUser += user.userId.toString();
        userArr.push(user.userId);
      }

      localStorage.setItem(`${postId} Member List`, listOfUser);

      // refresh number of users who like this post
      numberOfLikes.textContent = "Likes: " + userArr.length;

      // delete all user to render again
      for (let ele of likeUsers.querySelectorAll("div")) {
        ele.remove();
      }

      // add new img and username into list
      for (let user of listOfLikes) {
        processUserLikes(user.userName, likeUsers);
      }

      // add eventlisetener for each name to render profile when we click name
      addEventForEachName(likeUsers);

      // change field of button
      const myId = Number(localStorage.getItem("loginUser"));

      if (userArr.includes(myId)) {
        likeButton.textContent = "Unlike";
      } else {
        likeButton.textContent = "Like";
      }

      break;
    }
  }
}

// modify each comment
function processComments(numberOfComments, commentContent, data, postId) {
  const jobs = data.jobs;

  for (const job of jobs) {
    // find the corresponding job
    if (Number(job.id) === Number(postId)) {
      const listOfComments = job.comments;

      // clear all comments and refresh
      for (const comment of commentContent.querySelectorAll("div")) {
        comment.remove();
      }

      for (const comment of listOfComments) {
        processEachComment(comment, commentContent);
      }

      // update number of comments
      numberOfComments.textContent = "Comments: " + listOfComments.length;
      break;
    }
  }
}

// polling server to update users who like this post every 5s
export function liveUpdate(
  likeButton,
  postInfo,
  numberOfLikes,
  likeUsers,
  numberOfComments,
  commentContent
) {
  setInterval(() => {
    const userId = postInfo.creatorId;
    const postId = postInfo.id;

    // get back user info
    function success(data) {
      processLikes(likeButton, numberOfLikes, likeUsers, data, postId);
      processComments(numberOfComments, commentContent, data, postId);
    }

    fetchGET(
      `user?userId=${userId}`,
      success,
      "error happends when updating likes"
    );
  }, 5000);
}

// check each user via get request
function checkEachUserJobs(user) {
  const userId = user[0];
  const userJobs = user[1];

  function success(data) {
    const newJobs = data.jobs.length;

    // user post new job
    if (newJobs !== userJobs) {
      // update key-value in map
      jobsPerUser[userId] = newJobs;
      errorPopup(`${data.name} posts an new job`);
    }
  }

  fetchGET(
    `user?userId=${userId}`,
    success,
    "error happends when checking other users' jobs"
  );
}

// check the number of jobs for posted by each user every 5 seconds
export function pushNotification() {
  setInterval(() => {
    for (const [user, jobs] of Object.entries(jobsPerUser)) {
      checkEachUserJobs([user, jobs]);
    }
  }, 5000);
}
