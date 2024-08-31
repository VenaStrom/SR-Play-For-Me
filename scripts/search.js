
const searchBox = document.querySelector(".search-box");

searchBox.addEventListener("input", () => {
    const programs = JSON.parse(localStorage.getItem("programs")).programs;
    const search = searchBox.value.toLowerCase().replace(" ", "");

    const exactMatches = programs.filter(program => program.name.toLowerCase().replace(" ", "").includes(search));
    const nonExactMatches = programs.filter(program => !program.name.toLowerCase().replace(" ", "").includes(search));

    const partialMatches = nonExactMatches.map(program => {
        const name = program.name.toLowerCase();
        const letters = search.split("");

        let matches = 0;
        for (let i = 0; i < letters.length; i++) {
            if (name.includes(letters[i])) {
                matches++;
            }
        }
        const percent = matches / name.length;

        program.percentMatch = percent;

        return program;

    }).filter(program => program.percentMatch > 0.1);

    const returnList = [
        ...exactMatches,
        ...partialMatches.sort((a, b) => b.percentMatch - a.percentMatch)
    ]

    makeProgramDOMS(returnList);
});