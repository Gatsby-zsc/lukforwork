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

export function fetchPUT() {}

export function fetchDELETE() {}
