// this file is for mileston4, related to how to render user profile
import { fetchGET, fetchPUT } from "./fetch.js";

export function getWatchingUser(userId, watchedList) {
    const userNode = document
        .getElementById("like-user-template")
        .cloneNode(true);
    userNode.removeAttribute("id");

    const userImgNode = userNode.childNodes[1];
    const userNameNode = userNode.childNodes[3];

    function suecessFecthUserId(data) {
        localStorage.setItem(data.name, data.id);
        localStorage.setItem(data.id, data.name);
        userNameNode.textContent = data.name;
        userImgNode.src = data.image;
        watchedList.appendChild(userNode);

        userNode.addEventListener("click", () => {
            renderProfile(userNameNode.textContent);
        });
    }

    fetchGET(
        `user?userId=${userId}`,
        suecessFecthUserId,
        "error happens when fetching user info"
    );
}

export function renderProfile(userName) {
    const userId = localStorage.getItem(userName);

    function clearWatchList() {
        // clear watching list to re-render next time
        const childList = document
            .getElementById("profile-watched-by-list")
            .querySelectorAll("div");

        for (let item of childList) {
            item.remove();
        }
    }

    function suecessFecthInfo(data) {
        document.getElementById("profile-template").classList.remove("Hidden");
        document.getElementById("profile-user-img").src = data.image;
        document.getElementById("profile-user-name").textContent = data.name;
        document.getElementById("profile-user-id").textContent = data.id;
        document.getElementById("profile-user-email").textContent = data.email;
        document.getElementById("profile-user-watched-by").textContent =
            "watched by " +
            data.watcheeUserIds.length +
            (data.watcheeUserIds.length <= 1 ? " user" : " users");
        // process user info
        const watchedList = document.getElementById("profile-watched-by-list");

        clearWatchList();

        let watcheeListIds = data.watcheeUserIds;
        // update user info for each watching user
        for (const user of watcheeListIds) {
            getWatchingUser(user, watchedList);
        }

        // check whether we have watched this user
        const myId = Number(localStorage.getItem("loginUser"));

        // set the default field of button to watch
        const watchButton = document.getElementById("watch-and-unwatch-user");
        watchButton.textContent = "watch";

        // check whether the current profile we view is our own profile
        if (data.id === myId) {
            // hide this button, since we cannot watch/unwatch ourselves
            watchButton.classList.add("Hidden");
        } else {
            // show button when we view other user profile
            watchButton.classList.remove("Hidden");
        }

        for (const id of watcheeListIds) {
            if (myId === id) {
                watchButton.textContent = "unwatch";
            }
        }
        watchButton.addEventListener("click", () => {
            if (watchButton.textContent == "unwatch") {
                // we have watched this user
                watchButton.textContent = "watch";
                clearWatchList();
                const index = watcheeListIds.indexOf(myId);
                watcheeListIds.splice(index, 1);
                // delete our userId in watch list array

                for (const user of watcheeListIds) {
                    getWatchingUser(user, watchedList);
                }

                // send put request to server
                fetchPUT(
                    "user/watch",
                    { email: data.email, turnon: false },
                    "error happens when sending unwatch request to server"
                );
            } else {
                watchButton.textContent = "unwatch";
                watcheeListIds.push(myId);

                // re-render watch
                clearWatchList();
                for (const user of watcheeListIds) {
                    getWatchingUser(user, watchedList);
                }

                // send put request to server
                fetchPUT(
                    "user/watch",
                    { email: data.email, turnon: true },
                    "error happens when sending watch request to server"
                );
            }
        });

        // config button to close profile
        const closeButton = document.getElementById("close-profile");

        closeButton.addEventListener("click", () => {
            document.getElementById("profile-template").classList.add("Hidden");
        });
    }

    fetchGET(
        `user?userId=${userId}`,
        suecessFecthInfo,
        "error happens when render user profile"
    );
}

export function addEventForEachName(newPost) {
    const userArr = newPost.getElementsByClassName("User-name");
    for (const ele of userArr) {
        // add evenelister for each user name
        ele.addEventListener("click", () => {
            renderProfile(ele.textContent);
        });
    }
}

export function addEventForMyname() {
    // config "my profile" of side bar to render my own profile
    const myProfile = document.getElementById("my-profile");
    myProfile.addEventListener("click", () => {
        const myId = localStorage.getItem("loginUser");
        const myName = localStorage.getItem(myId);
        renderProfile(myName);
    });
}
