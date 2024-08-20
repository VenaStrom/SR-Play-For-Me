
const ul = document.getElementById('programs');

window.onload = () => {
    const programs = JSON.parse(localStorage.getItem('programs')).programs;
    console.log(programs.programs);

    programs.forEach(program => {
        const checkbox = document.createElement('input');
        const p = document.createElement('p');
        const li = document.createElement('li');

        checkbox.type = 'checkbox';

        li.setAttribute("data", JSON.stringify(program));
        li.id = program.id;
        p.innerHTML = program.name;

        li.appendChild(checkbox);
        li.appendChild(p);
        ul.appendChild(li);
    });
}