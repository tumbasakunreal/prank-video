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
});

