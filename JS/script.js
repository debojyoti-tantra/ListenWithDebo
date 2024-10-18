let songs;
let currFolder;
let currentSong;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder
    let response = await fetch(`./songs/${folder}/songs.json`);
    let textResponse = await response.json();

    songs = []

    songs = textResponse.songs.map(song => song.file);

    let songs_series = document.querySelector(".songs-series");
    songs_series.innerHTML = ""
    for (const song of songs) {
        songs_series.innerHTML += `
            <div class="song-l">
                <img src="./svg/song.svg" alt="" class="" >
                <p class="music-name white">${decodeURIComponent(song.split(".mp3")[0].replaceAll("%20", " "))}</p>
                <div style="display: flex; gap: 5px; justify-content: center; align-items: center;">
                    <p class="white">Play Now</p>
                    <img src="./svg/play-round.svg" alt="">
                </div>
            </div>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelectorAll(".songs-series .song-l")).forEach((e, index) => {
        e.addEventListener("click", () => {
            console.log(`Playing song: ${songs[index]}`);
            playMusic(songs[index]);
        });
    });
    return songs;
}

// Play the selected music
const playMusic = (track, pause=false) => {
    // Stop the currently playing song if it exists
    if (currentSong) {
        currentSong.pause(); // Pause the current song
        currentSong.currentTime = 0; // Reset the current time
    }

    currentSong = new Audio(`./songs/${currFolder}/${track}`);
    if (!pause) {
        currentSong.play();
        play.src = "./svg/pause.svg"
        console.log(`In ${currFolder},${track} is playing`);
    }

    // Update the UI with the current song name
    document.querySelector(".songname").innerHTML = decodeURIComponent(track.split(".mp3")[0].replaceAll("%20", " "));

    // Set up event listener for when the song ends
    currentSong.onended = () => {
        let currentIndex = songs.indexOf(track);

        if (currentIndex + 1 < songs.length) {
            playMusic(songs[currentIndex + 1]);
        }
    };

    // Listen for time update event
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".duration").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) *100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })
    
}

// Display available albums
async function displayAlbums() {
    let folders = ["love", "chill", "fresh", "magic", "party", "sad"];
    let cardContainer = document.querySelector(".card-container");
    cardContainer.innerHTML = ""; // Clear previous content

    // Loop through each folder and fetch its metadata
    for (const folder of folders) {
        // Fetch the songs.json from each folder
        let response = await fetch(`./songs/${folder}/songs.json`);

        // If the folder's songs.json does not exist, skip it
        if (!response.ok) {
            console.log(`Skipping folder: ${folder}, couldn't fetch songs.json`);
            continue;
        }

        let textResponse = await response.json();
        console.log(textResponse);

        // Render each album as a card
        if (!document.querySelector(`[data-folder="${folder}"]`)) {
            // Render each album as a card
            cardContainer.innerHTML += `
                <div class="card deeper-grey cur-poi" data-folder="${folder}">
                    <img src="${textResponse.cover}" alt="${textResponse.title}" width="130px">
                    <p class="title white deeper-grey">${textResponse.title}</p>
                    <p class="description white deeper-grey">${textResponse.description}</p>
                </div>`;
        }
        
    }

    // Attach click event listeners to each album card
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async (event) => {
            let folder = event.currentTarget.dataset.folder;
            console.log(`Fetching songs from folder: ${folder}`);

            // Fetch and display the songs for the selected album
            let songs = await getSongs(folder);
            if (songs.length > 0) {
                playMusic(songs[0]); // Play the first song from the selected album
            }
        });
    });
}

async function main() {
    // get the list of songs
    await getSongs("./love");
    console.log(songs);
    
    // Play the first song from the folder on seekbar tab
    playMusic(songs[0], true)

    // Display all the albums in the page
    displayAlbums()

    // Attach an event listener to volume
    document.querySelector(".vol #inputt").addEventListener("input", (e) => {
        let volumeValue = parseInt(e.target.value) / 100; // Get value from the event target and normalize it to 0-1 range
        if (!isNaN(volumeValue) && volumeValue >= 0 && volumeValue <= 1) {
            currentSong.volume = volumeValue; // Set the volume for the audio
            console.log("Volume set to:", currentSong.volume);
        } else {
            console.error("Invalid volume value!");
        }
    });

}

main()

// Add event listener to mute/unmute the track
let previousVolume = 0.2; // Store the previous volume
document.querySelector(".volume-svg").addEventListener("click", ()=>{
    if (document.querySelector(".volume-svg").src.split('/').pop().includes("volume.svg")) {
        // Mute the Song
        document.querySelector('.volume-svg').src = document.querySelector('.volume-svg').src.replace("volume.svg", "mute.svg");
        previousVolume = currentSong.volume; // Save the current volume
        currentSong.volume = 0; // Mute
        document.querySelector(".vol input").value = 0; // Set slider to 0
        console.log("volume-svg clicked");
    } else {
        // Unmute the song
        document.querySelector('.volume-svg').src = document.querySelector('.volume-svg').src.replace("mute.svg", "volume.svg");
        currentSong.volume = previousVolume;  // Set the restored volume
        document.querySelector(".vol input").value = previousVolume * 100;  // Set the slider to previous value
    }
})

function playpause() {
    if (currentSong.paused) {
        currentSong.play()
        play.src = "./svg/pause.svg"
        console.log("song is playing");
    } else {
        currentSong.pause()
        play.src = "./svg/play.svg"
        console.log("song is paused");
    }
}

function pre() {
    let index = songs.indexOf(decodeURIComponent(currentSong.src.split('/').pop())); // Get the current song index
    console.log("Current song index:", index);

    if ((index - 1) >= 0) {
        playMusic(songs[index - 1]); // Play the previous song
    } else {
        console.log("No previous song available");
    }
}

function nex() {
    let index = songs.indexOf(decodeURIComponent(currentSong.src.split('/').pop())); // Get the current song index
    console.log("Current song index:", index);

    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1]); // Play the next song
    } else {
        console.log("No next song available");
    }
}
