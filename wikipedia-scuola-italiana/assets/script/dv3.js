const wiki_link = "https://it.wikipedia.org/wiki/";
const ws_it_author_link = "https://it.wikisource.org/wiki/Autore:"
const ws_la_author_link = "https://la.wikisource.org/wiki/Scriptor:"
const ws_it_publication_link = "https://it.wikisource.org/wiki/"
const ws_la_publication_link = "https://la.wikisource.org/wiki/"

const container = "#dv3";
const font_size = 11;
const filter_item = 120;
const shiftx_author = 0;
const circle_size = 4.5;
const circle_opacity = 0.7;

const wiki_color = "blue";
const ws_it_color = "red";
const ws_la_color = "rgb(255, 182, 0)";

const it_authors = 146;
const la_authors = 57;

const italian_height = it_authors * 20;
const latin_height = la_authors * 20;

const it_h = 0.97;
const la_h = 0.97;

const literature_ = "it";

const reset_height_it = 50;
const reset_height_la = 10;

function escape_(item){
	let output = item.replace("'","%27")
	return output
}

let multiply = 1;
let window_w = $(container).outerWidth();
	window_h = $(container).outerHeight();

if (window_w <= 768) {
	reduction = 10;
}
else {
	reduction = 0;
}

let margin = {top: 20, left: 20-reduction, bottom: 20, right: 20-reduction},
	width = window_w - (margin.right + margin.right),
	height = window_h - (margin.top + margin.bottom);

let svg = d3.select(container)
	.append("svg")
	.attr("width", width + (margin.right + margin.right))
	.attr("height", italian_height)
	.attr("id", "svg")

function dv3(the_literature) {
	Promise.all([
		d3.tsv("../assets/data/publications.tsv"),
		d3.tsv("../assets/data/authors.tsv"),
	])
	.then(loaded);

	function loaded(data) {

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

		// filter by source (it or la)
		merged_data.forEach(function (val,i) {
			if (val.source == the_literature){
				publications_authors.push(val)
			}
		})

		// nest by author
		author_group = d3.nest()
			.key(d => d.surname)
			.entries(publications_authors)

		author_group.forEach(function (val,i) {
			let period = +val.values[0].period
			period.toFixed(2)

			let empty_publ = 0;
			let values = val.values;
			values.forEach(function (a,b) {
				if (a.pubb_w == "-" && a.pubbl_it == "-" && a.pubbl_la == "-"){
					empty_publ += 1
				}
			})
			
			val.values[0].tot_publ = (val.values.length - empty_publ)
			val.values[0].id = +val.values[0].id
		})
	
		author_group.sort(function(a, b) {
	  		return d3.ascending(a.values[0].surname, b.values[0].surname); // a, b.key
		}) 

		let max_publication = 21;

		// grid
		let the_height = 0;
		if (the_literature == "it") {
			the_height = italian_height + reset_height_it;
			v_shift = it_h;
		}
		else {
			the_height = latin_height + reset_height_la;
			v_shift = la_h;
		}
		// console.log(the_height,v_shift)

		let y = d3.scaleLinear()
			.domain([0,author_group.length]) 
			.range([0,the_height])

		let grids = svg.append("g")
			.attr("id", "grids")

		let v_grid = grids.append("g")
			.attr("id", "v_grid")
			.attr('transform','translate(' + 0 + ',' + (margin.top+8) + ')' )  

		// v_grid
		for (let i=0; i<author_group.length; i++) { 
			if(i % 3 == 0 && i !== 0){ // i == i
	       		v_grid.append('line')
					.attr('x1', 0)
					.attr('y1', y(i * v_shift)) 
					.attr('x2', width + margin.left + margin.right)
					.attr('y2', y(i * v_shift))
					.attr('stroke',"#e9e4e4")
					.attr('stroke-width',1)
	    	}
		}

		let h_grid = grids.append("g")
			.attr("id", "h_grid")
			.attr('transform','translate(' + (173+margin.left-circle_size-2) + ',' + (margin.top+8) + ')' )  

		// h_grid
		let min_size = (circle_size*3.2) * max_publication
		let space = (width-min_size)/(max_publication-1)
		let circle_set = circle_size*1

		for (let i=0; i<max_publication; i++) { 
			if( i % 1 == 0){ // i % 3 == 0
				// console.log(i)
	       		h_grid.append('line')
					.attr('x1', i * (circle_set + space) ) //  *  (circle_size*1 + space*1) )
					.attr('y1', -100) 
					.attr('x2', i * (circle_set + space)) // (circle_size*1 + space*1) )
					.attr('y2', function(d,i) {
						if (literature_ == "it") {
							return italian_height
						}
						else {
							return latin_height
						}
					})
					.attr('stroke',"#e9e4e4")
					.attr('stroke-width',1)
	    	}
		}	

		// plot
		let plot = svg.append("g")
			.attr("id", "d3_plot")
			.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

		// tooltips
		let tooltip_wikipedia = d3.tip()
			.attr("class", "tooltip")
			.attr("id", 'tooltip_wikipedia')
			.direction(function (d,i) {
				return 'n'
			})
			.offset([-10,0])
			.html(function(d) {
				let content = "";
				if (d.pubb_w !== "-") {
		            content = "<p style='margin: 0;'>" 
		            content += "<span style='font-weight: bold; display: block; margin: 0;'>" + d.pubb_w.replace(/_/g," ") + "</span></br>"; 
		            content += "<span>Wikipedia</span>";
		            content += "</p>"
		        }
		        else {
		        	content += "<p style='margin: 0;'>Non disponibile</p>"
		        }
		        return content;
	        });
       	plot.call(tooltip_wikipedia);

       	let tooltip_wikis_it = d3.tip()
			.attr('class', 'tooltip')
			.attr('id', 'tooltip_wikis_it')
			.direction(function (d,i) {
				return 'n'
			})
			.offset([-10,0])
			.html(function(d) {
				let content = "";
				if (d.pubbl_it !== "-") {
		            content = "<p style='margin: 0;'>" 
		            content += "<span style='font-weight: bold; display: block; margin: 0;'>" + d.pubbl_it.replace(/_/g," ") + "</span></br>"; 
		            content += "<span>Wikisource</span>";
		            content += "</p>"
				}
		        else {
		        	content += "<p style='margin: 0;'>Non disponibile</p>"
		        }
		        return content;
	        });
       	plot.call(tooltip_wikis_it);

       	let tooltip_wikis_la = d3.tip()
			.attr('class', 'tooltip')
			.attr('id', 'tooltip_wikis_la')
			.direction(function (d,i) {
				return 'n'
			})
			.offset([-10,0])
			.html(function(d) {
				let content = "";
				if (d.pubbl_la !== "-") {
		            content = "<p style='margin: 0;'>" 
		            content += "<span style='font-weight: bold; display: block; margin: 0;'>" + d.pubbl_la.replace(/_/g," ") + "</span></br>"; 
		            content += "<span>Wicifons</span>";
		            content += "</p>"

		        }
		        else {
		        	content += "<p style='margin: 0;'>Non disponibile</p>"
		        }
		        return content;
	        });
       	plot.call(tooltip_wikis_la);

		let authors = plot.append("g")	
			.attr("id","authors")
			.attr("transform","translate(" + shiftx_author + "," + (margin.top) + ")")	

		let author = authors.selectAll("g")
			.data(author_group)
			.enter()
			.append("g")
			.attr("class","author")
			.attr("id", function(d,i){
				return i + "_" + d.values[0].surname
			})
			.attr("transform", function(d,i){
				return "translate(" + 0 + "," + y(i * v_shift) + ")"
			})
			.on("mouseover", handleMouseOver)
			.on("mouseout", handleMouseOut)

		// license
		let license = author.append("text")
			.text(function(d,i){
				if(d.values[0].author_ws_it == "©") {
					return "Opere protette da copyright"
				}
			})
			.attr("class","license")
			.attr("font-size",font_size)
			.attr("text-anchor","end")
			.attr("transform","translate(" + (width-10) + ",0)")
			.attr("opacity",0)

		let author_box = author.append("g")
			.attr("class","author_box")
			.append("a")
			.attr("xlink:href", function(d,i){
				if (the_literature == "it") {
					if (d.values[0].author_ws_it !== "©" && d.values[0].author_ws_it !== "-") {
						return ws_it_author_link + d.values[0].author_ws_it.replace("Testi_di_","")
					}
					else {
						return wiki_link + d.values[0].author_w
					}
				}
				else {
					if (d.values[0].author_ws_la !== "-") {
						return ws_la_author_link + d.values[0].author_ws_la
					}
					else {
						return wiki_link + d.values[0].author_w
					}
				}
			})
			.attr("target","_blank")

		let author_name = author_box.append("text")
			.text(function(d,i){
				return d.values[0].surname + " " + d.values[0].name;
			})
			.attr("font-size",font_size)

		// publications
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
				return "translate(" + (i*space) + ",0)" 
			})

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
					return circle_size/6
				}
			})
			.style("fill",wiki_color)
			.style("opacity",circle_opacity)
			.attr("class",function(d,i){
				return d.pubb_w 
			})
			.on("mouseover", tooltip_wikipedia.show) 
			.on("mouseout", tooltip_wikipedia.hide)

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
					return circle_size/6
				}
			})
			.style("fill",ws_it_color)
			.style("opacity",circle_opacity)
			.attr("class",function(d,i){
				return d.pubbl_it 
			})
			.on("mouseover", tooltip_wikis_it.show) 
			.on("mouseout", tooltip_wikis_it.hide)

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
					return circle_size/6
				}
			})
			.style("fill", ws_la_color) // #ffb600 
			.style("opacity",circle_opacity)
			.attr("class",function(d,i){
				return d.pubbl_la
			})
			.on("mouseover", tooltip_wikis_la.show) 
			.on("mouseout", tooltip_wikis_la.hide)

		// mouse hover
		function handleMouseOver(){
			d3.selectAll(".author")
				.attr("opacity",0.2)

			d3.select(this)
				.attr("opacity",1)

			d3.select(this).select(".license")
				.attr("opacity",1)
		}

	    function handleMouseOut(){
			d3.selectAll(".author")
				.attr("opacity",1)

			d3.selectAll(".license")
				.attr("opacity",0)
	    }

		let new_sort;
		$("#literature").change(function() {
			let the_literature = this.value;
			new_sort =  $("#sort_publications option:selected").val();

			update_literature(the_literature,new_sort);
		});

		$("#sort_publications").change(function() {
			new_sort = parseInt(this.value);
			let literature_select = $("#literature option:selected").val();

			update_sort(literature_select,new_sort);
		});

		function update_literature(the_literature,the_sort){
			if (the_literature == "la"){
				d3.select("svg")
					.attr("height",latin_height)
			}
			else{
				d3.select("#svg")
					.attr("height",italian_height)
			}

			d3.select("#authors").remove();

			d3.selectAll("circle")
				.transition()
				.duration(500)
				.attr("r",0)

			let publications_authors = [];

			// filter by source (it or la)
			merged_data.forEach(function (val,i) {
				if (val.source == the_literature){
					publications_authors.push(val)
				}
			})

			// nest by author
			author_group = d3.nest()
				.key(d => d.surname)
				.entries(publications_authors)

			author_group.forEach(function (val,i) {
				let period = +val.values[0].period
				period.toFixed(2)

				let empty_publ = 0;
				let values = val.values;
				values.forEach(function (a,b) {
					if (a.pubb_w == "-" && a.pubbl_it == "-" && a.pubbl_la == "-"){
						empty_publ += 1
					}
				})
				
				val.values[0].tot_publ = (val.values.length - empty_publ)
				val.values[0].id = +val.values[0].id
			})

			// sort
			if (the_sort == 1) {
				author_group.sort(function(a, b) {
	  				return d3.ascending(a.values[0].surname, b.values[0].surname);
				})
			}
			else if (the_sort == 2){
				author_group.sort(function(a,b){
					return a.values[0].period - b.values[0].period
				})
			}
			else if (the_sort == 3){ 
				author_group.sort(function(a, b) {
	  				return d3.descending(a.values[0].tot_publ, b.values[0].tot_publ);
				})
			}

			let the_height = 0;
			if (the_literature == "it") {
				the_height = italian_height + reset_height_it;
				v_shift = it_h;
			}
			else {
				the_height = latin_height + reset_height_la;
				v_shift = la_h;
			}

			let y = d3.scaleLinear()
				.domain([0,author_group.length]) 
				.range([0,the_height])

			let authors = plot.append("g")	
				.attr("id","authors")
				.attr("transform","translate(" + shiftx_author + "," + (margin.top) + ")")

			let author = authors.selectAll("g")
				.data(author_group)
				.enter()
				.append("g")
				.attr("class","author")
				.attr("id", function(d,i){
					return i + "_" + d.values[0].surname
				})
				.attr("transform", function(d,i){
					return "translate(" + 0 + "," + y(i * v_shift) + ")"
				})
				.on("mouseover", handleMouseOver)
				.on("mouseout", handleMouseOut)

			let author_box = author.append("g")
				.attr("class","author_box")
				.append("a")
				.attr("xlink:href", function(d,i){
					if (the_literature == "it") {
						if (d.values[0].author_ws_it !== "©" && d.values[0].author_ws_it !== "-") {
							return ws_it_author_link + d.values[0].author_ws_it.replace("Testi_di_","")
						}
						else {
							return wiki_link + d.values[0].author_w
						}
					}
					else {
						if (d.values[0].author_ws_la !== "-") {
							return ws_la_author_link + d.values[0].author_ws_la
						}
						else {
							return wiki_link + d.values[0].author_w
						}
					}
				})
				.attr("target","_blank")

			let author_name = author_box.append("text")
				.text(function(d,i){
					return d.values[0].surname + " " + d.values[0].name;
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
					return "translate(" + (i*space) + ",0)" 
				})

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
					if (d.pubb_w !== "-"){
						return circle_size
					}
					else {
						return circle_size/6
					}
				})
				.style("fill",wiki_color)
				.style("opacity",circle_opacity)
				.attr("class",function(d,i){
					return d.pubb_w 
				})
				.on("mouseover", tooltip_wikipedia.show) 
				.on("mouseout", tooltip_wikipedia.hide)

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
					if (d.pubbl_it !== "-") { 
						return circle_size
					}
					else {
						return circle_size/6
					}
				})
				.style("fill",ws_it_color)
				.style("opacity",circle_opacity)
				.attr("class",function(d,i){
					return d.pubbl_it 
				})
				.on("mouseover", tooltip_wikis_it.show) 
				.on("mouseout", tooltip_wikis_it.hide)

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
					if (d.pubbl_la !== "-"){
						return circle_size
					}
					else {
						return circle_size/6
					}
				})
				.style("fill", ws_la_color) 
				.style("opacity",circle_opacity)
				.attr("class",function(d,i){
					return d.pubbl_la
				})
				.on("mouseover", tooltip_wikis_la.show) 
				.on("mouseout", tooltip_wikis_la.hide)
		}

		function update_sort(literature,new_sort) {

			// sort
			if (new_sort == 1) {
				author_group.sort(function(a, b) {
	  				return d3.ascending(a.values[0].surname, b.values[0].surname);
				})
			}
			else if (new_sort == 2){
				author_group.sort(function(a,b){
					return a.values[0].period - b.values[0].period
				})
			}
			else if (new_sort == 3){
				author_group.sort(function(a, b) {
	  				return d3.ascending(b.values[0].tot_publ, a.values[0].tot_publ);
				})
			}

			// grid
			let the_height = 0;
			if (literature == "it") {
				the_height = italian_height + reset_height_it;
				v_shift = it_h;
			}
			else {
				the_height = latin_height + reset_height_la;
				v_shift = la_h;
			}
			// console.log(the_height,v_shift);

			y.domain([0,author_group.length])
				.range([0,the_height])

			author_group.forEach(function(d,i){
				d.values[0].new_id = i;
				// console.log(d.key,i)
			})
			
			svg.selectAll(".author")
				.transition()
				.attr("transform", function(d,i){
					let new_i = +d.values[0].new_id;
					return "translate(" + 0 + "," + y(new_i * v_shift) + ")";
				})
		}
	}
}

$(document).ready(function() {
	// let random_literature = (Math.floor(Math.random() * 1) + 0) + 1
	// document.getElementById("literature").selectedIndex = random_literature;

	dv3(literature_); // literature_[random_literature]
});