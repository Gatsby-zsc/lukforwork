import { errorPopup } from "./error_handle.js";

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

export function fetchPUT(req, bodyInfo, err) {
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
      }
    })
    .catch(() => {
      errorPopup(err);
    });
}

export function fetchDELETE() {}
