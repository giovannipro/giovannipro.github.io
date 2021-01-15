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

let window_w = $(container).outerWidth();
	window_h = $(container).outerHeight();

let margin = {top: 40, left: 60, bottom: 20, right: 60},
	width = window_w - (margin.right + margin.right),
	height = window_h - (margin.top + margin.bottom);

let svg = d3.select(container)
	.append("svg")
	.attr("width", width + (margin.right + margin.right))
	.attr("height",height + (margin.top + margin.bottom))
	.attr("id", "svg")

const issue_height = height/2.1;
const features_height = height/2.1;

// const axis_issues_ticks = 5;
// const axis_features_ticks = 5;

const ticksAmount = 10;

function dv2(the_subject) {
	d3.tsv("../assets/data/articles.tsv").then(loaded)

	function loaded(data) {
		// console.log(data)

		// load data
		let total = 0;
		let subject_articles = [];
		let filtered_data;
		// let visit_sort;

		let subject_group = d3.nest()
			.key(d => d.subject)
			.entries(data)
		// console.log(subject_group)
	
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

		let filtered_data_ = subject_articles.filter(function(x,y){ 
			return x.issues > 0
		})

		filtered_data = filtered_data_.sort(function(a, b){
			return d3.descending(a.issues, b.issues);
		})

		filter_data = filtered_data.filter(function(x,y){ 
			return y < filter_item 
		})
	
		filtered_data.forEach(function (d,i) {
			total += 1
			d.id = +d.id
			d.discussion_size = +d.discussion_size
			d.average_daily_visit = +d.average_daily_visit
			d.article = d.article.replace(/_/g," ")
			d.size = +d.size

			d.references = +d.references
			d.notes = +d.notes
			d.images = +d.images

			d.features = d.references + d.notes + d.images;
		})
		// console.log(filtered_data)

		// scale
		let issues_max = d3.max(filtered_data, function(d) { 
				return d.issues
			})
		// console.log(issues_max)

		let max_features = d3.max(filtered_data, function(d) {
				return +d.features
			})

		let my_max_features = max_features;

		let x = d3.scaleLinear()
			.domain([0,filtered_data.length]) 
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
			.attr("transform", "translate(" + (margin.left*1.5) + "," + (margin.top) + ")") // v_shift
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
			.attr("transform", "translate(" + (margin.left*1.5) + "," + (margin.top + (height/2)+(v_shift*1)) + ")") // ((height/2)+(v_shift*3))
			.call(d3.axisLeft(x_features_axis)
				.ticks(ticksAmount)
				.tickValues(d3.range(0,my_max_features,50))
			)
			.attr("id","yAxis_features")


		// plot data
		let plot = svg.append("g")
			.attr("id", "d3_plot")
			.attr("transform", "translate(" + (margin.left*1.5) + "," + margin.top + ")");

		// tooltip
		let tooltip = d3.tip()
			.attr('class', 'tooltip')
			.attr('id', 'tooltip')
			.direction(function (d,i) {
				return 'n'
			})
			.offset([-10,0])
			.html(function(d) {
	            let content = "<p style='font-weight: bold; margin: 0 0 5px 3px;'>" + d.article + "<p><table>";

	            content += "<tr><th>avvisi</th><th>" + d.issues.toLocaleString() + "</th></tr>"
	            content += "<tr><th>riferimenti bibliografici</th><th>" + d.references.toLocaleString() + "</th></tr>"
	            content += "<tr><th>note</th><th>" + d.notes.toLocaleString() + "</th></tr>"
	            content += "<tr><th>immagini</th><th>" + d.images.toLocaleString() + "</th></tr>"

	            content += "</table>"
	            return content;
	        });
       	plot.call(tooltip);

		let article = plot.append("g")	
			.attr("class","articles")
			.selectAll("g")
			.data(filtered_data)
			.enter()
			.append("g")
			.sort(function(a, b) {
	  				return d3.descending(a.issues, b.issues);
			})
			.attr("class","article")
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
		let article_width = ((width-margin.left) - (h_space*(total-1))) / total
		// console.log(total,article_width,h_space)

		let article_circle = article.append("circle")
			.attr("cx", article_width/2)
			.attr("cy", -10)
			.attr("r", 5)
			.style("fill", function(d,i) {
				return apply_color(d.subject)
			})
			.style("opacity",0.5)

		//issues
		let issues = article.append("rect")
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

		// features
		let features = article.append("g")
			.attr("transform", function(d,i){
				return "translate(" + 0 + "," + ((height/2)+v_shift) + ")"
			})
			.attr("class", function(d,i){
				return "feat_" + d.features 
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

		// sort
		let new_sort;
		$("#subjects").change(function() {
			let subject = this.value;
			new_sort =  $("#sort_article option:selected").val();

			update_subject(subject,new_sort);
		});

		$("#sort_article").change(function() {
			new_sort = parseInt(this.value);
			let subject = $("#subjects option:selected").val();

			update_sort(subject,new_sort);
			// console.log(subject,new_sort)
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
			// console.log(subject_group)
		
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
			
			// visit_sort = subject_articles.sort(function(x, y){
			// 	return d3.descending(+x.average_daily_visit, +y.average_daily_visit);
			// })

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
			// console.log(filtered_data[0].article,filtered_data[0].references)
			// console.log(filtered_data[1].article,filtered_data[2].references)

			// filtered_data = filter_data.sort(function(a, b){
			// 	return d3.descending(a.issues, b.issues);
			// })
		
			filtered_data.forEach(function (d,i) {
				total += 1
				d.id = +d.id
				d.discussion_size = +d.discussion_size
				d.average_daily_visit = +d.average_daily_visit
				d.article = d.article.replace(/_/g," ")
				d.size = +d.size

				d.references = +d.references
				d.notes = +d.notes
				d.images = +d.images

				d.features = d.references + d.notes + d.images;
			})

			// scale
			issues_max = d3.max(filtered_data, function(d) { 
					return d.issues
				})

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

			// plot data
			let article = plot.append("g")	
				.attr("class","articles")
				.selectAll("g")
				.data(filtered_data)
				.enter()
				.append("g")
				.sort(function(a, b) {
	  				return d3.descending(a.issues, b.issues);
				})
				.attr("class","article")
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
			let article_width = (width/total)-(150/total)

			let article_circle = article.append("circle")
				.attr("cx", article_width/2)
				.attr("cy", -10)
				.attr("r", 5)
				.style("fill", function(d,i) {
					return apply_color(d.subject)
				})
				.style("opacity",0.5)

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

			// features
			let features = article.append("g")
				.attr("transform", function(d,i){
					return "translate(" + 0 + "," + ((height/2)+v_shift) + ")"
				})
				.attr("class", function(d,i){
					return "feat_" + d.features 
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
				// function(d,i){
				// 	return y_features(d.references)
				// })
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
			d3.select("#grid_issues")
				.transition()
				.call(make_issue_gridlines()
					.ticks(ticksAmount)
					.tickValues(d3.range(0,issues_max,1))
	          		.tickSize(-width-margin.left-margin.right-60)
	          	)

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
			// let visit_sort;

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
				d.id = +d.id
				d.discussion_size = +d.discussion_size
				d.average_daily_visit = +d.average_daily_visit
				d.article = d.article.replace(/_/g," ")
				d.size = +d.size

				d.references = +d.references
				d.notes = +d.notes
				d.images = +d.images

				d.features = d.references + d.notes + d.images;
			})

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
	let random_subject = (Math.floor(Math.random() * 17) + 0) + 1
	if (random_subject == 12 || random_subject == 17){
		random_subject = 11
	}

	document.getElementById("subjects").selectedIndex = random_subject;

	dv2(subjects[random_subject]);
});