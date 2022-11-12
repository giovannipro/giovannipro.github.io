// map
let map_contaier = "my_map";
let min_zoom = 5;
let max_zoom = 18;
let map_center = [42.593, 19.277]; // 45.981, 8.9852

function tsvJSON(tsv) {
	const lines = tsv.split("\n"); // .slice(0, 100)  n: data from database; r: data from Google Spreadsheet
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

// no building selected
const no_selection = " <div id='b_text'><p>Si prega di selezionare un punto sulla mappa per visualizzare i dettagli.</p></div>";

// sidebar open
let open = true;

let bounds = [];

// load data
function load_data(){
	let data_link = "assets/php/get_data.php";
	// let data_link = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGrLjvEojUsJnXde5dY3KB9Mw8fSJZXsU9QGMq0-RNoLbcLyJlgYaUvU0DByCA78kpIYXDKmHc8dE3/pub?gid=0&single=true&output=tsv";

	fetch(data_link)
		.then(response => response.text())
		.then((data) => {
			load_map(data);
			// console.log(data)
	 	})
}

function load_map(data){
	const buildings = tsvJSON(data);
	console.log(buildings)

	// filters
	const filter_main = document.getElementById("filter_category");
	const filter_sub = document.getElementById("filter_subcategory");

	let info_bar = document.getElementById("info");

	let close_info_bar = document.getElementById("close_info_bar");
	let close_info_bar_icon = document.getElementById("close_info_bar_icon");

	let map = L.map(map_contaier, {
		center: map_center,
		zoom: max_zoom
	});

	let category = "paravicini";
	let subcategory = "tutti";

	let markerGroup;

	function make_map(){

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: max_zoom,
			minZoom: min_zoom,
			tileSize: 256
		})
		.addTo(map);
		markerGroup = L.markerClusterGroup(); // L.layerGroup().addTo(map);
	}

	// append markers
	function append_markers(category,subcategory){
		// console.log(category,subcategory);

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
		
		// display all
		if (category == "tutti" && subcategory == "tutti"){
			filtered_items_b = buildings;
			filtered_items_b = buildings.filter(function(b){
				return b.category !== undefined;
			})
		}
		
		filtered_items_b.forEach(function(entry){
			entry.id = parseInt(entry.id);
			entry.lat = parseFloat(entry.lat);
			entry.lon = parseFloat(entry.lon);
			
			if(typeof entry.name !== "undefined"){
				entry.name = entry.name.replace(/\r/g, '').replace(/\n/g, '');
			}
			if(typeof entry.place !== "undefined"){
				entry.place = entry.place.replace(/\r/g, '').replace(/\n/g, '');
			}
			if(typeof entry.link !== "undefined"){
				entry.link = entry.link.replace(/\r/g, '').replace(/\n/g, '');
			}
			if(typeof entry.reference !== "undefined"){
				entry.reference = entry.reference.replace(/\r/g, '').replace(/\n/g, '');
			}
			if(typeof entry.description !== "undefined"){
				entry.description = entry.description.replace(/\r/g, '').replace(/\n/g, '');
			}

			console.log(entry.id , entry.link);
		})
		console.log(filtered_items_b);

		bounds = [];
		filtered_items_b.forEach(function(entry){
			// console.log(entry.id, entry.name, entry.link);
			// console.log(entry.id, entry.name, entry.lat, entry.lon, entry.category, entry.link);

			let tooltip_text = "<span class='tooltip'>" + entry.name + "</span>";

			if (entry.lat != "" && entry.lon != "" && isFloat(entry.lat) && isFloat(entry.lon)){
				myIcon.options.className = "b1 b2 " + entry.category + " " + entry.subcategory;

				markers = L.marker([entry.lat, entry.lon], {
					icon: myIcon
				})
				.bindPopup(tooltip_text, {
					"maxWidth": 200,
					"className": "popup building " + entry.id + " " + entry.category + " " + entry.subcategory,
				})
				.on('click', onClick);

				markerGroup.addLayer(markers);

				bounds.push([entry.lat,entry.lon])
			}

			function onClick(){
				open_sidebar(entry);

				// arrow icon
				open = true;
				close_info_bar_icon.classList.remove('open');
				close_info_bar_icon.classList.add('close');
			}
		})

	}
	make_map();
	append_markers(category,subcategory);
	set_map();

	function set_map(){
		map.addLayer(markerGroup);
		map.fitBounds(bounds, {
			"padding": [20, 20], // 260, 300
			"animate": true,
		    "duration": 2
		});			
	}

	// sidebar
	function open_sidebar(entry){
		// console.log(entry.id, entry.link)

		info_bar.innerHTML = "";
		info_bar.style.display = "block";
		close_info_bar.style.display = "block";

		let name = entry.name;
		let des = entry.description;
		let lat = entry.lat;
		let lon = entry.lon;
		let place = entry.place;
		let ref = entry.reference;
		let cat = entry.category;
		let sub = entry.subcategory;
		let link = entry.link;

		let the_name = "";
		let name_box = "";
		let box = "";

		// link
		if (link !== undefined && link.length > 20){
			box = "<a href='" + link +"' title='" + name + "' id='linked'>" 
			box += "<div id='b_name'>" + "<span>" + name + "</span>"
			box += "<span>" + "&#x2192;" + "</span></div></a>"
		}
		else {
			box += "<div id='b_name'><span>" + name + "</span></div>"
		}

		// sub-category
		let cat_sub = ""; 
		if (cat == "paravicini"){
			cat_ = "disegnato da Paravicini";
			cat_sub = "Edificio " + sub + " " + cat_;
		}
		else {
			cat_sub = "Edificio " + sub + " " + cat;
		}

		let output = box +
			"<div id='b_text'>" + 
			"<div><p class='label'>tipologia</p>" +
			"<p class='value'>" + cat_sub + "</p></div>";

			// place
			if (place !== undefined && place !== ""){
				output += "<div><p class='label'>località</p>";
				output += "<p class='value'>" + place + "</p></div>";
			}

			// rederence
			if (ref !== undefined && ref !== ""){
				output += "<div><p class='label'>segnatura dei disegni</p>";
				output += "<p class='value'>" + ref + "</p></div>";
			}

			// description
			if (des !== undefined && des !== ""){
				output += "<div><p class='label'>descrizione</p>";
				output += "<p class='value'>" + des + "</p></div>";
			}

			"</div>";

		info_bar.innerHTML = output;
		
		close_info_bar.onclick = function(evt) {
			close_sidebar();
		}
	}

	// close_sidebar
	function close_sidebar(){
		if (open == true){
			info_bar.style.display = "none";
			close_info_bar_icon.classList.remove('close');
			close_info_bar_icon.classList.add('open');
			open = false;
		}
		else {
			info_bar.style.display = "block";
			close_info_bar_icon.classList.remove('open');
			close_info_bar_icon.classList.add('close');
			open = true;
		}
	}

	// filter buildings for category
	filter_main.addEventListener ("change", function () {
		category = this.value;
		subcategory = filter_sub.value;

		// remove markers
		map.eachLayer(function(layer){
			map.removeLayer(layer);
		})

		info_bar.innerHTML = no_selection;

		make_map();
		append_markers(category,subcategory);	
		set_map();
	})

	// filter buildings for subcategory
	filter_sub.addEventListener ("change", function () { 
		let previous_subcategory = subcategory;
		subcategory = this.value;
		category = filter_main.value;

		// remove markers
		map.eachLayer(function(layer){
			map.removeLayer(layer);
		})

		info_bar.innerHTML = no_selection;

		make_map();
		append_markers(category,subcategory);	
		set_map();
	})

	// display all
	document.addEventListener("keydown", function(event) {
		if (event.which == 65){ // a
			append_markers("tutti","tutti");
			set_map();
		}
	})
}

document.addEventListener("DOMContentLoaded", function(){
    load_data();
});

