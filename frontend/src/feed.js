import { fetchGET, fetchPUT } from "./fetch.js";
import { fileToDataUrl } from "./helpers.js";

export function processCreatorId(creatorId, creatorName, creatorFollowers) {
    function getAllInfo(data) {
        localStorage.setItem(data.name, data.id);
        // localStorage.setItem(data.id, data.name);
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
    let node = document.createElement("li");
    let textnode = document.createTextNode(user);
    node.appendChild(textnode);
    node.classList.add("User-name");
    likeUsers.appendChild(node);
}

export function processEachComment(comment, commentContent) {
    // we can try to implement paging for post section
    let node = document.getElementById("comment-template").cloneNode(true);
    node.removeAttribute("id");
    node.childNodes[1].textContent = comment.userName;
    node.childNodes[3].textContent = comment.comment;
    commentContent.appendChild(node);
}

export function likeJobOrComment(
    firstButton,
    secondButton,
    postInfoid,
    likeList,
    jobLikes
) {
    // need to modify for second button
    // request like this comment to server
    firstButton.addEventListener("click", () => {
        const loginUser = Number(localStorage.getItem("loginUser"));
        if (likeList.includes(loginUser) !== true) {
            // user didn't like this post before
            console.log("send request");
            firstButton.addEventListener("click", () => {
                fetchPUT(
                    "job/like",
                    { id: postInfoid, turon: true },
                    "Error happens when sending like request"
                );
            });
            const currentLikes = Number(jobLikes.textContent) + 1;
            jobLikes.textContent = currentLikes;
        }
    });
}

export function renderEachPost(postInfo) {
    // render all information for each post
    // console.log(postInfo);
    let oldPost = document.getElementById("post-template");
    let newPost = oldPost.cloneNode(true);
    newPost.removeAttribute("id");
    const creatorContent = newPost.childNodes[1];
    const postContent = newPost.childNodes[3];

    // need to modify for insert creator image
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

    const jobLikes = likeAndComment.childNodes[1];
    jobLikes.textContent = "Likes: " + postInfo.likes.length;

    const likeList = [];
    // used for updating like number when user clikc "like" button
    for (const user of postInfo.likes) {
        likeList.push(user.userId);
    }

    const likeUsers = likeAndComment.childNodes[3];
    for (const user of postInfo.likes) {
        localStorage.setItem(user.userName, user.userId);
        // localStorage.setItem(user.userId, user.userName);
        processUserLikes(user.userName, likeUsers);
    }

    jobLikes.addEventListener("click", () => {
        // implement a toggle to switch between hide and show
        if (likeUsers.classList.contains("Hidden")) {
            likeUsers.classList.remove("Hidden");
        } else {
            likeUsers.classList.add("Hidden");
        }
    });

    const jobComments = likeAndComment.childNodes[5];
    jobComments.textContent = "Comments: " + postInfo.comments.length;

    const commentContent = likeAndComment.childNodes[7];
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

    const functionSection = likeAndComment.childNodes[9];
    const firstButton = functionSection.childNodes[1];
    const secondButton = functionSection.childNodes[3];
    likeJobOrComment(
        firstButton,
        secondButton,
        postInfo.id,
        likeList,
        jobLikes
    );

    document.getElementById("post").insertBefore(newPost, oldPost);
    // insert the newly created node ahead of template node each time
}

export function renderHomePage() {
    document.getElementById("login").classList.add("Hidden");
    document.getElementById("homepage").classList.remove("Hidden");
    const renderPost = (data) => {
        // for debugging
        for (let item of data) {
            renderEachPost(item);
        }
    };
    let currentPage = localStorage.getItem("Page");
    localStorage.setItem("Page", Number(currentPage) + 5);
    // update page to retrieve next 5 Posts next time

    fetchGET(
        `job/feed?start=${currentPage}`,
        renderPost,
        "error happen when render"
    );
}
