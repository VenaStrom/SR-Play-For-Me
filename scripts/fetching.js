
// // const getAllPrograms = (force = false) => {

// //     const localPrograms = JSON.parse(localStorage.getItem("programs")) || { fetchedAt: 0 };

// //     // If programs are already saved and no older than 12 hours, return
// //     if (!force) {
// //         if (localPrograms.fetchedAt > new Date().getTime() - 43200000) { // 12 hours = 1000 * 60 * 60 * 12 ms
// //             console.log("Using cached programs. Cached at:", new Date(localPrograms.fetchedAt));
// //             return localPrograms;
// //         }
// //     }

// //     console.log("Cache miss. Fetching programs...");
// //     return fetch("https://api.sr.se/api/v2/programs/index?format=json&pagination=false")
// //         .then(response => response.json())
// //         .then(data => {

// //             const programs = data.programs;
// //             const leanPrograms = programs.map(program => {
// //                 return {
// //                     id: program.id,
// //                     name: program.name,
// //                     description: program.description,
// //                     image: program.programimage
// //                 }
// //             })

// //             const programsAndDate = {
// //                 programs: leanPrograms,
// //                 fetchedAt: new Date().getTime()
// //             }

// //             localStorage.setItem("programs", JSON.stringify(programsAndDate));
// //             console.log("Programs fetched", programsAndDate);
// //             return programsAndDate
// //         })
// // }

// // const getEpisodesOfProgram = (programID, force = false) => {

// //     if (!localStorage.getItem("programs")) {
// //         console.warn("No programs found in localStorage. Please fetch programs first.");
// //         // await getAllPrograms();
// //     }

// //     const localEpisodes = JSON.parse(localStorage.getItem("episodes")) || { fetchedAt: 0 };

// //     // If episodes are already saved and no older than 10 minutes, return
// //     if (!force) {
// //         if (localEpisodes.fetchedAt > new Date().getTime() - 600000) { // 10 minutes = 1000 * 60 * 10 ms
// //             console.log("Using cached episodes. Cached at:", new Date(localEpisodes.fetchedAt));
// //             return { episodes: localEpisodes.episodes, fetchedAt: localEpisodes.fetchedAt };
// //         }
// //     }

// //     // Getting dates for the api call
// //     const oneDayInFuture = new Date()
// //     oneDayInFuture.setDate(oneDayInFuture.getDate() + 1);
// //     const oneMonthBack = new Date();
// //     oneMonthBack.setMonth(oneMonthBack.getMonth() - 1);

// //     const toDate = oneDayInFuture.toISOString().slice(0, 10);
// //     const fromDate = (
// //         toDate.slice(0, 5)
// //         + ((oneMonthBack.getMonth() + 1)).toString().padStart(2, "0")
// //         + toDate.slice(7, 10)
// //     );

// //     console.log("Cache miss. Fetching episodes...");
// //     fetch(`https://api.sr.se/api/v2/episodes/index?programid=${programID}&fromdate=${fromDate}&todate=${toDate}&audioquality=hi&format=json&pagination=false`)
// //         .then(response => response.json())
// //         .then(data => {
// //             const episodes = data.episodes;
// //             const leanEpisodes = episodes.map(episode => {
// //                 return {
// //                     title: episode.title,
// //                     description: episode.description,
// //                     programName: episode.program.name,
// //                     audioURL: episode.downloadpodfile.url,
// //                     duration: episode.downloadpodfile.duration
// //                 }
// //             })

// //             const episodesAndDate = {
// //                 episodes: leanEpisodes,
// //                 fetchedAt: new Date().getTime(),
// //                 likedProgramIDs: JSON.parse(localStorage.getItem("likedPrograms")) || []
// //             }

// //             localStorage.setItem("episodes", JSON.stringify(episodesAndDate));
// //             console.log(episodesAndDate);

// //             return episodesAndDate
// //         })
// // }

// // const getAllLikedPrograms = () => {

// //     if (!localStorage.getItem("likedPrograms")) {
// //         console.log("No liked programs found in localStorage.");
// //         return;
// //     }
// //     if (!localStorage.getItem("programs")) {
// //         console.warn("No programs found in localStorage. Please fetch programs first.");
// //         // await getAllPrograms();
// //     }

// //     const likedProgramIDs = JSON.parse(localStorage.getItem("likedPrograms")) || [];

// //     const episodes = [];

// //     likedProgramIDs.forEach(programID => {
// //         episodes.push(getEpisodesOfProgram(programID));
// //     });

// //     console.log(episodes);
// // }

// // localStorage.setItem("likedPrograms", JSON.stringify([4923, 2778]))
// // getAllPrograms();
// // getAllLikedPrograms();

// // getAllPrograms();
// // getEpisodesFromProgram(4923);

// // localStorage.setItem("likedPrograms", JSON.stringify([4923]))
// // const likedProgramsIds = JSON.parse(localStorage.getItem("likedPrograms")) || [];
// // likedProgramsIds.forEach(programID => {
// //     getEpisodesFromProgram(programID);
// // });


// const fetchAndSaveAllPrograms = () => {
//     return new Promise((resolve, reject) => {
//         fetch("https://api.sr.se/api/v2/programs/index?format=json&pagination=false")
//             .then(response => response.json())
//             .then(data => {
//                 const programs = data.programs;
//                 const leanPrograms = programs.map(program => {
//                     return {
//                         id: program.id,
//                         name: program.name,
//                         description: program.description,
//                         image: program.programimage
//                     }
//                 })

//                 const programsAndDate = {
//                     programs: leanPrograms,
//                     fetchedAt: new Date().getTime()
//                 }

//                 localStorage.setItem("programs", JSON.stringify(programsAndDate));
//                 console.log("Programs fetched and saved to localStorage");
//                 resolve();
//             })
//             .catch(error => {
//                 console.error("Error fetching programs:", error);
//                 reject(error);
//             });
//     });
// }

// window.onload = () => {
//     fetchAndSaveAllPrograms().then(() => {
//         console.log(JSON.parse(localStorage.getItem("programs")));
//     })
// }


// Check if the browser supports the Cache API
if ('caches' in window) {
    // Open a cache storage
    caches.open('audio-cache').then(function (cache) {
        // Create a new request for the audio file
        var request = new Request('https://sverigesradio.se/topsy/ljudfil/srapi/9451370.mp3');

        // Fetch the audio file and add it to the cache
        fetch(request).then(function (response) {
            cache.put(request, response);

            document.querySelector('audio').src = 'https://sverigesradio.se/topsy/ljudfil/srapi/9451370.mp3';
        });
    });
}