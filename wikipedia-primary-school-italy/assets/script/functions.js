function articles() {

	let template_source = 'assets/tpl/articles.tpl';
	let data_source = 'assets/data/articles.json';
	let target = '#articles';

	let head = {
		"article": "article",
		"link": "link",
		"typology": "typology",
		"subject": "subject",
		"year": "year",
		"argument": "argument",
		"topic": "topic",
		"average_daily_visit": "average_daily_visit",
		"first_edit": "first_edit",
		"size": "size",
		"incipit_size": "incipit_size",
		"discussion_size": "discussion_size",
		"issues": "issues",
		"notes": "notes",
		"images": "images",
		"references": "references",
	};

	$("#all_data").click(function(){
		load_data(0,false);
		$("#all_data").toggleClass("underline");
		$("#missing_data").toggleClass("underline");
	})

	$("#missing_data").click(function(){
		load_data(0,true); // 0
		$("#missing_data").toggleClass("underline");
		$("#all_data").toggleClass("underline");
	})

	function load_data(filter,activation) {
		$.get(template_source, function(tpl) {
			$.getJSON(data_source, function(data) {
				// console.log(data)

				let filtered = [];
				let index = 0;

				let art = []
				let duplicates = [];
				let duplicates_count = 0;

				$.each(data, function(a,b) {
					if (activation == true) {
						if (b.size == filter) {
						// if (b.first_edit == filter) {
						// if (b.subject == filter) {
						// if (b.typology == filter) {	
					        filtered.push(b);
					        index += 1
					    }
					}
					else {
						if (1 == 1) {
					        filtered.push(b);
					        index += 1

					        // duplicates
							if (art.includes(no_underscore(b.article))) {
								duplicates.push(b) //b.id + "_" + no_underscore(b.article) + "_" + b.size)
								duplicates_count += 1;
							}
							else {
								art.push(no_underscore(b.article))
							}
					    }
					}
				})
				console.log("duplicates: " + duplicates_count)

				filtered.sort(function(a, b) { 
					// return compareValues(a.average_daily_visit, b.average_daily_visit);
					return compareStrings(a.subject, b.subject);
					// return compareValues(a[sort], b[sort]);
				})

				filtered.unshift(head);


				if (duplicates === undefined || duplicates.length > 0) {
					duplicates.forEach(function (d,i) {
	    				console.log(d.article)
	    				// $(target).append(d.id)
					})
				}
				else {
					console.log("no duplicates")
				}

				let template = Handlebars.compile(tpl); 
				$(target).html(template(filtered));
			});
		});
	}
	load_data("",false);
}

function subjects() {

	let template_source = 'assets/tpl/subjects.tpl';
	let data_source = 'assets/data/subjects.json';
	let target = '#subjects';

	let head =   {
	    "subject": "subject",
	    "articles": "articles",
	    "average_daily_visit": "average_daily_visit",
	    "size": "size",
	    "incipit_on_size": "incipit_on_size",
	    "notes": "notes"
	};

	function load_data() {
		$.get(template_source, function(tpl) {
			$.getJSON(data_source, function(data) {
				// console.log(data);

				function compareStrings(a, b) {
					a = a.toLowerCase();
					b = b.toLowerCase();
					return (a < b) ? -1 : (a > b) ? 1 : 0;
				}

				function compareValues(a, b) {
					return b - a 
				}

				data.sort(function(a, b) { 
					// return compareValues(a.average_daily_visit, b.average_daily_visit);
					return compareStrings(a.subject, b.subject);
				})

				data.unshift(head);

				let template = Handlebars.compile(tpl); 
				$(target).html(template(data));
			});
		});
	}
	load_data();
}

function merge_data() {
	$.getJSON('assets/data/a_1.json', function(data_a) {
		$.getJSON('assets/data/b_1.json', function(data_b) {

			data_a.sort(function(a, b) { 
				return compareValues(a.article, b.article);
			})

			data_b.sort(function(a, b) { 
				return compareValues(a.article, b.article);
			})


			$.each(data_a, function(a,b) {

				let id = b.id
				let article = b.article
				let year = ""

				$.each(data_b, function(c,d) {
					// console.log(d)

					if (no_underscore(article) == no_underscore(d.article)) {
						year = d.year

						// let output = id + "," + no_underscore(d.article) + "," + d.first_edit + "<br/>"

						// console.log(output);

						// return false; // true: continue; false: break
					}
					else {

						if (year.length < 3) {
							year = "???"
						}
						// $("#articles").append(output)
						// return false; // 
					}
				})
				let output = id + "," + no_underscore(article) + "," + year + "<br/>"
				$("#articles").append(output)
			})
			console.log("finished")
		})
	})
}

$(document).ready(function() {
	articles();
	// subjects();
	// merge_data();
});