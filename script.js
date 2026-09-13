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

    // Kirim sinyal heartbeat setiap 5 detik
    setInterval(() => {
        set(statusRef, { online: true, lastSeen: Date.now() });
    }, 5000);

    let jumpscareOverlay = null;
    let autoCloseTimer = null;

    // Fungsi Jumpscare dengan kustomisasi gambar, suara, dan durasi
    function showJumpscare(imagePath, soundPath, durationInSeconds) {
        if (video) video.pause();
        if (jumpscareOverlay) return; // Jika sudah muncul, abaikan duplikat

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
            audio.play().catch(e => console.log("Audio diblokir browser:", e));
        }

        document.body.appendChild(jumpscareOverlay);

        // Jika durasi diisi lebih dari 0, otomatis hilang setelah sekian detik
        if (durationInSeconds && durationInSeconds > 0) {
            autoCloseTimer = setTimeout(() => {
                hideJumpscare();
            }, durationInSeconds * 1000);
        }
    }

    // Fungsi Reset / Hilangkan Jumpscare
    function hideJumpscare() {
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
            autoCloseTimer = null;
        }
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
            const jumpImg = cmd.image || "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop";
            const jumpSnd = cmd.sound || "https://www.myinstants.com/media/sounds/horror-scream.mp3";
            const duration = parseFloat(cmd.duration) || 0; // 0 artinya muncul terus sampai di-reset
            showJumpscare(jumpImg, jumpSnd, duration);
        } else if (cmd.action === "reset") {
            hideJumpscare();
        }
    });
});

