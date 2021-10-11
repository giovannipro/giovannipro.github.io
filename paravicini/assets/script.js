let map_contaier = "my_map";

function load_map(){
	let map = L.map(map_contaier, {
		center: [45.8081, 9.0852],
		zoom: 9
	});

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 17,
		minZoom: 9,
		tileSize: 256
	}).addTo(map);
}

document.addEventListener("DOMContentLoaded", function(){
    load_map();
});