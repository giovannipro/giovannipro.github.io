// map
let map_contaier = "my_map";
let min_zoom = 9;
let max_zoom = 16;
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

function isFloat(n) {
    return n === +n && n !== (n|0);
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
		zoom: max_zoom
	});

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: max_zoom,
		minZoom: min_zoom,
		tileSize: 256
	})
	.addTo(map);

	let category = "paravicini";
	let subcategory = "tutti";

	// filter buildings
	const filter_main = document.getElementById("filter_category");
	const filter_sub = document.getElementById("filter_subcategory");

	// append markers
	function append_markers(category){

		let min_lat = 45.4; 
		let max_lat = 46.5; 
		let min_lon = 8.5; 
		let max_lon = 9.5; 

		let bounds = [];
		buildings.forEach(function(entry){

			let name = entry.name;
			let lat = parseFloat(entry.lat);
			let lon = parseFloat(entry.lon);
			let cat = entry.category;
			let sub = entry.subcategory;
			// console.log(lat,lon)


			if (lat != "" && lon != "" && isFloat(lat) && isFloat(lon)){
				let tooltip_text = "<span>" +
					"<strong>" + name + "</strong>" +
					"<span>";

				if (cat == "rinascimentale"){
					cat = "rinascimento"
				}

				let building = L.marker([lat, lon], {
					icon: myIcon,
					id:  buildings
				})
				.bindPopup(tooltip_text, {
					"maxWidth": 200,
					"className": "popup b1 b2 " + cat + " " + sub
				})
				.addTo(map)
				.on('click', onClick);
				L.DomUtil.addClass( building._icon, "b1 b2 " + cat + " " + sub);
				L.DomUtil.addClass( building._shadow, "b1 b2 " + cat + " " + sub);
				L.DomUtil.addClass( building._icon, "b1 b2 " + cat + " " + sub);

				bounds.push([lat,lon])
				map.fitBounds(bounds, {
					"padding": [140, 200],
					"animate": true,
				    "duration": 2
				});	
			}

			function onClick(){
				open_sidebar(entry);
			}
		})

		function close_popup(){
			document.querySelectorAll(".popup").forEach(function(a){
				a.className = cat

				if (a.style.opacity == 1) {
					a.style.opacity = 0;
				}
				// a.classList.toggle("popup_close");
			})
		}

		// main filter
		filter_main.addEventListener ("change", function () {
			category = this.value;
			let subcategory = filter_sub.value;

			if (category == "rinascimentale"){
				category = "rinascimento"
			}

			// display buildings
			if (subcategory == "tutti"){
		       	document.querySelectorAll('.b1').forEach(function(a){
		       		if (a.className.indexOf(category) !== -1){
		       			a.style.display = "block";
		       			// a.classList.toggle = "invisible";
		       		}
		       		else {
		       			a.style.display = "none";
		       		}
				})
			}
			else {
				document.querySelectorAll('.b1').forEach(function(a){
		       		if (a.className.indexOf(category) !== -1 && a.className.indexOf(subcategory) !== -1) {  
		       			a.style.display = "block";	
		       		}
		       		else {
		       			a.style.display = "none";
		       		}
				})
			}
			console.log(category,subcategory,name);

	       	info_bar.innerHTML = "<div id='info' class='not_selected'>Seleziona un punto sulla mappa</div>";
		})

		// sub filter
		filter_sub.addEventListener ("change", function () { 
			subcategory = this.value;
			category = filter_main.value;

			if (category == "rinascimentale"){
				category = "rinascimento"
			}

			// display buildings
			if (subcategory == "tutti"){
				document.querySelectorAll('.b2').forEach(function(a){
					if (a.className.indexOf(category) !== -1) {
						a.style.display = "block";	
					}
					else {
			       		a.style.display = "none";
			       	}
				})
			}
			else {
				document.querySelectorAll('.b2').forEach(function(a){
					if (a.className.indexOf(category) !== -1 && a.className.indexOf(subcategory) !== -1) {
						a.style.display = "block";	
					}
					else {
			       		a.style.display = "none";
			       	}
				})
			}
			console.log(category,subcategory,name);
		})
	}
	append_markers(category);


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
			the_link = "<a href='" + link +"' title='" + name + "'>maggiori informazioni</a>"
		}

		if (cat == "paravicini"){
			cat = "disegnato da Paravicini"
		}

		let cat_sub = "Edificio " + sub + " " + cat;

		let output =  "<div class='b_name'>" + 
			"<p>" + name + "</p>" +
			"<p class='cat_sub'>" + cat_sub + "</p>" +
			"</div>" + 

			"<div class='b_text'>" + 
			"<p>" + ref + "</p>" +
			"<p>" + des + "</p>" +
			"<p>" + the_link + "</p>" +
			// "<p>" + cat + " - " + sub +"</p>" +
			"</div>"

		
		info_bar.innerHTML = output;
	}
}

document.addEventListener("DOMContentLoaded", function(){
    load_data();
});