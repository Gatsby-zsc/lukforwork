import { fetchGET } from "./fetch.js";

export function renderHomePage() {
    const renderPost = (data) => {
        document.getElementById("Login").classList.add("hidden");
        document.getElementById("Homepage").classList.remove("hidden");
        alert("Start render user webpage");
        alert(`There are ${data.length} posts`);
        // for debugging
    };

    fetchGET("job/feed?start=0", renderPost, "");
}
