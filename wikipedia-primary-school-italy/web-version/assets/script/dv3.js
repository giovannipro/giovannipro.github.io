const wiki_link = "https://it.wikipedia.org/wiki/";
const ws_it_author_link = "https://it.wikisource.org/wiki/Autore:"
const ws_la_author_link = "https://it.wikisource.org/wiki/Scriptor:"
const ws_it_publication_link = "https://it.wikisource.org/wiki/"
const ws_la_publication_link = "https://la.wikisource.org/wiki/"

function dv3() {
	d3.tsv("../assets/data/publications.tsv").then(loaded);

	function loaded(data) {
		// console.log(data)

		let output;

		let author_group = d3.nest()
			.key(d => d.author)
			.entries(data)

		console.log(author_group)

		publication_sort = author_group.sort(function(a,b){
			return b.values.length - a.values.length;
		})

		publication_sort.forEach(function (d,i) {
			// console.log(d.values.length)

			if (d.values[0].author_ws_it != "-") {
				output += "<a href='" + wiki_link + d.key + "' target='_blank'>" + d.key + "</a> - "
				output += d.values.length + " pubblicazioni<br/><ul style='margin: 0 0 0 40px;'>";

				if (d.values.length > 1) {
					d.values.forEach(function (a,b) {
						output += "<li><a href='"+ wiki_link + a.pubb_w + "' target='_blank'>" + a.pubb_w + " (w it)</a>, "
						output += "<a href='"+ ws_it_publication_link + a.pubbl_it + "' target='_blank'>" + a.pubbl_it + " (ws it)</a>, "
						output += "<a href='"+ ws_la_publication_link + a.pubbl_la + "' target='_blank'>" + a.pubbl_la + " (ws la)</a></li>"
					})
				}
			}
			else {
				output += "<a href='" + wiki_link + d.key + "' target='_blank'>" + d.key + "</a> - 0 pubblicazioni<br/>"
			}


			output += "</ul><br/>"
		})

		$("#dv3").append(output)
	}
}

$(document).ready(function() {
	dv3();
});