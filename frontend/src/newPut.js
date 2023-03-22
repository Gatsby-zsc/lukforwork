import { fetchPost, fetchDelete, fetchModi } from "./fetch.js";
import { fileToDataUrl } from "./helpers.js";

export function makePost() {
  const makePostBtn = document.getElementById("text-post");
  const putUp = document.getElementById("upload-post");
  makePostBtn.addEventListener("click", () => {
    const renderMakePost = document.getElementById("make-post-struc");
    if (
      renderMakePost.classList.contains("Hidden") &&
      putUp.classList.contains("Hidden")
    ) {
      renderMakePost.classList.remove("Hidden");
      putUp.classList.remove("Hidden");
      document.getElementById("post-header").value = "";
      document.getElementById("post-img").value = "";
      document.getElementById("post-start").value = "";
      document.getElementById("post-content").value = "";
    }
  });
  const closePost = document.getElementById("close-post-window");
  closePost.addEventListener("click", () => {
    document.getElementById("make-post-struc").classList.add("Hidden");
    putUp.classList.add("Hidden");
  });
  putUp.addEventListener("click", () => {
    const postTitle = document.getElementById("post-header").value;
    const postImage = document.getElementById("post-img").files[0];
    const postStart = document.getElementById("post-start").value;
    const postDescription = document.getElementById("post-content").value;
    fileToDataUrl(postImage)
      .then((data) => {
        fetchPost("job", {
          title: postTitle,
          image: data,
          start: postStart,
          description: postDescription,
        });
      })
      .then(() => {
        document.getElementById("make-post-struc").classList.add("Hidden");
        putUp.classList.add("Hidden");
      });
  });
}

export function makeComment(postId, commentDiv) {
  const postBtn = document.getElementById("post-new-comment");
  postBtn.addEventListener("click", () => {
    const newComment = document.getElementById("new-comment").value;
    fetchPost("job/comment", {
      id: postId,
      comment: newComment,
    });
    commentDiv.classList.add("Hidden");
  });
}

// Del a post in personalprofile
export function delPost(postId, postDel, newJob) {
  postDel.addEventListener("click", () => {
    fetchDelete("job", {
      id: postId,
    });
    newJob.remove();
  });
}

// Modify a post
export function modiPost(postId, postModi) {
  const modiUp = document.getElementById("modify-post");
  postModi.addEventListener("click", () => {
    const renderMakePost = document.getElementById("make-post-struc");
    if (
      renderMakePost.classList.contains("Hidden") &&
      modiUp.classList.contains("Hidden")
    ) {
      renderMakePost.classList.remove("Hidden");
      modiUp.classList.remove("Hidden");
      document.getElementById("post-header").value = "";
      document.getElementById("post-img").value = "";
      document.getElementById("post-start").value = "";
      document.getElementById("post-content").value = "";
    }
    modiUp.addEventListener("click", () => {
      const postTitle = document.getElementById("post-header").value;
      const postImage = document.getElementById("post-img").files[0];
      const postStart = document.getElementById("post-start").value;
      const postDescription = document.getElementById("post-content").value;
      fileToDataUrl(postImage)
        .then((data) => {
          fetchModi("job", {
            id: postId,
            title: postTitle,
            image: data,
            start: postStart,
            description: postDescription,
          });
        })
        .then(() => {
          document.getElementById("make-post-struc").classList.add("Hidden");
          modiUp.classList.add("Hidden");
        });
    });
  });
  const closePost = document.getElementById("close-post-window");
  closePost.addEventListener("click", () => {
    document.getElementById("make-post-struc").classList.add("Hidden");
    modiUp.classList.add("Hidden");
  });
}
