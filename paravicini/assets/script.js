// map
let map_contaier = "my_map";
let min_zoom = 9;
// let fill_opacity = 1;
// let opacity = 1;
// let stroke_opacity = 1
// let radius = 2;

// markers
// let color = "red";

function load_map(){
	let map = L.map(map_contaier, {
		center: [45.8081, 9.0852],
		zoom: min_zoom
	});

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 17,
		minZoom: min_zoom,
		tileSize: 256
	}).addTo(map);

	function append_markers(){

		let min_lat = 45; 
		let max_lat = 46.5; 
		let min_lon = 8.5; 
		let max_lon = 9.5; 

		let myIcon_a = L.icon({
		    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
		    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		    iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});

		let myIcon_b = L.icon({
		    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
		    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		    iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});

		for (let markers = 0; markers < 300; markers++) {
			let lat = Math.random() * (max_lat - min_lat) + min_lat;
			let lon = Math.random() * (max_lon - min_lon) + min_lon;
			let tooltip_text = markers.toString();
			console.log(lat,lon)

			let icon = myIcon_a;
			if (markers % 2 == 0){
				icon = myIcon_a
			}
			else {
				icon = myIcon_b
			}

			let place = L.marker([lat, lon], {
				icon: icon,
				className: "place",
				id: "place_" + 1
			})
		   	.bindTooltip( tooltip_text , {
				permanent: false,
				interactive: true,
				noWrap: true,
				opacity: 0.9
			})
			.addTo(map)
			// .on('click', onClick);

			// place.on('mouseover', mouseover);
			// place.on('mouseout', mouseleave);

			// map.fitBounds(bounds, {
			// 	"padding": [80, 80],
			// 	"animate": true,
			//     "duration": 2
			// });	
		}
	}
	append_markers();
}



document.addEventListener("DOMContentLoaded", function(){
    load_map();
});