
const ul = document.getElementById('programs');
const main = document.querySelector("main");

const populateUL = () => {
    const programs = JSON.parse(localStorage.getItem('programs')).programs;

    ul.innerHTML = "";

    programs.forEach(program => {

        const data = {
            id: program.id,
            name: program.name,
            description: program.description,
            image: program.programimage
        }

        const checkbox = document.createElement("img");
        // const img = document.createElement('img');
        const p = document.createElement('p');
        const li = document.createElement('li');

        checkbox.src = "assets/icons/icons8-heart-48.png";
        checkbox.classList.add("heart");
        checkbox.setAttribute("onclick", "like(event)");

        // img.src = program.programimage;

        li.setAttribute("data", JSON.stringify(data));
        li.id = data.id;
        li.setAttribute("data-id", data.id);
        p.innerHTML = data.name;

        li.appendChild(checkbox);
        // li.appendChild(img);
        li.appendChild(p);
        ul.appendChild(li);
    });
    
    sort();
    
    updateLiked();
}

