const container = "#dv2";
const font_size = 10;
const shiftx_article = 30;
const v_shift = 8;
const h_space = 2;
const wiki_link = "https://it.wikipedia.org/wiki/";
const filter_item = 130; 
// const article_width = 5;

let c_issues = '#EC4C4E',
	c_reference = '#49A0D8',
	c_note = '#A8D2A2',
	c_image = '#F5A3BD',
	c_days = '#9e9e9e',
	c_line = '#9E9E9E';



const stroke_dash = "2,2"

let window_w = $(container).outerWidth();
	window_h = $(container).outerHeight();

if (window_w <= 768){
	reduction = 10;
}
else {
	reduction = 0;
}

let margin = {
		top: 10, 
		left: 40-reduction, 
		bottom: 20, 
		right: 25-reduction
	},

	width = window_w - (margin.right + margin.right),
	height = window_h - (margin.top + margin.bottom);

let svg = d3.select(container)
	.append("svg")
	.attr("width", width + (margin.right + margin.right))
	.attr("height",height + (margin.top + margin.bottom))
	.attr("id", "svg")

const ticksAmount = 10;

const issue_height = height/2.4;
const features_height = height/2.4;
const circle_size = 2;

function get_year(){
	$("#year").change(function() {
		let year = parseInt(this.value);
		let subject = String($("#subjects option:selected").val());
		let sort =  parseInt($("#sort option:selected").val());

		$("#d3_plot").remove();
		$("#tooltip_dv2").remove();
		$("#axis_grid").remove();

		dv2(year,subject,sort);
	});
}

function getRandomIntInclusive(min, max) {
  	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min + 1) + min);
}

function dv2(year,the_subject,sort) {
	
	if (lang == undefined){
		lang = 'it'
	}

	d3.tsv("../assets/data/voci_" + year + ".tsv")
		.then(loaded)

	lang_vers_sort = document.getElementById("sort_article").options[5]
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

		let total = 0;
		let subject_articles = [];
		let filtered_data;

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
		// console.log(subject_articles);

		let filtered_data_ = subject_articles.filter(function(x,y){ 
			return x.issues > 0
		})

		filtered_data = filtered_data_.sort(function(a, b){
			return d3.descending(a.issues, b.issues);
		})

		filter_data = filtered_data.filter(function(x,y){ 
			return y < filter_item 
		})
		
		sidebar(2,filtered_data,sort);

		filtered_data.forEach(function (d,i) {
			// console.log(d)

			total += 1
			d.average_daily_visit = +d.average_daily_visit
			d.article = d.article.replace(/_/g," ")
			d.size = +d.size
			d.discussion_size = +d.discussion_size
			d.linguistic_versions = +d.linguistic_versions
			d.incipit_size = +d.incipit_size

			if (d.references !== "-"){
				d.references = +d.references
			}
			else {
				d.references = 0
			}

			if (d.issues !== "-"){
				d.issues = +d.issues
			}
			else {
				d.issues = 0
			}

			if (d.notes !== "-"){
				d.notes = +d.notes
			}
			else {
				d.notes = 0
			}

			if (d.images !== "-"){
				d.images = +d.images
			}
			else {
				d.images = 0
			}

			if (d.issues_prev !== "-"){
				d.issues_prev = +d.issues_prev
			}
			if (d.references_prev !== "-"){
				d.references_prev = +d.references_prev
			}
			if (d.notes_prev !== "-"){
				d.notes_prev = +d.notes_prev
			}
			if (d.images_prev !== "-"){
				d.images_prev = +d.images_prev
			}
			
			d.features = d.references + d.notes + d.images;
		})
		// console.log(filtered_data);

		// scale
		let issues_max = 10;
		// let issues_max = d3.max(filtered_data, function(d) { 
		// 		return d.issues
		// 	})

		// max_features = 370
		let max_features = d3.max(filtered_data, function(d) {
				return +d.features
			})

		// min and max size
		min_size = d3.min(filtered_data, function(d) { 
			return d.size;
		})
		max_size = d3.max(filtered_data, function(d) { 
			return d.size;
		})
		// console.log(min_size,max_size)

		let my_max_features = max_features;

		let x = d3.scaleLinear()
			.domain([0,filtered_data.length]) 
			.range([0,width-(margin.left*1)])

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

		// grid
		let grid_issues = grids.append("g")
			.attr("id","grid_issues")
			.attr("transform", "translate(-1," + margin.top + ")")
			.call(make_issue_gridlines()
				.ticks(ticksAmount)
				.tickValues(d3.range(0,issues_max,1))
          		.tickSize(-width-margin.left-margin.right-60)
			)

        let grid_features = grids.append("g")
			.attr("id","grid_features")
			.attr("transform", "translate(-1," + (margin.top + v_shift + (height/2)) + ")")
			.call(make_features_gridlines()
				.ticks(ticksAmount)
          		.tickValues(d3.range(0,my_max_features,25))
          		.tickSize(-width-margin.left-margin.right-60)
          	)

		// axis
		let axis = axis_grid.append("g")
			.attr("id","axis")

		let axis_issues = axis.append("g")
			.attr("transform", "translate(" + (margin.left*1) + "," + (margin.top + (v_shift*2.1)) + ")") // v_shift
			.call(d3.axisLeft(y_issues_text)
				.ticks(ticksAmount)
				.tickValues(d3.range(0,issues_max,1))
				.tickFormat(d3.format("d"))
			)
			.attr("id","yAxis_issues")

		let x_features_axis = d3.scaleLinear()
			.domain([my_max_features,0]) 
			.range([features_height,0])

		let axis_features = axis.append("g")
			.attr("transform", "translate(" + (margin.left*1) + "," + (margin.top + (height/2)+(v_shift*1)) + ")") // ((height/2)+(v_shift*3))
			.call(d3.axisLeft(x_features_axis)
				.ticks(ticksAmount)
				.tickValues(d3.range(0,my_max_features,50))
			)
			.attr("id","yAxis_features")

		// plot data
		let plot = svg.append("g")
			.attr("id", "d3_plot")
			.attr("transform", "translate(" + 50 /*(margin.left*2)*/ + "," + margin.top + ")");

		// tooltip
		let tooltip = d3.tip()
			.attr('class', 'tooltip')
			.attr('id', 'tooltip_dv2')
			.direction(function (d,i) {
				return 'n'
			})
			.offset(function (d,i){
				return [-20,0]
			})
			.html(function(d) {

				let params = new URLSearchParams(window.location.search);
				if (params.has('lang') == true) {
					lang = params.get('lang')
				}

				if (lang == 'it'){
					creation_date = "Creato il: "
					issues = "avvisi"
					references = "riferimenti bibliog."
					notes = "note"
					images = "immagini"
				}
				else {
					creation_date = "Created on: "
					issues = "issues"
					references = "references"
					notes = "notes"
					images = "images"
				}

				let content = "<p style='margin: 0 0 8px 3px;'><span style='font-weight: bold;'>" + d.article + "</span><br/>";
                content += "<span style='font-size: 0.8em;'>" + creation_date + format_date(d.first_edit) + "</span></p><table>"

	            // issues
                content += "<tr><td class='label'>" + issues + "</td><td class='value'>" + d.issues.toLocaleString()
                if(year != 2020){
	                content += "<td class='value " + variation_perc(d.issues,d.issues_prev,"issues")[0] + "'>" + variation_perc(d.issues,d.issues_prev,"issues")[1] + "</td></tr>"
	            }

                // references
                if(year != 2020){
                	content += "<tr><td class='label'>" + references + "</td><td class='value'>" + d.references.toLocaleString()
                }
            	
            	// notes
            	content += "<tr><td class='label'>" + notes + "</td><td class='value'>" + d.notes.toLocaleString()
            	if(year != 2020){
            		content += "<td class='value " + variation_perc(d.notes,d.notes_prev,"notes")[0] + "'>" + variation_perc(d.notes,d.notes_prev,"notes")[1] + "</td></tr>"
            	}

                // images
                content += "<tr><td class='label'>" + images + "</td><td class='value'>" + d.images.toLocaleString()
            	
            	if(year != 2020){
            		content += "<td class='value " + variation_perc(d.images,d.images_prev,"images")[0] + "'>" + variation_perc(d.images,d.images_prev,"images")[1] + "</td></tr>"
	            }

	            content += "</table>"
	            return content;
	        })
       	plot.call(tooltip);

		// article box
		let article = plot.append("g")	
			.attr("id","articles")
			.selectAll("g")
			.data(filtered_data)
			.enter()
			.append("g")
			.sort(function(a, b) {
	  			return d3.descending(a.issues, b.issues);
			})
			.attr("class","article")
			.attr("data-title", function(d,i){
				return d.article
			})
			.attr("id", function(d,i){
				return 'id_' + d.id_wikidata
			})
			.attr("transform", function(d,i){
				return "translate(" + x(i) + "," + 0 + ")"
			})
			.on("mouseover", handleMouseOver)
			.on("mouseout", handleMouseOut)
			.append("a")
			.attr("xlink:href", function(d,i){
				return wiki_link + d.article
			})
			.attr("target","_blank")
			.on("mouseover", tooltip.show) 
			.on("mouseout", tooltip.hide)

		// article circle
		let article_width = ((width-margin.left*2) - (h_space*(total-1))) / total

		let max_range = article_width/2 * circle_size

		if (article_width > 50){
			max_range = article_width / 2 * 1
		}
		// console.log(article_width,max_range)

		// if ( (article_width) > 40){
		// 	article_width = 40
		// // 	console.log(article_width)
		// // 	article_width = 40
		// // 	console.log(article_width/2 * circle_size)
		// }

		let r_size = d3.scaleLinear()
			.domain([0, max_size])
			.range([1,max_range])

		let article_circle = article.append("circle")
			.attr("class","article_c")
			.attr("cx", article_width/2)
			.attr("cy", height/2 - (height*0.04)) // -10
			.attr("r", function(d) {
				size = r_size(d.size)
				return size 
			})
			.style("fill", function(d,i) {
				return apply_color(d.subject)
			})
			.style("opacity",0.5)

		// incipit
		let article_incipit = article.append("circle")
			.attr("class","incipit_c")
			.attr("cx", article_width/2)
			.attr("cy", height/2 - (height*0.04))
			.attr("r", function(d) {
				incipit = r_size(d.incipit_size)
				// console.log(d.article, d.size, d.incipit_size)
				return incipit 
			})
			.style("fill", function(d,i) {
				return apply_color(d.subject)
			})
			.style("opacity",0.5)

		// discussion
		let article_discussion = article.append("circle")
			.attr("class","discussion_c")
			.attr("cx", article_width/2)
			.attr("cy", height/2 - (height*0.04))
			.attr("r", function(d) {
				discussion = r_size(d.discussion_size)
				return discussion 
			})
			.style("opacity",0.9)
			.attr("stroke", function(d,i){
				return apply_color(d.subject)
			})
			.attr("fill","transparent")
			.attr("stroke-width",0.5)

		//issues
		let issues = article.append("rect")
			.attr("class","issue_b")
			.attr("x",0)
			.attr("y",y_issues(issues_max))
			.attr("height",0)
			.attr("width",article_width)
			.attr("fill","red")
			.attr("class", function(d,i){
				return "iss " + d.issues 
			})
			.transition()
			.attr("height", function(d,i){
				return y_issues(d.issues) 
			})
			.attr("y",function(d,i){
				return y_issues(issues_max - d.issues)
			})

		let i_grid = [0,1,2,3,4,5,6,7,8,9]

		let issues_tick = article.selectAll("rect")
			.data(i_grid)
			.enter()
			.append("rect")
			.attr("fill","white")
			.attr("width",article_width + 2)
			.attr("height",5)
			.attr("y", (d, i) => y_issues (i) - 2)
			.attr("x", 0)

		// features
		let features = article.append("g")
			.attr("transform", function(d,i){
				return "translate(" + 0 + "," + ((height/2)+v_shift) + ")"
			})
			.attr("class", function(d,i){
				return "features"
			})
			.attr("data-features", function(d,i){
				return d.features
			})

		let images = features.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("width",article_width)
			.attr("fill",c_image)
			.attr("class", function(d,i){
				return "feat img_" + d.images 
			})
			.attr("height",0)
			.transition()
			.attr("height", function(d,i){
				return y_features(d.references + d.notes + d.images)
			})

		let notes = features.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("width",article_width)
			.attr("fill",c_note)
			.attr("class", function(d,i){
				return "feat not_" + d.notes 
			})
			.attr("height",0)
			.transition()
			.attr("height", function(d,i){
				return y_features(d.references + d.notes)
			})

		let references = features.append("rect")
			.attr("x",0)
			.attr("y",function(d,i){
				return 0
			})
			.attr("width",article_width)
			.attr("fill",c_reference)
			.attr("class", function(d,i){
				return "feat ref_" + d.references 
			})
			.attr("height", 0)
			.transition()
			.attr("height", function(d,i){
				return y_features(d.references)
			})

		// variation
		if (year != 2020){			
			let variation = article.append("g")
				.attr("class","variation")
				.attr("data-prev",function (d,i) {
					let feat_prev = (d.references_prev) + (d.notes_prev) + (d.images_prev); //  2020
					let feat_now = (d.references) + (d.notes) + (d.images); // 2021
					return feat_prev;
				})

			let issue_prev = variation.append("line")
				.attr("opacity",function(d,i){
					if (d.issues_prev !== "-"){
						return 1
					}
					else {
						return 0
					}
				})
				.attr("class","issue_prev")
				.attr("stroke", "black")
				.style("stroke-dasharray", (stroke_dash))
				.attr("x1", function(d,i){
					return 0
				})
				.attr("y1", function(d,i){
					return y_issues(issues_max - d.issues_prev)
				})
				.attr("x2", function(d,i){
					return article_width
				})
				.attr("y2", function(d,i){
					return y_issues(issues_max - d.issues_prev)
				})

			let features_prev = variation.append("line")
				.attr("opacity",1)
				.attr("class","features_prev")
				.attr("stroke", "black")
				.style("stroke-dasharray", (stroke_dash)) 
				.attr("transform", function(d,i){
					return "translate(" + 0 + "," + ((height/2)+v_shift) + ")"
				}) 
				.attr("x1", function(d,i){
					return 0
				})
				.attr("y1", function(d,i){
					// console.log(+d.references_prev, +d.notes_prev, +d.images_prev)
					return y_features((+d.references_prev) + (+d.notes_prev) + (+d.images_prev))
				})
				.attr("x2", function(d,i){
					return article_width
				})
				.attr("y2", function(d,i){
					return y_features((+d.references_prev) + (+d.notes_prev) + (+d.images_prev))
				})
		}

   		// mouse hover
		function handleMouseOver(){
			d3.selectAll(".article")
				.attr("opacity",0.2)

			d3.select(this)
				.attr("opacity",1)
		}

	    function handleMouseOut(){
			d3.selectAll(".article")
				.attr("opacity",1)
	    }

		$("#subjects").change(function() {
			let subject = this.value;
			new_sort = parseInt($("#sort_article option:selected").val());

			update_subject(subject,new_sort);
		});

		// sort
		let new_sort;
		$("#sort_article").change(function() {
			new_sort = parseInt(this.value);
			let subject = $("#subjects option:selected").val();

			update_sort(subject,new_sort);
		});

		function update_subject(the_subject,the_sort){
			// console.log(the_subject,the_sort);

			d3.select("#articles").remove();

			d3.selectAll(".feat")
				.transition()
				.duration(500)
				.attr("height",0)

			d3.selectAll(".iss")
				.transition()
				.duration(500)
				.attr("y",issue_height)
				.attr("height",0)

			d3.selectAll("circle")
				.transition()
				.duration(500)
				.attr("r",0)

			// load data
			let total = 0;
			let subject_articles = [];
			let visit_sort;
			let filtered_data_;
			let filtered_data;

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
			// console.log(subject_articles);

			filtered_data_ = subject_articles.filter(function(x,y){ 
				return x.issues > 0
			})

			filtered_data = filtered_data_.sort(function(a, b){
				return d3.descending(+a.issues, +b.issues);
			})

			filtered_data = filtered_data_.filter(function(x,y){ 
				return y < filter_item 
			})

			if (the_sort == 1){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.descending(+a.issues, +b.issues);
				})
			}
			else if (the_sort == 2){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.ascending(a.article, b.article);
				})
			}
			else if (the_sort == 3){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.descending(+a.references, +b.references);
				})
			}
			else if (the_sort == 4){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.descending(+a.notes, +b.notes);
				})
			}
			else if (the_sort == 5){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.descending(+a.images, +b.images);
				})
			}
			else if (the_sort == 6){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.descending(+a.linguistic_versions, +b.linguistic_versions);
				})
			}
			else if (the_sort == 7){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.descending(+a.size, +b.size);
				})
			}

			filtered_data.forEach(function (d,i) {
				total += 1
				d.average_daily_visit = +d.average_daily_visit
				d.article = d.article.replace(/_/g," ")
				d.size = +d.size
				d.discussion_size = +d.discussion_size

				if (d.references !== "-"){
					d.references = +d.references
				}
				else {
					d.references = 0
				}

				if (d.issues !== "-"){
					d.issues = +d.issues
				}
				else {
					d.issues = 0
				}

				if (d.notes !== "-"){
					d.notes = +d.notes
				}
				else {
					d.notes = 0
				}

				if (d.images !== "-"){
					d.images = +d.images
				}
				else {
					d.images = 0
				}

				if (d.issues_prev !== "-"){
					d.issues_prev = +d.issues_prev
				}
				if (d.references_prev !== "-"){
					d.references_prev = +d.references_prev
				}
				if (d.notes_prev !== "-"){
					d.notes_prev = +d.notes_prev
				}
				if (d.images_prev !== "-"){
					d.images_prev = +d.images_prev
				}
				
				d.features = d.references + d.notes + d.images;
				// console.log(d.article,d.features,d.references,d.notes,d.images)
			})
			// console.log(filtered_data);

			sidebar(2,filtered_data,the_sort);

			max_features = d3.max(filtered_data, function(d) {
				return +d.features
			})

			my_max_features = max_features;

			x.domain([0,filtered_data.length]) 

			y_issues = d3.scaleLinear()
				.domain([0,issues_max]) 
				.range([0,issue_height])

			y_issues_text = d3.scaleLinear()
				.domain([issues_max,0]) 
				.range([0,issue_height])

			y_features = d3.scaleLinear()
				.domain([0,my_max_features]) 
				.range([0,height/2])

			x_features_axis = d3.scaleLinear()
				.domain([my_max_features,0]) 
				.range([features_height,0])

			// min and max size
			min_size = d3.min(filtered_data, function(d) { 
				return d.size;
			})
			max_size = d3.max(filtered_data, function(d) { 
				return d.size;
			})

			// plot data
			let article = plot.append("g")	
				.attr("id","articles")
				.selectAll("g")
				.data(filtered_data)
				.enter()
				.append("g")
				.attr("class","article")
				.attr("data-title", function(d,i){
					return d.article
				})
				.attr("id", function(d,i){
					return 'id_' + d.id_wikidata
				})
				.attr("transform", function(d,i){
					return "translate(" + x(i) + "," + 0 + ")"
				})
				.on("mouseover", handleMouseOver)
				.on("mouseout", handleMouseOut)
				.append("a")
				.attr("xlink:href", function(d,i){
					return wiki_link + d.article
				})
				.attr("target","_blank")
				.on("mouseover", tooltip.show) 
				.on("mouseout", tooltip.hide)

			// article circle
			let article_width = ((width-margin.left*2) - (h_space*(total-1))) / total
			// console.log(article_width)

			let max_range = article_width/2 * circle_size

			if (article_width > 50){
				max_range = article_width / 2 * 1
			}
			// console.log(article_width,max_range)

			let r_size = d3.scaleLinear()
				.domain([0, max_size])
				.range([1,max_range])

			let article_circle = article.append("circle")
				.attr("cx", article_width/2)
				// .attr("cy", height/2 - 30) // -10
				.attr("cy", height/2 - (height*0.04))
				.attr("r", function(d) {
					size = r_size(d.size)
					return size 
				})
				.style("fill", function(d,i) {
					return apply_color(d.subject)
				})
				.style("opacity",0.5)
				.attr("class","circle_article")

			// incipit
			let article_incipit = article.append("circle")
				.attr("cx", article_width/2)
				// .attr("cy", height/2 - (height*0.04))
				.attr("cy", height/2 - (height*0.04)) // -10
				.attr("r", function(d) {
					incipit = r_size(d.incipit_size)
					// console.log(d.article, +d.size, d.incipit_size)

					return incipit 
				})
				.style("fill", function(d,i) {
					return apply_color(d.subject)
				})
				.style("opacity",0.5)
				.attr("class","circle_article")

			// discussion
			let article_discussion = article.append("circle")
				.attr("class","discussion_c")
				.attr("cx", article_width/2)
				.attr("cy", height/2 - (height*0.04))
				.attr("r", function(d) {
					discussion = r_size(d.discussion_size)
					return discussion 
				})
				.style("opacity",0.9)
				.attr("stroke", function(d,i){
					return apply_color(d.subject)
				})
				.attr("fill","transparent")
				.attr("stroke-width",0.5)

			//issues
			let issues = article.append("rect")
				.attr("x",0)
				.attr("y",function(d,i){
					return y_issues(issues_max - d.issues)
				})
				.attr("height", function(d,i){
					return y_issues(d.issues) 
				})
				.attr("width",article_width)
				.attr("fill","red")
				.attr("class", function(d,i){
					return "iss" // + d.issues 
				})

			let issues_tick = article.selectAll("rect")
				.data(i_grid)
				.enter()
				.append("rect")
				.attr("fill","white")
				.attr("width",article_width + 2)
				.attr("height",5)
				.attr("y", (d, i) => y_issues (i) - 2)
				.attr("x", 0)

			// features
			let features = article.append("g")
				.attr("transform", function(d,i){
					return "translate(" + 0 + "," + ((height/2)+v_shift) + ")"
				})
				.attr("class", function(d,i){
					return "features"
				})
				.attr("data-features", function(d,i){
					return d.features 
				})

			let images = features.append("rect")
				.attr("x",0)
				.attr("y",0)
				.attr("width",article_width)
				.attr("fill",c_image)
				.attr("class", function(d,i){
					return "feat img_" + d.images 
				})
				.attr("height",0)
				.transition()
				.attr("height", function(d,i){
					return y_features(d.references + d.notes + d.images)
				})

			let notes = features.append("rect")
				.attr("x",0)
				.attr("y",0)
				.attr("width",article_width)
				.attr("fill",c_note)
				.attr("class", function(d,i){
					return "feat not_" + d.notes 
				})
				.attr("height",0)
				.transition()
				.attr("height", function(d,i){
					return y_features(d.references + d.notes)
				})

			let references = features.append("rect")
				.attr("x",0)
				.attr("y",function(d,i){
					return 0
				})
				.attr("width",article_width)
				.attr("fill",c_reference)
				.attr("class", function(d,i){
					return "feat ref_" + d.references 
				})
				.attr("height", 0)
				.transition()
				.attr("height", function(d,i){
					return y_features(d.references)
				})

			// variation
			if (year != 2020){			
				let variation = article.append("g")
					.attr("class","variation")
					.attr("data-variation",function (d,i) {
						let feat_prev = (d.references_prev) + (d.notes_prev) + (d.images_prev); // 2020
						let feat_now = (d.references) + (d.notes) + (d.images); // 2021

						return feat_prev
					})

				let issue_prev = variation.append("line")
					.attr("opacity",function(d,i){
						if (d.issues_prev !== "-"){
							return 1
						}
						else {
							return 0
						}
					})
					.attr("class","issue_prev")
					.attr("stroke", "black")
					.style("stroke-dasharray", (stroke_dash))
					.attr("x1", function(d,i){
						return 0
					})
					.attr("y1", function(d,i){
						return y_issues(issues_max - d.issues_prev)
					})
					.attr("x2", function(d,i){
						return article_width
					})
					.attr("y2", function(d,i){
						return y_issues(issues_max - d.issues_prev)
					})

				let features_prev = variation.append("line")
					.attr("opacity",1)
					.attr("class","features_prev")
					.attr("stroke", "black")
					.style("stroke-dasharray", (stroke_dash)) 
					.attr("transform", function(d,i){
						return "translate(" + 0 + "," + ((height/2)+v_shift) + ")"
					}) 
					.attr("x1", function(d,i){
						return 0
					})
					.attr("y1", function(d,i){
						return y_features((+d.references_prev) + (+d.notes_prev) + (+d.images_prev))
					})
					.attr("x2", function(d,i){
						return article_width
					})
					.attr("y2", function(d,i){
						return y_features((+d.references_prev) + (+d.notes_prev) + (+d.images_prev))
					})
			}

			// update axis
			d3.select("#yAxis_issues")
				.transition()
				.call(d3.axisLeft(y_issues_text)
					.ticks(ticksAmount)
					.tickFormat(d3.format("d"))
					.tickValues(d3.range(0,issues_max,1))
				)
				.selectAll("text")
				.attr("y", 0)

			d3.select("#yAxis_features")
				.transition()
				.call(d3.axisLeft(x_features_axis)
					.ticks(ticksAmount)
					.tickValues(d3.range(0,my_max_features,50))
				)
				.selectAll("text")
				.attr("y", 0)

			// update grids
			// d3.select("#grid_issues")
			// 	.transition()
			// 	.call(make_issue_gridlines()
			// 		.ticks(ticksAmount)
			// 		.tickValues(d3.range(0,issues_max,1))
	        //   		.tickSize(-width-margin.left-margin.right-60)
	        //   	)

	        d3.select("#grid_features")
		        .transition()
				.call(make_features_gridlines()
					.ticks(ticksAmount)
          			.tickSize(-width-margin.left-margin.right-60)
          			.tickValues(d3.range(0,my_max_features,25))
	          	)
		}

		function update_sort(the_subject,the_sort){
			// console.log(the_subject,the_sort);

			// load data
			let total = 0;
			let subject_articles = [];
			let filtered_data;

			let subject_group = d3.nest()
				.key(d => d.subject)
				.entries(data)
		
			for (const [d,c] of Object.entries(subject_group)) {
				let values = c.values

				if (the_subject == "all"){

					if (c.key !== "-"){

						values.forEach(function (d,i) {
							subject_articles.push(d)
						})
					}
				}
				else {
					if (c.key == the_subject){
						subject_articles = values;
					}
				}
			}
		
			filtered_data_ = subject_articles.filter(function(x,y){ 
				return x.issues > 0
			})

			filtered_data = filtered_data_.sort(function(a, b){
				return d3.descending(+a.issues, +b.issues);
			})

			filtered_data = filtered_data_.filter(function(x,y){ 
				return y < filter_item 
			})

			filtered_data.forEach(function (d,i) {
				total += 1
				d.average_daily_visit = +d.average_daily_visit
				d.article = d.article.replace(/_/g," ")
				d.size = +d.size
				d.discussion_size = +d.discussion_size

				if (d.references !== "-"){
					d.references = +d.references
				}
				else {
					d.references = 0
				}

				if (d.issues !== "-"){
					d.issues = +d.issues
				}
				else {
					d.issues = 0
				}

				if (d.notes !== "-"){
					d.notes = +d.notes
				}
				else {
					d.notes = 0
				}

				if (d.images !== "-"){
					d.images = +d.images
				}
				else {
					d.images = 0
				}

				if (d.issues_prev !== "-"){
					d.issues_prev = +d.issues_prev
				}
				if (d.references_prev !== "-"){
					d.references_prev = +d.references_prev
				}
				if (d.notes_prev !== "-"){
					d.notes_prev = +d.notes_prev
				}
				if (d.images_prev !== "-"){
					d.images_prev = +d.images_prev
				}
				
				d.features = d.references + d.notes + d.images;
				// console.log(d.article,d.features,d.references,d.notes,d.images);
			})
			// console.log(filtered_data);

			// sort
			if (new_sort == 1){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.descending(+a.issues, +b.issues);
				})
			}
			else if (new_sort == 2){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.ascending(a.article, b.article);
				})
			}
			else if (new_sort == 3){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.descending(+a.references, +b.references);
				})
			}
			else if (new_sort == 4){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.descending(+a.notes, +b.notes);
				})
			}
			else if (new_sort == 5){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.descending(+a.images, +b.images);
				})
			}
			else if (new_sort == 6){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.descending(+a.linguistic_versions, +b.linguistic_versions);
				})
			}
			else if (the_sort == 7){
				filtered_data = filtered_data.sort(function(a, b){
					return d3.descending(+a.size, +b.size);
				})
			}

			sidebar(2,filtered_data,the_sort);

			filtered_data.forEach(function(d,i){
				new_id = i;
				d.new_id = new_id;
			})

			x.domain([0,filtered_data.length]) 

			svg.selectAll(".article")
				.transition()
				.attr("transform", function(d,i){
					return "translate(" + x(d.new_id) + "," + 0 + ")"
					// console.log(new_id, d.article)
				})
		}
	}
}

$(document).ready(function() {
	const random_subject = getRandomIntInclusive(1,17);
	document.getElementById("subjects").selectedIndex = random_subject;
	
	const starting_year = 2022;

	dv2(starting_year,subjects[random_subject],parseInt(1));
	get_year();
})