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
		"incipit_on_size": "incipit/size",
		"discussion_size": "discussion_size",
		"issues": "issues",
		"notes": "notes",
		"images": "images"
	};

	$("#all_data").click(function(){
		load_data("",false,);
		$("#all_data").toggleClass("underline");
		$("#missing_data").toggleClass("underline");
	})

	$("#missing_data").click(function(){
		load_data(0,true);
		$("#missing_data").toggleClass("underline");
		$("#all_data").toggleClass("underline");
	})

	function load_data(filter,activation) {
		$.get(template_source, function(tpl) {
			$.getJSON(data_source, function(data) {
				// console.log(data)

				let filtered = [];
				let index = 0;

				$.each(data, function(a,b) {
					if (activation == true) {
						if (b.size == filter) {
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
					    }
					}
				})
				// console.log(index)

				function compareStrings(a, b) {
					a = a.toLowerCase();
					b = b.toLowerCase();
					return (a < b) ? -1 : (a > b) ? 1 : 0;
				}

				function compareValues(a, b) {
					return b - a 
				}

				filtered.sort(function(a, b) { 
					return compareValues(a.average_daily_visit, b.average_daily_visit);
					// return compareStrings(a.subject, b.subject);
					// return compareValues(a[sort], b[sort]);
				})

				filtered.unshift(head);

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
					return compareValues(a.average_daily_visit, b.average_daily_visit);
					// return compareStrings(a.subject, b.subject);
				})

				data.unshift(head);

				let template = Handlebars.compile(tpl); 
				$(target).html(template(data));
			});
		});
	}
	load_data();
}

$(document).ready(function() {
	articles();
	subjects();
});