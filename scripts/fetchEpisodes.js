
const ul = document.getElementById("new-episodes");
const likedProgramsIds = JSON.parse(localStorage.getItem("liked")) || [];
const programs = JSON.parse(localStorage.getItem("programs")) || [];
const noFavNotification = document.getElementById("no-fav-notification");

if (likedProgramsIds !== 0) {
    noFavNotification.style.display = "none";
}

const fetchCooldown = 1000
let canFetch = true

const fetchPrograms = () => {

    const cooldownTimeout = setTimeout(() => {
        canFetch = true

        clearInterval(cooldownTimeout)
    }, fetchCooldown)

    if (canFetch) {
        canFetch = false;

        console.warn("Fetching programs...", "if you see this message repeatedly, something is wrong with the fetchPrograms.js script and it means that Sveriges Radio API is being spammed.")
        fetch("https://api.sr.se/api/v2/programs/index?format=json&pagination=false")
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("programs", JSON.stringify(data))
            })
    }
}

if (programs.length === 0) {
    fetchPrograms();
}

const fetchEpisodes = (id, fromDate, toDate) => {
    fetch(`https://api.sr.se/api/v2/episodes/index?programid=${id}&fromdate=${fromDate}&todate=${toDate}&audioquality=hi&format=json&pagination=false`)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("episodes", JSON.stringify(data.episodes));
            populateUL();
        })
}

const populateUL = (episode) => {
    const li = document.createElement("li");
    const show = document.createElement("p");
    const title = document.createElement("p");
    const description = document.createElement("p");
    // const img = document.createElement("img");
    const audio = document.createElement("audio");

    show.innerText = episode.program.name;
    // img.src = episode.imageurl;
    title.innerText = episode.title;
    description.innerText = episode.description;
    audio.src = episode.listenpodfile.url;
    audio.controls = true;

    // li.appendChild(img);
    li.appendChild(show);
    li.appendChild(title);
    li.appendChild(description);
    li.appendChild(audio);

    ul.appendChild(li);
}

// likedProgramsIds.forEach(id => {
//     const program = programs.programs.find(program => program.id == id);
//     const toDate = new Date().toISOString().slice(0, 10);
//     const pastDate = new Date();
//     pastDate.setMonth(pastDate.getMonth() - 1);
//     const fromDate =
//         toDate.slice(0, 5)
//         + ((pastDate.getMonth() + 1)).toString().padStart(2, "0")
//         + toDate.slice(7, 10)

//     // fetchEpisodes(id, fromDate, toDate);
// });

window.onload = () => {
    //     const episodes = JSON.parse(localStorage.getItem("episodes")) || [];
    //     episodes.forEach(episode => {
    //         populateUL(episode);
    //     });


    // navigator.storage.estimate().then(estimate => {
    //     console.log((estimate.quota / 1024 / 1024 / 1024).toFixed(0), "GB");
    // });

    // navigator.storage.persist().then(persistent => {
    //     if (persistent) {
    //         fetch("https://sverigesradio.se/topsy/ljudfil/srapi/9445218.mp3")
    //             .then(response => response.blob())
    //             .then(blob => {
    //                 const url = URL.createObjectURL(blob);
    //                 const anchor = document.createElement("a");
    //                 anchor.href = url;
    //                 anchor.download = "audio.mp3";
    //                 anchor.click();
    //                 URL.revokeObjectURL(url);
    //             })
    //             .catch(error => {
    //                 console.error("Failed to fetch audio file:", error);
    //             });
    //     } else {
    //         console.warn("Persistent storage is not granted. Please check your browser settings to enable persistent storage.");
    //     }
    // });


//     const fetchAndCacheAudio = (url) => {
//         fetch(url)
//             .then(response => response.blob())
//             .then(blob => {
//                 const audioUrl = URL.createObjectURL(blob);
//                 const audio = new Audio(audioUrl);
//                 audio.addEventListener('canplaythrough', () => {
//                     caches.open('audio-cache')
//                         .then(cache => cache.add(url))
//                         .catch(error => {
//                             console.error('Failed to cache audio file:', error);
//                         });
//                 });
//             })
//             .catch(error => {
//                 console.error('Failed to fetch audio file:', error);
//             });
//     };

//     fetchAndCacheAudio("https://sverigesradio.se/topsy/ljudfil/srapi/9445218.mp3");
}