import { errorPopup } from "./errorHandle.js";

export function fetchPOST(req, bodyInfo, success, err) {
  fetch("http://localhost:5005/" + req, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(bodyInfo),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      success(data);
    })
    .catch(() => {
      errorPopup(err);
    });
}

export function fetchGET(req, success, err) {
  fetch(`http://localhost:5005/` + req, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      success(data);
    })
    .catch(() => {
      errorPopup(err);
    });
}

export function fetchPut(req, bodyInfo, err) {
  fetch(`http://localhost:5005/` + req, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(bodyInfo),
  })
    .then((res) => {
      if (req === "user/watch" && res.status === 400) {
        alert("no user exist");
      } else if (req === "job" && res.status === 200) {
        alert("Post modified successfully");
      }
    })
    .catch(() => {
      errorPopup(err);
    });
}

// function of make a post or comment into server
export function fetchPost(req, postDetail) {
  fetch("http://localhost:5005/" + req, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(postDetail),
  }).then((res) => {
    if (res.status === 200) {
      alert("Post put successfully");
    }
  });
}

export function fetchDelete(req, postId) {
  fetch("http://localhost:5005/" + req, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(postId),
  }).then((res) => {
    if (res.status === 200) {
      alert("Delete successfully");
    }
  });
}
