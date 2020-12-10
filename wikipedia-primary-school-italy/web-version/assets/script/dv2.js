const container = "#dv2";
const font_size = 10;
const shiftx_article = 30;
const article_width = 5;
// const filter_item = 120;

let c_issues = '#EC4C4E',
	c_reference = '#49A0D8',
	c_note = '#A8D2A2',
	c_image = '#F5A3BD',
	c_days = '#9e9e9e',
	c_line = '#9E9E9E';

let window_w = $(container).outerWidth();
	window_h = $(container).outerHeight();

let margin = {top: 20, left: 40, bottom: 20, right: 60},
	width = window_w - (margin.right + margin.right),
	height = window_h - (margin.top + margin.bottom);

let svg = d3.select(container)
	.append("svg")
	.attr("width", width + (margin.right + margin.right))
	.attr("height",height + (margin.top + margin.bottom))
	.attr("id", "svg")

function dv2(the_subject) {
	d3.tsv("../assets/data/articles.tsv").then(loaded)

	function loaded(data) {
		// console.log(data)

		// load data
		let total = 0;
		let subject_articles;
		let visit_sort;
		let filter_data;

		let subject_group = d3.nest()
			.key(d => d.subject)
			.entries(data)
		// console.log(subject_group)
	
		// for (const [d,c] of Object.entries(subject_group)) {
		for (const [d,c] of Object.entries(subject_group)) {
			if (c.key == the_subject){
				subject_articles = c.values;
			}
		}
		
		visit_sort = subject_articles.sort(function(x, y){
			return d3.descending(+x.average_daily_visit, +y.average_daily_visit);
		})

		filter_data = visit_sort.filter(function(x,y){ 
			return x.issues > 0
		})

		filtered_data = filter_data.sort(function(a, b){
			return d3.descending(a.issues, b.issues);
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
		console.log(filtered_data)

		// scale
		let issues_max = d3.max(filtered_data, function(d) { 
				return d.issues
			})
		console.log(issues_max)

		let max_features = d3.max(filtered_data, function(d) {
				return +d.features
			})

		let my_max_features = max_features;

		let x = d3.scaleLinear()
			.domain([0,filtered_data.length]) 
			.range([0,width])

		let y_issues = d3.scaleLinear()
			.domain([0,issues_max]) 
			.range([0,height/2.2])

		let y_features = d3.scaleLinear()
			.domain([0,my_max_features]) 
			.range([0,height/2.2])

		let plot = svg.append("g")
			.attr("id", "d3_plot")
			.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

		// plot data
		let article = plot.append("g")	
			.attr("class","articles")
			.selectAll("g")
			.data(filtered_data)
			.enter()
			.append("g")
			.attr("class", function(d,i){
				return i + " " + d.article
			})
			.attr("transform", function(d,i){
				return "translate(" + x(i) + "," + 0 + ")"
			})

		// article circle
		let article_circle = article.append("circle")
			.attr("cx", article_width/2)
			.attr("cy", height/2)
			.attr("r", article_width/2)
			.style("fill","blue")
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
				return "iss_" + d.issues 
			})

		// features
		let features = article.append("g")
			.attr("transform", function(d,i){
				return "translate(" + 0 + "," + ((height/2)+30) + ")"
			})
			.attr("class", function(d,i){
				return "feat_" + d.features 
			})

		let references = features.append("rect")
			.attr("x",0)
			.attr("y",function(d,i){
				return 0
				// return y_features(max_features - d.references)
			})
			.attr("width",article_width)
			.attr("height", function(d,i){
				return y_features(d.references)
			})
			.attr("fill",c_reference)
			.attr("class", function(d,i){
				return "ref_" + d.references 
			})

		let notes = features.append("rect")
			.attr("x",0)
			.attr("y",function(d,i){
				return y_features(d.references)
			})
			.attr("width",article_width)
			.attr("height", function(d,i){
				return y_features(d.notes)
			})
			.attr("fill",c_note)
			.attr("class", function(d,i){
				return "not_" + d.notes 
			})

		let images = features.append("rect")
			.attr("x",0)
			.attr("y",function(d,i){
				return y_features(d.references + d.notes) //  
			})
			.attr("width",article_width)
			.attr("height", function(d,i){
				return y_features(d.images)
			})
			.attr("fill",c_image)
			.attr("class", function(d,i){
				return "img_" + d.images 
			})
	}
}

$(document).ready(function() {
	dv2("Storia"); // Storia Geografia Informatica Letteratura italiana Scienze
});