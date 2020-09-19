function dv3() {
	let multiply = 1;
	let container = "#dv3",
		window_w = $(container).outerWidth() * multiply,
		window_h = window.innerHeight * (multiply * 2);

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

			let filter_issue = 1;
			let filter_visit = 222;
			let filtered_data = [];
			let tot_average_daily_visit = 0;

			data.forEach(function (d,i) {
				d.issues = +d.issues;
				d.average_daily_visit = +d.average_daily_visit;

				// if (Number.isInteger(d.average_daily_visit)) {
				// 	tot_average_daily_visit += d.average_daily_visit
				// }

				if (d.issues > filter_issue) {
					if (d.average_daily_visit > filter_issue) {
						d.references = +d.references
						d.notes = +d.notes
						d.images = +d.images
						d.days = +d.days
					}
					filtered_data.push(d)
				}
			})
			console.log(filtered_data)
			console.log(filtered_data.length)

			sortByKey(filtered_data, "issues") 

			let y = d3.scaleLinear()
				.domain([0,filtered_data.length]) 
				.range([0,height])

			let x_issues_max = d3.max(filtered_data, function(d) { 
				return d.issues
			})
			// let x_features_max = d3.max(filtered_data, function(d) { 
			// 	return d.issues
			// })
			let x_days_max = d3.max(filtered_data, function(d) { 
				return d.days
			})

			let x_issues = d3.scaleLinear()
				.domain([0,x_issues_max]) 
				.range([0,width/3])

			let x_features = d3.scaleLinear()
				.domain([0,2000]) 
				.range([0,width/3])

			let x_days = d3.scaleLinear()
				.domain([0,x_days_max]) 
				.range([0,width/3])

			let size = 5;

			let articles = plot.append("g")	
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

			let issues = articles.append("rect")
				.attr("x",0)
				.attr("y",0)
				.attr("width", function(d,i){
					return x_issues(d.issues) 
				})
				.attr("height",size)
				.attr("fill","red")
				.attr("class", function(d,i){
					return d.issues 
				})
			
			let title = articles.append("text")
				.text(function(d,i){
					return no_underscore(d.article)
				})
				.attr("transform", function(d,i){
					return "translate(" + (width/3*2) + "," + size + ")"
				})

		})
	}
	render();
}

$(document).ready(function() {
	dv3();
});