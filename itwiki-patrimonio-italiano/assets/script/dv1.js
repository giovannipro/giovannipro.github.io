// settings
const it_articles_url = "assets/data/it_articles.tsv";
const map_contaier = "map1";

const place_color = "#1F5BD1"; // #2a35f7
const circle_min_size = 2;
const circle_max_size = 7;

const population_range = [{
	"a": {
		"min": 0,
		"max": 1000
	},
	"b": {
		"min": 1001,
		"max": 3000
	},
	"c": {
		"min": 3001,
		"max": 5000
	},
	"d": {
		"min": 5001,
		"max": 10000
	},
	"e": {
		"min": 10001,
		"max": 50000
	},
	"f": {
		"min": 50001,
		"max": 3000000
	}
}]

function population(value){
	if (value == 0){
		p_min = population_range[0].a.min;
		p_max = population_range[0].f.max;
	}
	else if (value == 1){
		p_min = population_range[0].a.min;
		p_max = population_range[0].a.max;
	}
	else if (value == 2){
		p_min = population_range[0].b.min;
		p_max = population_range[0].b.max;
	}
	else if (value == 3){
		p_min = population_range[0].c.min;
		p_max = population_range[0].c.max;
	}
	else if (value == 4){
		p_min = population_range[0].d.min;
		p_max = population_range[0].d.max;
	}
	else if (value == 5){
		p_min = population_range[0].e.min;
		p_max = population_range[0].e.max;
	}
	else {
		p_min = population_range[0].f.min;
		p_max = population_range[0].f.max;
	}
	return [p_min, p_max]
}


// make the visualization
function dv1(){

	let map = L.map(map_contaier, {
		center: [41.9028, 12.9164],
		zoom: 6
	});

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 15,
		minZoom: 6,
		tileSize: 256
	}).addTo(map);

	d3.tsv(it_articles_url)
  		.then(function(data) {
			console.log(data);

			// filter by population
			let p_min = population_range[0].a.min
			let p_max = population_range[0].a.max
			filter_population = data.filter(function(a,b){ 
				return a.Popolazione >= p_min && a.Popolazione <= p_max
			})

			let scale = d3.scaleLinear()
				.range([circle_min_size,circle_max_size])

			function append_markers(dataset,feature){

				let bounds = [];
				let min = 0;
				let max = 0;
			
				if (feature == "size") {
					min = d3.min(filter_population, function(d) { 
						return Math.sqrt(+d.pDim/3.14);
					})
					max = d3.max(filter_population, function(d) { 
						return Math.sqrt(+d.pDim/3.14);
					})
				}
				else if (feature == "issues") {
					min = d3.min(filter_population, function(d) { 
						return Math.sqrt(+d.aNum/3.14);
					})
					
					max = d3.max(filter_population, function(d) { 
						return Math.sqrt(+d.aNum/3.14);
					})
				}
				else if (feature == "references") {
					min = d3.min(filter_population, function(d) { 
						return Math.sqrt(+d.bNum/3.14);
					})
					
					max = d3.max(filter_population, function(d) { 
						return Math.sqrt(+d.bNum/3.14);
					})
				}
				else if (feature == "notes") {
					min = d3.min(filter_population, function(d) { 
						return Math.sqrt(+d.nNum/3.14);
					})
					
					max = d3.max(filter_population, function(d) { 
						return Math.sqrt(+d.nNum/3.14);
					})
				}
				else if (feature == "monuments") {
					min = d3.min(filter_population, function(d) { 
						return Math.sqrt(+d.mNum/3.14);
					})
					
					max = d3.max(filter_population, function(d) { 
						return Math.sqrt(+d.mNum/3.14);
					})
				}

				scale.domain([min,max]);
				
				console.log(min,max);
				
				dataset.forEach(function (a,b) {

					let lat = a.lat;
					let lon = a.lon;
					let name = a.Titolo;
					let prov = a.Sigla;
					let issues = +a.aNum;
					let size = +a.pDim;
					let references = +a.bNum;
					let notes = +a.nNum;
					let monuments = +a.mNum;
					let population = a.Popolazione;

					let tooltip_text = name + " (" + prov + ")";

					let radius;
					if (feature == "size"){
						radius = scale(size)/200;
					}
					else if (feature == "issues") {
						radius = scale(issues);
					}
					else if (feature == "references"){
						radius = scale(references)/3;
					}
					else if (feature == "notes"){
						radius = scale(notes)/7;
					}
					else { //  if (feature == "monuments")
						radius = scale(monuments)/2;
					}
					bounds.push([lat,lon])

					let place = L.circleMarker([lat, lon], { // circleMarker
						color: place_color,
						fillColor: place_color,
						fillOpacity: 0.5,
						radius: radius,
						className: "place",
						id: "place_" + b
					})
				   	.bindTooltip( tooltip_text , {
						permanent: false,
						interactive: true,
						noWrap: true,
						opacity: 0.9
					})
					.addTo(map);

					place.on('mouseover', customTip);

					function customTip() {
						this.openTooltip()
					}
				})

				map.fitBounds(bounds, {
					"padding": [50, 50],
					"animate": true,
				    "duration": 1
				});
			}

			append_markers(filter_population,"size");

			$("#region").change(function() {
				let region = this.value;
				let inhabitants =  $("#inhabitants option:selected").val();
				let feature =  $("#feature option:selected").val();
				console.log(region, inhabitants, feature)

				// filter by region
				if (region !== "all"){
					filter_region = data.filter(function(a,b){ 
						return a.Regione == region
					})
				}
				else {
					filter_region = data
				}

				// filter by population
				filter_population = filter_region.filter(function(a,b){ 
					return a.Popolazione >= population(inhabitants)[0] && a.Popolazione <= population(inhabitants)[1]
				})

				$(".place").remove();
				append_markers(filter_population, feature);
			});

			$("#inhabitants").change(function() {
				let inhabitants = this.value;
				let region = $("#region option:selected").val();
				let feature =  $("#feature option:selected").val();
				console.log(region, inhabitants, feature)

				// filter by region
				if (region !== "all"){
					filter_region = data.filter(function(a,b){ 
						return a.Regione == region
					})
				}
				else {
					filter_region = data
				}

				// filter by population
				filter_population = filter_region.filter(function(a,b){ 
					return a.Popolazione >= population(inhabitants)[0] && a.Popolazione <= population(inhabitants)[1]
				})
				
				$(".place").remove();
				append_markers(filter_population, feature);
			});

			$("#feature").change(function() {
				let feature = this.value;
				let inhabitants = $("#inhabitants option:selected").val();
				let region =  $("#region option:selected").val();
				console.log(region, inhabitants, feature)

				// filter by region
				if (region !== "all"){
					filter_region = data.filter(function(a,b){ 
						return a.Regione == region
					})
				}
				else {
					filter_region = data
				}

				// filter by population
				filter_population = filter_region.filter(function(a,b){ 
					return a.Popolazione >= population(inhabitants)[0] && a.Popolazione <= population(inhabitants)[1]
				})

				$(".place").remove();
				append_markers(filter_population, feature);
			});

	})
  	// .catch(function(error) {
   //  	console.log("some error occurred")
  	// });
}

