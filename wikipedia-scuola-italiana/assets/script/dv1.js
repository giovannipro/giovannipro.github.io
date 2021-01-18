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

let multiply = 1;
let window_w = $(container).outerWidth();
	window_h = $(container).outerHeight();

let margin = {top: 20, left: 0, bottom: 20, right: 60},
	width = window_w - (margin.right + margin.right),
	height = window_h - (margin.top + margin.bottom);

let svg = d3.select(container)
	.append("svg")
	.attr("width", width + (margin.right + margin.right))
	.attr("height",height + (margin.top + margin.bottom))
	.attr("id", "svg")

function dv1(the_subject) {
	d3.tsv("assets/data/articoli.tsv").then(loaded)
	// console.log(the_subject)

	function loaded(data) {

		// load data
		let total = 0;
		let subject_articles = [];
		let visit_sort;
		let filter_data;

		let subject_group = d3.nest()
			.key(d => d.subject)
			.entries(data)
		// console.log(subject_group)
	
		// for (const [d,c] of Object.entries(subject_group)) {
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
			return d3.descending(+x.average_daily_visit, +y.average_daily_visit);
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
			d.average_daily_visit = +d.average_daily_visit
			d.article = d.article.replace(/_/g," ")
			d.size = +d.size
		})
		// console.log(filtered_data
		
		// scale
		let y_max = d3.max(filtered_data, function(d) { 
			return +d.average_daily_visit;
		})
		// console.log(y_max)

		let r_max = d3.max(filtered_data, function(d) { 
			return Math.sqrt(+d.size/3.14);
		})

		let y = d3.scaleLinear()
			.domain([0,y_max+(y_max/100*10)]) 
			.range([height-margin.top,0])

		let x = d3.scaleLinear()
			.domain([0,total])
			.range([0,width-100]) //width-margin.right-margin.left]) 
		// console.log(0,total)

		let r = d3.scaleLinear()
			.range([0, 20])
			.domain([0,r_max])

		// axis and grid
		let grid = svg.append("g")
			.attr("id","grid")
			.attr("transform", "translate(-1," + margin.top*2 + ")")
			.call(make_y_gridlines()
          		.tickSize(-width-margin.left-margin.right-60)
          		// .tickFormat("")
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
			.attr('id', 'tooltip')
			.direction(function (d,i) {
				return 'n'
			})
			.offset([-10,0])
			.html(function(d) {
                let content = "<p style='font-weight: bold; margin: 0 0 5px 3px;'>" + d.article + "<p><table>";

                content += "<tr><th>pubblicazione</th><th>" + format_date(d.first_edit) + "</th></tr>"
                content += "<tr><th>dimensione</th><th>" + d.size.toLocaleString() + " byte</th></tr>"
                content += "<tr><th>discussione</th><th>" + d.discussion_size.toLocaleString() + " byte</th></tr>"
                content += "<tr><th>visite giornaliere</th><th>" + d.average_daily_visit.toLocaleString() + "</th></tr>"
                content += "<tr><th>incipit</th><th>" + d.incipit_size.toLocaleString() + " byte</th></tr>"
                content += "<tr><th>avvisi</th><th>" + d.issues.toLocaleString() + "</th></tr>"
                content += "<tr><th>immagini</th><th>" + d.images.toLocaleString() + "</th></tr>"


	            content += "</table>"
                return content;
            });
       	plot.call(tooltip);
		// console.log(the_sort);

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
				return "translate(" + (x(i)+50) + "," + y(+d.average_daily_visit) + ")"
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

	    // get new subject
	 //    let new_sort = 1;
	 //    let new_subject = the_subject;

	 //    const sort_options = document.querySelectorAll("#sort .dropdown li")
	 //    $("#subjects").change(function() {
	 //    	let subject = this.value;
		//     update_subject(subject,new_sort);
		//     console.log(subject,new_sort);
	 //    })

		// for (const sort_option of sort_options) {
		// 	sort_option.addEventListener('click', function(event) {
		// 		let new_sort = event.target.className;
		// 		update_sort(new_subject,new_sort);
		// 	})
		// }

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

		// $(window).resize(function() {
		// 	let subject = $("#subjects :selected").text()
		// 	console.log(subject);

		// 	let window_w = $(container).outerWidth();
		// 		window_h = $(container).outerHeight();

		// 	let width = window_w - (margin.right + margin.right),
		// 		height = window_h - (margin.top + margin.bottom);
			
		// 	d3.select("#svg")
		// 		.transition()
		// 		.attr("width", width + (margin.right + margin.right))
		// 		.attr("height",height + (margin.top + margin.bottom))

		// 	update(subject);
		// });

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
				return d3.descending(+x.average_daily_visit, +y.average_daily_visit);
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
				d.average_daily_visit = +d.average_daily_visit
				d.article = d.article.replace(/_/g," ")
				d.size = +d.size
			})
			// console.log(filtered_data)

			// scale
			y_max = d3.max(filtered_data, function(d) { 
				return +d.average_daily_visit;
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
							return "translate(" + (x(i)+50) + "," + y(+d.average_daily_visit) + ")"
						}
						else if (the_sort == 2){ // "publication"
							return "translate(" + (x(+d.days)+50) + "," + y(+d.average_daily_visit) + ")"
						}
						else if (the_sort == 3){ // "size"
							return "translate(" + (x(+d.size)+50) + "," + y(+d.average_daily_visit) + ")"
						}
						else if (the_sort == 4) { // "discussion"
							return "translate(" + (x(+d.discussion_size)+50) + "," + y(+d.average_daily_visit) + ")"
						}
						else if (the_sort == 5){
							return "translate(" + (x(+d.incipit_size)+50) + "," + y(+d.average_daily_visit) + ")"
						}
						else if (the_sort == 6){ // "issue"
							return "translate(" + (x(+d.issues)+50) + "," + y(+d.average_daily_visit) + ")"
						}
						else if (the_sort == 7){ // "images"
							return "translate(" + (x(+d.images)+50) + "," + y(+d.average_daily_visit) + ")"
						}
					// return "translate(" + (x(i)+50) + "," + y(+d.average_daily_visit) + ")"
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
				return d3.descending(+x.average_daily_visit, +y.average_daily_visit);
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
				d.average_daily_visit = +d.average_daily_visit
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
						return "translate(" + (x(i)+50) + "," + y(+d.average_daily_visit) + ")"
					}
					else if (the_sort == 2){ // "publication"
						return "translate(" + (x(+d.days)+50) + "," + y(+d.average_daily_visit) + ")"
					}
					else if (the_sort == 3){
						return "translate(" + (x(+d.size)+50) + "," + y(+d.average_daily_visit) + ")"
					}
					else if (the_sort == 4) {
						return "translate(" + (x(+d.discussion_size)+50) + "," + y(+d.average_daily_visit) + ")"
					}
					else if (the_sort == 5){
						return "translate(" + (x(+d.incipit_size)+50) + "," + y(+d.average_daily_visit) + ")"
					}
					else if (the_sort == 6){
						return "translate(" + (x(+d.issues)+50) + "," + y(+d.average_daily_visit) + ")"
					}
					else if (the_sort == 7){
						return "translate(" + (x(+d.images)+50) + "," + y(+d.average_daily_visit) + ")"
					}
				})
		}
	}
}


$(document).ready(function() {
	const random_subject = (Math.floor(Math.random() * 18) + 0) + 1
	document.getElementById("subjects").selectedIndex = random_subject;

	dv1(subjects[random_subject]);
	// dv1("all")
});

