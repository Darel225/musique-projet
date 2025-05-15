let currentTrack = 0;
let isPlaying = false;
let playlist = [];
const audio = new Audio();

function loadFiles(event) {
    const files = Array.from(event.target.files).slice(0, 5);
    if (playlist.length + files.length > 5) {
        showNotification("u can only add up to 5 songs");
        return;
    }
    playlist = [...playlist, ...files];
    renderPlaylist();
}

function renderPlaylist() {
    const playlistDiv = document.getElementById("playlist");
    playlistDiv.innerHTML = '';
    playlist.forEach((track, index) => {
        const trackElement = document.createElement("div");
        trackElement.className = "track";
        trackElement.innerHTML = `${index + 1}. ${track.name}`;
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "track-buttons";
        const deleteButton = document.createElement("i");
        deleteButton.className = "fas fa-trash";
        deleteButton.onclick = () => deleteTrack(index);
        buttonContainer.appendChild(deleteButton);
        trackElement.appendChild(buttonContainer);
        trackElement.onclick = () => selectTrack(index);
        playlistDiv.appendChild(trackElement);
    });
}

function playPause() {
    if (playlist.length === 0) {
        showNotification("no songs available to play");
        return;
    }

    if (isPlaying) {
        audio.pause();
        document.querySelector("#play-icon").classList.replace("fa-pause", "fa-play");
        showNotification("paused");
    } else {
        audio.play().catch(error => {
            console.error("404:", error);
        });
        document.querySelector("#play-icon").classList.replace("fa-play", "fa-pause");
        showNotification("playing");
    }
    isPlaying = !isPlaying;
}

function stopPlayback() {
    if (playlist.length === 0) {
        showNotification("no songs available to stop");
        return;
    }

    audio.pause();
    audio.currentTime = 0;
    document.querySelector("#play-icon").classList.replace("fa-pause", "fa-play");
    showNotification("stopped");
    isPlaying = false;
}

function selectTrack(trackIndex) {
    if (playlist.length === 0) {
        showNotification("no songs available to play");
        return;
    }

    currentTrack = trackIndex;
    audio.src = URL.createObjectURL(playlist[currentTrack]);
    audio.play().catch(error => {
        console.error("404:", error);
    });
    isPlaying = true;
    updateDuration();
    showNotification(`playing: ${playlist[currentTrack].name}`);
    document.querySelector("#play-icon").classList.replace("fa-play", "fa-pause");
}

function updateDuration() {
    const progressBar = document.getElementById("progress-bar");

    audio.onloadedmetadata = () => {
        document.getElementById("total-duration").textContent = formatTime(audio.duration);
        progressBar.max = audio.duration;
    };

    audio.ontimeupdate = () => {
        document.getElementById("current-time").textContent = formatTime(audio.currentTime);
        progressBar.value = audio.currentTime;
    };
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}

function seekAudio() {
    audio.currentTime = document.getElementById("progress-bar").value;
}

function nextTrack() {
    currentTrack = (currentTrack === playlist.length - 1) ? 0 : currentTrack + 1;
    selectTrack(currentTrack);
}

function prevTrack() {
    currentTrack = (currentTrack === 0) ? playlist.length - 1 : currentTrack - 1;
    selectTrack(currentTrack);
}

function changeVolume() {
    audio.volume = document.getElementById("volume").value;
    document.getElementById("volume-display").innerText = `${Math.floor(audio.volume * 100)}%`;
}

function changeSpeed() {
    audio.playbackRate = document.getElementById("speed").value;
    document.getElementById("speed-display").innerText = `${audio.playbackRate}x`;
}

function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notification-text");
    notificationText.innerText = message;
    notification.style.display = "flex";
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

function hideNotification() {
    document.getElementById("notification").style.display = "none";
}

function deleteTrack(index) {
    playlist.splice(index, 1);
    renderPlaylist();
    showNotification("track deleted");
}
            