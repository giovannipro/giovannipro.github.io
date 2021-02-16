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

if (window_w <= 768) {
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

// make the visualization
function dv2(){

	function load_data(url){

		d3.tsv(url)
	  		.then(function(data) {
	  			console.log(data)

				let svg = d3.select(container)
					.append("svg")
					.attr("width", width + (margin.right + margin.right))
					.attr("height",height + (margin.top + margin.bottom))
					.attr("id", "svg")

				// plot
				let plot = svg.append("g")
					.attr("id", "d3_plot")
					.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

	  			let total = 0;
	  			let region_articles = [];

	  			function make_chart(dataset,language){

	  				let region_group;

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
							.entries(dataset)
	  				}
					console.log(region_group);

					let sorted_data = region_group.sort(function(a, b){
						return d3.descending(+a.value.issues_avg, +b.value.issues_avg);
					})

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

					let r = d3.scaleLinear()
						.range([0, 1])
						.domain([0,r_max])


					// axis and grid
					let x = d3.scaleLinear()
						.domain([0,region_group.length]) 
						.range([0,width-margin.left])

					let y_issues = d3.scaleLinear()
						.domain([0,issues_max]) 
						.range([0,issue_height])

					let y_issues_text = d3.scaleLinear()
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
				    	return d3.axisLeft(y_issues)
					}

					function make_features_gridlines() {		
				    	return d3.axisLeft(y_features)
					}

					function make_y_gridlines() {		
			    		return d3.axisLeft(y)
					}

					let region = plot.append("g")	
						.attr("class","regions")
						.selectAll("g")
						.data(sorted_data)
						.enter()
						.append("g")
						// .sort(function(a, b) {
				  // 				return d3.descending(a.it_aNum, b.it_aNum);
						// })
						.attr("class",function(d,i){
							return d.key + " region"
						})
						.attr("transform", function(d,i){
							return "translate(" + x(i) + "," + 0 + ")"
						})
						.on("mouseover", handleMouseOver)
						.on("mouseout", handleMouseOut)
						// .append("a")
						// .attr("xlink:href", function(d,i){
						// 	return wiki_link + d.article
						// })
						// .attr("target","_blank")
						// .on("mouseover", tooltip.show) 
						// .on("mouseout", tooltip.hide)

					// place circle
					let place_width = ((width-margin.left) - (h_space*(20-1))) / 20

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
							return r(+d.value.size_avg)/10
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
							return r(+d.value.monuments_size_avg)/10
						})
						.style("fill", function(d,i) {
							return region_color
						})
						.style("opacity",0.5)

					let region_name = region.append("text")
						.text(function(d,i){
							return d.key
						}) 

					//issues
					let issues = region.append("g")
						.attr("transform",function(d,i){
							return "translate(" + 0 + "," + 85 + ")";
						})
						.attr("class", "issues")
						.append("rect")
						.attr("x",0)
						.attr("y",function(d,i){
							return y_issues(issues_max - d.value.issues_avg);
						})
						.attr("height", function(d,i){
							return y_issues(d.value.issues_avg) 
						})
						.attr("width",place_width)
						.attr("fill","red")
						.attr("class", function(d,i){
							return "iss " + d.value.issues_avg
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

					function handleMouseOver(){
						d3.selectAll(".region")
							.attr("opacity",0.2)

						d3.select(this)
							.attr("opacity",1)
					}

				    function handleMouseOut(){
						d3.selectAll(".region")
							.attr("opacity",1)
				    }

				}

				let inhabitants = 0;

				let filtered_data = data.filter(function(a,b){ 
					return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
				})
				// console.log(the_inhabitants(inhabitants)[0])

				make_chart(filtered_data,"it")


				$("#language").change(function() {
					let language = this.value;
					let inhabitants =  $("#inhabitants option:selected").val();
					let feature =  $("#sort_feature option:selected").val();
					console.log(feature);

					let filtered_data = data.filter(function(a,b){ 
						return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
					})

					$("#d3_plot").empty();

					update_language(filtered_data,language,feature);
				});

				$("#sort_feature").change(function() {
					let feature = this.value;
					let inhabitants =  $("#inhabitants option:selected").val();
					let language =  $("#language option:selected").val();

					update_sort(filtered_data,language,feature);
				});

				function update_language(dataset,language,feature){
					make_chart(dataset,language);
				}

				function update_sort(dataset,language,feature){
					// make_chart(dataset,language);
					console.log(language,feature)
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