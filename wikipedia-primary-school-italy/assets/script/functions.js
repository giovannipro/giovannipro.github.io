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
		"size": "size",
		"incipit_on_size": "incipit/size",
		"issues": "issues",
		"notes": "notes",
		"images": "images"
	};

	$.get(template_source, function(tpl) {
		$.getJSON(data_source, function(data) {
			// console.log(data)

			let filtered = [];
			let index = 0;
			let find = ""

			$.each(data, function(a,b) {
				// if (1 == 1){ 
				if (b.size == find ) {
			        filtered.push(b);
			        index += 1
			    }
			})
			console.log(index)

			function compareStrings(a, b) {
				a = a.toLowerCase();
				b = b.toLowerCase();
				return (a < b) ? -1 : (a > b) ? 1 : 0;
			}

			function compareValues(a, b) {
				return b - a 
			}

			filtered.sort(function(a, b) {
				return compareStrings(a.subject, b.subject);
				// return compareValues(a.size, b.size);
			})

			filtered.unshift(head);

			let template = Handlebars.compile(tpl); 
			$(target).html(template(filtered));
		});
	});
}


$(document).ready(function() {
	articles();
});