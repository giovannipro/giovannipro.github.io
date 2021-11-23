// map
let map_contaier = "my_map";
let min_zoom = 9;
let max_zoom = 16;
let map_center = [45.981, 8.9852];

function tsvJSON(tsv) {
	const lines = tsv.split("\n"); // n  -  r
	const headers = lines.slice(0, 1)[0].split("\t");
	return lines.slice(1, lines.length).map(line => {
	  const data = line.split("\t");
	  return headers.reduce((obj, nextKey, index) => {
    	obj[nextKey] = data[index];
    	return obj;
	  }, {});
	});
}

// markers
let myIcon = L.icon({ // red green  // https://github.com/pointhi/leaflet-color-markers
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
	className: ""
});

let my_selection_icon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
	className: ""
});

function isFloat(n) {
    return n === +n && n !== (n|0);
}

let no_selection = "<div id='info' class='b_text'><p>Si prega di selezionare un punto sulla mappa per visualizzare i dettagli.</p></div>";

// load data
function load_data(){
	let data_link = "assets/php/get_data.php";
	// let data_link = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGrLjvEojUsJnXde5dY3KB9Mw8fSJZXsU9QGMq0-RNoLbcLyJlgYaUvU0DByCA78kpIYXDKmHc8dE3/pub?gid=0&single=true&output=tsv";

	fetch(data_link)
		.then(response => response.text())
		.then((data) => {
			load_map(data);
	 	})
}

function load_map(data){
	const buildings = tsvJSON(data);
	console.log(buildings);

	// filters
	const filter_main = document.getElementById("filter_category");
	const filter_sub = document.getElementById("filter_subcategory");

	let info_bar = document.getElementById("info_bar");

	let map = L.map(map_contaier, {
		center: map_center,
		zoom: max_zoom
	});

	let category = "paravicini";
	let subcategory = "tutti";

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: max_zoom,
		minZoom: min_zoom,
		tileSize: 256
	})
	.addTo(map);

	let markerGroup = L.layerGroup().addTo(map);

	// append markers
	function append_markers(category,subcategory){
		// console.log(category,subcategory);

		let min_lat = 45.4; 
		let max_lat = 46.5; 
		let min_lon = 8.5; 
		let max_lon = 9.5; 
		let bounds = [];

		// filter buildings
		filtered_items_a = buildings.filter(function(b){
			return b.category == category
		})

		if (subcategory == "tutti"){
			filtered_items_b = filtered_items_a; 
		}
		else {
			filtered_items_b = filtered_items_a.filter(function(b){
				return b.subcategory == subcategory
			})
		}
		// console.log(category,subcategory,filtered_items_b)
		
		filtered_items_b.forEach(function(entry){
			let id = parseInt(entry.id);
			let name = entry.name;
			let lat = parseFloat(entry.lat);
			let lon = parseFloat(entry.lon);
			let cat = entry.category;
			let sub = entry.subcategory;
			let tooltip_text = "<span class='tooltip'>" + name + "</span>"
			// console.log(id, name, lat, lon, cat, sub);

			if (lat != "" && lon != "" && isFloat(lat) && isFloat(lon)){

				myIcon.options.className = "b1 b2 " + cat + " " + sub

				markers = L.marker([lat, lon], {
					icon: myIcon
				})
				.addTo(markerGroup)
				.bindPopup(tooltip_text, {
					"maxWidth": 200,
					"className": "popup building " + cat + " " + sub
				})
				.on('click', onClick)

				bounds.push([lat,lon])
				map.fitBounds(bounds, {
					"padding": [240, 300],
					"animate": true,
				    "duration": 2
				});	
			}

			// let count = 0; 
			function onClick(){
				open_sidebar(entry);
			}
		})
	}
	append_markers(category,subcategory);

	// sidebar
	function open_sidebar(entry){

		info_bar.innerHTML = "";
		info_bar.style.display = "block";

		let name = entry.name;
		let des = entry.description;
		let lat = entry.lat;
		let lon = entry.lon;
		let ref = entry.ref;
		let cat = entry.category;
		let sub = entry.subcategory;

		let link = entry.link;

		let the_link = "";
		if (link.length > 20){
			the_link = "<a href='" + link +"' title='" + name + "'>maggiori informazioni</a>";
		}

		if (cat == "paravicini"){
			cat = "disegnato da Paravicini";
		}

		let cat_sub = "Edificio " + sub + " " + cat;

		let output =  "<div class='b_name'>" + 
			"<p>" + name + "</p>" +
			"</div>" + 

			"<div class='b_text'>" + 
			"<p class='label'>tipologia</p>" +
			"<p class='value'>" + cat_sub + "</p>";

			if (ref !== ""){
				output += "<p class='label'>località</p>";
				output += "<p class='value'>" + ref + "</p>";
			}

			if (des !== ""){
				output += "<p class='label'>descrizione</p>";
				output += "<p class='value'>" + des + "</p>";
			}

			if (the_link !== ""){
				output += "<p>" + the_link + "</p>";
			}

			"</div>";

		info_bar.innerHTML = output;
	}

	// filter buildings
	filter_main.addEventListener ("change", function () {
		category = this.value;
		subcategory = filter_sub.value;

		// remove markers
		map.eachLayer(function(layer){
			if (layer instanceof L.Marker){
				map.removeLayer(layer);
			}
		})

		info_bar.innerHTML = no_selection;

		append_markers(category,subcategory);	
	})

	filter_sub.addEventListener ("change", function () { 
		let previous_subcategory = subcategory;
		subcategory = this.value;
		category = filter_main.value;
		console.log(previous_subcategory, subcategory)

		// remove markers
		map.eachLayer(function(layer){
			if (layer instanceof L.Marker){
				map.removeLayer(layer);
			}
		})

		info_bar.innerHTML = no_selection;

		append_markers(category,subcategory);
	})
}

document.addEventListener("DOMContentLoaded", function(){
    load_data();
});

