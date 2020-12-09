const wiki_link = "https://it.wikipedia.org/wiki/";
const ws_it_author_link = "https://it.wikisource.org/wiki/Autore:"
const ws_la_author_link = "https://it.wikisource.org/wiki/Scriptor:"
const ws_it_publication_link = "https://it.wikisource.org/wiki/"
const ws_la_publication_link = "https://la.wikisource.org/wiki/"

function escape_(item){
	let output = item.replace("'","%27")
	return output
}
// console.log(escape_("Guido,_i'_vorrei_che_tu_e_Lapo_ed_io (ws it),"))

function dv3() {
	Promise.all([
		d3.tsv("../assets/data/publications.tsv"),
		d3.tsv("../assets/data/authors.tsv"),
	])
	// d3.tsv("../assets/data/publications.tsv")
	.then(loaded);

	function loaded(data) {
		// console.log(data[0],data[1])
		
		// let merged_data = data[0].map((item, i) => Object.assign({}, item, data[1][i]));
		
		let merged_data = data[0].map((e) => {
		    for(let element of data[1]){
		        if(e.author == element.author) Object.assign(e, element);
		    }
		    return e;
		});

		console.log(merged_data);

		let output = "";

		let author_group = d3.nest()
			.key(d => d.author)
			.entries(merged_data)
		console.log(author_group)

		publication_sort = author_group.sort(function(a,b){
			return b.values.length - a.values.length;
		})

		let count = 1;
		publication_sort.forEach(function (d,i) {
			// console.log(d.values[0].period)

			output += count + ") <a href='" + wiki_link + d.key + "' target='_blank'>" + d.key + "</a> (" + d.values[0].period + ") - ";
			output += (d.values.length) + " pubblicazioni<br/><ul style='margin: 0 0 0 40px;'>";

			let test = "";
			d.values.forEach(function (a,b) {

				// test += a.pubb_w + a.pubbl_it + a.pubbl_la

				output += "<li>";

				// if (test == "---") {
				// 	output += test 
				// }

				// test = ""

				if (a.pubb_w != "-" && a.pubb_w != "deest" && a.pubb_w != "/" && a.pubb_w != " ") {
					output += "<a href='"+ wiki_link + escape_(a.pubb_w) + "' target='_blank'>" + a.pubb_w + " (w it)</a>, "
				}

				if (a.pubbl_it != "-" && a.pubbl_it != "deest" && a.pubbl_it != "/" && a.pubbl_it != " ") {
					output += "<a href='"+ ws_it_publication_link + escape_(a.pubbl_it) + "' target='_blank'>" + a.pubbl_it + " (ws it)</a>, "
				}

				if (a.pubbl_la != "-" && a.pubbl_la != "deest" && a.pubbl_la != "/" && a.pubbl_la != " ") {
					output += "<a href='"+ ws_la_publication_link + escape_(a.pubbl_la) + "' target='_blank'>" + a.pubbl_la + " (ws la)</a>"
				}

				output += "</li>";

			})

			output += "</ul><br/>";
			count += 1;
		})

		$("#dv3").append(output)
	}
}

$(document).ready(function() {
	dv3();
});