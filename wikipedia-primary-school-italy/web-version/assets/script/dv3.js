const wiki_link = "https://it.wikipedia.org/wiki/";
const ws_it_author_link = "https://it.wikisource.org/wiki/Autore:"
const ws_la_author_link = "https://it.wikisource.org/wiki/Scriptor:"
const ws_it_publication_link = "https://it.wikisource.org/wiki/"
const ws_la_publication_link = "https://la.wikisource.org/wiki/"

const container = "#dv3";
const font_size = 10;
const filter_item = 120;
const shiftx_author = 0;
const circle_size = 4.5;
const circle_opacity = 0.7;
const v_shift = 13;

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
	.attr("height",1980)
	.attr("id", "svg")
	// .attr("height",height + (margin.top + margin.bottom))

function dv3(the_literature) {
	Promise.all([
		d3.tsv("../assets/data/publications.tsv"),
		d3.tsv("../assets/data/authors.tsv"),
	])
	.then(loaded);

	function loaded(data) {
		// console.log(data[0],data[1])

		let publications_authors = [];
		let author_group = [];
		let merged_data = [];
		
		// merge the two datasets
		merged_data = data[0].map((e) => {
		    for(let element of data[1]){
		        if(e.author == element.author) Object.assign(e, element);
		    }
		    return e;
		});
		// console.log(merged_data);

		// filter by source (it or la)
		merged_data.forEach(function (val,i) {
			if (val.source == the_literature){
				publications_authors.push(val)
			}
		})
		// console.log(publications_authors)

		// nest by author
		author_group = d3.nest()
			.key(d => d.surname)
			.entries(publications_authors)
		console.log(author_group)

		author_group.forEach(function (val,i) {
			let period = +val.values[0].period
			period.toFixed(2)
			console.log(val.key, period)
		})

		let plot = svg.append("g")
			.attr("id", "d3_plot")
			.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

		// tooltip
		let tooltip = d3.tip()
			.attr('class', 'tooltip')
			.attr('id', 'tooltip')
			.direction(function (d,i) {
				return 'n'
			})
			.offset([-10,0])
			.html(function(d) {
	            let content = "<p style='font-weight: bold; margin: 0 0 5px 3px;'>" + d.pubb_w.replace(/_/g," ") + "<p><table>";

	            // content += "<tr><th>" + d.values[0].pubb_w.replace(/_/g," ") + "</th></tr>"

	            content += "</table>"
	            return content;
	        });
       	plot.call(tooltip);

		// plot data
		let authors = plot.append("g")	
			.attr("id","authors")
			.attr("transform","translate(" + shiftx_author + "," + (margin.top) + ")")	

		let author = authors.selectAll("g")
			.data(author_group)
			.enter()
			.append("g")
			.sort(function(a, b) {
	  			return d3.ascending(a.values[0].surname, b.values[0].surname); // a, b.key
			}) 
			.attr("class","author")
			.attr("id", function(d,i){
				return i + "_" + d.values[0].surname
			})
			.attr("transform", function(d,i){
				return "translate(" + 0 + "," + ((i)*v_shift) + ")"
			})

		let author_box = author.append("g")
			.attr("class","author_box")
			.append("a")
			.attr("xlink:href", function(d,i){
				// return ws_it_author_link + d.values[0].author_ws_it
				if (d.values[0].source == "it") {
					return ws_it_author_link + d.values[0].author_ws_it.replace("Testi_di_","")
				}
				else {
					return ws_la_author_link + d.values[0].author_ws_la
				}
			})
			.attr("target","_blank")

		let author_name = author_box.append("text")
			.text(function(d,i){
				return d.values[0].surname + " " + d.values[0].name // + " " + d.values[0].period // d.key.replace(/_/g," ") // (i+1) + "-" + 
			})
			.attr("font-size",font_size)

		let publication_box = author.append("g")
			.attr("class","publication_box")
			.attr("transform","translate(180,-3)")
			.selectAll("g")
			.data(function(d) { 
				return d.values; 
			})
			.enter()
			.append("g")
			.attr("transform",function(d,i){
				return "translate(" + i*(circle_size*15) + ",0)" 
			})
			.on("mouseover", tooltip.show) 
			.on("mouseout", tooltip.hide)

		// pubb_w
		let publication_ws_la = publication_box.append("a")	
			.attr("xlink:href", function(d,i){
				return wiki_link + d.pubb_w
			})
			.attr("target","_blank")
			.append("circle")
			.attr("cx",function(d,i) {
				return ((i * circle_size) + 0)
			})
			.attr("cy",0)
			.attr("r",function(d,i){
				if (d.pubb_w !== "-"){ //   || d.pubb_w !== ""
					return circle_size
				}
				else {
					return circle_size/4
				}
			})
			.style("fill","blue")
			.style("opacity",circle_opacity)
			.attr("class",function(d,i){
				return d.pubb_w 
			})

		let publications_link_it = publication_box.append("a")	
			.attr("xlink:href", function(d,i){
				return ws_it_publication_link + d.pubbl_it
			})
			.attr("target","_blank")
			.append("circle")
			.attr("cx",function(d,i) {
				return ((i * circle_size) + circle_size*2.5)
			})
			.attr("cy",0)
			.attr("r",function(d,i){
				if (d.pubbl_it !== "-"){ //  || d.pubbl_it !== ""
					return circle_size
				}
				else {
					return circle_size/4
				}
			})
			.style("fill","red")
			.style("opacity",circle_opacity)
			.attr("class",function(d,i){
				return d.pubbl_it 
			})

		let publications_link_la = publication_box.append("a")	
			.attr("xlink:href", function(d,i){
				return ws_la_publication_link + d.pubbl_la
			})
			.attr("target","_blank")
			.append("circle")
			.attr("cx",function(d,i) {
				return ((i * circle_size) + (circle_size*5) )
			})
			.attr("cy",0)
			.attr("r",function(d,i){
				if (d.pubbl_la !== "-"){ // || d.pubbl_la !== ""
					return circle_size
				}
				else {
					return circle_size/4
				}
			})
			.style("fill","#ffb600")
			.style("opacity",circle_opacity)
			.attr("class",function(d,i){
				return d.pubbl_la
			})

		let new_sort;
		$("#literature").change(function() {
			let literature = this.value;
			new_sort =  $("#sort_publications option:selected").val();

			update_literature(literature,new_sort);
		});

		$("#sort_publications").change(function() {
			new_sort = parseInt(this.value);
			let literature = $("#literature option:selected").val();

			update_sort(literature,new_sort);
			console.log(literature,new_sort)
		});

		function update_literature(the_literature,the_sort){
			console.log(the_literature,the_sort);

			if (the_literature == "la"){
				d3.select("svg")
					.attr("height",850)
			}
			else{
				d3.select("#svg")
					.attr("height",1980)
			}

			d3.select("#authors").remove();

			d3.selectAll("circle")
				.transition()
				.duration(300)
				.attr("r",0)

			let publications_authors = [];
			let author_group = [];

			// filter by source (it or la)
			merged_data.forEach(function (val,i) {
				if (val.source == the_literature){
					publications_authors.push(val)
				}
			})
			// console.log(publications_authors)

			// nest by author
			author_group = d3.nest()
				.key(d => d.surname)
				.entries(publications_authors)
			console.log(author_group)

			let authors = plot.append("g")	
				.attr("id","authors")
				.attr("transform","translate(" + shiftx_author + "," + (margin.top) + ")")

			let author = authors.selectAll("g")
				.data(author_group)
				.enter()
				.append("g")
				.attr("class","author")
				.sort(function(a, b) {
	  				return d3.ascending(a.values[0].surname, b.values[0].surname);
				})
				.attr("id", function(d,i){
					return i + "_" + d.key
				})
				.attr("transform", function(d,i){
					return "translate(" + 0 + "," + ((i)*v_shift) + ")"
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
					return d.values[0].surname + " " + d.values[0].name
				})
				.attr("font-size",font_size)

			let publication_box = author.append("g")
				.attr("class","publication_box")
				.attr("transform","translate(180,-3)")
				.selectAll("g")
				.data(function(d) { 
					return d.values; 
				})
				.enter()
				.append("g")
				.attr("transform",function(d,i){
					return "translate(" + i*(circle_size*10) + ",0)" 
				})

			let publication_ws_la = publication_box.append("a")	
				.attr("xlink:href", function(d,i){
					return wiki_link + d.pubb_w
				})
				.attr("target","_blank")
				.append("circle")
				.attr("cx",function(d,i) {
					return ((i * circle_size) + 0)
				})
				.attr("cy",0)
				.attr("r",function(d,i){
					if (d.pubb_w !== "-"){ //   || d.pubb_w !== ""
						return circle_size
					}
					else {
						return circle_size/4
					}
				})
				.style("fill","blue")
				.style("opacity",circle_opacity)
				.attr("class",function(d,i){
					return d.pubb_w 
				})

			let publications_link_it = publication_box.append("a")	
				.attr("xlink:href", function(d,i){
					return ws_it_publication_link + d.pubbl_it
				})
				.attr("target","_blank")
				.append("circle")
				.attr("cx",function(d,i) {
					return ((i * circle_size) + circle_size*2.5)
				})
				.attr("cy",0)
				.attr("r",function(d,i){
					if (d.pubbl_it !== "-"){ //  || d.pubbl_it !== ""
						return circle_size
					}
					else {
						return circle_size/4
					}
				})
				.style("fill","red")
				.style("opacity",circle_opacity)
				.attr("class",function(d,i){
					return d.pubbl_it 
				})

			let publications_link_la = publication_box.append("a")	
				.attr("xlink:href", function(d,i){
					return ws_la_publication_link + d.pubbl_la
				})
				.attr("target","_blank")
				.append("circle")
				.attr("cx",function(d,i) {
					return ((i * circle_size) + (circle_size*5) )
				})
				.attr("cy",0)
				.attr("r",function(d,i){
					if (d.pubbl_la !== "-"){ // || d.pubbl_la !== ""
						return circle_size
					}
					else {
						return circle_size/4
					}
				})
				.style("fill","#ffb600")
				.style("opacity",circle_opacity)
				.attr("class",function(d,i){
					return d.pubbl_la
				})
		}

		function update_sort(literature,new_sort) {
			console.log(literature,new_sort)

			if (new_sort == 3){
				author.sort(function(a, b) {
	  					return d3.descending(a.values.length, b.values.length);
					})
					.transition()
					.attr("transform", function(d,i){
					return "translate(" + 0 + "," + ((i)*v_shift) + ")"
				})
			}
			else if (new_sort == 2){
				// author.sort(function(a, b) {
	  	// 				return d3.ascending(a.values[0].period, b.values[0].period);
				// 	})
				author.sort(function(a,b){
					return a.values[0].period - b.values[0].period
				})
					.transition()
					.attr("transform", function(d,i){
					return "translate(" + 0 + "," + ((i)*v_shift) + ")"
				})
			}
			else if (new_sort == 1){
				author.sort(function(a, b) {
	  					return d3.ascending(a.key, b.key);
					})
					.transition()
					.attr("transform", function(d,i){
					return "translate(" + 0 + "," + ((i)*v_shift) + ")"
				})
			}
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
	dv3("it"); // it la
});