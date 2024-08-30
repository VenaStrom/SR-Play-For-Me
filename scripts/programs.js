
const ul = document.getElementById("programs");

const fetchPrograms = () => {

    console.log("Fetching list of all programs...", "if you see this message repeatedly, something is wrong with the fetchPrograms.js script and it means that Sveriges Radio API is being spammed.")
    fetch("https://api.sr.se/api/v2/programs/index?format=json&pagination=false")
        .then(response => response.json())
        .then(data => {

            const returnData = {
                programs: data.programs.map((data) => {
                    return {
                        id: data.id,
                        name: data.name,
                        description: data.description,
                        image: data.programimagewide,
                    }
                }),
                timeFetched: new Date().getTime(),
            };

            localStorage.setItem("programs", JSON.stringify(returnData));

        }).then(() => {
            const programs = JSON.parse(localStorage.getItem("programs"));
            makeProgramDOMS(programs.programs);
        });
}

const makeProgramDOMS = (programs) => {
    programs.forEach(program => {

        const li = `
        <li id='program${program.id}'>
            <img class="heart" onclick='toggleHeart(this)' src="assets/icons/icons8-heart-48.png" alt="Följ">
            <p class="name">${program.name}</p>
        </li>`

        const liDOM = new DOMParser().parseFromString(li, "text/html").getElementById(`program${program.id}`);

        ul.appendChild(liDOM);
    });
}

const toggleHeart = (source) => {
    const li = source.parentElement;
    const id = li.id;

    const liked = JSON.parse(localStorage.getItem("liked")) || [];
    liked.push(id);
    localStorage.setItem("liked", JSON.stringify(liked));

    source.classList.toggle("liked");

    if (source.classList.contains("liked")) {
        source.src = "assets/icons/icons8-heart-48-filled.png";
    } else {
        source.src = "assets/icons/icons8-heart-48.png";
    }
}

const relikePrograms = () => {
    const liked = JSON.parse(localStorage.getItem("liked")) || [];

    liked.forEach(id => {
        const li = document.getElementById(id);

        if (li.id === id) {
            const heart = li.querySelector(".heart");
            toggleHeart(heart);
        }
    });
}

window.onload = () => {

    const programs = JSON.parse(localStorage.getItem("programs"));
    
    if (!programs || programs.timeFetched + 86400000 < new Date().getTime()) { // 24 hours = 1000*60*60*24 ms
        fetchPrograms();
    } else {
        makeProgramDOMS(programs.programs);
    }

    relikePrograms();
}