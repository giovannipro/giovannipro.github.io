function apply_color(item){
	let color = "blue";
	return color;
}

const container = "#dv1";
let filtered_data = [];
const font_size = 12;

let multiply = 1;
let window_w = $(container).outerWidth();
	window_h = $(container).outerHeight(); //  window.innerHeight * (multiply*1.5);

let margin = {top: 20, left: 20, bottom: 20, right: 20},
	width = window_w - (margin.right + margin.right),
	height = window_h - (margin.top + margin.bottom);

let filter_item = 500;

let svg = d3.select(container)
	.append("svg")
	.attr("width", width + (margin.right + margin.right))
	.attr("height",height + (margin.top + margin.bottom))
	.attr("id", "svg")

let plot = svg.append("g")
	.attr("id", "d3_plot")
	.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

function dv1(the_subject) {
	d3.tsv("../assets/data/articles.tsv").then(loaded)
	d3.select("#articles").remove();
	d3.select("#yAxis").remove();

	function loaded(data) {
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
		})
		// console.log(total,filtered_data)
		
		// scale
		let y_min = d3.min(filtered_data, function(d) { 
			return d.average_daily_visit;
		})
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

		let articles = plot.append("g")	
			.attr("id","articles")

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
			.attr("opacity",0)

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
			.attr("y",-20)
			.attr("text-anchor","middle")
			.attr("fill","black")
			.attr("font-size",font_size)
			.attr("class","text")
			
		function handleMouseOver(d, i) { 
			d3.select(this.parentNode).select(".article_text")
				.attr("opacity",1)
		}

		function handleMouseOut(d, i) { 
			d3.select(this.parentNode).select(".article_text")
				.attr("opacity",0)
		}

		let yAxis = plot.append("g")
			.attr("id","yAxis")
			.attr("transform", "translate(" + (margin.left) + "," + (margin.top) +")")
			.call(d3.axisLeft(y));
	}

	// function update_dv1(subject){
	// 	let data = get_data()

	// 	let y_min = d3.min(data, function(d) { 
	// 		return d.average_daily_visit
	// 	})
	// 	let y_max = d3.max(data, function(d) { 
	// 		return d.average_daily_visit
	// 	})

	// 	let y = d3.scaleLinear()
	// 		.domain([0,y_max+(y_max/100*10)]) 
	// 		.range([height-margin.top,0])

	// 	d3.select(".yAxis")
	// 		.transition()
	// 		.call(d3.axisLeft(y));
	// }

}

$( "#subjects" ).change(function() {
	let subject = this.value;
	dv1(subject)
});

$(document).ready(function() {
	dv1("Biologia");
});