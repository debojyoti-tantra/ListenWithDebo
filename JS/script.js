console.log("Let's write script.js");
let currentSong = new Audio();
let songs;
let currFolder;

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
    let response = await fetch(`./${folder}/`);
    let textResponse = await response.text();
    let div = document.createElement("div");
    div.innerHTML = textResponse;
    let anchors = div.getElementsByTagName("a");
    
    songs = [];
    for (let index = 0; index < anchors.length; index++) {
        const element = anchors[index];
        
        if (element.href.endsWith("mp3")) {
            // songs.push(element.href.split(`/`)[5]);
            songs.push(element.href.split(`/`).slice(-1)[0]);
        }
    }

    // showing all the songs in .songs-series
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

const playMusic = (track, pause=false) => {
    // let audio = new Audio(`./songs/love/${track}`);
    currentSong.src = `./${currFolder}/` + track
    if(!pause){
        currentSong.play();
        play.src = "./svg/pause.svg"
    }

    document.querySelector(".songname").innerHTML = track.replaceAll("%20", " ").split(".mp3")[0]
    // document.querySelector(".duration").innerHTML = "00:00 / 00:00"

    // Set up event listener for when the song ends
    currentSong.onended = () => {
        let currentIndex = songs.indexOf(track);

        if (currentIndex + 1 < songs.length) {
            playMusic(songs[currentIndex + 1]);
        }
    };
}

async function displayAlbums() {
    let response = await fetch(`./songs/`);
    let textResponse = await response.text();
    let div = document.createElement("div");
    div.innerHTML = textResponse;
    let as = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card-container")
    
    // let array = Array.from(as)
    // for (let index = 0; index < array.length; index++) {
    //     const e = array[index];
    
    
    Array.from(as).forEach(async e=>{
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {            
            let folder = e.href.split("/").slice(-1)[0]
            // document.body.innerHTML = folder
            
            // Get the meta data of the folders
            let response = await fetch(`./songs/${folder}/info.json`);
            let textResponse = await response.json();
            
            // Display the all songs folders by cards
            cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card deeper-grey cur-poi" data-folder="${folder}">
                <img src="./songs/${folder}/cover.jpg" alt="love" width="130px">
                <p class="title white deeper-grey">${textResponse.title}</p>
                <p class="description white deeper-grey">${textResponse.description}</p>
            </div>`

        }
        // Load the playlists whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e=>{
            e.addEventListener("click", async item=>{
                songs = await getSongs(`./songs/${item.currentTarget.dataset.folder}/`);
                playMusic(songs[0])
            })
        })
        
    })
    
}

async function main() {

    // get the list of songs
    await getSongs("./songs/love");
    console.log(songs);

    // Play the first song from the folder on seekbar tab
    playMusic(songs[0], true)

    
    // Display all the albums in the page
    displayAlbums()


    // Attach an event listener to play
    play.addEventListener("click", ()=>{
        if (currentSong.paused) {
            currentSong.play()
            play.src = "./svg/pause.svg"

        } else {
            currentSong.pause()
            play.src = "./svg/play.svg"
        }
    })

    // Listen for time update event
    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime, currentSong.duration);
        // document.body.innerHTML = `${currentSong.currentTime}, ${currentSong.duration}`
        document.querySelector(".duration").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) *100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })

    // Attach an event listener to previous
    previous.addEventListener("click", ()=>{

        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        console.log(currentSong, index);

        if ((index-1) >= length) {
            playMusic(songs[index-1])
        }
    })

    // Attach an event listener to next
    next.addEventListener("click", ()=>{
        console.log("next clicked");

        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        console.log(currentSong, index);

        if ((index+1) < songs.length) {
            playMusic(songs[index+1])
        }
    })

    // Attach an event listener to volume
    document.querySelector(".vol").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log(e, e.target, e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100
    })

    // Load the playlists whenever card is clicked
    // Array.from(document.getElementsByClassName("card")).forEach(e=>{
    //     e.addEventListener("click", async item=>{
    //         songs = await getSongs(`./songs/${item.currentTarget.dataset.folder}/`);
    //     })
    // })

    // Add event listener to mute the track
    document.querySelector(".volume-svg").addEventListener("click", e=>{
        console.log(e.target);

        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".vol").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = 0.2;
            document.querySelector(".vol").getElementsByTagName("input")[0].value = 20;
        }
    })

}

main();