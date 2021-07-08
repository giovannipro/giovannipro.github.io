// settings
const articles_url = "../assets/data/articles.tsv";
const container = "#dv2";

const h_space = 2;
const v_shift = 8;

const region_color = "#1F5BD1"

let c_issues = '#EC4C4E',
	c_reference = '#49A0D8',
	c_note = '#A8D2A2',
	c_image = '#F5A3BD',
	c_days = '#9e9e9e',
	c_line = '#9E9E9E';

let window_w = $(container).outerWidth();
	window_h = $(container).outerHeight();

if (window_w <= 768) {
	reduction = 20;
}
else {
	reduction = 0;
}

let margin = {top: 20, left: 0-reduction, bottom: 20, right: 60-reduction},
	width = window_w - (margin.right + margin.right),
	height = window_h - (margin.top + margin.bottom);

const issue_height = height/2.8;
const features_height = height/2.1;

const ticksAmount = 3;

let empty = {
  "key": "test",
  "value": {
    "images_avg": 20,
		"issues_Verifica_avg": 30,
		"issues_avg": 3,
		"issues_correggere_avg": 20,
		"issues_curiosita_avg": 0,
		"issues_dividere_avg": 0,
		"issues_noFonte_avg": 0,
		"issues_noInfobox_avg": 0,
		"issues_noNote_avg": 0,
		"issues_noReferenze_avg": 0,
		"issues_notabile_avg": 0,
		"issues_organizzare_avg": 0,
		"issues_pov_avg": 0,
		"issues_recentismo_avg": 0,
		"issues_stub_avg": 0,
		"issues_wikify_avg": 0,
		"monuments_size_avg": 0,
		"notes_avg": 20,
		"places": 0,
		"population": 20000,
		"references_avg": 2,
		"size_avg": 20
  }
}

// make the visualization
function dv2(){

	function load_data(url){

		d3.tsv(url)
	  		.then(function(data) {
	  			//console.log(data)

				let svg = d3.select(container)
					.append("svg")
					.attr("width", width + (margin.right + margin.right))
					.attr("height",height + (margin.top + margin.bottom))
					.attr("id", "svg")

				// tooltip
				let div = d3.select("#dv2").append("div")	
				    .attr("class", "tooltip")				
				    .style("opacity", 0);

	  			let total = 0;
	  			let region_articles = [];
	  			let sorted_data = []

				let x = d3.scaleLinear()
					.range([0,width-margin.left])

				let y_issues_text = 0;

	  			function make_chart(dataset,language,feature){

	  				let region_group;
	  				function make_dataset(dataset,language){

				  		// aggregate cities by region
		  				if (language == "it") {	
				  			region_group = d3.nest()
								.key(d => d.Regione)
								.rollup(function(v) { return {
								    places: v.length,
								    population: d3.mean(v, function(d) { 
								    	return +d.Popolazione 
								    }),
								    size_avg: d3.mean(v, function(d) { 
								    	return +d.it_pDim 
								    }),
								    monuments_size_avg: d3.mean(v, function(d) { 
								    	return +d.it_mDim 
								    }),
								    
								    // issues
								    issues_avg: d3.mean(v, function(d) { 
								    	return +d.it_aNum 
								    }),
								    issues_Verifica_avg: d3.mean(v, function(d) { 
								    	return (+d.it_verifica)
								    }),
								    issues_correggere_avg: d3.mean(v, function(d) { 
								    	return (+d.it_correggere)
								    }),
								    issues_curiosita_avg: d3.mean(v, function(d) { 
								    	return (+d.it_curiosita)
								    }),
								    issues_dividere_avg: d3.mean(v, function(d) { 
								    	return (+d.it_dividere)
								    }),
								    issues_notabile_avg: d3.mean(v, function(d) { 
								    	return (+d.it_notabile)
								    }),
								    issues_noReferenze_avg: d3.mean(v, function(d) { 
								    	return (+d.it_noReferenze)
								    }),
								    issues_noNote_avg: d3.mean(v, function(d) { 
								    	return (+d.it_noNote)
								    }),
								    issues_organizzare_avg: d3.mean(v, function(d) { 
								    	return (+d.it_organizzare)
								    }),
								    issues_pov_avg: d3.mean(v, function(d) { 
								    	return (+d.it_pov)
								    }),
								    issues_recentismo_avg: d3.mean(v, function(d) { 
								    	return (+d.it_recentismo)
								    }),
								    issues_stub_avg: d3.mean(v, function(d) { 
								    	return (+d.it_stub)
								    }),
								    issues_noFonte_avg: d3.mean(v, function(d) { 
								    	return (+d.it_noFonte)
								    }),
								    issues_noInfobox_avg: d3.mean(v, function(d) { 
								    	return (+d.it_noInfobox)
								    }),
								    issues_wikify_avg: d3.mean(v, function(d) { 
								    	return (+d.it_wikify)
								    }),


								    references_avg: d3.mean(v, function(d) { 
								    	return +d.it_bNum 
								    }),
								    notes_avg: d3.mean(v, function(d) { 
								    	return +d.it_nNum 
								    }),
								    images_avg: d3.mean(v, function(d) { 
								    	return (+d.it_svg) + (+d.it_jpg) + (+d.it_png) + (+d.it_gif) + (+d.it_tif) + (+d.it_mAltri); 
								    })
								}})
								.entries(dataset)
		  				}
		  				else {	
				  			region_group = d3.nest()
								.key(d => d.Regione)
								.rollup(function(v) { return {
								    places: v.length,
								    population: d3.mean(v, function(d) { 
								    	return +d.Popolazione 
								    }),
								    size_avg: d3.mean(v, function(d) { 
								    	return +d.en_pDim 
								    }),
								    monuments_size_avg: d3.mean(v, function(d) { 
								    	return +d.en_mDim 
								    }),
								    
								    // issues
								    issues_avg: d3.mean(v, function(d) { 
								    	return +d.en_aNum 
								    }),
								    issues_Verifica_avg: d3.mean(v, function(d) { 
								    	return (+d.en_verifica)
								    }),
								    issues_correggere_avg: d3.mean(v, function(d) { 
								    	return (+d.en_correggere)
								    }),
								    issues_curiosita_avg: d3.mean(v, function(d) { 
								    	return (+d.en_curiosita)
								    }),
								    issues_dividere_avg: d3.mean(v, function(d) { 
								    	return (+d.en_dividere)
								    }),
								    issues_notabile_avg: d3.mean(v, function(d) { 
								    	return (+d.en_notabile)
								    }),
								    issues_noReferenze_avg: d3.mean(v, function(d) { 
								    	return (+d.en_noReferenze)
								    }),
								    issues_noNote_avg: d3.mean(v, function(d) { 
								    	return (+d.en_noNote)
								    }),
								    issues_organizzare_avg: d3.mean(v, function(d) { 
								    	return (+d.en_organizzare)
								    }),
								    issues_pov_avg: d3.mean(v, function(d) { 
								    	return (+d.en_pov)
								    }),
								    issues_recentismo_avg: d3.mean(v, function(d) { 
								    	return (+d.en_recentismo)
								    }),
								    issues_stub_avg: d3.mean(v, function(d) { 
								    	return (+d.en_stub)
								    }),
								    issues_noFonte_avg: d3.mean(v, function(d) { 
								    	return (+d.en_noFonte)
								    }),
								    issues_noInfobox_avg: d3.mean(v, function(d) { 
								    	return (+d.en_noInfobox)
								    }),
								    issues_wikify_avg: d3.mean(v, function(d) { 
								    	return (+d.en_wikify)
								    }),


								    references_avg: d3.mean(v, function(d) { 
								    	return +d.en_bNum 
								    }),
								    notes_avg: d3.mean(v, function(d) { 
								    	return +d.en_nNum 
								    }),
								    images_avg: d3.mean(v, function(d) { 
								    	return (+d.en_svg) + (+d.en_jpg) + (+d.en_png) + (+d.en_gif) + (+d.en_tif) + (+d.en_mAltri); 
								    })
								}})
								.entries(dataset)
		  				}
		  				return region_group
	  				}
						make_dataset(dataset,language)
						// console.log(region_group)

						// sort
						if (feature == "size"){
							sorted_data = region_group.sort(function(a, b){
								return d3.descending(+a.value.size_avg, +b.value.size_avg);
							})
						}
						else if (feature == "issues"){
							sorted_data = region_group.sort(function(a, b){
								return d3.descending(+a.value.issues_avg, +b.value.issues_avg);
							})
						}
						else if (feature == "references") {
							sorted_data = region_group.sort(function(a, b){
								return d3.descending(+a.value.references_avg, +b.value.references_avg);
							})
						}
						else if (feature == "notes") {
							sorted_data = region_group.sort(function(a, b){
								return d3.descending(+a.value.notes_avg, +b.value.notes_avg);
							})
						}
						else if (feature == "images") {
							sorted_data = region_group.sort(function(a, b){
								return d3.descending(+a.value.images_avg, +b.value.images_avg);
							})
						}

						// scale
						let issues_max = d3.max(region_group, function(d) { 
							return +d.value.issues_avg
						})

						let my_max_features = d3.max(region_group, function(d) {
							return +d.value.references_avg + (+d.value.notes_avg) + (d.value.images_avg)
						})

						let r_max = d3.max(region_group, function(d) { 
							return Math.sqrt(+d.value.size_avg/3.14);
						})

						x.domain([0, region_group.length]) // region_group.length sorted_data
						// console.log(sorted_data.length)

						let r = d3.scaleLinear()
							.range([0, 1])
							.domain([0,r_max])

						// axis and grid
						let y_issues = d3.scaleLinear()
							.domain([0,issues_max]) 
							.range([0,issue_height])

						y_issues_text = d3.scaleLinear()
							.domain([issues_max,0]) 
							.range([0,issue_height])

						let y_features = d3.scaleLinear()
							.domain([0,my_max_features]) 
							.range([0,features_height])

						// grid 
						let axis_grid = svg.append("g")
							.attr("id","axis_grid")

						let grids = axis_grid.append("g")
							.attr("id","grids")

						function make_issue_gridlines() {		
					    	return d3.axisLeft(y_issues_text)
						}

						function make_features_gridlines() {		
					    	return d3.axisLeft(y_features)
						}

						function make_y_gridlines() {		
				    		return d3.axisLeft(y)
						}

						// grid
						let grid_issues = grids.append("g")
							.attr("id","grid_issues")
							.attr("transform", "translate(-1," + (margin.top+85) + ")")
							.call(make_issue_gridlines()
								//.ticks(ticksAmount)
								.tickValues(d3.range(0,issues_max,0.2))
				          		.tickSize(-width-margin.left-margin.right-60)
				          	)

				        let grid_features = grids.append("g")
							.attr("id","grid_features")
							.attr("transform", "translate(-1," + (margin.top + v_shift + (height/2)) + ")")
							.call(make_features_gridlines()
								//.ticks(ticksAmount)
				          		.tickValues(d3.range(0,my_max_features,25))
				          		.tickSize(-width-margin.left-margin.right-60)
				          	)

				        // axis
						let axis = axis_grid.append("g")
							.attr("id","axis")

						let axis_issues = axis.append("g")
							.attr("transform", "translate(" + (margin.left*1+40) + "," + (margin.top+85) + ")")
							.call(d3.axisLeft(y_issues_text)
								.tickValues(d3.range(0,issues_max,1))
								.tickFormat(d3.format("d"))
							)
							.attr("id","yAxis_issues")

						let x_features_axis = d3.scaleLinear()
							.domain([my_max_features,0]) 
							.range([features_height,0])

						let axis_features = axis.append("g")
							.attr("transform", "translate(" + (margin.left*1+40) + "," + (margin.top + (height/2)+(v_shift*1)) + ")") // ((height/2)+(v_shift*3))
							.call(d3.axisLeft(x_features_axis)
								.tickValues(d3.range(0,my_max_features,50))
								.tickFormat(d3.format("d"))
							)
							.attr("id","yAxis_features")

						// plot
						let plot = svg.append("g")
							.attr("id", "d3_plot")
							.attr("transform", "translate(" + (margin.right*1.5) + "," + margin.top + ")");

						// region 
						let region = plot.append("g")	
							.attr("class","regions")
							.selectAll("g")
							.data(sorted_data)
							.enter()
							.append("g")
							.attr("data-region",function(d,i){
								return d.key
							})
							.attr("class","region")
							.attr("transform", function(d,i){
								return "translate(" + x(i) + "," + 0 + ")"
							})
							.on("mouseover", function(d,i) {
								let tooltip_text = d.key + "<br>" + Math.floor(d.value.population).toLocaleString() + 
									" abitanti (media)<br><br>"

									tooltip_text += "<table>"
									tooltip_text += "<tr><td class='label'>byte</td>" + "<td class='value' style='text-align: right;'>" + Math.floor(+d.value.size_avg).toLocaleString() + "</td></tr>" 
									tooltip_text += "<tr><td class='label'>avvisi</td>" + "<td class='value' style='text-align: right;'>" + (+d.value.issues_avg.toFixed(2)) + "</td></tr>" 
									tooltip_text += "<tr><td class='label'>riferimenti bibliografici</td>" + "<td class='value' style='text-align: right;'>" + (+d.value.references_avg.toFixed(1)) + "</td></tr>" 
									tooltip_text += "<tr><td class='label'>note</td>" + "<td class='value' style='text-align: right;'>" + (+d.value.notes_avg.toFixed(1)) + "</td></tr>" 
									tooltip_text += "<tr><td class='label'>immagini</td>" + "<td class='value' style='text-align: right;'>" + (+d.value.images_avg.toFixed(1)) + "</td></tr>" 
									tooltip_text += "</table>"

								div.transition()		
					            	.duration(200)		
					            	.style("opacity", .9);

					            div.html(tooltip_text)	
					            	.style("left", (d3.event.pageX-110) + "px")
					                .style("top", (d3.event.pageY-220) + "px");	

					            d3.selectAll(".region")
									.attr("opacity",0.2)

								d3.select(this)
									.attr("opacity",1)
					        })			
							.on("mouseout", function(d) {
								d3.selectAll(".region")
								.attr("opacity",1)

								div.transition()		
	                				.duration(500)		
	                				.style("opacity", 0);
							})

					// place circle
					let place_width = 0;
					place_width = ((width-margin.left*2) - (h_space*(sorted_data.length-1))) / (sorted_data.length)

					// if (sorted_data.length == 20){
					// 	place_width = ((width-margin.left*2) - (h_space*(sorted_data.length-1))) / (sorted_data.length)
					// }
					// else if (sorted_data.length == 19) {
					// 	place_width = ((width-margin.left*2) - (h_space*(sorted_data.length-1))) / (sorted_data.length + 1)
					// }
					// else {
					// 	place_width = ((width-margin.left*2) - (h_space*(sorted_data.length-1))) / (sorted_data.length + 2)
					// }

					let region_size = region.append("g")
						.attr("transform","translate(" + (place_width/2) + "," + 40 + ")")
						.attr("class", "size")

					let region_circle = region_size.append("circle")
						.transition()
						.duration(500)
						.delay(function(d,i){ 
							return i * 2
						})
						.attr("cx", 0)
						.attr("cy", 0)
						.attr("r", function(d,i){
							return r(+d.value.size_avg)/14
						})
						.style("fill", function(d,i) {
							return region_color
						})
						.style("opacity",0.5)

					let monument_circle = region_size.append("circle")
						.transition()
						.duration(500)
						.delay(function(d,i){ 
							return i * 2
						})
						.attr("cx", 0)
						.attr("cy", 0)
						.attr("r", function(d,i){
							return r(+d.value.monuments_size_avg)/13
						})
						.style("fill", function(d,i) {
							return region_color
						})
						.style("opacity",0.5)

					//issues
					let issues = region.append("g")
						.attr("transform",function(d,i){
							return "translate(" + 0 + "," + 85 + ")";
						})
						.attr("class", "issues")
						.append("rect")
						.attr("data-issues", function(d,i){
							return +d.value.issues_avg
						})
						.attr("x",0)
						.attr("y",y_issues(issues_max))
						.attr("width",place_width)
						.attr("height",0)
						.attr("fill","red")
						.attr("class","iss ")
						.transition()
						.attr("y",function(d,i){
							return y_issues(issues_max - d.value.issues_avg);
						})
						.attr("height", function(d,i){
							return y_issues(d.value.issues_avg) 
						})

					// features
					let features = region.append("g")
						.attr("transform", function(d,i){
							return "translate(" + 0 + "," + ((height/2)+v_shift) + ")"
						})
						.attr("class", "features")

					let images = features.append("rect")
						.attr("x",0)
						.attr("y",0)
						.attr("width",place_width)
						.attr("fill",c_image)
						.attr("class", function(d,i){
							return "feat img_" + d.value.images_avg 
						})
						.attr("height",0)
						.transition()
						.attr("height", function(d,i){
							return y_features(d.value.references_avg + d.value.notes_avg + d.value.images_avg)
						})

					let notes = features.append("rect")
						.attr("x",0)
						.attr("y",0)
						.attr("width",place_width)
						.attr("fill",c_note)
						.attr("class", function(d,i){
							return "feat not_" + d.value.notes_avg 
						})
						.attr("height",0)
						.transition()
						.attr("height", function(d,i){
							return y_features(d.value.references_avg + d.value.notes_avg)
						})

					let references = features.append("rect")
						.attr("x",0)
						.attr("y",function(d,i){
							return 0
						})
						.attr("width",place_width)
						.attr("fill",c_reference)
						.attr("class", function(d,i){
							return "feat ref_" + d.value.references_avg 
						})
						.attr("height", 0)
						.transition()
						.attr("height", function(d,i){
							return y_features(d.value.references_avg)
						})
				}

				let inhabitants = 0;

				let filtered_data = data.filter(function(a,b){ 
					return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
				})

				make_chart(filtered_data,"it","size")

				$("#language").change(function() {
					let language = this.value;
					let inhabitants =  $("#inhabitants option:selected").val();
					let feature =  $("#sort_feature option:selected").val();

					let filtered_data = data.filter(function(a,b){ 
						return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
					})

					$("#d3_plot").remove();
					$("#axis_grid").remove();

					update_language(filtered_data,language,feature);
				});

				$("#inhabitants").change(function() {
					let inhabitants = parseInt(this.value);
					let language = $("#language option:selected").val();
					let feature = $("#sort_feature option:selected").val();

					let filtered_data = data.filter(function(a,b){ 
						return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
					})

					$("#d3_plot").remove();
					$("#axis_grid").remove();

					update_language(filtered_data,language,feature);
					// console.log(filtered_data,language,feature,inhabitants)
				});

				$("#sort_feature").change(function() {
					let feature = this.value;
					let language =  $("#language option:selected").val();
					let inhabitants = $("#inhabitants option:selected").val();

					let filtered_data = data.filter(function(a,b){ 
						return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
					})

					let data_to_sort;
					if (inhabitants == "3"){
						data_to_sort = filtered_data.filter(function(value, index, arr){ 
							return value.Regione != "Basilicata";
						})
					}
					else if (inhabitants == "4"){
						data_to_sort = filtered_data.filter(function(value, index, arr){ 
							return value.Regione != "Molise" && value.Regione != "Valle d'Aosta/Vallée d'Aoste";
						})
					}
					else {
						data_to_sort = filtered_data;
					}

					update_sort(data_to_sort,feature,language,inhabitants);
				});

				function update_language(dataset,language,feature){
					make_chart(dataset,language,feature);
				}

				function update_sort(dataset,feature,language,inhabitants){
					// console.log(dataset)

		  		// aggregate cities by region
  				if (language == "it") {	
		  			region_group = d3.nest()
						.key(d => d.Regione)
						.rollup(function(v) { return {
						    places: v.length,
						    population: d3.sum(v, function(d) { 
						    	return +d.Popolazione 
						    }),
						    size_avg: d3.mean(v, function(d) { 
						    	return +d.it_pDim 
						    }),
						    monuments_size_avg: d3.mean(v, function(d) { 
						    	return +d.it_mDim 
						    }),
						    
						    // issues
						    issues_avg: d3.mean(v, function(d) { 
						    	return +d.it_aNum 
						    }),
						    issues_Verifica_avg: d3.mean(v, function(d) { 
						    	return (+d.it_verifica)
						    }),
						    issues_correggere_avg: d3.mean(v, function(d) { 
						    	return (+d.it_correggere)
						    }),
						    issues_curiosita_avg: d3.mean(v, function(d) { 
						    	return (+d.it_curiosita)
						    }),
						    issues_dividere_avg: d3.mean(v, function(d) { 
						    	return (+d.it_dividere)
						    }),
						    issues_notabile_avg: d3.mean(v, function(d) { 
						    	return (+d.it_notabile)
						    }),
						    issues_noReferenze_avg: d3.mean(v, function(d) { 
						    	return (+d.it_noReferenze)
						    }),
						    issues_noNote_avg: d3.mean(v, function(d) { 
						    	return (+d.it_noNote)
						    }),
						    issues_organizzare_avg: d3.mean(v, function(d) { 
						    	return (+d.it_organizzare)
						    }),
						    issues_pov_avg: d3.mean(v, function(d) { 
						    	return (+d.it_pov)
						    }),
						    issues_recentismo_avg: d3.mean(v, function(d) { 
						    	return (+d.it_recentismo)
						    }),
						    issues_stub_avg: d3.mean(v, function(d) { 
						    	return (+d.it_stub)
						    }),
						    issues_noFonte_avg: d3.mean(v, function(d) { 
						    	return (+d.it_noFonte)
						    }),
						    issues_noInfobox_avg: d3.mean(v, function(d) { 
						    	return (+d.it_noInfobox)
						    }),
						    issues_wikify_avg: d3.mean(v, function(d) { 
						    	return (+d.it_wikify)
						    }),

						    references_avg: d3.mean(v, function(d) { 
						    	return +d.it_bNum 
						    }),
						    notes_avg: d3.mean(v, function(d) { 
						    	return +d.it_nNum 
						    }),
						    images_avg: d3.mean(v, function(d) { 
						    	return (+d.it_svg) + (+d.it_jpg) + (+d.it_png) + (+d.it_gif) + (+d.it_tif) + (+d.it_mAltri); 
						    })
						}})
						.entries(dataset)
  				}
  				else {	
				  			region_group = d3.nest()
								.key(d => d.Regione)
								.rollup(function(v) { return {
								    places: v.length,
								    population: d3.sum(v, function(d) { 
								    	return +d.Popolazione 
								    }),
								    size_avg: d3.mean(v, function(d) { 
								    	return +d.en_pDim 
								    }),
								    monuments_size_avg: d3.mean(v, function(d) { 
								    	return +d.en_mDim 
								    }),
								    
								    // issues
								    issues_avg: d3.mean(v, function(d) { 
								    	return +d.en_aNum 
								    }),
								    issues_Verifica_avg: d3.mean(v, function(d) { 
								    	return (+d.en_verifica)
								    }),
								    issues_correggere_avg: d3.mean(v, function(d) { 
								    	return (+d.en_correggere)
								    }),
								    issues_curiosita_avg: d3.mean(v, function(d) { 
								    	return (+d.en_curiosita)
								    }),
								    issues_dividere_avg: d3.mean(v, function(d) { 
								    	return (+d.en_dividere)
								    }),
								    issues_notabile_avg: d3.mean(v, function(d) { 
								    	return (+d.en_notabile)
								    }),
								    issues_noReferenze_avg: d3.mean(v, function(d) { 
								    	return (+d.en_noReferenze)
								    }),
								    issues_noNote_avg: d3.mean(v, function(d) { 
								    	return (+d.en_noNote)
								    }),
								    issues_organizzare_avg: d3.mean(v, function(d) { 
								    	return (+d.en_organizzare)
								    }),
								    issues_pov_avg: d3.mean(v, function(d) { 
								    	return (+d.en_pov)
								    }),
								    issues_recentismo_avg: d3.mean(v, function(d) { 
								    	return (+d.en_recentismo)
								    }),
								    issues_stub_avg: d3.mean(v, function(d) { 
								    	return (+d.en_stub)
								    }),
								    issues_noFonte_avg: d3.mean(v, function(d) { 
								    	return (+d.en_noFonte)
								    }),
								    issues_noInfobox_avg: d3.mean(v, function(d) { 
								    	return (+d.en_noInfobox)
								    }),
								    issues_wikify_avg: d3.mean(v, function(d) { 
								    	return (+d.en_wikify)
								    }),

								    references_avg: d3.mean(v, function(d) { 
								    	return +d.en_bNum 
								    }),
								    notes_avg: d3.mean(v, function(d) { 
								    	return +d.en_nNum 
								    }),
								    images_avg: d3.mean(v, function(d) { 
								    	return (+d.en_svg) + (+d.en_jpg) + (+d.en_png) + (+d.en_gif) + (+d.en_tif) + (+d.en_mAltri); 
								    })
								}})
								.entries(dataset);
					}

					// sort
					if (feature == "size"){
						data_ = region_group.sort(function(a, b){
							return d3.descending(+a.value.size_avg, +b.value.size_avg);
						})
					}
					else if (feature == "issues"){
						data_ = region_group.sort(function(a, b){
							return d3.descending(+a.value.issues_avg, +b.value.issues_avg);
						})
					}
					else if (feature == "references") {
						data_ = region_group.sort(function(a, b){
							return d3.descending(+a.value.references_avg, +b.value.references_avg);
						})
					}
					else if (feature == "notes") {
						data_ = region_group.sort(function(a, b){
							return d3.descending(+a.value.notes_avg, +b.value.notes_avg);
						})
					}
					else if (feature == "images") {
						data_ = region_group.sort(function(a, b){
							return d3.descending(+a.value.images_avg, +b.value.images_avg);
						})
					}

					// data_.forEach(function(d,i){
					// 	console.log(i,d.key,+d.value.issues_avg.toFixed(2))
					// })

					data_.forEach(function(d,i){
						new_id = i;
						d.new_id = new_id;
						// console.log(d.new_id,d.key,+d.value.issues_avg.toFixed(2),+d.value.references_avg.toFixed(1))
					})

					let dataset_length = data_.length; // 20
					x.domain([0,dataset_length]);
 
					svg.selectAll(".region")
						.transition()
						.attr("transform", function(d,i){
							data_.forEach(function(a,b){
								if (d.key == a.key){
									d.new_id = b
								}
							})
							return "translate(" + x(d.new_id) + "," + 0 + ")";
						})
					}
	  		})

			// .catch(function(error) {
		 //    	console.log("some error occurred")
		 //  	});

	}

	load_data(articles_url);
}

$(document).ready(function() {
	dv2();
})