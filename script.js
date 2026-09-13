// Impor Firebase Realtime Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Konfigurasi Firebase Anda (Sesuaikan link database Anda)
const firebaseConfig = {
    databaseURL: "https://<DATABASE_NAME>.firebasedatabase.app" 
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Indikator Online untuk Panel Admin
const statusRef = ref(db, 'status/target');
set(statusRef, "ONLINE");

// Mendengarkan Perintah dari Panel Admin (Trigger Jumpscare)
const triggerRef = ref(db, 'control/trigger');
onValue(triggerRef, (snapshot) => {
    const data = snapshot.val();
    if (data === true) {
        jalankanJumpscare();
    }
});

// Fungsi Jumpscare Full Layar & Suara Maksimal
function jalankanJumpscare() {
    // 1. Putar Suara Teriakan dengan Volume Maksimal (1.0)
    const audio = new Audio('screamer.mp3');
    audio.volume = 1.0; // Mengatur volume web ke 100%
    audio.play().catch(e => console.log("Audio diblokir browser"));

    // 2. Buat Tampilan Jumpscare Full Layar (Menutupi segalanya)
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '999999999'; // Pastikan paling atas
    overlay.style.backgroundColor = '#000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.overflow = 'hidden';

    const img = document.createElement('img');
    img.src = 'jump.jpg';
    img.style.width = '100vw';
    img.style.height = '100vh';
    img.style.objectFit = 'cover'; // Memastikan gambar memenuhi layar penuh tanpa gepeng/terpotong
    img.style.position = 'absolute';

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    // 3. Paksa Masuk Mode Fullscreen (Layar Penuh Browser) jika didukung
    try {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        }
    } catch(err) {}
}

