function dv3() {
	let multiply = 1;
	let container = "#dv3",
		window_w = $(container).outerWidth() * multiply,
		window_h = window.innerHeight * (multiply * 1.8);

	let margin = {top: 20, right: 20, bottom: 20, right: 20},
		width = window_w - (margin.right + margin.right),
		height = window_h - (margin.top + margin.bottom);

	function render(){
		$(container).empty();

		let svg = d3.select(container)
			.append("svg")
			.attr("id", "svg")
			.attr("width", width + (margin.right + margin.right))
			.attr("height",height + (margin.top + margin.bottom))

		let plot = svg.append("g")
			.attr("id", "d3_plot")
			.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

		d3.tsv("../assets/data/articles.tsv", function (error, data) {
			if (error) throw error;

			let filter_issue = 0;
			let max_visit = 8000;
			let filter_visit = 350;
			let filtered_data = [];
			let tot_average_daily_visit = 0;
			let features_ = 0

			let head = "article,issues,average_daily_visit,references,notes,images,days" + "<br/>"; 
			let dataset = [];

			data.forEach(function (d,i) {
				d.issues = +d.issues;
				d.average_daily_visit = +d.average_daily_visit;

				// if (Number.isInteger(d.average_daily_visit)) {
				// 	tot_average_daily_visit += d.average_daily_visit
				// }

				if (d.issues > filter_issue) {
					if (d.average_daily_visit >= filter_visit) {
						d.references = +d.references
						d.notes = +d.notes
						d.images = +d.images
						d.days = +d.days
						// d.size = +d.size
						// d.discussion_size = +d.discussion_size
						d.features = d.references + d.notes + d.images;
						
						if (d.first_edit == "???") {
							console.log(d.article)
						}
						filtered_data.push(d)

						let output = d.article + "," + d.issues + "," + d.average_daily_visit + "," + d.references + "," + d.notes + "," + d.days + "<br/>"; 
						dataset.push(output)
					}
				}
			})
			// console.log(filtered_data)
			console.log("min visit: " + filter_visit)
			console.log(filtered_data.length)

			sortByKey(filtered_data, "issues") 

			$("#dv3_dataset").append(dataset)

			let max_features = d3.max(filtered_data, function(d) {
				return +d.features
			})
			// console.log(max_features)

			let y = d3.scaleLinear()
				.domain([0,filtered_data.length]) 
				.range([0,height])

			let x_issues_max = d3.max(filtered_data, function(d) { 
				return d.issues
			})

			let r_max = d3.max(filtered_data, function(d) { 
				return Math.sqrt(d.size/3.14)
			})

			let x_days_max = d3.max(filtered_data, function(d) { 
				return d.days
			})

			let x_issues = d3.scaleLinear()
				.domain([0,x_issues_max]) 
				.range([0,width/12*2])

			let x_features = d3.scaleLinear()
				.domain([0,max_features]) 
				.range([0,width/12*5])

			let x_days = d3.scaleLinear()
				.domain([0,x_days_max]) 
				.range([0,width/12*2])

			let r = d3.scaleLinear()
				.range([0, 30])
				.domain([0,r_max])

			// parameters
			let size = 5;
			let separator = 10;

			let article = plot.append("g")	
				.attr("class","articles")
				// .attr("transform","translate(0,200)")
				.selectAll("g")
				.data(filtered_data)
				.enter()
				.append("g")
				.attr("class", function(d,i){
					return i + " " + d.article
				})
				.attr("transform", function(d,i){
					return "translate(" + 0 + "," + y(i) + ")"
				})

			// days
			let days = article.append("rect")
				.attr("x",0)
				.attr("y",0)
				.attr("width", function(d,i){
					return x_days(d.days) 
				})
				.attr("height",size)
				.attr("fill","gray")
				.attr("class", function(d,i){
					return d.days 
				})

			// size
			// let article_size = article.append("circle")
			// 	.attr("cx",0)
			// 	.attr("cy",0)
			// 	.attr("r", function(d,i){
			// 		return r(Math.sqrt(d.size/3.14)) 
			// 	})
			// 	.attr("fill","gray")
			// 	.attr("class", function(d,i){
			// 		return d.size 
			// 	})
			// 	.attr("opacity",0.5)

			// let discussion_size = article.append("circle")
			// 	.attr("cx",0)
			// 	.attr("cy",0)
			// 	.attr("r", function(d,i){
			// 		return r(Math.sqrt(d.discussion_size/3.14)) 
			// 	})
			// 	.attr("stroke","red")
			// 	.attr("fill","transparent")
			// 	.attr("class", function(d,i){
			// 		return d.discussion_size 
			// 	})
			// 	.attr("stroke-width",0.5)
			// 	.attr("opacity",0.9)

			// features
			let feat = article.append("g")
				.attr("transform", function(d,i){
					return "translate(" + (separator + (width/12*2)) + "," + 0 + ")"
				})
				.attr("class", function(d,i){
					return "feat_" + d.features 
				})

			let references = feat.append("rect")
				.attr("x",function(d,i){
					// return d.references / max_features
					return x_features(max_features - d.references)
				})
				.attr("y",0)
				.attr("width", function(d,i){
					return x_features(d.references) //x_features(d.references) 
				})
				.attr("height",size)
				.attr("fill","blue")
				.attr("class", function(d,i){
					return "ref_" + d.references 
				})

			let notes = feat.append("rect")
				.attr("x",function(d,i){
					return x_features(max_features - d.references - d.notes)
				})
				.attr("y",0)
				.attr("width", function(d,i){
					return x_features(d.notes) 
				})
				.attr("height",size)
				.attr("fill","green")
				.attr("class", function(d,i){
					return "not_" + d.notes 
				})

			let images = feat.append("rect")
				.attr("x",function(d,i){
					return x_features(max_features - d.references - d.notes - d.images)
				})
				.attr("y",0)
				.attr("width", function(d,i){
					return x_features(d.images) 
				})
				.attr("height",size)
				.attr("fill","orange")
				.attr("class", function(d,i){
					return "img_" + d.images 
				})
			
			//issues
			let issues = article.append("rect")
				.attr("x", (separator*2) + (width/12*7))
				.attr("y",0)
				.attr("width", function(d,i){
					return x_issues(d.issues) 
				})
				.attr("height",size)
				.attr("fill","red")
				.attr("class", function(d,i){
					return "iss_" + d.issues 
				})

			// title
			let title = article.append("text")
				.text(function(d,i){
					return no_underscore(d.article)
				})
				.attr("transform", function(d,i){
					return "translate(" + ((separator*3) + (width/12*9)) + "," + size + ")"
				})

			// grid
			var grid = plot.append('g')
				.attr('class','grid')
				.attr('transform','translate(0,' + '0' + ')' )  

			for (var i=0; i<filtered_data.length; i++) { 
				if( i % 5 == 0){
		       		grid.append('line')
						.attr('x1', 0)
						.attr('y1', y(i) - 3) // ((height - margin.top - margin.bottom) / (filtered_data.length) ))
						.attr('x2', width - margin.top - margin.bottom)
						.attr('y2', y(i)- 3 ) //i * ((height - margin.top - margin.bottom) / (filtered_data.length) )) 
						.attr('stroke',"gray")
						.attr('stroke-width',1)
		    	}
			}

			// issue_separator
			// var issue_separator = plot.append('g')

			// for (var i=0; i<5; i++) { 
			// 	issue_separator. append('line')
			// 		.attr('x1', (separator*3) + (width/12*7) )
			// 		.attr('y1', y(i))
			// 		.attr('x2', (separator*3) + (width/12*7))
			// 		.attr('y2', height)
			// 		.attr('stroke',"violet")
			// 		.attr('stroke-width',2)
			// }


		})
	}
	render();
}

$(document).ready(function() {
	dv3();
});