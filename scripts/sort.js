
const sort = () => {

    const searchBox = document.querySelector('.search-box');
    const programs = JSON.parse(localStorage.getItem('programs')).programs;

    const initialLength = programs.length;

    const alphabetSort = (list) => {
        return list.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            } else {
                return 1;
            }
        });
    }

    const getLikedPrograms = (list) => {
        const liked = JSON.parse(localStorage.getItem("liked")) || [];
        const likedPrograms = list.filter(program => liked.includes((program.id).toString()));
        const otherPrograms = list.filter(program => !liked.includes((program.id).toString()));

        return [likedPrograms, otherPrograms];
    }


    const searchMatch = (list) => {
        const searchString = searchBox.value.toLowerCase();
        const searchWords = searchString.split(" ");
        const fuzzyString = searchString.replace(" ", "").split("");

        const exactMatch = list.filter(program => {
            return (
                program.name.toLowerCase().includes(searchString)
                ||
                searchWords.every(word => program.name.toLowerCase().includes(word))
            )
        });
        const restExactMatch = list.filter(program => !program.name.toLowerCase().includes(searchString));

        restExactMatch.forEach(program => {
            let score = 0;
            const matchedCharacters = {};

            fuzzyString.forEach(character => {
                if (program.name.toLowerCase().includes(character)) {
                    score++;

                    if (matchedCharacters[character]) {
                        matchedCharacters[character] += 1;
                    } else {
                        matchedCharacters[character] = 1;
                    }
                }

                if (matchedCharacters.length === fuzzyString.length) {
                    score++;
                }
            });

            if (program.name.split(" ").length === searchWords.length) {
                score++;
            }

            program.matches = score;
        });
        const fuzzySorted = restExactMatch.sort((a, b) => b.matches - a.matches);

        return [exactMatch, fuzzySorted];
    }

    const [likedPrograms, otherPrograms] = getLikedPrograms(programs);
    const [exactMatch, fuzzySorted] = searchMatch(otherPrograms);

    const sortedPrograms = [...likedPrograms, ...exactMatch, ...fuzzySorted];
    if (sortedPrograms.length !== initialLength) {
        console.warn("Sorting removed elements! This may be a bug.");
    }
    sortedPrograms.forEach((program, index) => {
        const li = ul.querySelector(`[data-id='${program.id}']`);
        li.style.order = index;
    });

    main.scrollTop = 36;
}