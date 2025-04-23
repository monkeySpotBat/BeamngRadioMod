const clientId = "55dc9af460ef459ca11eca67c9ec951b"; // aus Spotify Dashboard
const redirectUri = "https://beamngradiomod.vercel.app/callback.html";  // Überprüfen, dass diese URI auch in Spotify Developer korrekt ist

let token = localStorage.getItem("spotify_token");

// Funktion für die Anmeldung und Authentifizierung bei Spotify
async function login() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=user-read-playback-state%20user-modify-playback-state`;
    window.location.href = authUrl;
}

// Funktion für das Abspielen des aktuellen Songs
async function play() {
    await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: { Authorization: "Bearer " + token }
    });
}

// Funktion für das Pausieren des aktuellen Songs
async function pause() {
    await fetch("https://api.spotify.com/v1/me/player/pause", {
        method: "PUT",
        headers: { Authorization: "Bearer " + token }
    });
}

// Funktion für das Überspringen zum nächsten Song
async function next() {
    await fetch("https://api.spotify.com/v1/me/player/next", {
        method: "POST",
        headers: { Authorization: "Bearer " + token }
    });
}

// Die Logik, die ausgeführt wird, wenn die Seite vollständig geladen ist
window.onload = async () => {
    if (token) {
        // Wenn ein Token vorhanden ist, zeige die Steuerungselemente an
        document.getElementById("controls").style.display = "block";

        // Abrufen der aktuell wiedergegebenen Song-Informationen
        const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: { Authorization: "Bearer " + token }
        });

        if (res.ok) {
            const data = await res.json();
            // Anzeige der Song-Informationen
            document.getElementById("song-info").innerText = `${data.item.name} – ${data.item.artists[0].name}`;
        } else {
            alert("Fehler beim Abrufen der Song-Informationen");
        }
    } else {
        // Wenn kein Token vorhanden ist, zeige eine Login-Schaltfläche an
        document.getElementById("login-button").style.display = "block";
    }
};

// Callback-Logik für den Authentifizierungsvorgang
if (window.location.hash) {
    const params = new URLSearchParams(window.location.hash.substring(1)); // Extrahiert die URL-Parameter
    const accessToken = params.get("access_token");

    if (accessToken) {
        // Speichern des Tokens in LocalStorage und Weiterleitung
        localStorage.setItem("spotify_token", accessToken);
        window.location.href = "/";  // Zurück zur Startseite oder einer anderen Seite
    }
}
