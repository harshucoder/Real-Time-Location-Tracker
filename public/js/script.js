const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords; // Corrected typo
        console.log("Emitting location:", { latitude, longitude }); // Added for debugging
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

const map = L.map("map").setView([0, 0], 10);
// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "harsh"
}).addTo(map);

const markers = {};
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    console.log("Received location:", data); // Added for debugging
    map.setView([latitude, longitude], 16);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});
socket.on("user-disconnected", (userId) => {
    if (markers[userId]) {
        map.removeLayer(markers[userId]); // Remove the marker from the map
        delete markers[userId]; // Remove the marker from the markers object
    }
});