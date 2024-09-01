
const programsUL = document.getElementById("programs");

const fetchPrograms = () => {

    console.log("Fetching list of all programs...", "if you see this message repeatedly, something is wrong with the fetchPrograms.js script and it means that Sveriges Radio API is being spammed.")
    return fetch("https://api.sr.se/api/v2/programs/index?format=json&pagination=false")
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
        })
}

const makeProgramDOMS = (programs) => {
    if (!document.getElementById("programs")) { return }

    programsUL.innerHTML = "";

    programs.forEach(program => {
        const heart = document.createElement("img");
        heart.classList.add("heart");
        heart.src = "assets/icons/icons8-heart-48.png";
        heart.alt = "Följ";
        heart.onclick = () => toggleHeart(heart);

        const name = document.createElement("p");
        name.classList.add("name");
        name.textContent = program.name;

        const li = document.createElement("li");
        li.id = `program${program.id}`;
        li.appendChild(heart);
        li.appendChild(name);

        programsUL.appendChild(li);
    });

    reLikePrograms();
}

const reLikePrograms = () => {
    const liked = JSON.parse(localStorage.getItem("liked")) || [];

    liked.forEach(id => {
        if (document.getElementById(id)) {
            const li = document.getElementById(id);
            const heart = li.querySelector(".heart");

            heart.classList.add("liked");
            heart.src = "assets/icons/icons8-heart-48-filled.png";
        }
    });
}

const toggleHeart = (source) => {
    const liked = JSON.parse(localStorage.getItem("liked")) || [];
    const id = source.parentElement.id;

    source.classList.toggle("liked");

    if (source.classList.contains("liked")) {
        liked.push(id);
        source.src = "assets/icons/icons8-heart-48-filled.png";
    } else {
        liked.splice(liked.indexOf(id), 1);
        source.src = "assets/icons/icons8-heart-48.png";
    }

    localStorage.setItem("liked", JSON.stringify(liked));
}

window.onload = () => {
    const programs = JSON.parse(localStorage.getItem("programs"));

    if (!programs || new Date().getDate() !== new Date(programs.timeFetched).getDate()) {
        fetchPrograms().then(() => {
            makeProgramDOMS(programs.programs);
        });
    } else {
        makeProgramDOMS(programs.programs);
    }
}