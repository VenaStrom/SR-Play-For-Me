
const ul = document.getElementById('programs');
const main = document.querySelector("main");

const populateUL = () => {
    const programs = JSON.parse(localStorage.getItem('programs')).programs;

    programs.forEach(program => {
        // const checkbox = document.createElement('input');
        const checkbox = document.createElement("img");
        const p = document.createElement('p');
        const li = document.createElement('li');

        checkbox.src = "assets/icons/icons8-heart-48.png";
        checkbox.classList.add("heart");
        checkbox.setAttribute("onclick", "like(event)");

        li.setAttribute("data", JSON.stringify(program));
        li.id = program.id;
        p.innerHTML = program.name;

        li.appendChild(checkbox);
        li.appendChild(p);
        ul.appendChild(li);
    });

    main.scrollTop = 36;

    updateLiked();
}

