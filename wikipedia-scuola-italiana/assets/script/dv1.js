function format_date(date){
	if (date != 0) {
		const year = date.substring(0,4);
		const month = date.substring(5,7);
		const day = date.substring(8,10);
		return day + "-" + month + "-" + year
	}
	else {
		return "-"
	}
}

const container = "#dv1";
const font_size = 10;
const filter_item = 120; // 120
const shiftx_article = 30;
const wiki_link = "https://it.wikipedia.org/wiki/";
const variation_line_opacity = 0.7;

const stroke_dash = "3,3";

// let multiply = 1;
let window_w = $(container).outerWidth();
	window_h = $(container).outerHeight();

if (window_w <= 768){
	reduction = 20;
}
else {
	reduction = 0;
}

let margin = {top: 20, left: 0-reduction, bottom: 20, right: 60-reduction},
	width = window_w - (margin.right + margin.right),
	height = window_h - (margin.top + margin.bottom);

let svg = d3.select(container)
	.append("svg")
	.attr("width", width + (margin.right + margin.right))
	.attr("height",height + (margin.top + margin.bottom))
	.attr("id", "svg")

// improvements
let improvements_defs = svg.append("defs")
	.append("g")
	.attr("id","icons")

let scale_icons = "0.5"

let improv_one = improvements_defs.append("g")
	.attr("id","improv_one")
	.attr("transform","scale(" + scale_icons + "),translate(5,-10)")
	.append("polygon")
	.attr("points", "5 0 0 7 10 7 5 0" )

let improv_two = improvements_defs.append("g")
	.attr("id","improv_two")
	.attr("transform","scale(" + scale_icons + "),translate(5,-17)")
	
	improv_two.append("polygon")
		.attr("points", "5 0 0 7 10 7 5 0" )

	improv_two.append("polygon")
		.attr("points", "5 7 0 14 10 14 5 7" )

let improv_three = improvements_defs.append("g")
	.attr("id","improv_three")
	.attr("transform","scale(" + scale_icons + "),translate(5,-24)")

	improv_three.append("polygon")
		.attr("points", "5 0 0 7 10 7 5 0" )

	improv_three.append("polygon")
		.attr("points", "5 7 0 14 10 14 5 7" )

	improv_three.append("polygon")
		.attr("points", "5 14 0 21 10 21 5 14" )

let improv_col = "black"; //"#1ba51b";
let improv_delay = 1800;

function dv1(year,the_subject,sort) {
	d3.tsv("assets/data/voci_" + year + ".tsv").then(loaded)
	// console.log(year,the_subject,sort)

	function loaded(data) {

		// load data
		let total = 0;
		let subject_articles = [];
		let filter_data;

		let subject_group = d3.nest()
			.key(d => d.subject)
			.entries(data)
	
		for (const [d,c] of Object.entries(subject_group)) {

			// all subjects
			if (the_subject == "all"){

				if (c.key !== "-"){
					let values = c.values

					values.forEach(function (d,i) {
						subject_articles.push(d)
					})
				}
			}
			else {
				if (c.key == the_subject){
					subject_articles = c.values;
				}
			}
		}
		// console.log(subject_group);
		
		visit_sort = subject_articles.sort(function(x, y){
			return d3.descending(+x.avg_pv, +y.avg_pv);
		})

		filter_data = visit_sort.filter(function(x,y){ 
			return y < filter_item 
		})

		// sort
		filtered_data = filter_data.sort(function(a, b){
			return d3.ascending(a.article, b.article);
		})
	
		filtered_data.forEach(function (d,i) {
			total += 1
			d.article = d.article.replace(/_/g," ")
			d.size = +d.size
			d.discussion_size = +d.discussion_size
			d.incipit_size = +d.incipit_size
			d.issues = +d.issues
			d.images = +d.images

			d.days = +d.days
			d.avg_pv = +d.avg_pv

			d.issues_prev = +d.issues_prev
			d.images_prev = +d.images_prev
			d.incipit_prev = +d.incipit_prev

			if (d.avg_pv_prev !== "-"){
				d.avg_pv_prev = +d.avg_pv_prev
			}

			// improvements
			d.improvements = 0;
			if (d.issues < d.issues_prev) {
				d.improvements += 1
			}
			if (d.images > d.images_prev) {
        		d.improvements += 1
        	}
        	if (d.incipit_size > d.incipit_prev) {
        		d.improvements += 1
        	}

        	if (d.improvements > 0) {
				console.log(d.article,d.improvements,d.issues,d.issues_prev,d.images,d.images_prev,d.incipit_size,d.incipit_prev);
			}
		})
		// console.log(filtered_data);
		
		// scale
		let y_max = d3.max(filtered_data, function(d) { 
			return +d.avg_pv;
		})

		let r_max = d3.max(filtered_data, function(d) { 
			return Math.sqrt(+d.size/3.14);
		})

		let y = d3.scaleLinear()
			.domain([0,y_max+(y_max/100*10)]) 
			.range([height-margin.top,0])

		if (sort == 1) {
			max = total	
			min = 0
		}
		else if (sort == 2){
			max = d3.min(filtered_data, function(d) { 
				return d.days;
			})
			min = d3.max(filtered_data, function(d) { 
				return d.days;
			})
		}
		else if (sort == 3){
			min = d3.min(filtered_data, function(d) { 
				return d.size;
			})
			max = d3.max(filtered_data, function(d) { 
				return d.size;
			})
		}
		else if (sort == 4){
			min = d3.min(filtered_data, function(d) { 
				return d.discussion_size;
			})
			max = d3.max(filtered_data, function(d) { 
				return d.discussion_size;
			})
		}
		else if (sort == 5){
			min = d3.min(filtered_data, function(d) { 
				return d.incipit_size;
			})
			max = d3.max(filtered_data, function(d) { 
				return d.incipit_size;
			})
		}
		else if (sort == 6){
			min = 0;
			max = d3.max(filtered_data, function(d) { 
				return d.issues;
			})
		}
		else if (sort == 7){
			min = d3.min(filtered_data, function(d) { 
				return d.images;
			})
			max = d3.max(filtered_data, function(d) { 
				return d.images;
			})
		}
       	
       	x = d3.scaleLinear()
			.domain([min,max])
			.range([0,width-100])
		// console.log(min,max)

		let r = d3.scaleLinear()
			.range([0, 20])
			.domain([0,r_max])

		// axis and grid
		let grid = svg.append("g")
			.attr("id","grid")
			.attr("transform", "translate(-1," + margin.top*2 + ")")
			.call(make_y_gridlines()
          		.tickSize(-width-margin.left-margin.right-60)
          	)

		let plot = svg.append("g")
			.attr("id", "d3_plot")
			.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

		function make_y_gridlines() {		
		    return d3.axisLeft(y)
		}

		let yAxis_margin = 10;
		if (window_w < 700){
			yAxis_margin = 0;
		}
		let yAxis = plot.append("g")
			.attr("id","yAxis")
			.attr("transform", "translate(" + yAxis_margin + "," + (margin.top) +")")
			.call(d3.axisLeft(y))
			.selectAll("text")
			.attr("y", -10)

		let yaxis_label_box = plot.append("g")
			.attr("class","yaxis_label")
			.attr("transform","translate(7," + height + ")")

		let yaxis_label = yaxis_label_box.append("text")
			.text("visite giornaliere (media)")
			.attr("y",-6)
			.attr("font-size",font_size)

		// let the_sort;
		let tooltip = d3.tip()
			.attr('class', 'tooltip')
			.attr('id', 'tooltip_dv1')
			.direction(function (d,i) {
				return 'n'
			})
			.offset([-10,0])
			.html(function(d,i) {
                let content = "<p style='font-weight: bold; margin: 0 0 10px 3px;'>" + d.article +"</p><table>";

                content += "<tr><td class='label'>pubblicazione</td><td class='value'>" + format_date(d.first_edit) + "</td><td></td></tr>"

                // avg daily visits
                content += "<tr><td class='label'>visite giornaliere</td><td class='value'>" + d.avg_pv.toLocaleString()
            	if (d.avg_pv_prev !== "-"){
	            	let diff_pv = d.avg_pv - d.avg_pv_prev
	            	if (diff_pv > 0){
	            		content += "<td class='value increase'>(" + /*d.avg_pv_prev + " " + */ variation_perc(d.avg_pv,d.avg_pv_prev,"visits") + ")</td></tr>"
	            	}
	            	else {
	            		let diff_pv_perc = Math.floor(100-(d.avg_pv*100)/d.avg_pv_prev).toLocaleString();
	            		content += "<td class='value decrease'>(" + /* d.avg_pv_prev + " " + */ variation_perc(d.avg_pv,d.avg_pv_prev,"visits") + ")</td></tr>"
	                }
           		}

                //size
                content += "<tr><td class='label'>dimensioni</td><td class='value'>" + d.size.toLocaleString()
        		if(year != 2020){
        			let diff_size = d.size - d.size_prev
	            	if (diff_size > 0){
	            		content += "<td class='value increase'>(" + /* d.size_prev + " " + */ variation_perc(d.size,d.size_prev,"visits") + ")</td></tr>"
	            	}
	            	else {
	            		content += "<td class='value decrease'>(" + /* d.size_prev + " " + */ variation_perc(d.size,d.size_prev,"visits") + ")</td></tr>"
	            	}
	            }

            	// discussion
            	content += "<tr><td class='label'>discussione</td><td class='value'>" + d.discussion_size.toLocaleString()
            	if(year != 2020){
            		let diff_discussion = d.discussion_size - d.discussion_prev
	            	if (diff_discussion > 0){
	            		content += "<td class='value increase'>(" + /* d.discussion_prev + " " + */ variation_perc(d.discussion_size,d.discussion_prev,"discussion") + ")</td></tr>"
	            	}
	            	else {
	            		content += "<td class='value decrease'>(" + /* d.discussion_prev + " " + */ variation_perc(d.discussion_size,d.discussion_prev,"discussion") + ")</td></tr>"
	            	}
            	}

            	// incipit
            	content += "<tr><td class='label'>incipit</td><td class='value'>" + d.incipit_size.toLocaleString()
            	if(year != 2020){
            		let diff_incipit = d.incipit_size - d.incipit_prev
	            	if (diff_incipit > 0){
	            		content += "<td class='value increase'>(" + /* d.incipit_prev + " " + */ variation_perc(d.incipit_size,d.incipit_prev,"incipit") + ")</td></tr>"
	            	}
	            	else {
	            		content += "<td class='value decrease'>(" + /* d.incipit_prev + " " + */ variation_perc(d.incipit_size,d.incipit_prev,"incipit") + ")</td></tr>"
	            	}
            	}

            	// issues
            	content += "<tr><td class='label'>avvisi</td><td class='value'>" + d.issues.toLocaleString()
            	if(year != 2020){
            		let diff_issues = d.issues - d.issues_prev
	            	if (diff_issues > 0){
	            		content += "<td class='value decrease'>(" + /* d.issues_prev + " " + */ variation_perc(d.issues,d.issues_prev,"issues") + ")</td></tr>"
	            	}
	            	else {
	            		content += "<td class='value increase'>(" + /* d.issues_prev + " " + */ variation_perc(d.issues,d.issues_prev,"issues") + ")</td></tr>"
	            	}
            	}

				// images
				content += "<tr><td class='label'>immagini</td><td class='value'>" + d.images.toLocaleString()
            	if(year != 2020){
            		let diff_images = d.images - d.images_prev
	            	if (diff_images > 0){
	            		content += "<td class='value increase'>(" + /* d.images_prev + " " + */ variation_perc(d.images,d.images_prev,"images") + ")</td></tr>"
	            	}
	            	else {
	            		content += "<td class='value decrease'>(" + /* d.images_prev + " " + */ variation_perc(d.images,d.images_prev,"images") + ")</td></tr>"
	            	}
            	}

	            content += "</table>"
                return content;
            });
       	plot.call(tooltip);

		// plot data
		let articles = plot.append("g")	
			.attr("id","articles")
			.attr("transform","translate(" + shiftx_article + "," + (margin.top) + ")")	

		let article = articles.selectAll("g")
			.data(filtered_data)
			.enter()
			.append("g")
			.attr("class","article")
			.attr("id", function(d,i){
				return i
			})
			.attr("data-article", function(d,i){
				return d.article
			})
			.attr("transform", function(d,i){
				if (sort == 1){
					return "translate(" + (x(i)+50) + ",0)"
				}
				else if (sort == 2) {
					return "translate(" + (x(d.days)+50) + ",0)";
				}
				else if (sort == 3) {
					return "translate(" + (x(d.size)+50) + ",0)";
				}
				else if (sort == 4) {
					return "translate(" + (x(d.discussion_size)+50) + ",0)";
				}
				else if (sort == 5) {
					return "translate(" + (x(d.incipit_size)+50) + ",0)";
				}
				else if (sort == 6) {
					return "translate(" + (x(d.issues)+50) + ",0)";
				}
				else if (sort == 7) {
					return "translate(" + (x(d.images)+50) + ",0)";
				}
			})
			.on("mouseover", tooltip.show) 
			.on("mouseout", tooltip.hide)

			// variation 2020-2021
			let variation = article.append("g")
				.attr("class","variation")
				.attr("transform",function (d,i) {
					if (d.avg_pv_prev !== "-"){
						return "translate(" + 0 + "," + y(d.avg_pv_prev) + ")"
					}
					else {
						return "translate(0,0)" 
					}
				})

			let variation_line = variation.append("line")
				.attr("class","line_prev")
				.attr("opacity",variation_line_opacity)
				.attr("stroke", function(d,i){
					return apply_color(d.subject)
				})
				.style("stroke-dasharray", (stroke_dash)) 
				.attr("x1", function(d,i){
					return 0
				})
				.attr("y1", function(d,i){
					return 0
				})
				.attr("x2", function(d,i){
					return 0
				})
				.attr("y2", function(d,i){
					if (d.avg_pv_prev !== "-"){
						return y(d.avg_pv)-y(d.avg_pv_prev)
					}
					else {
						return 0
					}
				})

			let variation_circle = variation.append("circle")
				.attr("cx",0)
				.attr("cy", function(d,i){
					if (d.avg_pv_prev !== "-"){
						return y(d.avg_pv)-y(d.avg_pv_prev)
					}
					else {
						return 0
					}
				})
				.attr("class","circle_prev")
				.attr("opacity",0)
				.attr("stroke", function(d,i){
					return apply_color(d.subject)
				})
				.style("stroke-dasharray", (stroke_dash)) 
				.attr("fill","transparent")
				.attr("r", function(d,i){
					return r(Math.sqrt(d.size_prev/3.14))
				})

		// articles
		let article_circles = article.append("g")
			.attr("class","article_circles")
			.attr("transform",function (d,i) {
				return "translate(" + 0 + "," + y(+d.avg_pv) + ")"
			})	
			.on("mouseover", handleMouseOver) 
			.on("mouseout", handleMouseOut)
			.append("a")
			.attr("xlink:href", function(d,i){
				return wiki_link + d.article
			})
			.attr("target","_blank")

		let circles = article_circles.append("circle")
			.transition()
			.duration(500)
			.delay(function(d,i){ 
				return i * 2
			})
			.attr("cx",0)
			.attr("cy",0)	
			.attr("fill", function(d,i){
				return apply_color(d.subject)
			})
			.attr("opacity",0.5)
			.attr("r",0)
			.transition()
			.ease(d3.easeLinear)
			.duration(500) 
			.attr("r", function(d,i){
				return r(Math.sqrt(d.size/3.14)) 
			})
			.attr("data-size", function(d,i){
				return d.size
			})

		let incipit = article_circles.append("circle")
			.transition()
			.duration(500)
			.delay(function(d,i){ 
				return i * 2
			})
			.attr("cx",0)
			.attr("cy",0)
			.attr("fill", function(d,i){
				return apply_color(d.subject)
			})
			.attr("opacity",0.5)
			.attr("r", function(d,i){
				return r(Math.sqrt(d.incipit_size/3.14))
			})
			.attr("data-incipit", function(d,i){
				return d.incipit_size
			})

		let discussion = article_circles.append("circle")
			.transition()
			.duration(500)
			.delay(function(d,i){ 
				return i * 2
			})
			.attr("cx",0)
			.attr("cy",0)
			.attr("stroke", function(d,i){
				return apply_color(d.subject)
			})
			.attr("fill","transparent")
			.attr("stroke-width",0.5)
			.attr("opacity",0.9)
			.attr("r",0)
			.transition()
			.delay(500)
			.ease(d3.easeLinear)
			.duration(500) 
			.attr("r", function(d,i){
				return r(Math.sqrt(d.discussion_size/3.14))
			})

		// improvements
		let improvements_box = article_circles.append("g")
			.attr("class","improvements")
			.attr("data-improvements", function (d,i) {
				return d.improvements
			})

		let improvements = improvements_box.append("g")
			.append("use")
			.attr("xlink:href", function(d,i){
				if (d.improvements == 1){
					return "#improv_one"
				}
				else if (d.improvements == 2){
					return "#improv_two"
				}
				else if (d.improvements == 3){
					return "#improv_three"
				}
			})
			.attr("transform",function(d,i) {
				return "translate(-5,-" + (r(Math.sqrt(d.size/3.14))) + ")"
			})
            .attr("stroke", "none")
            .attr("fill", function (d,i) {
            	if (d.improvements > 0) {
            		return improv_col
            	}
            	else {
            		return "none"
            	}
            })
            .attr("opacity",0)
			.transition()
			.delay(improv_delay)
			.attr("opacity",1)

		// let improvement_debug = improvements_box.append("circle")
		// 	.attr("cx",0)
		// 	.attr("cy",0)
		// 	.attr("r",30)
  //           .attr("fill", "none")
  //           .attr("stroke", function (d,i) {
  //           	if (d.improvements > 0) {
  //           		return improv_col
  //           	}
  //           	else {
  //           		return "none"
  //           	}
  //           })

	    function handleMouseOver(){

	    	// hide circles
			d3.selectAll(".article_circles")
				.attr("opacity",0.2)

			d3.selectAll(".variation").select(".line_prev")
				.attr("opacity",0.2)

			d3.selectAll(".variation").select(".circle_prev")
				.attr("opacity",0)

			// highlight
			d3.select(this)
				.attr("opacity",1)

			d3.select(this.previousSibling).select(".circle_prev")
				.attr("opacity",1)

			d3.select(this.previousSibling).select(".line_prev")
				.attr("opacity",1)
		}

	    function handleMouseOut(){
			d3.selectAll(".article_circles")
				.attr("opacity",1)

			d3.selectAll(".variation").select(".circle_prev")
				.attr("opacity",0)

			d3.selectAll(".variation").select(".line_prev")
				.attr("opacity",variation_line_opacity)
	    }

		$("#subjects").change(function() {
			let subject = this.value;
			new_sort =  $("#sort option:selected").val();

			update_subject(subject,new_sort);
		});

		$("#sort").change(function() {
			new_sort = parseInt(this.value);
			let subject = $("#subjects option:selected").val();

			update_sort(subject,new_sort);
		});

		function update_subject(the_subject,the_sort){
			d3.select("#articles").remove();

			d3.selectAll("circle")
				.transition()
				.duration(300)
				.attr("r",0)

			// load data
			total = 0;

			let subject_articles = [];
			let visit_sort;
			let filter_data;

			let subject_group = d3.nest()
				.key(d => d.subject)
				.entries(data)
		
			for (const [d,c] of Object.entries(subject_group)) {
				if (the_subject == "all"){

					if (c.key !== "-"){
						let values = c.values

						values.forEach(function (d,i) {
							subject_articles.push(d)
						})
					}
				}
				else {
					if (c.key == the_subject){
						subject_articles = c.values;
					}
				}
			}
			
			visit_sort = subject_articles.sort(function(x, y){
				return d3.descending(+x.avg_pv, +y.avg_pv);
			})

			filter_data = visit_sort.filter(function(x,y){ 
				return y < filter_item 
			})

			filtered_data = filter_data.sort(function(a, b){
				return d3.ascending(a.article, b.article);
			})
		
			filtered_data.forEach(function (d,i) {
				total += 1
				d.article = d.article.replace(/_/g," ")
				d.size = +d.size
				d.discussion_size = +d.discussion_size
				d.incipit_size = +d.incipit_size
				d.issues = +d.issues
				d.images = +d.images

				d.days = +d.days
				d.avg_pv = +d.avg_pv

				d.issues_prev = +d.issues_prev
				d.images_prev = +d.images_prev
				d.incipit_prev = +d.incipit_prev

				if (d.avg_pv_prev !== "-"){
					d.avg_pv_prev = +d.avg_pv_prev
				}

				// improvements
				d.improvements = 0;
				if (d.issues < d.issues_prev) {
					d.improvements += 1
				}
				if (d.images > d.images_prev) {
	        		d.improvements += 1
	        	}
	        	if (d.incipit_size > d.incipit_prev) {
	        		d.improvements += 1
	        	}

	        	if (d.improvements > 0) {
					console.log(d.article,d.improvements,d.issues,d.issues_prev,d.images,d.images_prev,d.incipit_size,d.incipit_prev);
				}
			})

			// scale
			y_max = d3.max(filtered_data, function(d) { 
				return +d.avg_pv;
			})

			y = d3.scaleLinear()
				.domain([0,y_max+(y_max/100*10)]) 
				.range([height-margin.top,0])

			if (the_sort == 1) {
				max = total	
				min = 0
			}
			else if (the_sort == 2){
				min = d3.max(filtered_data, function(d) { 
					return d.days;
				})
				max = d3.min(filtered_data, function(d) { 
					return d.days;
				})
			}
			else if (the_sort == 3){
				min = d3.min(filtered_data, function(d) { 
					return d.size;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.size;
				})
			}
			else if (the_sort == 4){
				min = d3.min(filtered_data, function(d) { 
					return d.discussion_size;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.discussion_size;
				})
			}
			else if (the_sort == 5){
				min = d3.min(filtered_data, function(d) { 
					return d.incipit_size;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.incipit_size;
				})
			}
			else if (the_sort == 6){
				min = 0;
				max = d3.max(filtered_data, function(d) { 
					return d.issues;
				})
			}
			else if (the_sort == 7){
				min = d3.min(filtered_data, function(d) { 
					return d.images;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.images;
				})
			}

			x = d3.scaleLinear()
				.domain([min,max])
				.range([0,width-100])
	       	
			function make_y_gridlines() {		
		    	return d3.axisLeft(y)
			}

			svg.select("#yAxis")
				.transition()
				.call(d3.axisLeft(y))
				.selectAll("text")
				.attr("y", -10)

			svg.select("#grid")
				.transition()
				.call(make_y_gridlines()
	          		.tickSize(-width-margin.left-margin.right-60)
	          	)

	        let yaxis_label_box = d3.selectAll(".tick:nth-child(1)").select("text")
				.attr("fill","red")

			let articles = plot.append("g")	
				.attr("id","articles")
				.attr("transform","translate(" + shiftx_article + "," + (margin.top) + ")")		

			let article = articles.selectAll("g")
				.data(filtered_data)
				.enter()
				.append("g")
				.attr("class","article")
				.attr("id", function(d,i){
					return i
				})
				.attr("data-article", function(d,i){
					return d.article
				})
				.attr("transform", function(d,i){
					if (the_sort == 1) { // "article"
						return "translate(" + (x(i)+50) + "," + 0 + ")"
					}
					else if (the_sort == 2){ // "publication"
						return "translate(" + (x(+d.days)+50) + "," + 0 + ")"
					}
					else if (the_sort == 3){ // "size"
						return "translate(" + (x(+d.size)+50) + "," + 0 + ")"
					}
					else if (the_sort == 4) { // "discussion"
						return "translate(" + (x(+d.discussion_size)+50) + "," + 0 + ")"
					}
					else if (the_sort == 5){
						return "translate(" + (x(+d.incipit_size)+50) + "," + 0 + ")"
					}
					else if (the_sort == 6){ // "issue"
						return "translate(" + (x(+d.issues)+50) + "," + 0 + ")"
					}
					else if (the_sort == 7){ // "images"
						return "translate(" + (x(+d.images)+50) + "," + 0 + ")"
					}
				})
				.on("mouseover", tooltip.show)
				.on("mouseout", tooltip.hide)

			// variation 2020-2021
			let variation = article.append("g")
				.attr("class","variation")
				.attr("transform",function (d,i) {
					if (d.avg_pv_prev !== "-"){
						return "translate(" + 0 + "," + y(d.avg_pv_prev) + ")"
					}
					else {
						return "translate(0,0)" 
					}
				})

			let variation_line = variation.append("line")
				.attr("class","line_prev")
				.attr("opacity",variation_line_opacity)
				.attr("stroke", function(d,i){
					return apply_color(d.subject)
				})
				.style("stroke-dasharray", (stroke_dash)) 
				.attr("x1", function(d,i){
					return 0
				})
				.attr("y1", function(d,i){
					return 0
				})
				.attr("x2", function(d,i){
					return 0
				})
				.attr("y2", function(d,i){
					if (d.avg_pv_prev !== "-"){
						return y(d.avg_pv)-y(d.avg_pv_prev)
					}
					else {
						return 0
					}
				})

			let variation_circle = variation.append("circle")
				.attr("cx",0)
				.attr("cy", function(d,i){
					if (d.avg_pv_prev !== "-"){
						return y(d.avg_pv)-y(d.avg_pv_prev)
					}
					else {
						return 0
					}
				})
				.attr("class","circle_prev")
				.attr("opacity",0)
				.attr("stroke", function(d,i){
					return apply_color(d.subject)
				})
				.style("stroke-dasharray", (stroke_dash)) 
				.attr("fill","transparent")
				.attr("r", function(d,i){
					return r(Math.sqrt(d.size_prev/3.14))
				})

			// articles
			let article_circles = article.append("g")
				.attr("class","article_circles")
				.attr("transform",function (d,i) {
					return "translate(" + 0 + "," + y(+d.avg_pv) + ")"
				})	
				.on("mouseover", handleMouseOver)
				.on("mouseout", handleMouseOut)
				.append("a")
				.attr("xlink:href", function(d,i){
					return "https://it.wikipedia.org/wiki/" + d.article
				})
				.attr("target","_blank")
				
			let circles = article_circles.append("circle")
				.transition()
				.duration(500)
				.delay(function(d,i){ 
					return i * 2
				})
				.attr("cx",0)
				.attr("cy",0)
				.attr("fill", function(d,i){
					return apply_color(d.subject)
				})
				.attr("opacity",0.5)
				.attr("r",0)
				.transition()
				.ease(d3.easeLinear)
				.duration(500) 
				.attr("r", function(d,i){
					return r(Math.sqrt(d.size/3.14)) 
				})
				.attr("data-size", function(d,i){
					return d.size
				})

			let incipit = article_circles.append("circle")
				.transition()
				.duration(500)
				.delay(function(d,i){ 
					return i * 2
				})
				.attr("cx",0)
				.attr("cy",0)
				.attr("fill", function(d,i){
					return apply_color(d.subject)
				})
				.attr("opacity",0.5)
				.attr("r", function(d,i){
					return r(Math.sqrt(d.incipit_size/3.14))
				})
				.attr("data-incipit", function(d,i){
					return d.incipit_size
				})

			let discussion = article_circles.append("circle")
				.transition()
				.duration(500)
				.delay(function(d,i){ 
					return i * 2
				})
				.attr("cx",0)
				.attr("cy",0)
				.attr("stroke", function(d,i){
					return apply_color(d.subject)
				})
				.attr("fill","transparent")
				.attr("stroke-width",0.5)
				.attr("opacity",0.9)
				.attr("r",0)
				.transition()
				.delay(500)
				.ease(d3.easeLinear)
				.duration(500) 
				.attr("r", function(d,i){
					return r(Math.sqrt(d.discussion_size/3.14))
				})

			// improvements
			let improvements_box = article_circles.append("g")
				.attr("class","improvements")
				.attr("data-improvements", function (d,i) {
					return d.improvements
				})

			let improvements = improvements_box.append("g")
				.append("use")
				.attr("xlink:href", function(d,i){
					if (d.improvements == 1){
						return "#improv_one"
					}
					else if (d.improvements == 2){
						return "#improv_two"
					}
					else if (d.improvements == 3){
						return "#improv_three"
					}
				})
				.attr("transform",function(d,i) {
					return "translate(-5,-" + (r(Math.sqrt(d.size/3.14))) + ")"
				})
	            .attr("stroke", "none")
	            .attr("fill", function (d,i) {
	            	if (d.improvements > 0) {
	            		return improv_col
	            	}
	            	else {
	            		return "none"
	            	}
	            })
	            .attr("opacity",0)
				.transition()
				.delay(improv_delay)
				.attr("opacity",1)

			// let improvement_debug = improvements_box.append("circle")
			// 	.attr("cx",0)
			// 	.attr("cy",0)
			// 	.attr("r",30)
	  //           .attr("fill", "none")
	  //           .attr("stroke", function (d,i) {
	  //           	if (d.improvements > 0) {
	  //           		return improv_col
	  //           	}
	  //           	else {
	  //           		return "none"
	  //           	}
	  //           })
		}

		function update_sort(the_subject,the_sort){
			// console.log(the_subject)

			//load data
			total = 0;

			let subject_articles = [];
			let visit_sort;
			let filter_data;

			let subject_group = d3.nest()
				.key(d => d.subject)
				.entries(data)
		
			for (const [d,c] of Object.entries(subject_group)) {
				if (the_subject == "all"){

					if (c.key !== "-"){
						let values = c.values

						values.forEach(function (d,i) {
							subject_articles.push(d)
						})
					}
				}
				else {
					if (c.key == the_subject){
						subject_articles = c.values;
					}
				}
			}
			
			visit_sort = subject_articles.sort(function(x, y){
				return d3.descending(+x.avg_pv, +y.avg_pv);
			})

			filter_data = visit_sort.filter(function(x,y){ 
				return y < filter_item 
			})
		
			filtered_data.forEach(function (d,i) {
				total += 1
				d.discussion_size = +d.discussion_size
				d.article = d.article.replace(/_/g," ")
				d.size = +d.size
				d.images = +d.images

				d.days = +d.days
				d.avg_pv = +d.avg_pv
				d.avg_pv_prev = +d.avg_pv_prev
				d.issues = +d.issues
				// console.log(d.article,d.issues)
			})
			
			let max;
			let min;
			let sort = [
				"article",		// 1
				"publication",	// 2
				"size",			// 3
				"discussion",	// 4
				"incipit",		// 5
				"issue",		// 6
				"images"		// 7
			]

			if (the_sort == 1) {
				max = total	
				min = 0
			}
			else if (the_sort == 2){
				max = d3.min(filtered_data, function(d) { 
					return d.days;
				})
				min = d3.max(filtered_data, function(d) { 
					return d.days;
				})
			}
			else if (the_sort == 3){
				min = d3.min(filtered_data, function(d) { 
					return d.size;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.size;
				})
			}
			else if (the_sort == 4){
				min = d3.min(filtered_data, function(d) { 
					return d.discussion_size;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.discussion_size;
				})
			}
			else if (the_sort == 5){
				min = d3.min(filtered_data, function(d) { 
					return d.incipit_size;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.incipit_size;
				})
			}
			else if (the_sort == 6){
				min = 0;
				max = d3.max(filtered_data, function(d) { 
					return d.issues;
				})
			}
			else if (the_sort == 7){
				min = d3.min(filtered_data, function(d) { 
					return d.images;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.images;
				})
			}

			x = d3.scaleLinear()
				.domain([min,max])
				.range([0,width-100])
			// console.log(min,max,the_sort)

	       	svg.selectAll(".article")
	       		.data(filtered_data)
	       		.enter()
	       		.append("div")

			svg.selectAll(".article")
				.transition()
				.attr("transform", function(d,i){
					if (the_sort == 1) { // "article"
						return "translate(" + (x(i)+50) + "," + 0 + ")"
					}
					else if (the_sort == 2){ // "publication"
						return "translate(" + (x(d.days)+50) + "," + 0 + ")"
					}
					else if (the_sort == 3){
						return "translate(" + (x(d.size)+50) + "," + 0 + ")"
					}
					else if (the_sort == 4) {
						return "translate(" + (x(d.discussion_size)+50) + "," + 0+ ")"
					}
					else if (the_sort == 5){
						return "translate(" + (x(d.incipit_size)+50) + "," + 0 + ")"
					}
					else if (the_sort == 6){
						return "translate(" + (x(d.issues)+50) + "," + 0 + ")"
					}
					else if (the_sort == 7){
						return "translate(" + (x(d.images)+50) + "," + 0 + ")"
					}
				})
		}
	}
}

function get_year(){
	$("#year").change(function() {
		let year = parseInt(this.value);
		let subject = String($("#subjects option:selected").val());
		let sort =  parseInt($("#sort option:selected").val());

		$("#d3_plot").remove();
		$("#tooltip_dv1").remove();
		$("#grid").remove();

		dv1(year,subject,sort);
	});
}

function getRandomIntInclusive(min, max) {
  	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min + 1) + min);
}

$(document).ready(function() {
	const random_subject = getRandomIntInclusive(1,17);
	document.getElementById("subjects").selectedIndex = random_subject;

	dv1(2021,subjects[random_subject],parseInt(1));
	get_year();
});

