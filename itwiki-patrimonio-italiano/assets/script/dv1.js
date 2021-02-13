// settings
const it_articles_url = "assets/data/it_articles.tsv";
const map_contaier = "map1";

const place_color = "#2a35f7"

// make the visualization
function dv1(){
	console.log("start");	

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

			let the_population_min = 30;
			let the_population_max = 2000;
			console.log(the_population_min,the_population_max)

			// filter by region
			// filter_region = data.filter(function(a,b){ 
			// 	return a.Regione == the_region
			// })
			// console.log(filter_region.length)

			// filter by population
			filter_population = data.filter(function(a,b){ 
				return a.Popolazione >= the_population_min && a.Popolazione <= the_population_max
			})
			console.log(filter_population.length)


			let issue_min = d3.min(filter_population, function(d) { 
				return Math.sqrt(+d.aNum/3.14);
			})
			let issue_max = d3.max(filter_population, function(d) { 
				return Math.sqrt(+d.aNum/3.14);
			})

			function append_markers(dataset){

				// var bounds = L.latLngBounds()

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
				    "duration": 2
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
					return a.Popolazione > inhabitants
				})

				$(".place").remove();
				append_markers(filter_population);
			});

	})
  	// .catch(function(error) {
   //  	console.log("some error occurred")
  	// });
}

