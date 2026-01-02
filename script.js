const API_KEY = "AIzaSyCjWH-e5A0oOC0LMuSI4LK7m-gzudnvj9Y"; // Replace with your API key  
const PLAYLIST_ID = "PLYazKoZJJto_fOBHijYa1fWwZK7l0SVy5"; // Replace with your playlist ID  
const MAX_VIDEOS = 20; // Number of videos to fetch (max 50 per request)  
 
// DOM Elements  
const playerContainer = document.getElementById("player-container");  
const playlistItemsContainer = document.getElementById("playlist-items");  
 
// Global Variables  
let player; // YouTube player instance  
let playlistItems = []; // Stores fetched playlist data  
async function fetchPlaylistItems() {  
    try {  
        const response = await fetch(  
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=${MAX_VIDEOS}&key=${API_KEY}`  
        );  
 
        if (!response.ok) throw new Error("Failed to fetch playlist");  
 
        const data = await response.json();  
        playlistItems = data.items; // Store items in global array  
        renderPlaylistItems(); // Render list after fetching  
        initPlayer(); // Initialize player with first video  
    } catch (error) {  
        console.error("Error fetching playlist:", error);  
        playlistItemsContainer.innerHTML = `<p>Error loading playlist: ${error.message}</p>`;  
    }  
}  
 
// Call the function to load data  
fetchPlaylistItems(); 
function initPlayer() {  
    if (playlistItems.length === 0) return;  
 
    // Get the first video's ID from the playlist  
    const firstVideoId = playlistItems[0].snippet.resourceId.videoId;  
 
    // Create player instance  
    player = new YT.Player(playerContainer, {  
        height: "100%",  
        width: "100%",  
        videoId: firstVideoId,  
        playerVars: {  
            autoplay: 0, // Disable autoplay by default  
            controls: 1, // Show YouTube controls  
            rel: 0, // Hide related videos at end  
            modestbranding: 1 // Remove YouTube logo  
        }  
    });  
}  
 
// YouTube IFrame API callback (required by the API)  
window.onYouTubeIframeAPIReady = () => {  
    // Player initialization is handled in fetchPlaylistItems()  
}; 
function renderPlaylistItems() {  
    playlistItemsContainer.innerHTML = ""; // Clear existing content  
 
    playlistItems.forEach((item, index) => {  
        const videoId = item.snippet.resourceId.videoId;  
        const title = item.snippet.title;  
        const thumbnail = item.snippet.thumbnails.default.url; // Use "medium" for larger thumbnails  
 
        // Create list item element  
        const listItem = document.createElement("div");  
        listItem.className = `playlist-item ${index === 0 ? "active" : ""}`; // Mark first item as active  
        listItem.dataset.videoId = videoId; // Store video ID for later  
 
        // Item HTML  
        listItem.innerHTML = `  
            <img src="${thumbnail}" alt="${title}" class="playlist-thumbnail">  
            <div class="playlist-info">  
                <h4 class="playlist-title">${title}</h4>  
            </div>  
        `;  
 
        // Add click event to switch videos  
        listItem.addEventListener("click", () => switchVideo(videoId, listItem));  
 
        // Append to container  
        playlistItemsContainer.appendChild(listItem);  
    });  
}  
function switchVideo(videoId, listItem) {  
    // Update player to new video  
    player.loadVideoById(videoId);  
 
    // Update active list item  
    document.querySelectorAll(".playlist-item").forEach(item => {  
        item.classList.remove("active");  
    });  
    listItem.classList.add("active");  
 
    // Optional: Scroll active item into view  
    listItem.scrollIntoView({ behavior: "smooth", block: "nearest" });  
}  
async function fetchVideoDurations() {  
    const videoIds = playlistItems.map(item => item.snippet.resourceId.videoId).join(",");  
    const response = await fetch(  
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`  
    );  
    const data = await response.json();  
    return data.items;  
}  
playerVars: {  
    autoplay: 1, // Enable autoplay  
    shuffle: 1, // Shuffle playlist (requires playlistId in playerVars)  
    playlist: PLAYLIST_ID // Required for shuffle/autoplay  
}   