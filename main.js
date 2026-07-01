/* ==========================================================================
   JAVASCRIPT CONTROLLER - LES RIDEAUX DE DOUCHE (RDD)
   ========================================================================== */

// Track playlists database
const PLAYLISTS = {
    live_scout: [
        { title: "Under my Thumb", file: "audio/live_scout/Under my thumb.mp3" },
        { title: "Sweet Home Chicago", file: "audio/live_scout/Sweet home chicago.mp3" },
        { title: "New York avec toi", file: "audio/live_scout/New York avec toi.mp3" },
        { title: "A Little Help from my Friend", file: "audio/live_scout/A little help from my friend.mp3" },
        { title: "Sunshine of your Love", file: "audio/live_scout/Sunshine of your love.mp3" },
        { title: "I Shot the Sheriff", file: "audio/live_scout/I shot the sheriff.mp3" },
        { title: "Get Back", file: "audio/live_scout/Get back.mp3" },
        { title: "Hey Joe", file: "audio/live_scout/Hey Joe.mp3" },
        { title: "Cocaïne", file: "audio/live_scout/Cocaine.mp3" },
        { title: "Can't Find my Way Home", file: "audio/live_scout/Cant find my way home.mp3" }
    ],
    garage_sound: [
        { title: "Jumpin' Jack Flash", file: "audio/garage_sound/Jumpin' jack flash.mp3" },
        { title: "Time is on my side", file: "audio/garage_sound/Time is on my side.mp3" },
        { title: "Rido!", file: "audio/garage_sound/Rido!.mp3" },
        { title: "Jazz Funk Rock Merde", file: "audio/garage_sound/Jazz Funk Rock merde.mp3" },
        { title: "Johnny Be Good", file: "audio/garage_sound/Johnny be good.mp3" },
        { title: "Blowing in the Wind", file: "audio/garage_sound/Blowing in the wind.mp3" },
        { title: "Twist and Shout", file: "audio/garage_sound/Twist and shout.mp3" },
        { title: "Sympathy for the Devil", file: "audio/garage_sound/Sympathy for the devil.mp3" },
        { title: "Day Tripper", file: "audio/garage_sound/Day tripper.mp3" },
        { title: "Viva", file: "audio/garage_sound/Viva.mp3" },
        { title: "Paint it Black", file: "audio/garage_sound/Paint it black.mp3" },
        { title: "Goodbye Blues", file: "audio/garage_sound/Goodbye blues.mp3" },
        { title: "Hey Joe", file: "audio/garage_sound/Hey Joe.mp3" }
    ],
    rarities: [
        { title: "La Grosse Jocelyne (K7)", file: "audio/K7/La Grosse Jocelyne.mp3" },
        { title: "Hey Joe (K7 Live)", file: "audio/K7/hey joe.mp3" },
        { title: "Inédit RDD Live (Rare)", file: "audio/Inedit_RDD_live.mp3" }
    ],
    simone: [
        { title: "Blue Blues", file: "audio/sons/blue.mp3" },
        { title: "Green Blues", file: "audio/sons/green.mp3" },
        { title: "Root Blues", file: "audio/sons/root.mp3" },
        { title: "Centre du Jeu", file: "audio/sons/centre_du_jeu.mp3" }
    ]
};

// Album Metadata for covers and subheadings
const ALBUM_METADATA = {
    live_scout: {
        title: "Live Scout (1990)",
        art: "images/live_scout_cover.png"
    },
    garage_sound: {
        title: "Garage Sound (1991)",
        art: "images/garage_sound_cover.png"
    },
    rarities: {
        title: "Cassettes & Inédits",
        art: "images/K7_cover.png"
    },
    simone: {
        title: "Simone & les Garçons",
        art: "images/simone_cover.png"
    }
};

// State Variables
let currentPlaylistKey = "live_scout";
let currentTrackIndex = 0;
let isPlaying = false;

// DOM Elements
const audio = document.getElementById("audio-element");
const playPauseBtn = document.getElementById("btn-play-pause");
const playIcon = document.getElementById("play-icon");
const prevBtn = document.getElementById("btn-prev");
const nextBtn = document.getElementById("btn-next");
const progressBarBg = document.getElementById("progress-bar-bg");
const progressBarFill = document.getElementById("progress-bar-fill");
const timeCurrentLabel = document.getElementById("time-current");
const timeTotalLabel = document.getElementById("time-total");
const volumeSlider = document.getElementById("volume-slider");
const volumeIcon = document.getElementById("volume-icon");
const currentTrackTitle = document.getElementById("current-track-title");
const currentAlbumTitle = document.getElementById("current-album-title");
const playerAlbumArt = document.getElementById("player-album-art");
const playerVinyl = document.getElementById("player-vinyl");
const playerContainer = document.querySelector(".player-container");
const tracklistBody = document.getElementById("tracklist-body");
const tabButtons = document.querySelectorAll(".tab-btn");
const menuToggle = document.getElementById("menu-toggle-btn");
const navMenu = document.getElementById("nav-links-menu");
const statsTotal = document.getElementById("stats-total");
const statsYear = document.getElementById("stats-year");
const statsMonth = document.getElementById("stats-month");

/* ==========================================================================
   1. Audio Player Logic
   ========================================================================== */

// Initialize player
function initPlayer() {
    // Explicitly make sure the Live Scout tab is marked active on load
    const defaultTab = document.getElementById("tab-live-scout");
    if (defaultTab) {
        tabButtons.forEach(btn => btn.classList.remove("active"));
        defaultTab.classList.add("active");
    }
    loadTrack(currentPlaylistKey, 0, false);
    renderTracklist();
    setupVolume();
}

// Load a specific track
function loadTrack(playlistKey, index, startPlaying = true) {
    currentPlaylistKey = playlistKey;
    currentTrackIndex = index;
    const track = PLAYLISTS[playlistKey][index];
    const albumMeta = ALBUM_METADATA[playlistKey];

    audio.src = track.file;
    currentTrackTitle.textContent = track.title;
    currentAlbumTitle.textContent = albumMeta.title;
    
    // Attempt loading custom cover, fallback to Jimi Hendrix logo if load fails
    playerAlbumArt.src = albumMeta.art;
    playerAlbumArt.onerror = function() {
        playerAlbumArt.src = "images/JimHen.gif";
    };

    // Reset progress visual
    progressBarFill.style.width = "0%";
    timeCurrentLabel.textContent = "0:00";
    timeTotalLabel.textContent = "0:00";

    // Update active visual in list
    updateActiveTrackRow();

    if (startPlaying) {
        playAudio();
    }
}

// Play Audio
function playAudio() {
    audio.play().then(() => {
        isPlaying = true;
        playIcon.className = "fa-solid fa-pause";
        playerContainer.classList.add("playing");
    }).catch(err => {
        console.log("Lecture audio bloquée ou échouée :", err);
    });
}

// Pause Audio
function pauseAudio() {
    audio.pause();
    isPlaying = false;
    playIcon.className = "fa-solid fa-play";
    playerContainer.classList.remove("playing");
}

// Toggle Play/Pause
function togglePlay() {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

// Previous Track
function prevTrack() {
    let newIndex = currentTrackIndex - 1;
    if (newIndex < 0) {
        newIndex = PLAYLISTS[currentPlaylistKey].length - 1;
    }
    loadTrack(currentPlaylistKey, newIndex, isPlaying);
}

// Next Track
function nextTrack() {
    let newIndex = currentTrackIndex + 1;
    if (newIndex >= PLAYLISTS[currentPlaylistKey].length) {
        newIndex = 0;
    }
    loadTrack(currentPlaylistKey, newIndex, isPlaying);
}

// Format duration from seconds to MM:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update progress bar & timers
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBarFill.style.width = `${progressPercent}%`;
        timeCurrentLabel.textContent = formatTime(currentTime);
        timeTotalLabel.textContent = formatTime(duration);
    }
}

// Click on progress bar to seek
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// Configure Volume controls
function setupVolume() {
    audio.volume = volumeSlider.value;
    volumeSlider.addEventListener("input", (e) => {
        audio.volume = e.target.value;
        updateVolumeIcon(e.target.value);
    });
}

// Update Volume Icon representation
function updateVolumeIcon(val) {
    if (val == 0) {
        volumeIcon.className = "fa-solid fa-volume-xmark";
    } else if (val < 0.4) {
        volumeIcon.className = "fa-solid fa-volume-low";
    } else {
        volumeIcon.className = "fa-solid fa-volume-high";
    }
}

/* ==========================================================================
   2. UI & Playlist Rendering
   ========================================================================== */

// Render tracks inside table
function renderTracklist() {
    tracklistBody.innerHTML = "";
    const tracks = PLAYLISTS[currentPlaylistKey];

    // Update playlist description dynamically
    const descContainer = document.getElementById("playlist-description-container");
    const descText = document.getElementById("playlist-description-text");
    if (descContainer && descText) {
        if (currentPlaylistKey === "simone") {
            descText.innerHTML = `<i class="fa-solid fa-info-circle" style="color: var(--primary-light); margin-right: 6px;"></i> <strong>Simone & les Garçons</strong> : Le groupe coup de cœur du nouveau millénaire, considérés comme les "enfants spirituels des RDD". Retrouvez ici leur triple single blues d'origine et la maquette inédite "Centre du Jeu".`;
            descContainer.style.display = "block";
        } else {
            descContainer.style.display = "none";
        }
    }

    tracks.forEach((track, index) => {
        const tr = document.createElement("tr");
        tr.setAttribute("data-index", index);
        
        // Add active style if it's the currently loaded track
        if (index === currentTrackIndex) {
            tr.className = "active-track";
        }

        tr.innerHTML = `
            <td class="track-number">${index + 1}</td>
            <td>${track.title}</td>
            <td style="text-align: right;">
                <button class="play-track-icon" aria-label="Écouter ${track.title}">
                    <i class="fa-solid ${isPlaying && index === currentTrackIndex ? 'fa-circle-pause' : 'fa-circle-play'}"></i>
                </button>
            </td>
        `;

        // Row selection trigger
        tr.addEventListener("click", () => {
            if (currentTrackIndex === index && isPlaying) {
                pauseAudio();
                tr.querySelector(".play-track-icon i").className = "fa-solid fa-circle-play";
            } else {
                loadTrack(currentPlaylistKey, index, true);
            }
        });

        tracklistBody.appendChild(tr);
    });
}

// Update active highlight row in table
function updateActiveTrackRow() {
    const rows = tracklistBody.querySelectorAll("tr");
    rows.forEach((row, index) => {
        const btnIcon = row.querySelector(".play-track-icon i");
        if (index === currentTrackIndex) {
            row.className = "active-track";
            btnIcon.className = isPlaying ? "fa-solid fa-circle-pause" : "fa-solid fa-circle-play";
        } else {
            row.className = "";
            btnIcon.className = "fa-solid fa-circle-play";
        }
    });
}

/* ==========================================================================
   3. Event Listeners & Navigation
   ========================================================================== */

// Event Listeners setup
playPauseBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevTrack);
nextBtn.addEventListener("click", nextTrack);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", nextTrack); // Auto play next track
progressBarBg.addEventListener("click", setProgress);

// Audio load meta listener
audio.addEventListener("loadedmetadata", () => {
    timeTotalLabel.textContent = formatTime(audio.duration);
});

// Playlist Tabs switcher
tabButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        tabButtons.forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
        
        const playlistKey = e.target.getAttribute("data-playlist");
        loadTrack(playlistKey, 0, isPlaying);
        renderTracklist();
    });
});

// Update table play pause icon state on generic audio state updates
audio.addEventListener("play", () => {
    playIcon.className = "fa-solid fa-pause";
    playerContainer.classList.add("playing");
    updateActiveTrackRow();
});

audio.addEventListener("pause", () => {
    playIcon.className = "fa-solid fa-play";
    playerContainer.classList.remove("playing");
    updateActiveTrackRow();
});

// Responsive Mobile Menu
menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    const icon = menuToggle.querySelector("i");
    if (navMenu.classList.contains("active")) {
        icon.className = "fa-solid fa-xmark";
    } else {
        icon.className = "fa-solid fa-bars";
    }
});

// Close mobile menu when clicking nav link
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.querySelector("i").className = "fa-solid fa-bars";
        
        // Manual active class toggle
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
    });
});

// Scrollspy navigation link highlighting
window.addEventListener("scroll", () => {
    let current = "";
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-links a");
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 120)) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(item => {
        item.classList.remove("active");
        if (item.getAttribute("href") === `#${current}`) {
            item.classList.add("active");
        }
    });
});

/* ==========================================================================
   4. Mock Visitor Counter & Page Load initialization
   ========================================================================== */

// Real Page Views Counter using free public CounterAPI
async function runVisitorCounter() {
    const historicalBase = 28430;
    
    const updateStatsDOM = (count) => {
        if (statsTotal) statsTotal.textContent = count.toLocaleString('fr-FR');
        if (statsYear) statsYear.textContent = (Math.floor(count * 0.045) + 120).toLocaleString('fr-FR');
        if (statsMonth) statsMonth.textContent = (Math.floor(count * 0.004) + 12).toLocaleString('fr-FR');
    };

    try {
        const response = await fetch("https://api.counterapi.dev/v1/rdd_visitors/page_hits/up");
        if (response.ok) {
            const data = await response.json();
            const realCount = historicalBase + (data.count || 1);
            updateStatsDOM(realCount);
            return;
        }
    } catch (err) {
        console.warn("Failed to fetch real visitor count, falling back to simulation:", err);
    }
    
    // Fallback simulation if the API is down
    let fallbackCount = historicalBase + 450;
    if (sessionStorage.getItem("rdd_visitors")) {
        fallbackCount = parseInt(sessionStorage.getItem("rdd_visitors"));
    }
    updateStatsDOM(fallbackCount);
    
    setInterval(() => {
        if (Math.random() > 0.4) {
            fallbackCount += Math.floor(Math.random() * 3) + 1;
            updateStatsDOM(fallbackCount);
            sessionStorage.setItem("rdd_visitors", fallbackCount);
        }
    }, 4500);
}

// Run player and views counter on window load
window.addEventListener("DOMContentLoaded", () => {
    initPlayer();
    runVisitorCounter();
    setupDamienSound();
    setupGuestbook();
});

// Damien Sound Trigger Logic
function setupDamienSound() {
    const playSound = (e) => {
        e.preventDefault();
        const damienAudio = new Audio("audio/sons/damien.wav");
        damienAudio.play().catch(err => console.log("Failed to play sound:", err));
    };

    const memberCard = document.getElementById("member-damien");
    const textLink1 = document.getElementById("damien-sound-trigger-text");
    const textLink2 = document.getElementById("damien-sound-trigger-text2");

    if (memberCard) memberCard.addEventListener("click", playSound);
    if (textLink1) textLink1.addEventListener("click", playSound);
    if (textLink2) textLink2.addEventListener("click", playSound);
}

/* ==========================================================================
   5. Livre d'Or (Guestbook) Logic using Google Sheets API
   ========================================================================== */

const GUESTBOOK_API_URL = "https://script.google.com/macros/s/AKfycbwZGqAvPDqnANKaGimUbRYZYWuPba-saOIAAwSjcwKovakpVzRTApwsZUZgxkJVpeC5mQ/exec";
let guestbookMessages = [];

async function setupGuestbook() {
    const form = document.getElementById("guestbook-form-element");
    const nameInput = document.getElementById("form-name");
    const messageInput = document.getElementById("form-message");
    const submitBtn = document.getElementById("form-submit-btn");
    const feedback = document.getElementById("form-feedback");
    const container = document.getElementById("guestbook-board-container");

    if (!container) return;

    // 1. Load existing messages
    async function loadMessages() {
        try {
            const response = await fetch(GUESTBOOK_API_URL);
            if (response.ok) {
                const data = await response.json();
                guestbookMessages = data.messages || [];
                renderMessages();
            } else {
                container.innerHTML = `<div class="text-center text-muted" style="padding: 20px;">Erreur de chargement des messages.</div>`;
            }
        } catch (err) {
            console.error("Failed to load guestbook messages:", err);
            container.innerHTML = `<div class="text-center text-muted" style="padding: 20px;">Impossible de se connecter au Livre d'Or.</div>`;
        }
    }

    // 2. Render messages in DOM
    function renderMessages() {
        const seedMessages = [
            {
                "name": "Dada Fan",
                "text": "Les RDD c'est toute ma jeunesse ! J'ai encore la cassette d'époque de Live Scout (1990) dans mon tiroir. Quel kiff de retrouver les morceaux en ligne !",
                "date": "04/05/2026"
            },
            {
                "name": "Rockeur d'Angers",
                "text": "Super la modernisation du site ! Très propre et pro. Simone et les garçons ont bien pris la relève spirituelle, le morceau 'Centre du jeu' déchire.",
                "date": "12/06/2026"
            },
            {
                "name": "Mélomane Grunge",
                "text": "Quel plaisir de réécouter 'Under my thumb' et 'Cocaine' en live brut. RDD forever !",
                "date": "28/06/2026"
            }
        ];
        
        // Merge seeds with sheet messages
        const allMessages = [...seedMessages, ...guestbookMessages];
        
        container.innerHTML = "";
        // Render newest messages first (so new submissions are at the top)
        [...allMessages].reverse().forEach(msg => {
            const entry = document.createElement("div");
            entry.className = "guestbook-entry";
            
            // Basic sanitization
            const cleanName = msg.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const cleanText = msg.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            
            // Format date if it's an ISO timestamp from Google Sheets
            let cleanDate = msg.date.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            if (cleanDate.includes("T")) {
                const d = new Date(cleanDate);
                if (!isNaN(d.getTime())) {
                    cleanDate = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                }
            }

            entry.innerHTML = `
                <div class="guestbook-entry-header">
                    <span class="guestbook-author">${cleanName}</span>
                    <span class="guestbook-date">${cleanDate}</span>
                </div>
                <div class="guestbook-text">${cleanText}</div>
            `;
            container.appendChild(entry);
        });
    }

    // 3. Handle message submit
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const name = nameInput.value.trim();
            const text = messageInput.value.trim();
            if (!name || !text) return;

            // Disable button and show sending state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Publication...`;
            feedback.style.display = "none";

            // Format date as DD/MM/YYYY
            const now = new Date();
            const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

            const newMsg = { name, text, date: dateStr };

            try {
                // Send new message to Google Apps Script Web App
                // Using x-www-form-urlencoded and no-cors mode to bypass browser CORS preflight & redirect restrictions
                const formData = new URLSearchParams({
                    name: name,
                    text: text,
                    date: dateStr
                });

                await fetch(GUESTBOOK_API_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData.toString()
                });

                // Under 'no-cors' mode, we won't receive the response body, but the fetch resolves successfully on network receipt.
                guestbookMessages.push(newMsg);
                renderMessages();
                
                // Reset form & show success feedback
                nameInput.value = "";
                messageInput.value = "";
                feedback.style.color = "#00ffcc";
                feedback.textContent = "Message publié avec succès ! Merci de votre soutien.";
                feedback.style.display = "block";
            } catch (err) {
                console.error("Failed to post message:", err);
                feedback.style.color = "var(--secondary)";
                feedback.textContent = "Erreur lors de la publication. Veuillez réessayer.";
                feedback.style.display = "block";
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fa-solid fa-pen-fancy"></i> Publier sur le Livre d'Or`;
            }
        });
    }

    // Initial load
    await loadMessages();
}

