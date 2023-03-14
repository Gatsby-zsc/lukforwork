import { renderUserPage } from "./Basic_feed.js";
import { errorPopup } from "./error_handle.js";

export function fetch_request(req, requestMethod, bodyInfo, success, err) {
    fetch("http://localhost:5005/" + req, {
        method: requestMethod,
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
            // process user data
            success(data);
            renderUserPage();
        })
        .catch(() => {
            errorPopup(err);
        });
}
