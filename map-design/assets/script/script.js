// basic setup ----------------------

const map = L.map('map', {
    center: [45.870673, 8.979357],
    zoom: 13,
    // minZoom: 0,
    // maxZoom: 17
    // zoomSnap: 0.25
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    // L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    // L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    // L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', {
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    // L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    // L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    
    // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CartoDB'
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
})
.addTo(map);

console.log()


// markers ----------------------

let marker = L.marker([45.870, 8.979])
    .bindPopup('Questo è un popup')
    .addTo(map)
