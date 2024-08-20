
const fetchCooldown = 1 // seconds
let timeCheck = true

const fetchPrograms = () => {

    const cooldownTimeout = setTimeout(() => {
        timeCheck = true

        clearInterval(cooldownTimeout)
    }, fetchCooldown * 1000)

    if (timeCheck) {
        timeCheck = false

        console.warn("Fetching programs...", "if you see this message repeatedly, something is wrong with the fetchPrograms.js script and it means that Sveriges Radio API is being spammed.")
        fetch("https://api.sr.se/api/v2/programs/index?format=json&pagination=false")
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("programs", JSON.stringify(data))
            })
    }
}

if (localStorage.getItem("programs") === null) {
    fetchPrograms()
}

if (localStorage.getItem("lastFetch") === null) {
    localStorage.setItem("lastFetch", Date.now())
}

if (localStorage.getItem("lastFetch")) {
    const lastFetch = parseInt(localStorage.getItem("lastFetch"))
    const currentTime = parseInt(Date.now())

    if (currentTime - lastFetch > 1000 * 60 * 60 * 12) { // 12 hours in milliseconds
        fetchPrograms()
        localStorage.setItem("lastFetch", Date.now())
    }
}