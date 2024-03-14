let lang;
let footer_it;
let footer_en;
let footer = document.getElementById('footer');

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function apply_color(subject){
	let color;

	if (subject == "Letteratura italiana"  || subject == "Letteratura latina" || subject == "Storia" || subject == "Storia dell'arte" || subject == "Filosofia" || subject == "Grammatica italiana" || subject == "Grammatica latina") {
		color = "#ef95c4"; //"#eeb4ee";
	}
	else if (subject == "Informatica" || subject == "Tecnologia"){
		color = "#3a34e0"; // "blue";
	}
	else if (subject == "Geografia"  || subject == "Diritto e Economia" || subject == "Cittadinanza e costituzione"){
		color = "#00b2ff";
	}
	else { // Biologia Chimica Fisica Matematica Scienze della Terra Scienze
		color = "green";
	}
	return color;
}

function format_date(date){
	if (date != 0) {
		const year = date.substring(0,4);
		const month = date.substring(5,7);
		const day = date.substring(8,10);
		return day + "-" + month + "-" + year
	}
	else {
		return "-"
	}
}

function precentage(num,tot){
	let perc = (num*100)/tot
	return parseFloat(perc.toFixed(2)) + "%";
}

function variation_perc(now,prev,parameter){
	let variation = now - prev;
	let limit = 0.5;
	let perc; 
	let output;
	let style;

	// variation percentage
    if (variation > 0){
    	perc = (((now/prev)-1)*100)
    	s = '+'
	}
	else {
		perc = (100-(now*100)/prev)
		s = '-'
	}

	// sign and style
	if (perc > limit && s == '+'){
		if (parameter == 'issues'){
			sign = '+'; 
			style = 'decrease';
		}
		else {
			sign = '+'; 
			style = 'increase';
		}
	}
	else if (perc < limit && perc > -limit) {
		sign = ''; 
		style = 'stable';
	}
	else {
		if (parameter == 'issues'){
			sign = '-'; 
			style = 'increase';
		}
		else {
			sign = "-"; 
			style = 'decrease';
		}
	}

	// output
	if (now == 0 && prev == 0) {
		output = '-' ;
		style = 'stable';
	}
	else {
		// console.log(perc)
		if (perc == Infinity){
			output = '(' + sign + variation + ')';
		}
		// else if (perc == -Infinity){
		// 	output = '(' + '-' + variation + ')';
		// }

		else if (perc > limit){
			output = '(' + sign + perc.toFixed(1) + '%)';
		}
		else if (perc < limit && perc > -limit) {
			output = '-' ;
		}
		else {
			output = '(' + sign + perc.toFixed(1) + '%)';
		}
	}

	return [style, output]
    // return [style, output  + ' ' + prev + ' '  + now];
}

// console.log(variation_perc(0,8,'images'))

const subjects = [
	"Tutte le materie",
	"Biologia",
	"Chimica",
	"Cittadinanza e costituzione",
	"Diritto e Economia",
	"Filosofia",
	"Fisica",
	"Geografia",
	"Grammatica italiana",
	"Grammatica latina",
	"Informatica",
	"Letteratura italiana",
	"Letteratura latina",
	"Matematica",
	"Scienze della Terra",
	"Scienze",
	"Storia",
	"Tecnologia"
]

// const literature_ = [
// 	"it",
// 	"la"
// ]

function mobile_menu() {
 	let open = false;
 	let the_path;

	$("#mobile_menu_icon").click(function(){

		let display = $("#mobile_menu_icon").css('display')
		// console.log(display)

		if (open == false) {

			let path = window.location.pathname;
			
			if (path.indexOf("autori") != -1 || path.indexOf("avvisi") != -1){
				$("#mobile_menu_icon").css("background","url('../assets/img/close-menu.svg') center center no-repeat").css("background-size","55%");
			}
			else {
				$("#mobile_menu_icon").css("background","url('assets/img/close-menu.svg') center center no-repeat").css("background-size","55%");
			}
			console.log(path,the_path)

			$("#mobile_menu_box").show()
			open = true;
		}
		else {
			if (path.indexOf("autori") != -1 || path.indexOf("avvisi") != -1){
				$("#mobile_menu_icon").css("background","url('../assets/img/mobile-menu.svg') center center no-repeat").css("background-size","55%");			
			}
			else {
				$("#mobile_menu_icon").css("background","url('assets/img/mobile-menu.svg') center center no-repeat").css("background-size","55%");							
			}
			$("#mobile_menu_box").hide()
			open = false;
		}
	})
}

function mobile_filter() {
 	let open = false;
	let the_path;

	$("#mobile_filter_icon").click(function(){
		let path = window.location.pathname;
		
		if (open == false) {

			if (path.indexOf("avvisi") != -1 || path.indexOf("autori") != -1){ 
				$("#mobile_filter_icon").css("background","url('../assets/img/arrow-up.svg') center center no-repeat").css("background-size","55%");
			}
			else {
				$("#mobile_filter_icon").css("background","url('assets/img/arrow-up.svg') center center no-repeat").css("background-size","55%");
			}

			$("#select_box").show()
			$("#select_box").css("display","flex")
			open = true;
		}
		else {
			if (path.indexOf("avvisi") != -1 || path.indexOf("autori") != -1){ 
				$("#mobile_filter_icon").css("background","url('../assets/img/arrow-down.svg') center center no-repeat").css("background-size","55%");			
			}
			else {
				$("#mobile_filter_icon").css("background","url('assets/img/arrow-down.svg') center center no-repeat").css("background-size","55%");			
			}
			$("#select_box").hide()
			open = false;
		}
	})
}

function get_statistics(){
	window.addEventListener("keydown", function(e) {
		
		if(e.key == "s"){
			// console.log("statistics");

			let path = window.location.pathname;
			let year = parseInt($("#year option:selected").val());

			if (path.indexOf("avvisi") == -1 && path.indexOf("autori") == -1){ 
				the_path = "";
			}
			else {
				the_path = "../";
			}

			d3.tsv(the_path + "assets/data/voci_" + year + ".tsv").then(loaded)

			function loaded(data) {
				// console.log(data);

				let articles = 0;
				data.forEach(function (d,i) {
					articles += 1;
					d.size = +d.size;
				})

				let subject_group = d3.nest()
					.key(d => d.subject)
					.entries(data)

				console.group();
				console.log("articoli",articles)

				subject_group = subject_group.sort(function(x, y){
					return d3.descending(x.values.length, y.values.length);
				})

				subject_group.forEach(function (d,i) {
					console.log(d.key,d.values.length,precentage(d.values.length,articles))
				})

				// avg daily visit
				let avg_pv = d3.mean(data, function(d) { 
					return Math.round(d.avg_pv);
				})

				let avg_pv_prev = d3.mean(data, function(d) { 
					return Math.round(d.avg_pv_prev);
				})

				// size
				let avg_size = d3.mean(data, function(d) { 
					return d.size;
				})

				let avg_size_prev = d3.mean(data, function(d) { 
					return d.size_prev;
				})

				// incipit
				let avg_incipit = d3.mean(data, function(d) { 
					return d.incipit_size;
				})

				let avg_incipit_prev = d3.mean(data, function(d) { 
					return d.incipit_prev;
				})

				// discussion
				let avg_discussion = d3.mean(data, function(d) { 
					return d.discussion_size;
				})

				let avg_discussion_prev = d3.mean(data, function(d) { 
					return d.discussion_prev;
				})

				// issues
				let avg_issues = d3.mean(data, function(d) { 
					return d.issues;
				})

				let avg_issues_prev = d3.mean(data, function(d) { 
					return d.issues_prev;
				})

				// notes
				let avg_notes = d3.mean(data, function(d) { 
					return d.notes;
				})

				let avg_notes_prev = d3.mean(data, function(d) { 
					return d.notes_prev;
				})

				// images
				let avg_images = d3.mean(data, function(d) { 
					return d.images;
				})

				let avg_images_prev = d3.mean(data, function(d) { 
					return d.images_prev;
				})

				console.log("media visite giornaliere", Math.round(avg_pv), variation_perc(avg_pv,avg_pv_prev,"avg_pv"));

				console.log("media byte articolo", Math.round(avg_size), variation_perc(avg_size,avg_size_prev,"avg_size"));

				console.log("media byte incipit ", Math.round(avg_incipit), variation_perc(avg_incipit,avg_incipit_prev,"avg_incipit"));

				console.log("media byte pagina di discussione", Math.round(avg_discussion), variation_perc(avg_discussion,avg_discussion_prev,"avg_discussion"));

				console.log("media avvisi", parseFloat(avg_issues.toFixed(3)), variation_perc(avg_issues,avg_issues_prev,"avg_issues"));				

				console.log("media note", Math.round(avg_notes), variation_perc(avg_notes,avg_notes_prev,"avg_notes"));

				console.log("media immagini", Math.round(avg_images), variation_perc(avg_images,avg_images_prev,"avg_images"));
		
				console.groupEnd();
			}
		}
	})
}

function language() {
	const lang_button = document.getElementById("language");
	const lang_button_mobile = document.getElementById("language_mobile");
	let language_name = document.querySelectorAll(".language_name");

	let enContent = document.querySelectorAll(".en");
	let itContent = document.querySelectorAll(".it");

	let lang_switch = document.querySelectorAll(".lang_switch");
	let lang;

	lang_button.addEventListener("click", switch_language);
	lang_button_mobile.addEventListener("click", switch_language);

	// url
	const url = new URL(window.location.href);
	const base_url = location.protocol + '//' + location.host + location.pathname
	let params = new URLSearchParams(window.location.search);
	// console.log(base_url)

	function language_onload() {
		if (params.has('lang') == true) {
			lang = params.get('lang')
			// console.log(lang)

			if (lang == 'it') {
				lang = 'en'
			}
			else if (lang == 'en'){
				lang = 'it'
			}
			// console.log(lang)

			switch_language()
	  	}
	  	else {
	  		lang = "it"
	  	}
	}
	language_onload()

	function switch_language(){
		// update_footer();

		if (lang == "it") {

			lang = "en";

			// box with text
			enContent.forEach(box => {
				box.style.display = 'block';
			});
			itContent.forEach(box => {
				box.style.display = 'none';
			});

			// label
			language_name.forEach(box => {
				box.innerHTML = "IT";
			});

			// data attribute
			lang_switch.forEach(content => {
				let en = content.dataset.en
				let it = content.dataset.it

				content.textContent = en
			})
		} 
		else {
			
			lang = "it";

			// box with text
			enContent.forEach(box => {
				box.style.display = 'none';
			});
			itContent.forEach(box => {
				box.style.display = 'block';
			});

			// label
			language_name.forEach(box => {
				box.innerHTML = "EN";
			});

			// data attribute
			lang_switch.forEach(content => {
				let en = content.dataset.en
				let it = content.dataset.it

				content.textContent = it
			})
		}

		// url parameter
		params.set("lang", lang);
		newURL = base_url + "?lang=" + lang
		window.history.replaceState({}, '', newURL);

		path = window.location.pathname
		// console.log(path)

		if (path == '/'){ // homepage
			update_dv1_lang(lang)
		}
		else if (path.indexOf('autori') != -1){
			update_dv3_lang(lang)
		}

		if (path.indexOf('autori') == -1){
			update_sidebar_text()
		}

		// update stuff
		update_footer(lang)
		changeTitle(lang)
	}
}

function load_path(){
	const path = window.location.pathname

	if (path.indexOf("avvisi") == -1 && path.indexOf("autori") == -1){ 
		the_path = "";
	}
	else {
		the_path = "../";
	}
	return the_path
}

function load_footer(){

	let params = new URLSearchParams(window.location.search);
	if (params.has('lang') == true) {
		lang = params.get('lang')
	}
	
	let the_path = load_path()
	let footer_link = 'assets/content/footer.html'
	let url = the_path + footer_link;
	// console.log(url)
	
	fetch(url)
	    .then(response => {
	    	if (!response.ok) {
	        	throw new Error('Network response was not ok');
	    	}
	      	return response.text();
	    })
	    .then(data => {
	    	const tempElement = document.createElement('div');
      		tempElement.innerHTML = data;

      		footer_it = tempElement.querySelector('#footer_it');
      		footer_en = tempElement.querySelector('#footer_en');

      		if (lang == 'it'){
		      	the_footer = footer_it
      		}
	      	else {
      			the_footer = footer_en
      		}

		    footer.append(the_footer)
	    })
	    .catch(error => {
			console.error('There was a problem fetching the HTML:', error);
	    });
}
function update_footer(lang){	

	let new_footer;
	if (lang == 'it'){
		new_footer = footer_it
	}
	else {
		new_footer = footer_en
	}

	if (new_footer != undefined){
		footer.innerHTML = ''
		footer.append(new_footer)
	}
}

function changeTitle(lang) {
	const base = 'Wikipedia e scuola italiana'
	let title = document.title
	let page = title.split(' | ')[0];
	let newTitle;

	switch (page) {
		case 'Autori e pubblicazioni':
			newTitle = 'Authors and publications'
			break;
		case 'Authors and publications':
			newTitle = 'Autori e pubblicazioni'
			break;

		case 'Voci con avvisi':
			newTitle = 'Articles with issues'
			break;
		case 'Articles with issues':
			newTitle = 'Voci con avvisi'
			break;

		case 'Voci più viste':
			newTitle = 'Most viewed articles'
			break;
		case 'Most viewed articles':
			newTitle = 'Voci più viste'
			break;

		default:
			newTitle = page;
	}
	document.title = newTitle + ' | ' + base;
}

$(document).ready(function() {

	mobile_menu();
	mobile_filter();

	language();
	load_footer()	

	// get_statistics();
	
})