// Import Firebase SDK dari CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

// Konfigurasi Firebase dari project Anda
const firebaseConfig = {
    apiKey: "AIzaSyChOVPFqBphS5ScSOOBcySUGEWk1shcLn4",
    authDomain: "prank-video-control.firebaseapp.com",
    databaseURL: "https://prank-video-control-default-rtdb.firebaseio.com/",
    projectId: "prank-video-control",
    storageBucket: "prank-video-control.firebasestorage.app",
    messagingSenderId: "36656925961",
    appId: "1:36656925961:web:1002decbd04cfb908c57d8"
};

// Inisialisasi Firebase & Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", function() {
    const video = document.querySelector(".video-box video");

    // Fungsi utama untuk memicu jumpscare
    window.triggerJumpscare = function(imagePath, soundPath) {
        if (video) video.pause();

        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.backgroundColor = "black";
        overlay.style.zIndex = "999999";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";

        const img = document.createElement("img");
        img.src = imagePath;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        overlay.appendChild(img);

        if (soundPath) {
            const audio = new Audio(soundPath);
            audio.play().catch(e => console.log("Audio diblokir browser:", e));
        }

        document.body.appendChild(overlay);
    };

    // Mendengarkan sinyal dari Firebase secara real-time
    const prankRef = ref(db, 'prank_trigger');
    onValue(prankRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.active === true) {
            // Gambar dan suara jumpscare (bisa diganti link gambar/suara lain jika mau)
            const jumpImage = "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop"; 
            triggerJumpscare(jumpImage, null);
        }
    });
});

