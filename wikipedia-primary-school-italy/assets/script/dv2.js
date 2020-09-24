function dv2() {
	let multiply = 1;
	let container = "#dv2",
		window_w = $(container).outerWidth() * (multiply*2),
		window_h = window.innerHeight * multiply;

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
			// console.log(data)

			let tab = "&#09;";
			let br = ""
			let head = "article,subject,average_daily_visit,incipit_size,size" + "<br/>"; 
			let dataset = [];
			dataset.push(head)

			let filter = 10;
			let total = 0;
			let filtered_data = [];
			let subjects = [];
			let art = []
			let duplicates = [];

			let grouped_data = groupByKey(data, "subject");
			// console.log(grouped_data)

			// grouped_data.forEach(function (i,d) {
			for (const [d,c] of Object.entries(grouped_data)) {
				// console.log(value)

				c.forEach(function (d) {
					d.average_daily_visit = +d.average_daily_visit
					d.incipit_size = +d.incipit_size
					d.incipit_on_size = +d.incipit_on_size
					d.size = +d.size
					d.year = +d.year
					d.subject = d.subject
					d.discussion_size = +d.discussion_size
					d.issues = +d.issues
					// d.discussion_on_size = (d.size/d.discussion_size).toFixed(1)
				})

				c.sort(function(a, b) {
				    return b.average_daily_visit - a.average_daily_visit;
				});
			}
			// console.log(grouped_data)
			
			for (const [d,c] of Object.entries(grouped_data)) {
				c.forEach(function (d,i) {
					if (i <= filter){
						filtered_data.push(d)
						total += 1

						// duplicates
						if (art.includes(no_underscore(d.article))) {
							duplicates.push(no_underscore(d.article))
						}
						else {
							art.push(no_underscore(d.article))
						}

						// if (d.discussion_size == 0 || d.discussion_size == NaN) {
						// 	// console.log("size: " + d.discussion_size + " " + no_underscore(d.article))
						// }

						// if (d.issues > 0) {
						// 	console.log(d.issues + " " + no_underscore(d.article))
						// }

						let output = no_underscore(d.article) + "," + d.subject + "," + d.average_daily_visit + "," + d.incipit_size + "," + d.size + "<br/>"; 
						dataset.push(output)
					}
				})
			}
			console.log("articles: " + total);

			function the_dataset(){
				$("#dv2_dataset").append(dataset)
			}
			function legend(){
				const legend = "<img src='../assets/img/dv2_legend.svg' width='" + 250 + "'>"; // <span>Articoli con più di 1000 visite medie al giorno</span>
				$("#dv2_legend").append(legend)
			}
			the_dataset();
			legend();

			filtered_data.sort(function (a, b) { 
	            var af = a.subject; 
	            var bf = b.subject; 
	            var as = a.article; 
	            var bs = b.article; 
	              
	            if(af == bf) { 
	                return (as < bs) ? -1 : (as > bs) ? 1 : 0; 
	            } else { 
	                return (af < bf) ? -1 : 1; 
	            } 
	        }); 

			// let test_a = {article:'A_9000',subject:'Biologia', average_daily_visit:9000, incipit_size:50000, size:25000, year:2, discussion_size:100000};
			// let test_b = {article:'B_0',subject:'Biologia', average_daily_visit:0, incipit_size:70000, size:35000, year:0, discussion_size:100000};
			// filtered_data.push(test_a);
			// filtered_data.push(test_b);

			if (duplicates === undefined || duplicates.length > 0) {
				duplicates.forEach(function (d,i) {
    				console.log(d)
				})
			}
			else {
				console.log("no duplicates")
			}

			$("#dv1_dataset").append(dataset)

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
					return color(d.subject)
				})
				.attr("opacity",0.5)

			let incipit = articles.append("circle")
				.attr("cx",0)
				.attr("cy",0)
				.attr("r", function(d,i){
					return r(Math.sqrt(d.incipit_size/3.14))
				})
				.attr("fill", function(d,i){
					return color(d.subject)
				})
				.attr("opacity",0.5)

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

			// let issues = articles.append("g")
			// 	// .style("transform","rotate(-45deg)")
			// 	.append("rect")
			// 	.attr("x",0)
			// 	.attr("y",0)
			// 	.attr("height",3)
			// 	.attr("width", function(d,i){
			// 		return d.issues*20
			// 	})
			// 	.attr("fill", function(d,i){
			// 		return color(d.subject)
			// 	})
			// 	.attr("opacity",0.9)

			let label = articles.append("text")
				.text(function(d,i){
					return no_underscore(d.article) // + " " + d.year //+ " " + d.discussion_size // + " " + d.year //+ " " + d.average_daily_visit
				})
				.attr("x",0)
				.attr("y",-5)
				.attr("text-anchor","middle")
				.attr("fill","black")
				.attr("font-size","0.6em")

			let yAxis = plot.append("g")
				.attr("transform", "translate(0,0)")
				.call(d3.axisLeft(y));

			let the_subjects = [
				"Biologia", 
				"Chimica", 
				"Cittadinanza e costituzione",
				"Diritto e Economia", 
				"Filosofia", 
				"Fisica", 
				"Geografia", 
				"Grammatica italiana",
				"Grammatica latina",
				"Informatica",
				"Letteratura italiana", 
				"Letteratura latina",
				"Matematica",
				"Scienze",
				"Scienze della Terra", 
				"Storia",
				"Storia dell'arte", 
				"Tecnologia"
			]
			console.log("subjects: " + the_subjects.length);

			let subjects_ = plot.append("g")	
				.attr("class", "subjects")
				.selectAll("text")
				.data(the_subjects)
				.enter()
				.append("text")
				.text(function(d,i){
					return d
				})
				.attr("transform", function(d,i){
					return "translate(" + ((width/1.05)/the_subjects.length*i) + "," + (height+10) + ")"
				})

		})
	}
	render();
}

$(document).ready(function() {
	dv2();
});