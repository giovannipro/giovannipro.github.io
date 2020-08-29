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
	    "incipit_size": "incipit/size",
	    "issues": "issues",
	    "notes": "notes",
	    "images": "images"
	};

	$.get(template_source, function(tpl) {
		$.getJSON(data_source, function(data) {
			// console.log(data)

			// var dataArray = [];
			// for (item in data) {
			//     var size = data[size];
			//     dataArray.push({size: parseInt(size)});
			// }

			// data.sort(function(a, b) {
			//     var x = a.size, y = b.size;
			//     return x < y ? -1 : x > y ? 1 : 0;
			// });

			// var objSorted = {}
			// sortable.forEach(function(item){
			//     objSorted[item[0]]=item[1]
			// })

			// let sort = [];

			// for (var item in data) {
			//     sort.push([item, data[size]]);
			// }

			// sort.sort(function(a, b) {
			//     return a[1] - b[1];
			// });



			// data.sort(function(a, b){
			// });
			    // return data.subject - data.subject;

			// let sorted = data.sort(function (a, b) {
			// 	let subject_order = a.subject - b.subject
			// // 	// let article_order = a.article - b.article 
			// // 	// let size_order = b.size - a.size 
			// // 	// let visit_order = b.average_daily_visit - a.average_daily_visit  
			//     return  subject_order //|| article_order // || b.size - a.size  // || || b.article - a.article
			//     // return  b.subject - a.subject
			// });
			// // console.log(sorted)

			// console.log(sort);

			// let filter = sorted.filter(function (entry) {
			//     return entry.subject == "Storia";
			// });

			// let the_data = filter.unshift(head);
			data.unshift(head);
			// console.log(the_data)

			let template = Handlebars.compile(tpl); 
			$(target).html(template(data));
		});
	});
}


$(document).ready(function() {
	articles();
});