function dv1() {
	let container = "#dv1",
		window_w = 1500; //$(container).outerWidth(),
		window_h = 1500;

	let margin = {top: 5, right: 0, bottom: 30, right: 0},
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
			// console.log(data)

			let tab = "&#09;";
			let br = ""
			let head = "article" + "," + "average_daily_visit" + "," + "year" + "," + "size" + "<br/>"; 
			let dataset = [];
			dataset.push(head)

			let filter = 1000; // 2000;
			let total = 0;
			let filtered_data = [];
			data.forEach(function (d) {
				if (d.average_daily_visit > filter){
					d.average_daily_visit = +d.average_daily_visit
					d.year = +d.year
					d.size = +d.size

					total += 1
					filtered_data.push(d)

					let output = d.article + "," + d.average_daily_visit + "," + d.year + "," + d.size + "<br/>"; 
					dataset.push(output)
				}
			})

			filtered_data.sort(function(a, b) { 
				return compareStrings(a.article, b.article);
			})
			console.log(filtered_data)

			$("#dv1_dataset").append(dataset)

			// scale
			let y_min = d3.min(filtered_data, function(d) { 
				return d.average_daily_visit
			})
			let y_max = d3.max(filtered_data, function(d) { 
				return d.average_daily_visit
			})
			let r_max = d3.max(filtered_data, function(d) { 
				return d.size
			})

			let y = d3.scaleLinear()
				.range([height-300,0])
				.domain([y_min,y_max])

			let x = d3.scaleLinear()
				.range([0,width])
				.domain([0,total])

			let r = d3.scaleLinear()
				.range([0, 20])
				.domain([0,r_max])

			let articles = plot.append("g")	
				.attr("class","articles")
				.attr("transform","translate(0,200)")
				.selectAll("g")
				.data(filtered_data)
				.enter()
				.append("g")
				.attr("class", function(d,i){
					return i + " " + d.article
				})
				.attr("transform", function(d,i){
					return "translate(" + x(i) + "," + y(d.average_daily_visit) + ")"
				})

			let article = articles.append("circle")
				.attr("cx",0)
				.attr("cy",0)
				.attr("r", function(d,i){
					return r(d.size)
				})
				.attr("fill","blue")
				.attr("opacity",0.5)

			let label = articles.append("text")
				.text(function(d,i){
					return d.article + " " + d.average_daily_visit
				})
				.attr("x",0)
				.attr("y",-10)
				.attr("text-anchor","middle")
				.attr("fill","red")
				.attr("font-size","0.7em")
		})
	}
	render();
}

$(document).ready(function() {
	dv1();
});