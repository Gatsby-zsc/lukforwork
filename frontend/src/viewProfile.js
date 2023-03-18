// this file is for mileston4, related to how to render user profile

export function renderProfile(userName) {
    const userId = localStorage.getItem(userName);
    console.log(userId);
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
