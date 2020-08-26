function articles() {

	let template_source = 'assets/tpl/articles.tpl';
	let data_source = 'assets/data/articles.json';
	let target = '#articles';

	$.get( template_source , function(tpl) {
		$.getJSON( data_source , function(data) {
			let template = Handlebars.compile(tpl);
			$(target).html(template(data));
		});
	});
}

$(document).ready(function() {
	articles();
});