const wiki_link = "https://it.wikipedia.org/wiki/";
const ws_it_author_link = "https://it.wikisource.org/wiki/Autore:"
const ws_la_author_link = "https://it.wikisource.org/wiki/Scriptor:"
const ws_it_publication_link = "https://it.wikisource.org/wiki/"
const ws_la_publication_link = "https://la.wikisource.org/wiki/"

const container = "#dv3";
const font_size = 10;
const filter_item = 120;
const shiftx_article = 30;
const circle_size = 7;

function escape_(item){
	let output = item.replace("'","%27")
	return output
}


let multiply = 1;
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

function dv3(the_literature) {
	Promise.all([
		d3.tsv("../assets/data/publications.tsv"),
		d3.tsv("../assets/data/authors.tsv"),
	])
	.then(loaded);

	function loaded(data) {
		// console.log(data[0],data[1])

		let publications_authors = [];
		
		// merge the two datasets
		let merged_data = data[0].map((e) => {
		    for(let element of data[1]){
		        if(e.author == element.author) Object.assign(e, element);
		    }
		    return e;
		});
		console.log(merged_data);

		// filter by source (it or la)
		merged_data.forEach(function (val,i) {
			if (val.source == the_literature){
				publications_authors.push(val)
			}
		})
		console.log(publications_authors)

		// nest by author
		let author_group = d3.nest()
			.key(d => d.author)
			.entries(publications_authors)
		console.log(author_group)

		// publication_sort = author_group.sort(function(a,b){
		// 	return b.values.length - a.values.length;
		// })

		// plot data
		let plot = svg.append("g")
			.attr("id", "d3_plot")
			.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

		let authors = plot.append("g")	
			.attr("id","authors")
			.attr("transform","translate(" + shiftx_article + "," + (margin.top) + ")")	

		let author = authors.selectAll("g")
			.data(author_group)
			.enter()
			.append("g")
			.attr("class","author")
			.attr("id", function(d,i){
				return i + "_" + d.key
			})
			.attr("transform", function(d,i){
				return "translate(" + 0 + "," + ((i)*15) + ")"
			})

		let author_box = author.append("g")
			.attr("class","author_box")
			.append("a")
			.attr("xlink:href", function(d,i){
				// return ws_it_author_link + d.values[0].author_ws_it
				if (d.values[0].source == "it") {
					return ws_it_author_link + d.values[0].author_ws_it
				}
				else {
					return ws_la_author_link + d.values[0].author_ws_la
				}
			})
			.attr("target","_blank")

		let author_name = author_box.append("text")
			.text(function(d,i){
				return (i+1) + "-" + d.key
			})
			.attr("font-size",font_size)

		let publication_box = author.append("g")
			.attr("class","publication_box")
			.attr("transform","translate(220,0)")

		let publications_wikipedia = publication_box.selectAll("a")
			.data(function(d) { 
				return d.values; 
			})
			.enter()
			.append("a")
			.attr("xlink:href", function(d,i){
				return wiki_link + d.pubb_w
			})
			.attr("target","_blank")
			.append("circle")
			.attr("cx",function(d,i) {
				return ((i * circle_size) * 5)
			})
			.attr("cy",0)
			.attr("r",function(d,i){
				if (d.pubb_w !== "-"){
					return circle_size
				}
				else {
					return circle_size/2
				}
			})
			.style("fill","blue")
			.attr("class",function(d,i){
				return d.pubb_w 
			})

		function update_subject(the_literature,the_sort){
			// console.log(the_subject,the_sort);

			d3.select("#authors").remove();
		}

		// let output = "";
		// let count = 1;
		// publication_sort.forEach(function (d,i) {
		// 	// console.log(d.values[0].period)

		// 	output += count + ") <a href='" + wiki_link + d.key + "' target='_blank'>" + d.key + "</a> (" + d.values[0].period + ") - ";
		// 	output += (d.values.length) + " pubblicazioni<br/><ul style='margin: 0 0 0 40px;'>";

		// 	let test = "";
		// 	d.values.forEach(function (a,b) {


		// 		output += "<li>";

		// 		if (a.pubb_w != "-" && a.pubb_w != "deest" && a.pubb_w != "/" && a.pubb_w != " ") {
		// 			output += "<a href='"+ wiki_link + escape_(a.pubb_w) + "' target='_blank'>" + a.pubb_w + " (w it)</a>, "
		// 		}

		// 		if (a.pubbl_it != "-" && a.pubbl_it != "deest" && a.pubbl_it != "/" && a.pubbl_it != " ") {
		// 			output += "<a href='"+ ws_it_publication_link + escape_(a.pubbl_it) + "' target='_blank'>" + a.pubbl_it + " (ws it)</a>, "
		// 		}

		// 		if (a.pubbl_la != "-" && a.pubbl_la != "deest" && a.pubbl_la != "/" && a.pubbl_la != " ") {
		// 			output += "<a href='"+ ws_la_publication_link + escape_(a.pubbl_la) + "' target='_blank'>" + a.pubbl_la + " (ws la)</a>"
		// 		}

		// 		output += "</li>";

		// 	})

		// 	output += "</ul><br/>";
		// 	count += 1;
		// })

		// $("#dv3").append(output)
	}
}

$(document).ready(function() {
	dv3("it");
});