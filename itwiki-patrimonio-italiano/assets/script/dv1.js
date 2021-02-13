// settings
const it_articles_url = "assets/data/it_articles.tsv";
const map_contaier = "map1";

const place_color = "#4b4cf9"

// make the visualization
function dv1(){
	console.log("start");	

	let map = L.map(map_contaier, {
		center: [41.9028, 12.4964],
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

			let filter_region = "Sardegnaa";
			let filter_population = 15000;
			console.log(filter_region, filter_population)

			// filter by region
			filter_region = data.filter(function(a,b){ 
				return a.Regione !== filter_region
			})
			console.log(filter_region.length)

			// filter by population
			filter_population = filter_region.filter(function(a,b){ 
				return a.Popolazione > filter_population
			})
			console.log(filter_population.length)


			let issue_min = d3.min(filter_population, function(d) { 
				return Math.sqrt(+d.aNum/3.14);
			})
			let issue_max = d3.max(filter_population, function(d) { 
				return Math.sqrt(+d.aNum/3.14);
			})

			let bounds = [];

			filter_population.forEach(function (a,b) {

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
					radius: scale_issues(issues)
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
			    "duration": 10
			});
	})
  	.catch(function(error) {
    	console.log("some error occurred")
  	});
}

