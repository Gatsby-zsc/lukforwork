import { fetchGET } from "./fetch.js";
import { fileToDataUrl } from "./helpers.js";

export function ProcessCreatorId(creatorId) {
    function getAllInfo(data) {
        let creatorName = document.getElementById("creatorName");
        let creatorFollowers = document.getElementById("followers");

        creatorName.textContent = data.name;
        creatorFollowers.textContent =
            data.watcheeUserIds.length + " followers";

        creatorName.removeAttribute("Id");
        creatorFollowers.removeAttribute("Id");
    }

    fetchGET(
        `user?userId=${creatorId}`,
        getAllInfo,
        "error when getting cretator info"
    );
}

export function AnalyzeTime(date) {
    const currentTime = Date.now();
    const postTime = Date.parse(date);

    const timeStamp = currentTime - postTime;
    if (timeStamp > 86_400_000) {
        // post 24 hours ago
        let retTime = new Date(postTime).toISOString();
        retTime = retTime.substring(0, 10).split("-");
        retTime = retTime[2] + "/" + retTime[1] + "/" + retTime[0];
        return retTime;
    } else {
        // post within 24 hours
        const minutes = Math.trunc((timeStamp % 3_600_000) / 60_000);
        const hours = Math.trunc(timeStamp / 3_600_000);
        return hours + " hours " + minutes + " minutes ago";
    }
}

export function renderEachPost(postInfo) {
    // render all information for each post

    let oldPost = document.getElementById("post-Template");
    let newPost = oldPost.cloneNode(true);
    newPost.removeAttribute("Id");
    const creatorContent = newPost.childNodes[1];
    const postContent = newPost.childNodes[3];

    // need to modify for insert image
    const creatorName = creatorContent.childNodes[3].childNodes[1];
    creatorName.setAttribute("id", "creatorName");

    const followers = creatorContent.childNodes[3].childNodes[3];
    followers.setAttribute("id", "followers");
    ProcessCreatorId(postInfo.creatorId);

    const postDate = creatorContent.childNodes[3].childNodes[5];
    postDate.textContent = AnalyzeTime(postInfo.createdAt);

    const jobTitle = postContent.childNodes[1];
    jobTitle.textContent = postInfo.title;

    const startDate = postContent.childNodes[3];
    startDate.textContent = "Start at " + AnalyzeTime(postInfo.start);

    const jobDescription = postContent.childNodes[5];
    jobDescription.textContent = postInfo.description;

    const jobImage = postContent.childNodes[7];
    jobImage.src = postInfo.image;

    const jobLikes = postContent.childNodes[9];
    jobLikes.textContent = postInfo.likes.length;

    const jobComments = postContent.childNodes[11];
    jobComments.textContent = postInfo.comments.length;

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
