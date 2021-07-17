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

function precentage(num,tot){
	let perc = (num*100)/tot
	return parseFloat(perc.toFixed(2)) + "%";
}

function variation_perc(now,prev,parameter){
	let variation = now - prev;
	let perc; 
	let output;
    if (variation > 0){
    	perc = (((now/prev)-1)*100)
	}
	else {
		perc = (100-(now*100)/prev)
	}

	if (perc <= 0.5 && perc >=-0.5){
		output = perc.toFixed(1) + "%";
	}
	else if (variation == 0){
		output = "-"
	}
	else {
		output = Math.floor(perc).toLocaleString() + "%";
	}

	if (variation > 0){
		output = "+" + output; 
	}
	else if (variation == 0){
		output = output
	}
	else {
		output = "-" + output; 
	}
    return output;
}

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
 	let the_path = "";

	$("#mobile_menu_icon").click(function(){

		let display = $("#mobile_menu_icon").css('display')
		// console.log(display)

		if (open == false) {

			let path = window.location.pathname;
			
			if (path.indexOf("autori") == -1 || path.indexOf("avvisi") == -1){
				the_path = "";
			}
			else {
				the_path = "../";
			}

			$("#mobile_menu_icon").css("background","url(" + the_path + "assets/img/close-menu.svg) center center no-repeat").css("background-size","55%");
			$("#mobile_menu_box").show()
			open = true;
		}
		else {
			$("#mobile_menu_icon").css("background","url(" + the_path + "assets/img/mobile-menu.svg) center center no-repeat").css("background-size","55%");			
			$("#mobile_menu_box").hide()
			open = false;
		}
	})
}

function mobile_filter() {
 	let open = false;
	let the_path = "";


	$("#mobile_filter_icon").click(function(){
		let path = window.location.pathname;
		
		if (open == false) {

			if (path.indexOf("avvisi") == -1 && path.indexOf("autori") == -1){ 
				the_path = path;
			}
			else {
				the_path = "../";
			}
			// console.log(path,the_path + "assets/img/arrow-up.svg")

			$("#mobile_filter_icon").css("background","url(" + the_path + "assets/img/arrow-up.svg) center center no-repeat").css("background-size","55%");
			$("#select_box").show()
			$("#select_box").css("display","flex")
			open = true;
		}
		else {
			$("#mobile_filter_icon").css("background","url(" + the_path + "assets/img/arrow-down.svg) center center no-repeat").css("background-size","55%");			
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

$(document).ready(function() {
	mobile_menu();
	mobile_filter();

	get_statistics();
})