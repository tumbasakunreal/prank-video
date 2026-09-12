// Import Firebase SDK dari CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyChOVPFqBphS5ScSOOBcySUGEWk1shcLn4",
    authDomain: "prank-video-control.firebaseapp.com",
    databaseURL: "https://prank-video-control-default-rtdb.firebaseio.com/",
    projectId: "prank-video-control",
    storageBucket: "prank-video-control.firebasestorage.app",
    messagingSenderId: "36656925961",
    appId: "1:36656925961:web:1002decbd04cfb908c57d8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", function() {
    const video = document.querySelector(".video-box video");
    
    // Laporkan status target ONLINE ke database
    const statusRef = ref(db, 'target_status');
    set(statusRef, { online: true, lastSeen: Date.now() });

    // Kirim sinyal heartbeat setiap 5 detik agar admin tahu target masih online
    setInterval(() => {
        set(statusRef, { online: true, lastSeen: Date.now() });
    }, 5000);

    let jumpscareOverlay = null;

    // Fungsi Jumpscare (bisa muncul singkat atau sesuai perintah)
    function showJumpscare(imagePath, soundPath) {
        if (video) video.pause();
        if (jumpscareOverlay) return; // Kalau sudah muncul, biarkan

        jumpscareOverlay = document.createElement("div");
        jumpscareOverlay.id = "jumpscare-box";
        jumpscareOverlay.style.position = "fixed";
        jumpscareOverlay.style.top = "0";
        jumpscareOverlay.style.left = "0";
        jumpscareOverlay.style.width = "100vw";
        jumpscareOverlay.style.height = "100vh";
        jumpscareOverlay.style.backgroundColor = "black";
        jumpscareOverlay.style.zIndex = "999999";
        jumpscareOverlay.style.display = "flex";
        jumpscareOverlay.style.justifyContent = "center";
        jumpscareOverlay.style.alignItems = "center";

        const img = document.createElement("img");
        img.src = imagePath;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        jumpscareOverlay.appendChild(img);

        if (soundPath) {
            const audio = new Audio(soundPath);
            audio.play().catch(e => console.log("Audio diblokir:", e));
        }

        document.body.appendChild(jumpscareOverlay);
    }

    // Fungsi Reset / Hilangkan Jumpscare
    function hideJumpscare() {
        if (jumpscareOverlay) {
            jumpscareOverlay.remove();
            jumpscareOverlay = null;
        }
        if (video) video.play();
    }

    // Mendengarkan perintah real-time dari Firebase
    const commandRef = ref(db, 'prank_command');
    onValue(commandRef, (snapshot) => {
        const cmd = snapshot.val();
        if (!cmd) return;

        if (cmd.action === "play") {
            hideJumpscare();
            if (video) video.play();
        } else if (cmd.action === "pause") {
            if (video) video.pause();
        } else if (cmd.action === "jumpscare") {
            // Gambar hantu / glitch & suara horor
            const jumpImg = cmd.image || "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop";
            const jumpSnd = cmd.sound || "https://www.myinstants.com/media/sounds/horror-scream.mp3";
            showJumpscare(jumpImg, jumpSnd);
        } else if (cmd.action === "reset") {
            hideJumpscare();
        }
    });
});

