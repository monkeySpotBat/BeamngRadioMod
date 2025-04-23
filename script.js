const clientId = "55dc9af460ef459ca11eca67c9ec951b";
const redirectUri = encodeURIComponent("https://beamngradiomod.vercel.app/callback.html");
let token = localStorage.getItem("spotify_token");

// Spotify Login Funktion
async function login() {
    const scope = 'user-read-playback-state user-modify-playback-state';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}&show_dialog=true`;
    window.location.href = authUrl;
}

// API Request Helper
async function spotifyApiRequest(url, method = 'GET') {
    try {
        const response = await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 401) {
            await handleUnauthorized();
            return null;
        }
        
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('API Request Error:', error);
        return null;
    }
}

// Handle Unauthorized
async function handleUnauthorized() {
    localStorage.removeItem("spotify_token");
    token = null;
    alert("Session expired. Please login again.");
    window.location.reload();
}

// Player Controls
async function play() {
    await spotifyApiRequest("https://api.spotify.com/v1/me/player/play", "PUT");
}

async function pause() {
    await spotifyApiRequest("https://api.spotify.com/v1/me/player/pause", "PUT");
}

async function next() {
    await spotifyApiRequest("https://api.spotify.com/v1/me/player/next", "POST");
}

// Update Player UI
async function updatePlayerUI() {
    const controls = document.getElementById("controls");
    const loginBtn = document.getElementById("login-button");
    const songInfo = document.getElementById("song-info");
    
    if (token) {
        const playerData = await spotifyApiRequest("https://api.spotify.com/v1/me/player");
        const currentTrack = await spotifyApiRequest("https://api.spotify.com/v1/me/player/currently-playing");
        
        if (playerData) {
            controls.style.display = "block";
            loginBtn.style.display = "none";
            
            if (currentTrack && currentTrack.item) {
                songInfo.innerText = `${currentTrack.item.name} - ${currentTrack.item.artists[0].name}`;
            } else {
                songInfo.innerText = "No track playing";
            }
        } else {
            controls.style.display = "none";
            loginBtn.style.display = "block";
        }
    } else {
        controls.style.display = "none";
        loginBtn.style.display = "block";
    }
}

// Handle Callback
function handleCallback() {
    if (window.location.hash) {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const newToken = params.get("access_token");
        
        if (newToken) {
            localStorage.setItem("spotify_token", newToken);
            token = newToken;
            window.history.replaceState({}, document.title, window.location.pathname);
            updatePlayerUI();
        }
    }
}

// Initialize
async function init() {
    handleCallback();
    await updatePlayerUI();
    
    // Event listeners
    document.getElementById("play-btn").addEventListener("click", play);
    document.getElementById("pause-btn").addEventListener("click", pause);
    document.getElementById("next-btn").addEventListener("click", next);
    document.getElementById("login-button").addEventListener("click", login);
}

// Start the app
document.addEventListener("DOMContentLoaded", init);
