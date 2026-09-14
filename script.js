// Impor Firebase Realtime Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Konfigurasi Firebase dengan URL Anda yang sebenarnya
const firebaseConfig = {
    databaseURL: "https://prank-video-control-default-rtdb.firebaseio.com" 
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 1. Set Status Target menjadi ONLINE pada jalur target_status
const statusRef = ref(db, 'target_status');
set(statusRef, {
    status: "ONLINE",
    lastSeen: Date.now()
});

let currentAudio = null;
let activeOverlay = null;

// 2. Mendengarkan Perintah dari Panel Admin pada jalur prank_command
const controlRef = ref(db, 'prank_command');
onValue(controlRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    const imageUrl = data.image || 'jump.jpg';
    const soundUrl = data.audio || 'ahhh.mp3';
    const duration = data.duration !== undefined ? parseInt(data.duration) : 0;
    const command = data.command;

    if (command === 'JUMPSCARE' || command === 'PLAY') {
        jalankanAksi(imageUrl, soundUrl, duration);
    } else if (command === 'RESET') {
        tutupSemua();
    }
});

function jalankanAksi(imgUrl, audioUrl, durationSec) {
    tutupSemua();

    if (audioUrl) {
        currentAudio = new Audio(audioUrl);
        currentAudio.volume = 1.0;
        currentAudio.play().catch(e => console.log("Audio diblokir browser"));
    }

    activeOverlay = document.createElement('div');
    activeOverlay.style.position = 'fixed';
    activeOverlay.style.top = '0';
    activeOverlay.style.left = '0';
    activeOverlay.style.width = '100vw';
    activeOverlay.style.height = '100vh';
    activeOverlay.style.zIndex = '999999999';
    activeOverlay.style.backgroundColor = '#000';
    activeOverlay.style.display = 'flex';
    activeOverlay.style.justifyContent = 'center';
    activeOverlay.style.alignItems = 'center';
    activeOverlay.style.overflow = 'hidden';

    const img = document.createElement('img');
    img.src = imgUrl;
    img.style.width = '100vw';
    img.style.height = '100vh';
    img.style.objectFit = 'cover';
    img.style.position = 'absolute';

    activeOverlay.appendChild(img);
    document.body.appendChild(activeOverlay);

    try {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
    } catch(err) {}

    if (durationSec > 0) {
        setTimeout(() => {
            tutupSemua();
        }, durationSec * 1000);
    }
}

function tutupSemua() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    if (activeOverlay) {
        activeOverlay.remove();
        activeOverlay = null;
    }
    try {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    } catch(err) {}
}

