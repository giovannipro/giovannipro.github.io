function dv1() {
	let multiply = 1;
	let container = "#dv1",
		window_w = $(container).outerWidth();
		window_h = $(container).outerHeight(); //  window.innerHeight * (multiply*1.5);

	let margin = {top: 20, right: 20, bottom: 20, right: 20},
		width = window_w - (margin.right + margin.right),
		height = window_h - (margin.top + margin.bottom);

	function render(the_subject){
		$(container).empty();

		const svg = d3.select(container)
			.append("svg")
			.attr("width", width + (margin.right + margin.right))
			.attr("height",height + (margin.top + margin.bottom))
			.attr("id", "svg")

		const plot = svg.append("g")
			.attr("id", "d3_plot")
			.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

		d3.tsv("../assets/data/articles.tsv").then(function(data) {
			// console.log(data);

			const tab = "&#09;";
			const br = ""
			const head = "article,subject,average_daily_visit,incipit_size,size" + "<br/>"; 
			let dataset = [];
			dataset.push(head);

			// const filter = 10;
			const font_size = 12;

			let filter_item = 30;
			// let filtered_data = [];
			let subjects = [];
			let art = []
			let duplicates = [];

			let subject_group = d3.nest()
				.key(d => d.subject)
				.sortKeys(function(a, b){ return a.average_daily_visit - b.average_daily_visit; })
				.entries(data)
			console.log(subject_group)
			
			let filtered_data = []
			for (const [d,c] of Object.entries(subject_group)) {
				if (c.key == the_subject){ // "Letteratura italiana"
					filtered_data = c.values;
				}
			}
			
			filtered_data.forEach(function (d,i) {
				d.id = +d.id
    			d.discussion_size = +d.discussion_size
    			d.average_daily_visit = +d.average_daily_visit
			})

			let a = filtered_data.sort(function(x, y){
				return d3.descending(+x.average_daily_visit, +y.average_daily_visit);
			})

			let b = a.filter(function(x,y){ 
				return y < filter_item 
			})

			filtered_data = b.sort(function(a, b){
				return d3.ascending(a.article, b.article);
			})

			// scale
			let y_min = d3.min(filtered_data, function(d) { 
				return d.average_daily_visit
			})
			let y_max = d3.max(filtered_data, function(d) { 
				return d.average_daily_visit
			})

			let r_max = d3.max(filtered_data, function(d) { 
				return Math.sqrt(d.size/3.14)
			})

			let color = d3.scaleOrdinal(d3.schemeCategory10);

			let y = d3.scaleLinear()
				.domain([0,y_max]) 
				.range([height,0])

			let x = d3.scaleLinear()
				.domain([0,filter_item])
				.range([0,width/1.05]) 

			let r = d3.scaleLinear()
				.range([0, 20])
				.domain([0,r_max])

			let articles = plot.append("g")	
				.attr("class","articles")
				.attr("transform","translate(0,0)")
				.selectAll("g")
				.data(filtered_data)
				.enter()
				.append("g")
				.attr("class","article")
				.attr("id", function(d,i){
					return i
				})
				.attr("transform", function(d,i){
					return "translate(" + x(i) + "," + y(d.average_daily_visit) + ")"
				})

			let article = articles.append("circle")
				.attr("cx",0)
				.attr("cy",0)
				.attr("fill", function(d,i){
					return color(d.subject)
				})
				.attr("opacity",0.5)
				.attr("r",0)
				.transition()
				.ease(d3.easeLinear)
				.duration(500) 
				.attr("r", function(d,i){
					return r(Math.sqrt(d.size/3.14)) 
				})

			let incipit = articles.append("circle")
				.attr("cx",0)
				.attr("cy",0)
				.attr("fill", function(d,i){
					return color(d.subject)
				})
				.attr("opacity",0.5)
				.attr("r", function(d,i){
					return r(Math.sqrt(d.incipit_size/3.14))
				})

			let discussion = articles.append("circle")
				.attr("cx",0)
				.attr("cy",0)
				.attr("r", function(d,i){
					return r(Math.sqrt(d.discussion_size/3.14))
				})
				.attr("stroke", function(d,i){
					return color(d.subject)
				})
				.attr("fill","transparent")
				.attr("stroke-width",0.5)
				.attr("opacity",0.9)
	
			let label = articles.append("a")
				.attr("xlink:href", function(d,i){
					return "https://it.wikipedia.org/wiki/" + d.article
				})
				.append("text")
				.text(function(d,i){
					return d.article // cropText(no_underscore()) // + " " + d.year //+ " " + d.discussion_size // + " " + d.year //+ " " + d.average_daily_visit
				})
				.attr("x",0)
				.attr("y",-5)
				.attr("text-anchor","middle")
				.attr("fill","black")
				.attr("font-size",font_size)
				.attr("class","text")
				.attr("opacity",0)
				.on("mouseover", handleMouseOver)
				.on("mouseout", handleMouseOut)

			function handleMouseOver(d, i) { 
				d3.select(this)
					.attr("opacity",1)
			}

			function handleMouseOut(d, i) { 
				d3.select(this)
					.attr("opacity",0)
			}

			let yAxis = plot.append("g")
				.attr("transform", "translate(0,0)")
				.call(d3.axisLeft(y));
		})
	}
	render("Biologia");

	$( "#subjects" ).change(function() {
		let subject = this.value
		console.log(subject)
		render(subject);
	});

}

$(document).ready(function() {
	dv1();
});