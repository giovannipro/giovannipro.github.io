const container = "#dv1";
const font_size = 10;
const filter_item = 120; // 120
const shiftx_article = 30;
const wiki_link = "https://it.wikipedia.org/wiki/";
const variation_line_opacity = 0.7;

const stroke_dash = "3,3";

const log_exponent = 0.5; 

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

	if (lang == undefined){
		lang = 'it'
	}

	d3.tsv("assets/data/voci_" + year + ".tsv")
		.then(loaded)
		.then(() => update_dv1_lang(lang));
	// console.log(year,the_subject,sort)

	lang_vers_sort = document.getElementById("sort_article").options[7]
	if (year != 2022){
		lang_vers_sort.style.display = 'none'

		if (isNaN(sort) == true){
			$("#d3_plot").remove();
			document.getElementById("sort_article").value = 1
		}
	} 
	else {
		lang_vers_sort.style.display = 'block'
	}

	function loaded(data) {
		// console.log(data[0].article,data[0].linguistic_versions)

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

		sidebar(1,filtered_data,sort);
	
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

			d.linguistic_versions = +d.linguistic_versions

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

        	// if (d.improvements > 0) {
			// 	// console.log(d.article,d.improvements,d.issues,d.issues_prev,d.images,d.images_prev,d.incipit_size,d.incipit_prev);
			// 	// console.log(d.article)
			// 	console.log(d.article,d.avg_pv,d.avg_pv_prev, d.avg_pv - d.avg_pv_prev)
			// }
		})
		// console.log(filtered_data);

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
		else if (sort == 8){
			min = d3.min(filtered_data, function(d) { 
				return d.linguistic_versions;
			})
			max = d3.max(filtered_data, function(d) { 
				return d.linguistic_versions;
			})
		}

		// scale
		let y_max = d3.max(filtered_data, function(d) { 
			return +d.avg_pv;
		})

		let r_max = d3.max(filtered_data, function(d) { 
			return Math.sqrt(+d.size/3.14);
		})

		let r = d3.scaleLinear()
			.range([0, 20])
			.domain([0,r_max])

		let x = d3.scaleLinear()
			.domain([min,max])
			.range([0,width-100])

		// let y = d3.scalePow().exponent(log_exponent)  
		let y = d3.scaleLinear() // scaleSymlog() > it works
			.domain([0,y_max+(y_max/100*10)]) 
			.range([height-margin.top,0])
       	
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
			.attr("class","axis_name")
			.text("visite giornaliere (media)")
			.attr("data-it","visite giornaliere (media)")
			.attr("data-en","daily visits (average)")
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

				let params = new URLSearchParams(window.location.search);
				if (params.has('lang') == true) {
					lang = params.get('lang')
				}

				if (lang == 'it'){
					creation_date = "Creato il: "
					visits = "visite giornaliere"
					size = "dimensioni"
					discussion = "discussione"
					issues = "avvisi"
					images = "immagini"

					references = "riferimenti bibliog."
					notes = "note"
				}
				else {
					creation_date = "Created on: "
					visits = "daily visits"
					size = "size"
					discussion = "discussion"
					issues = "issues"
					images = "images"

					references = "references"
					notes = "notes"
				}

				let content = "<p style='margin: 0 0 8px 3px;'><span style='font-weight: bold;'>" + d.article + "</span><br/>";
                content += "<span style='font-size: 0.8em;'>" + creation_date + format_date(d.first_edit) + "</span></p><table>"

                // avg daily visits
                content += "<tr><td class='label'>" + visits + "</td><td class='value'>" + d.avg_pv.toLocaleString()
            	if (d.avg_pv_prev !== "-"){
            		content += "<td class='value " + variation_perc(d.avg_pv,d.avg_pv_prev,"visits")[0] + "'>" + variation_perc(d.avg_pv,d.avg_pv_prev,"visits")[1] + "</td></tr>"
           		}

                //size
                content += "<tr><td class='label'>" + size + "</td><td class='value'>" + d.size.toLocaleString()
        		if(year != 2020){
        			content += "<td class='value " + variation_perc(d.size,d.size_prev,"visits")[0] + "'>" + variation_perc(d.size,d.size_prev,"visits")[1] + "</td></tr>"
	            }

            	// discussion
            	content += "<tr><td class='label'>" + discussion + "</td><td class='value'>" + d.discussion_size.toLocaleString()
            	if(year != 2020){
            		content += "<td class='value " + variation_perc(d.discussion_size,d.discussion_prev,"discussion")[0] + "'>" + variation_perc(d.discussion_size,d.discussion_prev,"discussion")[1] + "</td></tr>"
            	}

            	// incipit
            	content += "<tr><td class='label'>incipit</td><td class='value'>" + d.incipit_size.toLocaleString()
            	if(year != 2020){
            		content += "<td class='value " + variation_perc(d.incipit_size,d.incipit_prev,"incipit")[0] + "'>" + variation_perc(d.incipit_size,d.incipit_prev,"incipit")[1] + "</td></tr>"
            	}

            	// issues
            	content += "<tr><td class='label'>" + issues + "</td><td class='value'>" + d.issues.toLocaleString()
            	if(year != 2020){
            		content += "<td class='value " + variation_perc(d.issues,d.issues_prev,"issues")[0] + "'>" + variation_perc(d.issues,d.issues_prev,"issues")[1] + "</td></tr>"
            	}

				// images
				content += "<tr><td class='label'>" + images + "</td><td class='value'>" + d.images.toLocaleString()
            	if(year != 2020){
            		content += "<td class='value " + variation_perc(d.images,d.images_prev,"images")[0] + "'>" + variation_perc(d.images,d.images_prev,"images")[1] + "</td></tr>"
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
			.attr("data-subject", function(d,i){
				return d.subject
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
				else if (sort == 8) {
					return "translate(" + (x(+d.linguistic_versions)+50) + ",0)";
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
			.attr("id", function(d,i){
				return 'id_' + d.id_wikidata
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

		const duration = 0
	    function handleMouseOver(){
	
			// hide circles
			d3.selectAll(".article_circles,.line_prev,.circle_prev")
				.transition()
				.duration(duration)
				.attr("opacity",0.2)

			// highlight
			d3.select(this)
				.transition()
				.duration(duration)
				.attr("opacity",1)

			d3.select(this.previousSibling).select(".circle_prev,.line_prev")
				.transition()
				.duration(duration)
				.attr("opacity",1)
		}

	    function handleMouseOut(){
			d3.selectAll(".article_circles")
				.transition()
				.duration(duration)
				.attr("opacity",1)

			d3.selectAll(".variation").select(".circle_prev")
				.transition()
				.duration(duration)
				.attr("opacity",0)

			d3.selectAll(".variation").select(".line_prev")
				.transition()
				.duration(duration)
				.attr("opacity",variation_line_opacity)
	    }

		$("#subjects").change(function() {
			let subject = this.value;
			new_sort =  $("#sort_article option:selected").val();

			update_subject(subject,new_sort);
		});

		$("#sort_article").change(function() {
			new_sort = parseInt(this.value);
			let subject = $("#subjects option:selected").val();

			update_sort(subject,new_sort);
		});

		function update_subject(the_subject,the_sort){
			// console.log(the_subject,the_sort)
			// console.log(data[0].article,data[0].linguistic_versions)
			to_linear()
			
			d3.select("#articles").remove();

			d3.selectAll("circle")
				.transition()
				.duration(300)
				.attr("r",0)

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
			
			sidebar(1,filtered_data,the_sort);

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

				d.avg_pv_prev = +d.avg_pv_prev

				d.linguistic_versions = +d.linguistic_versions

				// console.log(d.article,d.subject, d.size, d.avg_pv_prev, d.avg_pv_prev,d.avg_pv - d.avg_pv_prev)
				let diff = d.avg_pv - d.avg_pv_prev
				// console.log(d.article,d.subject, d.avg_pv_prev, d.avg_pv, diff)

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

	        	// if (d.improvements > 0) {
				// 	console.log(d.article,d.improvements,d.issues,d.issues_prev,d.images,d.images_prev,d.incipit_size,d.incipit_prev);
				// }
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
			else if (the_sort == 8){
				min = d3.min(filtered_data, function(d) { 
					return d.linguistic_versions;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.linguistic_versions;
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
					return 'id_' + d.id_wikidata
				})
				.attr("data-article", function(d,i){
					return d.article
				})
				.attr("data-subject", function(d,i){
					return d.subject
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
					else if (the_sort == 8){ 
						return "translate(" + (x(+d.linguistic_versions)+50) + "," + 0 + ")"
					}
				})
				.on("mouseover", tooltip.show)
				.on("mouseout", tooltip.hide)

			// variations
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
			// console.log(the_subject,the_sort)
			// console.log(data[0].article,data[0].linguistic_versions)

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

				d.linguistic_versions = +d.linguistic_versions
				// console.log(d.article,d.issues)
			})

			sidebar(1,filtered_data,the_sort);
			
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
			else if (the_sort == 8){
				min = d3.min(filtered_data, function(d) { 
					return d.linguistic_versions;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.linguistic_versions;
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
					else if (the_sort == 8){
						return "translate(" + (x(d.linguistic_versions)+50) + "," + 0 + ")"
					}
				})

			sidebar(1,filtered_data,the_sort);
		}

		function update_scale(scale){
			y = d3.scaleLinear()
			// let yAxisScale = ''

			if (scale == "linear"){
				y = d3.scaleLinear()
					.domain([0,y_max+(y_max/100*10)]) 
					.range([height-margin.top,0])

				// yAxisScale = d3.axisLeft(y);
			}
			else if (scale == "log"){
				// y = d3.scalePow().exponent(log_exponent)
				y = d3.scaleSymlog(10)
					.domain([0,y_max+(y_max/100*10)]) 
					.range([height-margin.top,0])

				// yAxisScale = d3.axisLeft(y);
			}


			// articles
			svg.selectAll(".article_circles")
				.transition()
				.duration(200)
				.attr("transform",function (d,i) {
					return "translate(" + 0 + "," + y(+d.avg_pv) + ")"
				})	

			// variation line and circle
			svg.selectAll(".variation")
				.transition()
				.duration(200)
				.attr("transform",function (d,i) {
					if (d.avg_pv_prev !== "-"){
						return "translate(" + 0 + "," + y(d.avg_pv_prev) + ")"
					}
					else {
						return "translate(0,0)" 
					}
				})

			svg.selectAll(".line_prev")
				.transition()
				.duration(200)
				.attr("y2", function(d,i){
					if (d.avg_pv_prev !== "-"){
						return y(d.avg_pv)-y(d.avg_pv_prev)
					}
					else {
						return 0
					}
				})

			svg.selectAll(".circle_prev")
				.transition()
				.duration(200)
				.attr("cy", function(d,i){
					if (d.avg_pv_prev !== "-"){
						return y(d.avg_pv)-y(d.avg_pv_prev)
					}
					else {
						return 0
					}
				})

			// y axis ticks text
			svg.select("#yAxis")
			    .transition()
			    .duration(200)
			    .call(d3.axisLeft(y)) // it works

			d3.select('#grid')
				.transition()
			    .duration(200)
			    .call(d3.axisLeft(y)
			    	.tickSize(-width-margin.left-margin.right-60)
			    )
			}

		function to_log(){
			update_scale("log")

			the_path = load_path() 
			scale_icon.style.background = "url(" + the_path + "assets/img/scale_linear.svg) center center / 55% no-repeat"
			scale = "log"

			tootip_linear.style.display = 'none'
			tootip_log.style.display = 'block'
		}

		function to_linear(){
			update_scale("linear")

			the_path = load_path() 
			scale_icon.style.background = "url(" + the_path + "assets/img/scale_log.svg) center center / 55% no-repeat"
			scale = "linear"

			tootip_log.style.display = 'none'
			tootip_linear.style.display = 'block'
		}

		let scale = "linear"
		const switch_scale = document.getElementById("scale_button")
		const scale_icon = document.getElementById("scale_button_icon")
		const tootip_linear = document.getElementById("scale_tooltip_linear")
		const tootip_log = document.getElementById("scale_tooltip_logarithmic")

		switch_scale.addEventListener('click', (event) => {
			if (scale == "linear"){
				to_log()
			}
			else if (scale == "log") {
				to_linear()
		    }
		})

		document.onkeydown = function (e) {
		    var key = e.key;
		    if(key == 1) { // s
				to_linear()
		    }
		    else if (key == 2){
		    	to_log()
		    }
		};
	}
}

function update_dv1_lang(lang){
	let text = document.querySelectorAll('.axis_name');

	text.forEach(function(content) {
		let it = content.dataset.it
		let en = content.dataset.en

		if (lang == 'it'){
			content.textContent = it
		}
		else if (lang == 'en') {
			content.textContent = en
		}
	});
}


function get_year(){
	$("#year").change(function() {
		let year = parseInt(this.value);
		let subject = String($("#subjects option:selected").val());
		let sort =  parseInt($("#sort_article option:selected").val());

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

	const starting_year = 2022;

	dv1(starting_year,subjects[random_subject],parseInt(1));
	get_year();
});

