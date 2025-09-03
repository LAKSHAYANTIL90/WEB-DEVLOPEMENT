let currentSong = new Audio();
let songs = [];
let currFolder = "songs";
let currentIndex = 0;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Fetch songs
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let e of as) {
    if (e.href.endsWith(".mp3")) {
      songs.push(e.href.split(`/${folder}/`)[1]);
    }
  }

  let libList = document.querySelector(".library-list");
  libList.innerHTML = "";

  // extract artist name from folder
  let folderParts = folder.split("/");
  let artistName = decodeURIComponent(folderParts[folderParts.length - 1]);

  for (const song of songs) {
    //  Clean display name
    let displayName = decodeURIComponent(song)
      .replace(".mp3", "")
      .replace(/_/g, " ")
      .trim();

    let baseName = song.replace(".mp3", "");

    // Default image
    let imgSrc = "img/music.svg";

    // Try song-specific image
    let imgPaths = [
      `/${folder}/${baseName}.jpg`,
      `/${folder}/${baseName}.jpeg`,
      `/${folder}/${baseName}.png`
    ];

    for (let path of imgPaths) {
      try {
        let res = await fetch(path);
        if (res.ok) {
          imgSrc = path;
          break;
        }
      } catch (e) { }
    }

    // If no song image found, try album cover
    if (imgSrc === "img/music.svg") {
      try {
        let res = await fetch(`/${folder}/cover.jpg`);
        if (res.ok) imgSrc = `/${folder}/cover.jpg`;
      } catch (e) { }
    }

    // Use cleaned names
    libList.innerHTML += `
      <div class="library-item" data-file="${song}">
        <img class="artist-avatar" src="${imgSrc}" alt="${displayName}">
        <div class="library-item-info">
          <h4>${displayName}</h4>
          <p>${artistName}</p>
        </div>
      </div>`;
  }

  // click handling
  document.querySelectorAll(".library-item").forEach((item, idx) => {
    item.addEventListener("click", () => {
      playMusic(item.getAttribute("data-file"));
      currentIndex = idx;
      document.querySelector(".right-panel").classList.remove("hidden");
    });
  });
  return songs;
}

// Play Music
function playMusic(track, pause = false) {
  currentSong.src = `/${currFolder}/` + track;
  currentIndex = songs.indexOf(track);

  if (!pause) {
    currentSong.play();
    document.getElementById("play").src = "img/pause.svg";
  }

  // ✅ Clean display name
  let displayName = decodeURIComponent(track)
    .replace(".mp3", "")
    .replace(/_/g, " ")
    .trim();

  //  Artist name from folder
  let folderParts = currFolder.split("/");
  let artistName = decodeURIComponent(folderParts[folderParts.length - 1]);

  //  Update UI text
  document.getElementById("player-title").innerText = displayName;
  document.getElementById("player-title-bottom").innerText = displayName;
  document.getElementById("player-artist").innerText = artistName;
  document.getElementById("player-artist-bottom").innerText = artistName;

  //  Update images
  let art = document.getElementById("player-album-art");
  let artBottom = document.getElementById("player-album-art-bottom");

  let baseName = track.replace(".mp3", "");
  let imgSrc = "img/music.svg"; // default fallback

  // Try song-specific images
  let imgPaths = [
    `/${currFolder}/${baseName}.jpg`,
    `/${currFolder}/${baseName}.jpeg`,
    `/${currFolder}/${baseName}.png`
  ];

  Promise.all(imgPaths.map(path =>
    fetch(path).then(res => res.ok ? path : null).catch(() => null)
  )).then(results => {
    let found = results.find(r => r !== null);
    if (found) {
      art.src = found;
      artBottom.src = found;
    } else {
      // Try cover.jpg
      fetch(`/${currFolder}/cover.jpg`).then(res => {
        if (res.ok) {
          art.src = `/${currFolder}/cover.jpg`;
          artBottom.src = `/${currFolder}/cover.jpg`;
        } else {
          art.src = "img/music.svg";
          artBottom.src = "img/music.svg";
        }
      }).catch(() => {
        art.src = "img/music.svg";
        artBottom.src = "img/music.svg";
      });
    }
  });
}


// Albums
async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let albumContainer = document.querySelector(".albumContainer");
  albumContainer.innerHTML = "";

  for (let e of anchors) {
    if (e.href.includes("/songs/") && !e.href.endsWith(".mp3")) {
      let folder = e.href.split("/").slice(-2)[0];
      try {
        let res = await fetch(`/songs/${folder}/info.json`);
        let info = await res.json();

        albumContainer.innerHTML += `
          <div class="card" data-folder="${folder}">
            <div class="album-cover">
              <img src="/songs/${folder}/cover.jpg" alt="${info.title}">
              <button class="album-play-btn" data-folder="${folder}">▶</button>
            </div>
            <h3>${info.title}</h3>
            <p>${info.description}</p>
          </div>`;
      } catch {
        console.warn("No info.json for folder", folder);
      }
    }
  }

  // Play album on click
  document.querySelectorAll(".album-play-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      let folder = btn.dataset.folder;
      songs = await getSongs(`songs/${folder}`);
      if (songs.length > 0) {
        playMusic(songs[0]);
        document.querySelector(".right-panel").classList.add("hidden");
      }
    });
  });
}

// Main
async function main() {
  songs = await getSongs("songs");
  if (songs.length > 0) playMusic(songs[0], true);
  await displayAlbums();

  // Controls
  document.getElementById("play").addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      document.getElementById("play").src = "img/pause.svg";
    } else {
      currentSong.pause();
      document.getElementById("play").src = "img/play.svg";
    }
  });

  document.getElementById("previous").addEventListener("click", () => {
    if (currentIndex > 0) playMusic(songs[currentIndex - 1]);
  });

  document.getElementById("next").addEventListener("click", () => {
    if (currentIndex < songs.length - 1) playMusic(songs[currentIndex + 1]);
  });

  // Progress bar
  currentSong.addEventListener("timeupdate", () => {
    document.getElementById("current-time").innerText =
      secondsToMinutesSeconds(currentSong.currentTime);
    document.getElementById("total-time").innerText =
      secondsToMinutesSeconds(currentSong.duration);
    document.querySelector(".progress-fill").style.width =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".progress").addEventListener("click", e => {
    let rect = e.target.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    currentSong.currentTime = currentSong.duration * percent;
  });

  // Volume
  document.querySelector(".volume-range").addEventListener("input", e => {
    currentSong.volume = e.target.value / 100;
    document.getElementById("volume-icon").src =
      currentSong.volume > 0 ? "img/volume.svg" : "img/mute.svg";
  });

  document.getElementById("volume-icon").addEventListener("click", e => {
    if (currentSong.volume > 0) {
      currentSong.volume = 0;
      document.querySelector(".volume-range").value = 0;
      e.target.src = "img/mute.svg";
    } else {
      currentSong.volume = 0.5;
      document.querySelector(".volume-range").value = 50;
      e.target.src = "img/volume.svg";
    }
  });
}
main();