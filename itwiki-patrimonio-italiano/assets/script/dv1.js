// settings
const articles_url = "assets/data/articles.tsv";

const map_contaier = "map1";

const place_color = "#1F5BD1"; // #2a35f7
const circle_min_size = 2;
const circle_max_size = 7;
const pg = 3.14;

const it_wiki = "https://it.wikipedia.org/wiki/";
const en_wiki = "https://en.wikipedia.org/wiki/";

const inhabitants_range = [{
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

function the_inhabitants(value){
	if (value == 0){
		p_min = inhabitants_range[0].a.min;
		p_max = inhabitants_range[0].f.max;
	}
	else if (value == 1){
		p_min = inhabitants_range[0].a.min;
		p_max = inhabitants_range[0].a.max;
	}
	else if (value == 2){
		p_min = inhabitants_range[0].b.min;
		p_max = inhabitants_range[0].b.max;
	}
	else if (value == 3){
		p_min = inhabitants_range[0].c.min;
		p_max = inhabitants_range[0].c.max;
	}
	else if (value == 4){
		p_min = inhabitants_range[0].d.min;
		p_max = inhabitants_range[0].d.max;
	}
	else if (value == 5){
		p_min = inhabitants_range[0].e.min;
		p_max = inhabitants_range[0].e.max;
	}
	else {
		p_min = inhabitants_range[0].f.min;
		p_max = inhabitants_range[0].f.max;
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

	function load_data(url){

		d3.tsv(url)
	  		.then(function(data) {
				console.log(data);

				// filter by inhabitants
				let p_min = inhabitants_range[0].a.min
				let p_max = inhabitants_range[0].a.max

				filter_inhabitants = data.filter(function(a,b){ 
					return +a.Popolazione >= p_min && +a.Popolazione <= p_max
				})

				function append_markers(dataset, language, feature){

					let scale = d3.scaleLinear()
						.range([circle_min_size,circle_max_size])

					let bounds = [];
					let min = 0;
					let max = 0;
				
					if (language == "it") {
						// if (feature == "inhabitants") {
						// 	min = d3.min(filter_inhabitants, function(d) { 
						// 		return Math.sqrt(+d.Popolazione/pg);
						// 	})
						// 	max = d3.max(filter_inhabitants, function(d) { 
						// 		return Math.sqrt(+d.Popolazione/pg);
						// 	})
						// }					
						if (feature == "size") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_pDim/pg);
							})
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_pDim/pg);
							})
						}
						else if (feature == "issues") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_aNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_aNum/pg);
							})
						}
						else if (feature == "references") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_bNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_bNum/pg);
							})
						}
						else if (feature == "notes") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_nNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_nNum/pg);
							})
						}
						else if (feature == "monuments") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_mNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_mNum/pg);
							})
						}
						else if (feature == "images") {
							min = d3.min(filter_inhabitants, function(d) { 
								images = (+d.it_svg) + (+d.it_jpg) + (d.it_png) + (d.it_gif) + (+d.it_tif) + (d.it_mAltri);
								return Math.sqrt(images/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								images = (+d.it_svg) + (+d.it_jpg) + (d.it_png) + (d.it_gif) + (+d.it_tif) + (d.it_mAltri);
								return Math.sqrt(images/pg);
							})
						}
					}
					else {
						// if (feature == "inhabitants") {
						// 	min = d3.min(filter_inhabitants, function(d) { 
						// 		return Math.sqrt(+d.Popolazione/pg);
						// 	})
						// 	max = d3.max(filter_inhabitants, function(d) { 
						// 		return Math.sqrt(+d.Popolazione/pg);
						// 	})
						// }	
						if (feature == "size") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_pDim/pg);
							})
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_pDim/pg);
							})
						}
						else if (feature == "issues") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_aNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_aNum/pg);
							})
						}
						else if (feature == "references") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_bNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_bNum/pg);
							})
						}
						else if (feature == "notes") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_nNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_nNum/pg);
							})
						}
						else if (feature == "monuments") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_mNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_mNum/pg);
							})
						}
						else if (feature == "images") {
							min = d3.min(filter_inhabitants, function(d) { 
								images = (+d.en_svg) + (+d.en_jpg) + (d.en_png) + (d.en_gif) + (+d.en_tif) + (d.en_mAltri);
								return Math.sqrt(images/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								images = (+d.en_svg) + (+d.en_jpg) + (d.en_png) + (d.en_gif) + (+d.en_tif) + (d.en_mAltri);
								return Math.sqrt(images/pg);
							})
						}
					}

					scale.domain([min,max]);
					
					dataset.forEach(function (a,b) {

						let lat = a.lat;
						let lon = a.lon;
						let prov = a.Sigla;
						let inhabitants = +a.Popolazione;
						let feature_text;

						if (language == "it") {
							name = a.it_Titolo;

							size = +a.it_pDim;
							issues = +a.it_aNum;
							references = +a.it_bNum;
							notes = +a.it_nNum;
							monuments = +a.it_mNum;
							images = (+a.it_svg) + (+a.it_jpg) + (a.it_png) + (a.it_gif) + (+a.it_tif) + (a.it_mAltri);
							
						}
						else {
							name = a.en_Titolo;

							size = +a.en_pDim;
							issues = +a.en_aNum;
							references = +a.en_bNum;
							notes = +a.en_nNum;
							monuments = +a.en_mNum;
							images = (+a.en_svg) + (+a.en_jpg) + (a.en_png) + (a.en_gif) + (+a.en_tif) + (a.en_mAltri);
						}

						if (feature == "size"){
							feature_text = size.toLocaleString() + " byte";
						}
						else if (feature == "issues") {
							feature_text = issues + " avvisi";
						}
						else if (feature == "references") {
							feature_text = references + " referenze bibliografiche";
						}
						else if (feature == "notes") {
							feature_text = notes + " note";
						}
						else if (feature == "monuments") {
							feature_text = monuments + " sezioni monumenti";
						}
						else if (feature == "images") {
							feature_text = images + " immagini";
						}

						let tooltip_text = name + " (" + prov + ")<br/>" + inhabitants.toLocaleString() + " abitanti<br/><br/>" + feature_text + "</br>";

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
						else if (feature == "images"){
							radius = scale(images)/800;
						}
						else{
							radius = scale(monuments)/2;
						}

						bounds.push([lat,lon])

						let place = L.circleMarker([lat, lon], {
							color: place_color,
							fillColor: place_color,
							fillOpacity: 0.4,
							opacity: 0.8,
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
						.addTo(map)
						.on('click', onClick);

						place.on('mouseover', mouseover);
						place.on('mouseout', mouseleave);

						function mouseover() {
							this.openTooltip();
							place.setStyle({opacity: 1, fillOpacity: 0.8});
						}

						function mouseleave() {
							place.setStyle({opacity: 0.8, fillOpacity: 0.5});
						}

						function onClick() {
							let url;
							if (language == "it"){
								url = it_wiki + a.it_Titolo;
							}
							else {
								url = en_wiki + a.en_Titolo;
							}
							window.open(url);
						}
					})

					map.fitBounds(bounds, {
						"padding": [50, 50],
						"animate": true,
					    "duration": 1
					});
				}

				append_markers(filter_inhabitants, "it", "size");

				$("#region").change(function() {
					region = this.value;
					language =  $("#language option:selected").val();
					inhabitants =  $("#inhabitants option:selected").val();
					feature =  $("#feature option:selected").val();
					console.log(language, region, inhabitants, feature)

					// filter by region
					if (region !== "all"){
						filter_region = data.filter(function(a,b){ 
							return a.Regione == region
						})
					}
					else {
						filter_region = data
					}

					// filter by inhabitants
					filter_inhabitants = filter_region.filter(function(a,b){ 
						return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
					})

					$(".place").remove();
					append_markers(filter_inhabitants, language, feature);
				});

				$("#inhabitants").change(function() {
					inhabitants = this.value;
					language = $("#language option:selected").val();
					region = $("#region option:selected").val();
					feature =  $("#feature option:selected").val();
					console.log(language, region, inhabitants, feature)

					// filter by region
					if (region !== "all"){
						filter_region = data.filter(function(a,b){ 
							return a.Regione == region
						})
					}
					else {
						filter_region = data
					}

					// filter by inhabitants
					filter_inhabitants = filter_region.filter(function(a,b){ 
						return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
					})
					
					$(".place").remove();
					append_markers(filter_inhabitants, language, feature);
				});

				$("#feature").change(function() {
					feature = this.value;
					language = $("#language option:selected").val();
					region =  $("#region option:selected").val();
					inhabitants = $("#inhabitants option:selected").val();
					console.log(language, region, inhabitants, feature)

					// filter by region
					if (region !== "all"){
						filter_region = data.filter(function(a,b){ 
							return a.Regione == region
						})
					}
					else {
						filter_region = data
					}

					// filter by inhabitants
					filter_inhabitants = filter_region.filter(function(a,b){ 
						return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
					})

					$(".place").remove();
					append_markers(filter_inhabitants, language, feature);
				});

				$("#language").change(function() {
					language = this.value;
					region = $("#region option:selected").val();
					inhabitants = $("#inhabitants option:selected").val();
					feature =  $("#feature option:selected").val();
					console.log(language, region, inhabitants, feature)

					// filter by region
					if (region !== "all"){
						filter_region = data.filter(function(a,b){ 
							return a.Regione == region
						})
					}
					else {
						filter_region = data
					}

					// filter by inhabitants
					filter_inhabitants = filter_region.filter(function(a,b){ 
						return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
					})

					$(".place").remove();
					append_markers(filter_inhabitants, language, feature);
				});

		})

	}

  	// .catch(function(error) {
   //  	console.log("some error occurred")
  	// });

  	load_data(articles_url,);

}

