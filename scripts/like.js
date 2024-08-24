
updateLiked = () => {
    const liked = JSON.parse(localStorage.getItem("liked")) || [];

    liked.forEach(id => {
        const li = document.getElementById(id);
        const heart = li.querySelector("img");

        heart.classList.add("liked");
        heart.src = "assets/icons/icons8-heart-48-filled.png";
    });
}

const like = (event) => {
    const target = event.target;

    target.classList.toggle("liked");

    if (target.classList.contains("liked")) {
        target.src = "assets/icons/icons8-heart-48-filled.png";

        const liked = JSON.parse(localStorage.getItem("liked")) || [];
        liked.push(target.parentElement.id);
        localStorage.setItem("liked", JSON.stringify(liked));
    } else {
        target.src = "assets/icons/icons8-heart-48.png";

        const liked = JSON.parse(localStorage.getItem("liked")) || [];
        liked.splice(liked.indexOf(target.parentElement.id), 1);
        localStorage.setItem("liked", JSON.stringify(liked));
    }

} 