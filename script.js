const clientId = "55dc9af460ef459ca11eca67c9ec951b"; // aus Spotify Dashboard
const redirectUri = "https://beamngradiomod.vercel.app/callback.html";  // Überprüfen, dass diese URI auch in Spotify Developer korrekt ist

let token = localStorage.getItem("spotify_token");
if (token) {
  // Hier geht die Anfrage an die Spotify API
  const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: "Bearer " + token }
  });
}


function login() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=user-read-playback-state%20user-modify-playback-state`;
    window.location.href = authUrl;
}

async function play() {
  await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: { Authorization: "Bearer " + token }
  });
}

async function pause() {
  await fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "PUT",
    headers: { Authorization: "Bearer " + token }
  });
}

async function next() {
  await fetch("https://api.spotify.com/v1/me/player/next", {
    method: "POST",
    headers: { Authorization: "Bearer " + token }
  });
}

window.onload = async () => {
  if (token) {
    document.getElementById("controls").style.display = "block";
    const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: "Bearer " + token }
    });
    if (res.ok) {
      const data = await res.json();
      document.getElementById("song-info").innerText = `${data.item.name} – ${data.item.artists[0].name}`;
    }
  }
}
