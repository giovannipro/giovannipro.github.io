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
const filter_item = 120; // 130;
const shiftx_article = 30;
const wiki_link = "https://it.wikipedia.org/wiki/";

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

function dv1(year,the_subject) {
	d3.tsv("assets/data/voci_" + year + ".tsv").then(loaded)
	console.log(year,the_subject)

	function loaded(data) {

		// load data
		let total = 0;
		let subject_articles = [];
		let visit_sort;
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
		console.log(subject_group)
		
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
			d.discussion_size = +d.discussion_size
			d.avg_pv = +d.avg_pv
			d.article = d.article.replace(/_/g," ")
			d.size = +d.size
			d.images = +d.images
		})
		console.log(filtered_data);
		
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

		let x = d3.scaleLinear()
			.domain([0,total])
			.range([0,width-100])

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

		let yAxis = plot.append("g")
			.attr("id","yAxis")
			.attr("transform", "translate(" + 10 + "," + (margin.top) +")")
			.call(d3.axisLeft(y))
			.selectAll("text")
			.attr("y", -10)

		// let yaxis_label_box = d3.selectAll(".tick:nth-child(1)").select("text")
		// 	.attr("fill","red")

		let yaxis_label_box = plot.append("g")
			.attr("class","yaxis_label")
			.attr("transform","translate(7," + height + ")")

		let yaxis_label = yaxis_label_box.append("text")
			.text("visite giornaliere (media)")
			.attr("y",-6)
			.attr("font-size",font_size)

		let the_sort;
		let tooltip = d3.tip()
			.attr('class', 'tooltip')
			.attr('id', 'tooltip_dv1')
			.direction(function (d,i) {
				return 'n'
			})
			.offset([-10,0])
			.html(function(d) {
                let content = "<p style='font-weight: bold; margin: 0 0 10px 3px;'>" + d.article + "</p><table>";

                content += "<tr><td class='label'>pubblicazione</td><td class='value'>" + format_date(d.first_edit) + "</td></tr>"

                content += "<tr><td class='label'>visite giornaliere</td><td class='value'>" + d.avg_pv.toLocaleString()
                
                if (year == 2021){
                	content += "<br/>" + d.avg_pv_prev.toLocaleString()
                }
                content += "</td></tr>"

                content += "<tr><td class='label'>dimensione (in byte)</td><td class='value'>" + d.size.toLocaleString() + "</td></tr>"
                content += "<tr><td class='label'>discussione (in byte)</td><td class='value'>" + d.discussion_size.toLocaleString() + "</td></tr>"
                content += "<tr><td class='label'>incipit (in byte)</td><td class='value'>" + d.incipit_size.toLocaleString() + "</td></tr>"
                content += "<tr><td class='label'>avvisi</td><td class='value'>" + d.issues.toLocaleString() + "</td></tr>"
                content += "<tr><td class='label'>immagini</td><td class='value'>" + d.images.toLocaleString() + "</td></tr>"


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
			.attr("transform", function(d,i){
				return "translate(" + (x(i)+50) + "," + y(+d.avg_pv) + ")"
			})
			.on("mouseover", tooltip.show) 
			.on("mouseout", tooltip.hide)

		let article_circles = article.append("g")
			.attr("class","article_circles")
			.on("mouseover", handleMouseOver) 
			.on("mouseout", handleMouseOut)
			.append("a")
			.attr("xlink:href", function(d,i){
				return wiki_link + d.article
			})
			.attr("target","_blank")
			
		let article_text = article.append("g")
			.attr("class","article_text")
			.attr("data-title", function(d,i){
				return d.title
			})
			
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

		// let label = article_text.append("text")
		// 	.text(function(d,i){
		// 		return d.article // + " " + (+d.discussion_size)
		// 	}) 
		// 	.attr("x",0)
		// 	.attr("y",-height-50)
		// 	.attr("text-anchor","middle")
		// 	.attr("fill","black")
		// 	.attr("font-size",font_size)
		// 	.attr("class","text")
		// 	.attr("opacity",0)
		// 	.attr("data-radius",function(d,i){
		// 		return r(Math.sqrt(d.size/3.14))
		// 	})

	    function handleMouseOver(){
			d3.selectAll(".article_circles")
				.attr("opacity",0.2)

			d3.select(this)
				.attr("opacity",1)
		}

	    function handleMouseOut(){
			d3.selectAll(".article_circles")
				.attr("opacity",1)
	    }

		$("#subjects").change(function() {
			let subject = this.value;
			new_sort =  $("#sort option:selected").val();
			// new_sort =  $("#sort option:selected").val();

			update_subject(subject,new_sort);
			// console.log(subject,new_sort);
		});

		$("#sort").change(function() {
			new_sort = parseInt(this.value);
			let subject = $("#subjects option:selected").val();

			update_sort(subject,new_sort);
		});

		function update_subject(the_subject,the_sort){
			// console.log(the_subject)

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
			// console.log(subject_articles)
			
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
				d.id = +d.id
				d.discussion_size = +d.discussion_size
				d.avg_pv = +d.avg_pv
				d.article = d.article.replace(/_/g," ")
				d.size = +d.size
			})
			// console.log(filtered_data)

			// scale
			y_max = d3.max(filtered_data, function(d) { 
				return +d.avg_pv;
			})
			// console.log(y_max);

			y = d3.scaleLinear()
				.domain([0,y_max+(y_max/100*10)]) 
				.range([height-margin.top,0])

			if (the_sort == 1) {
				max = total	
				min = 0
			}
			else if (the_sort == 2){
				max = d3.max(filtered_data, function(d) { 
					return +d.days;
				})
				min = d3.min(filtered_data, function(d) { 
					return +d.days;
				})
			}
			else if (the_sort == 3){
				max = d3.max(filtered_data, function(d) { 
					return +d.size;
				})
				min = 0
				// min = d3.min(filtered_data, function(d) { 
				// 	return +d.size;
				// })
			}
			else if (the_sort == 4){
				max = d3.max(filtered_data, function(d) { 
					return +d.discussion_size;
				})
				min = 0
				// min = d3.min(filtered_data, function(d) { 
				// 	return +d.discussion_size;
				// })
			}
			else if (the_sort == 5){
				max = d3.max(filtered_data, function(d) { 
					return +d.incipit_size;
				})
				min = 0
				// min = d3.min(filtered_data, function(d) { 
				// 	return +d.incipit_size;
				// })
			}
			else if (the_sort == 6){
				max = d3.max(filtered_data, function(d) { 
					return +d.issues;
				})
				min = 0
				// min = d3.min(filtered_data, function(d) { 
				// 	return +d.size;
				// })
			}
			else if (the_sort == 7){
				max = d3.max(filtered_data, function(d) { 
					return +d.images;
				})
				min = 0
				// min = d3.min(filtered_data, function(d) { 
				// 	return +d.size;
				// })
			}
			// console.log(min,max)

			x = d3.scaleLinear()
				.domain([min,max])
				.range([0,width-100]) // margin.right-margin.left-20]) 
	       	
	       	if (the_sort == 2){ 
	       		x = d3.scaleLinear()
					.domain([max,min])
					.range([0,width-100])
	       	}

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
				.attr("transform", function(d,i){
					if (the_sort == 1) { // "article"
							return "translate(" + (x(i)+50) + "," + y(+d.avg_pv) + ")"
						}
						else if (the_sort == 2){ // "publication"
							return "translate(" + (x(+d.days)+50) + "," + y(+d.avg_pv) + ")"
						}
						else if (the_sort == 3){ // "size"
							return "translate(" + (x(+d.size)+50) + "," + y(+d.avg_pv) + ")"
						}
						else if (the_sort == 4) { // "discussion"
							return "translate(" + (x(+d.discussion_size)+50) + "," + y(+d.avg_pv) + ")"
						}
						else if (the_sort == 5){
							return "translate(" + (x(+d.incipit_size)+50) + "," + y(+d.avg_pv) + ")"
						}
						else if (the_sort == 6){ // "issue"
							return "translate(" + (x(+d.issues)+50) + "," + y(+d.avg_pv) + ")"
						}
						else if (the_sort == 7){ // "images"
							return "translate(" + (x(+d.images)+50) + "," + y(+d.avg_pv) + ")"
						}
					// return "translate(" + (x(i)+50) + "," + y(+d.avg_pv) + ")"
				})
				.on("mouseover", tooltip.show)
				.on("mouseout", tooltip.hide)

			let article_circles = article.append("g")
				.attr("class","article_circles")
				.on("mouseover", handleMouseOver)
				.on("mouseout", handleMouseOut)
				.append("a")
				.attr("xlink:href", function(d,i){
					return "https://it.wikipedia.org/wiki/" + d.article
				})
				.attr("target","_blank")
				
			let article_text = article.append("g")
				.attr("class","article_text")

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
			// console.log(subject_articles)
			
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
				d.id = +d.id
				d.discussion_size = +d.discussion_size
				d.avg_pv = +d.avg_pv
				d.article = d.article.replace(/_/g," ")
				d.size = +d.size
			})
			// console.log(filtered_data)
			
			let max = 0;
			let min = 0;
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
				max = d3.max(filtered_data, function(d) { 
					return +d.days;
				})
				min = d3.min(filtered_data, function(d) { 
					return +d.days;
				})
			}
			else if (the_sort == 3){
				max = d3.max(filtered_data, function(d) { 
					return +d.size;
				})
				min = 0
				// min = d3.min(filtered_data, function(d) { 
				// 	return +d.size;
				// })
			}
			else if (the_sort == 4){
				max = d3.max(filtered_data, function(d) { 
					return +d.discussion_size;
				})
				min = 0
				// min = d3.min(filtered_data, function(d) { 
				// 	return +d.discussion_size;
				// })
			}
			else if (the_sort == 5){
				max = d3.max(filtered_data, function(d) { 
					return +d.incipit_size;
				})
				min = 0
				// min = d3.min(filtered_data, function(d) { 
				// 	return +d.incipit_size;
				// })
			}
			else if (the_sort == 6){
				max = d3.max(filtered_data, function(d) { 
					return +d.issues;
				})
				min = 0
				// min = d3.min(filtered_data, function(d) { 
				// 	return +d.size;
				// })
			}
			else if (the_sort == 7){
				max = d3.max(filtered_data, function(d) { 
					return +d.images;
				})
				min = 0
				// min = d3.min(filtered_data, function(d) { 
				// 	return +d.size;
				// })
			}
			// console.log(min,max)

			x = d3.scaleLinear()
				.domain([min,max])
				.range([0,width-100]) // margin.right-margin.left-20]) 
	       	
	       	if (the_sort == 2){ 
	       		x = d3.scaleLinear()
					.domain([max,min])
					.range([0,width-100])
	       	}

	       	svg.selectAll(".article")
	       		.data(filtered_data)
	       		.enter()
	       		.append("div")

			svg.selectAll(".article")
				.transition()
				.attr("transform", function(d,i){
					if (the_sort == 1) { // "article"
						return "translate(" + (x(i)+50) + "," + y(+d.avg_pv) + ")"
					}
					else if (the_sort == 2){ // "publication"
						return "translate(" + (x(+d.days)+50) + "," + y(+d.avg_pv) + ")"
					}
					else if (the_sort == 3){
						return "translate(" + (x(+d.size)+50) + "," + y(+d.avg_pv) + ")"
					}
					else if (the_sort == 4) {
						return "translate(" + (x(+d.discussion_size)+50) + "," + y(+d.avg_pv) + ")"
					}
					else if (the_sort == 5){
						return "translate(" + (x(+d.incipit_size)+50) + "," + y(+d.avg_pv) + ")"
					}
					else if (the_sort == 6){
						return "translate(" + (x(+d.issues)+50) + "," + y(+d.avg_pv) + ")"
					}
					else if (the_sort == 7){
						return "translate(" + (x(+d.images)+50) + "," + y(+d.avg_pv) + ")"
					}
				})
		}
	}
}

function get_year(){
	$("#year").change(function() {
		let year = parseInt(this.value);
		let subject = String($("#subjects option:selected").val());

		$("#d3_plot").remove();
		$("#grid").remove();

		dv1(year,subject);
	});
}

function getRandomIntInclusive(min, max) {
  	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min + 1) + min);
}

$(document).ready(function() {
	const random_subject = getRandomIntInclusive(1,17); //(Math.floor(Math.random() * 18) + 0) + 1
	document.getElementById("subjects").selectedIndex = random_subject;
	// console.log(document.getElementById("subjects")[17]);

	dv1(2020,subjects[random_subject]);
	get_year();
});

