// map
let map_contaier = "my_map";
let min_zoom = 9;
let map_center = [45.481, 8.9852];

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
	const lines = tsv.split('\r');
	const headers = lines.slice(0, 1)[0].split('\t');
	// console.log(headers)
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
	fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQGrLjvEojUsJnXde5dY3KB9Mw8fSJZXsU9QGMq0-RNoLbcLyJlgYaUvU0DByCA78kpIYXDKmHc8dE3/pub?gid=0&single=true&output=tsv")
		.then(response => response.text())
		.then((data) => {
			load_map(data)
	 	})
}

function load_map(data){

	const buildings = tsvJSON(data);
	console.log(buildings)

	let info_bar = document.getElementById("info_bar");

	let map = L.map(map_contaier, {
		center: map_center,
		zoom: min_zoom
	});

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 17,
		minZoom: min_zoom,
		tileSize: 256
	})
	.addTo(map);

	let category = "paravicini"

	// filter buildings
	let filter = document.getElementById("filter");

	// append markers
	function append_markers(category){

		let min_lat = 45.4; 
		let max_lat = 46.5; 
		let min_lon = 8.5; 
		let max_lon = 9.5; 

		let bounds = [];
		buildings.forEach(function(entry){

			let name = entry.name;
			let lat = entry.lat;
			let lon = entry.lon;
			let cat = entry.category;

			let tooltip_text = "<span>" +
				"<strong>" + name + "</strong>" +
				"<span>";

			let building = L.marker([lat, lon], {
				icon: myIcon,
				id:  buildings
			})
		 //   	.bindTooltip( tooltip_text , {
			// 	permanent: false,
			// 	interactive: true,
			// 	noWrap: false,
			// 	opacity: 0.9,
			// })
			.bindPopup(tooltip_text, {
				"maxWidth": 200,
				"className": "popup"
			})
			.addTo(map)
			.on('click', onClick);
			L.DomUtil.addClass( building._icon, "building " + cat);
			L.DomUtil.addClass( building._shadow, "building " + cat);
			L.DomUtil.addClass( building._icon, "building " + cat);

			bounds.push([lat,lon])
			map.fitBounds(bounds, {
				"padding": [140, 200],
				"animate": true,
			    "duration": 2
			});	

			function onClick(){
				open_sidebar(entry);

		  //       let theIcon = L.icon({
		  //           iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
				// 	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		  //       });
		  //       this.setIcon(theIcon);
			}

		})

		filter.addEventListener ("change", function () {
			category = this.value;

			document.querySelectorAll(".popup").forEach(function(a){
				a.classList.toggle("popup_close");
			})

	       	document.querySelectorAll('.building').forEach(function(a){
	       		if (a.className.indexOf(category) !== -1){
	       			a.style.display = "block";
	       		}
	       		else {
	       			a.style.display = "none";
	       		}
			})

	       	info_bar.innerHTML = "<div id='info'>Seleziona un punto sulla mappa</div>";

		})
	}
	append_markers(category);

	// sidebar
	function open_sidebar(entry){
		info_bar.innerHTML = "";
		info_bar.style.display = "block";

		let name = entry.name;
		let lat = entry.lat;
		let lon = entry.lon;
		let ref = entry.ref;
		let cat = entry.category;
		let link = entry.link;

		let the_link = "";
		if (link.length > 20){
			the_link = "<a href='" + link +"' title='" + name + "'>maggiori informazioni</a>"
		}

		let output = "<div id='info'>" +
			"<span class='b_name'>" + name + "</span><br/><br/>" + 
			ref + "<br/></br>" +
			the_link + 
			"</div>"
		
		info_bar.innerHTML = output;
	}
}

document.addEventListener("DOMContentLoaded", function(){
    load_data();
});