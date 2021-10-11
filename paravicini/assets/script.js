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

		let myIcon = L.icon({ // red green  // https://github.com/pointhi/leaflet-color-markers
		    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
		    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		    iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});

		let bounds = [];

		for (let markers = 0; markers < 150; markers++) {
			let name = "Castello di Trezzo";
			let ref = "BAMi, S.P.II.217, quaderno 2, cc. 29, 30";
			let description = "Disegni delle fortificazioni viscontee del castello di Trezzo datate «Trezzo, 3 settembre 1869»"
			let link = "https://neorenaissance.supsi.ch/cms/2021/10/05/nome-edificio-neo-rinascimentale/";

			let lat = Math.random() * (max_lat - min_lat) + min_lat;
			let lon = Math.random() * (max_lon - min_lon) + min_lon;
			let tooltip_text = "<span>" +
				"<strong>" + name + "</strong>" + "<br/>" +
				// description + "<br/>" + "<br/>" + 
				ref + "<br/>" +
				"<span>";
			console.log(lat,lon) 

			let popup_text = "<div>" +
				"<strong>" + name + "</strong>" + "<br/>" + 
				"<a href=" + link + " title=" + name + ">" + "maggiori informazioni" + "</a>"
				"</div>"

			let place = L.marker([lat, lon], {
				icon: myIcon,
				className: "place",
				id: "place_"
			})
			// .bindPopup(popup_text , {
			// 	maxWidth: 300
			// })
		   	.bindTooltip( tooltip_text , {
				permanent: false,
				interactive: true,
				noWrap: false,
				opacity: 0.9,
			})
			.addTo(map)
			.on('click', onClick);
		
			bounds.push([lat,lon])

			map.fitBounds(bounds, {
				"padding": [80, 80],
				"animate": true,
			    "duration": 2
			});	
			
			function onClick(){
				window.location = link; 
			}
		}

	}
	append_markers();
}



document.addEventListener("DOMContentLoaded", function(){
    load_map();
});