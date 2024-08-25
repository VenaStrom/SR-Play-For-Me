
const getAllPrograms = async () => {

    const localPrograms = JSON.parse(localStorage.getItem("programs")) || { fetchedAt: 0 };

    // If programs are already save and no older than 12 hours, return
    if (localPrograms.fetchedAt > new Date().getTime() - 43200000) { // 12 hours = 1000 * 60 * 60 * 12 ms
        console.log("Using cached programs. Cached at:", new Date(localPrograms.fetchedAt));
        return;
    }

    // Refetch programs
    fetch("https://api.sr.se/api/v2/programs/index?format=json&pagination=false")
        .then(response => response.json())
        .then(data => {

            const programs = data.programs;
            const leanPrograms = programs.map(program => {
                return {
                    id: program.id,
                    name: program.name,
                    description: program.description,
                    image: program.programimage
                }
            })

            const programsAndDate = {
                programs: leanPrograms,
                fetchedAt: new Date().getTime()
            }

            localStorage.setItem("programs", JSON.stringify(programsAndDate));
            console.log(programsAndDate);
        })
}

const getEpisodes = async (id) => {

}

getAllPrograms();