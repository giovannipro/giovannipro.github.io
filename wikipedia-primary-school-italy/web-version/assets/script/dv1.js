function apply_color(item){
	let color = "blue";
	return color;
}

const subjects = [
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
	"Scienze della Terra",
	"Scienze",
	"Storia",
	"Tecnologia"
]

const container = "#dv1";
const font_size = 12;
const filter_item = 100;
const shiftx_article = 30;

let multiply = 1;
let window_w = $(container).outerWidth();
	window_h = $(container).outerHeight(); //  window.innerHeight * (multiply*1.5);

let margin = {top: 20, left: 40, bottom: 20, right: 40},
	width = window_w - (margin.right + margin.right),
	height = window_h - (margin.top + margin.bottom);

let svg = d3.select(container)
	.append("svg")
	.attr("width", width + (margin.right + margin.right))
	.attr("height",height + (margin.top + margin.bottom))
	.attr("id", "svg")

function dv1(the_subject) {
	d3.tsv("../assets/data/articles.tsv").then(loaded)

	function loaded(data) {

		// load data
		let total = 0;

		let subject_articles;
		let visit_sort;
		let filter_data;

		let subject_group = d3.nest()
			.key(d => d.subject)
			.entries(data)
	
		for (const [d,c] of Object.entries(subject_group)) {
			if (c.key == the_subject){
				subject_articles = c.values;
			}
		}
		
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
		})
		
		// scale
		let y_max = d3.max(filtered_data, function(d) { 
			return d.average_daily_visit;
		})

		let r_max = d3.max(filtered_data, function(d) { 
			return Math.sqrt(d.size/3.14);
		})

		let y = d3.scaleLinear()
			.domain([0,y_max+(y_max/100*10)]) 
			.range([height-margin.top,0])

		let x = d3.scaleLinear()
			.domain([0,total])
			.range([0,width-margin.right-margin.left-20]) 

		let r = d3.scaleLinear()
			.range([0, 20])
			.domain([0,r_max])


		// axis and grid
		let grid = svg.append("g")
			.attr("id","grid")
			.attr("transform", "translate(-1," + margin.top*2 + ")")
			.call(make_y_gridlines()
          		.tickSize(-width-margin.left-margin.right)
          		.tickFormat("")
          	)

		let plot = svg.append("g")
			.attr("id", "d3_plot")
			.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

		function make_y_gridlines() {		
		    return d3.axisLeft(y)
		}

		let yAxis = plot.append("g")
			.attr("id","yAxis")
			.attr("transform", "translate(" + (margin.left) + "," + (margin.top) +")")
			.call(d3.axisLeft(y))
			.selectAll("text")
			.attr("y", -10)

		let yaxis_label = plot.append("g")
			.attr("transform","translate(40," + (height) + ")")
			.append("text")
			.text("pagine viste")
			.attr("y",-6)

		// plot data
		let articles = plot.append("g")	
			.attr("id","articles")
			.attr("transform","translate(" + shiftx_article + ",0)")	

		let article = articles.selectAll("g")
			.data(filtered_data)
			.enter()
			.append("g")
			.attr("class","article")
			.attr("id", function(d,i){
				return i
			})
			.attr("transform", function(d,i){
				return "translate(" + (x(i)+50) + "," + y(d.average_daily_visit) + ")"
			})

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

		let label = article_text.append("text")
			.text(function(d,i){
				return d.article 
			})
			.attr("x",0)
			.attr("y",-height)
			.attr("text-anchor","middle")
			.attr("fill","black")
			.attr("font-size",font_size)
			.attr("class","text")
			.attr("opacity",0)

		function handleMouseOver(d, i) { 
			d3.selectAll(".article")
				.attr("opacity",0.2)

			d3.select(this.parentNode)
				.attr("opacity",1)

			d3.select(this.parentNode).select("text")
				.attr("opacity",1)
				.attr("y",-20)
		}

		function handleMouseOut(d, i) { 
			d3.selectAll(".article")
				.attr("opacity",1)

			d3.select(this.parentNode).select("text")
				.attr("opacity",0)
				.attr("y",-height)	
		}

		$( "#subjects" ).change(function() {
			let subject = this.value;
			update(subject);
		});

		function update(the_subject){
			// console.log(the_subject)

			d3.select("#articles").remove();

			d3.selectAll("circle")
				.transition()
				.duration(300)
				.attr("r",0)

			// load data
			let total = 0;

			let subject_articles;
			let visit_sort;
			let filter_data;

			let subject_group = d3.nest()
				.key(d => d.subject)
				.entries(data)
		
			for (const [d,c] of Object.entries(subject_group)) {
				if (c.key == the_subject){
					subject_articles = c.values;
				}
			}
			
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
			})

			// scale
			let y_max = d3.max(filtered_data, function(d) { 
				return d.average_daily_visit;
			})

			let x = d3.scaleLinear()
				.domain([0,total])
				.range([0,width-margin.right-margin.left-20]) 

			let y = d3.scaleLinear()
				.domain([0,y_max+(y_max/100*10)]) 
				.range([height-margin.top,0])

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
	          		.tickSize(-width-margin.left-margin.right)
	          		.tickFormat("")
	          	)

			// plot data
			// let plot = svg.append("g")
			// 	.attr("id", "d3_plot")
			// 	.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

			let articles = plot.append("g")	
				.attr("id","articles")
				.attr("transform","translate(" + shiftx_article + ",0)")	

			let article = articles.selectAll("g")
				.data(filtered_data)
				.enter()
				.append("g")
				.attr("transform","translate(0,0)")	
				.attr("class","article")
				.attr("id", function(d,i){
					return i
				})
				.attr("transform", function(d,i){
					return "translate(" + (x(i)+50) + "," + y(d.average_daily_visit) + ")"
				})

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

			let label = article_text.append("text")
				.text(function(d,i){
					return d.article // cropText(no_underscore()) // + " " + d.year //+ " " + d.discussion_size // + " " + d.year //+ " " + d.average_daily_visit
				})
				.attr("x",0)
				.attr("y",-height)
				.attr("text-anchor","middle")
				.attr("fill","black")
				.attr("font-size",font_size)
				.attr("class","text")
		}
	}
}


$(document).ready(function() {
	let random_subject = (Math.floor(Math.random() * 17) + 0) + 1
	// console.log(random_subject, subjects[random_subject]);

	document.getElementById("subjects").selectedIndex = random_subject;
	// const select = $("#subjects");
    // select.selectedIndex = random_subject;

	dv1(subjects[random_subject]);
});

