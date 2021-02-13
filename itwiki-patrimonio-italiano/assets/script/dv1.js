// settings
const it_articles_url = "assets/data/it_articles.tsv";
const map_contaier = "map1";

const place_color = "#2a35f7"

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

			// let the_population_min = 30;
			// let the_population_max = 2000;
			// console.log(the_population_min,the_population_max)

			// filter by region
			// filter_region = data.filter(function(a,b){ 
			// 	return a.Regione == the_region
			// })
			// console.log(filter_region.length)

			// filter by population
			let p_min = population_range[0].a.min
			let p_max = population_range[0].a.max
			filter_population = data.filter(function(a,b){ 
				return a.Popolazione >= p_min && a.Popolazione <= p_max
			})
			// console.log(p_min,p_max)
			// console.log(filter_population.length)

			let issue_min = d3.min(filter_population, function(d) { 
				return Math.sqrt(+d.aNum/3.14);
			})
			let issue_max = d3.max(filter_population, function(d) { 
				return Math.sqrt(+d.aNum/3.14);
			})

			function append_markers(dataset){

				let bounds = [];

				dataset.forEach(function (a,b) {

					let population = a.Popolazione

					let lat = a.lat
					let lon = a.lon
					let name = a.Titolo
					let prov = a.Sigla
					let tooltip_text = name + " (" + prov + ")"

					let issues = a.aNum;

					bounds.push([lat,lon])

					let scale_issues = d3.scaleLinear()
						.range([2,6])
						.domain([issue_min,issue_max])

					let place = L.circleMarker([lat, lon], {
						color: place_color,
						fillColor: place_color,
						fillOpacity: 0.5,
						radius: scale_issues(issues),
						className: "place"
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

			append_markers(filter_population);

			$("#region").change(function() {
				let region = this.value;
				let inhabitants =  $("#inhabitants option:selected").val();
				console.log(region, inhabitants)

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
				append_markers(filter_population);
			});

			$("#inhabitants").change(function() {
				let inhabitants = this.value;
				let region =  $("#region option:selected").val();
				// console.log(region, inhabitants)

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
				console.log(population(inhabitants)[0], population(inhabitants)[1], filter_population.length)

				$(".place").remove();
				append_markers(filter_population);
			});

	})
  	// .catch(function(error) {
   //  	console.log("some error occurred")
  	// });
}

