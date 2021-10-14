// map
let map_contaier = "my_map";
let min_zoom = 9;

// markers
let myIcon = L.icon({ // red green  // https://github.com/pointhi/leaflet-color-markers
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

function tsvJSON(tsv) {
	const lines = tsv.split('\n');
	const headers = lines.slice(0, 1)[0].split('\t');
	return lines.slice(1, lines.length).map(line => {
	  const data = line.split('\t');
	  return headers.reduce((obj, nextKey, index) => {
	    obj[nextKey] = data[index];
	    return obj;
	  }, {});
	});
}


// load data
function load_data(){
	fetch("assets/data.tsv")
		.then(response => response.text())
		.then((data) => {
			load_map(data)
	 	})
}

function load_map(data){

	const buildings = tsvJSON(data);
	console.log(buildings)

	let map = L.map(map_contaier, {
		center: [45.881, 8.9852],
		zoom: min_zoom
	});

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 17,
		minZoom: min_zoom,
		tileSize: 256
	}).addTo(map);

	let category = "paravicini"

	// filter buildings
	let filter = document.getElementById("filter");

	// append markers
	function append_markers(category){

		filter.addEventListener ("change", function () {
			category = this.value;
			// console.log(category);

	       	document.querySelectorAll('.building').forEach(function(a){
				a.remove()
			})
			append_markers(category)
		});

		let min_lat = 45.4; 
		let max_lat = 46.5; 
		let min_lon = 8.5; 
		let max_lon = 9.5; 

		let bounds = [];

		buildings.forEach(function(entry){

			let name = entry.name;
			let lat = entry.lat;
			let lon = entry.lon;
			let ref = entry.ref;
			let cat = entry.category;
			let link = entry.link;

			let tooltip_text = "<span>" +
				"<strong>" + name + "</strong>" +
				"<span>";

			let building = L.marker([lat, lon], {
				icon: myIcon,
				id:  buildings
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
			L.DomUtil.addClass( building._icon, "building" );
			L.DomUtil.addClass( building._shadow, "building" );
		
			// bounds.push([lat,lon])

			// map.fitBounds(bounds, {
			// 	"padding": [80, 80],
			// 	"animate": true,
			//     "duration": 2
			// });	
			
			function onClick(){
				// window.location = link; 
				open_sidebar(tooltip_text);

			}
		})

	}
	append_markers(category);

	// sidebar
	function open_sidebar(item){
		const container = document.getElementById("info_bar");
		const title = 

		container.style.display = "block";
		
		container.innerHTML = "";
		container.append(item)
	}
}

document.addEventListener("DOMContentLoaded", function(){
    load_data();
});