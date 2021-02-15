// settings
const articles_url = "../assets/data/articles.tsv";
const container = "#dv2";

const h_space = 2;

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

const issue_height = height/2.1;
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

	  			function make_chart(dataset){

		  			// aggregate cities by region
		  			let region_group = d3.nest()
						.key(d => d.Regione)
						// .rollup(function(v) {return d3.mean(v, function(d) { return d.Popolazione; })})
						.rollup(function(v) { return {
						    places: v.length,
						    population: d3.sum(v, function(d) { 
						    	return d.Popolazione 
						    }),
						    size_avg: d3.mean(v, function(d) { 
						    	return d.it_pDim 
						    }),
						    issues_avg: d3.mean(v, function(d) { 
						    	return d.it_aNum 
						    }),
						    references_avg: d3.mean(v, function(d) { 
						    	return d.it_bNum 
						    }),
						    notes_avg: d3.mean(v, function(d) { 
						    	return d.it_nNum 
						    })
						}})
						.entries(data)
					console.log(region_group)

					// scale
					let issues_max = d3.max(region_group, function(d) { 
						return d.it_aNum
					})

					let max_features = d3.max(region_group, function(d) {
						return +d.en_pDim // size
					})

					// axis and grid
					let my_max_features = max_features;

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
						.data(region_group)
						.enter()
						.append("g")
						.sort(function(a, b) {
				  				return d3.descending(a.it_aNum, b.it_aNum);
						})
						.attr("class",function(d,i){
							return d.key
						})
						.attr("transform", function(d,i){
							return "translate(" + x(i) + "," + 0 + ")"
						})
						// .on("mouseover", handleMouseOver)
						// .on("mouseout", handleMouseOut)
						// .append("a")
						// .attr("xlink:href", function(d,i){
						// 	return wiki_link + d.article
						// })
						// .attr("target","_blank")
						// .on("mouseover", tooltip.show) 
						// .on("mouseout", tooltip.hide)

					// place circle
					// let place_width = ((width-margin.left) - (h_space*(total-1))) / total

					console.log(region_group[0].value.size_avg)

					let region_circle = region.append("circle")
						.attr("cx", 0)
						.attr("cy", 200)
						.attr("r", function(d,i){
							return d.value.size_avg/400
						})
						.style("fill", function(d,i) {
							// return apply_color(d.subject)
							return "red"
						})
						.style("opacity",0.5)

					let region_name = region.append("text")
						.text(function(d,i){
							return d.key
						})

				}

				make_chart(data)

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