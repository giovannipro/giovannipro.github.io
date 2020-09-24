function dv1() {
	let container = "#dv1",
		window_w = $(container).outerWidth() * 1.5, // 4000; //
		window_h = window.innerHeight * 1 //2000;

	let margin = {top: 20, right: 0, bottom: 20, right: 20},
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

			let tab = "&#09;";
			let br = ""
			let head = "article,subject,average_daily_visit,incipit_size,size" + "<br/>"; 
			let dataset = [];
			dataset.push(head)

			let filter = 1001; // 2000;
			let total = 0;
			let filtered_data = [];
			let subjects = [];
			let art = []
			let duplicates = [];
			data.forEach(function (d) {
				if (d.average_daily_visit > filter){
					d.average_daily_visit = +d.average_daily_visit
					d.incipit_size = +d.incipit_size
					d.incipit_on_size = +d.incipit_on_size
					d.size = +d.size
					d.year = +d.year
					d.subject = d.subject
					d.discussion_size = +d.discussion_size

					// if (d.discussion_size == "NaN") {
					// console.log(d.average_daily_visit + " " + d.article)
					// }

					total += 1
					filtered_data.push(d)

					if (subjects.includes(d.subject)) {}
					else {subjects.push(d.subject)}

					// duplicates
					if (art.includes(d.article)) {
						duplicates.push(d.article)
					}
					else {
						art.push(d.article)
					}

					let output = no_underscore(d.article) + "," + d.subject + "," + d.average_daily_visit + "," + d.incipit_size + "," + d.size + "<br/>"; 
					dataset.push(output)
				}
			})

			// let test_a = {article:'A_9000',subject:'Biologia', average_daily_visit:9000, incipit_size:50000, size:25000, year:2, discussion_size:100000};
			// let test_b = {article:'A_0',subject:'Biologia', average_daily_visit:0, incipit_size:70000, size:35000, year:0, discussion_size:100000};
			// filtered_data.push(test_a);
			// filtered_data.push(test_b);

	    	sortByKey(filtered_data, "article") 

			console.log("article: " + total)
			console.log(subjects)

			if (duplicates === undefined || duplicates.length > 0) {
    			console.log(duplicates + " duplicates")
			}
			else {
				console.log("no duplicates")
			}

			function the_dataset(){
				$("#dv1_dataset").append(dataset)
			}
			function legend(){
				const legend = "<img src='../assets/img/dv1_legend.svg' width='" + 800 + "'>"; // <span>Articoli con più di 1000 visite medie al giorno</span>
				$("#dv1_legend").append(legend)
			}
			the_dataset();
			legend();

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
				.domain([0,total])
				.range([0, width/1.05])

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
					return r(Math.sqrt(d.size/3.14)) 
				})
				.attr("fill", function(d,i){
					return apply_color(d.subject)
					// return color(d.subject)
				})
				.attr("opacity",0.5)

			let incipit = articles.append("circle")
				.attr("cx",0)
				
				.attr("r", function(d,i){
					return r(Math.sqrt(d.incipit_size/3.14))
				})
				.attr("fill", function(d,i){
					return apply_color(d.subject)
					// return color(d.subject)
				})
				.attr("opacity",0.5)

			let discussion = articles.append("circle")
				.attr("cx",0)
				.attr("cy",0)
				.attr("r", function(d,i){
					return r(Math.sqrt(d.discussion_size/3.14))
				})
				.attr("stroke", function(d,i){
					return apply_color(d.subject)
					// return color(d.subject)
				})
				.attr("fill","transparent")
				.attr("stroke-width",0.5)
				.attr("opacity",0.9)

			let label = articles.append("text")
				.text(function(d,i){
					return no_underscore(d.article) // + " " + d.year //+ " " + d.average_daily_visit
				})
				.attr("x",0)
				.attr("y",-5)
				.attr("text-anchor","middle")
				.attr("fill","black")
				.attr("font-size","0.6em")

			let yAxis = plot.append("g")
				.attr("transform", "translate(0,0)")
				.call(d3.axisLeft(y));
		})
	}
	render();
}

$(document).ready(function() {
	dv1();
});