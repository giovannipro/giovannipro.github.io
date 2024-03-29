// settings
const articles_url = "assets/data/articles.tsv";

const map_contaier = "map1";

const place_color = "#1F5BD1"; // #2a35f7
const issue_color = "#f95656";
const no_issue_color = "#5bcc5b";

const circle_min_size = 2;
const circle_max_size = 7;
const pg = 3.14;

const it_wiki = "https://it.wikipedia.org/wiki/";
const en_wiki = "https://en.wikipedia.org/wiki/";

const avg_size_it = 17992;
const avg_size_en = 4279;

// make the visualization
function dv1(){

	let map = L.map(map_contaier, {
		center: [42.21, 12.6],
		zoom: 6
	});

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 15,
		minZoom: 6,
		tileSize: 256
	}).addTo(map);

	function load_data(url){

		d3.tsv(url)
	  		.then(function(data) {
				console.log(data);

				// filter by inhabitants
				let p_min = inhabitants_range[0].a.min
				let p_max = inhabitants_range[0].a.max

				filter_inhabitants = data.filter(function(a,b){ 
					return +a.Popolazione >= p_min && +a.Popolazione <= p_max
				})

				function append_markers(dataset, language, feature){

					let scale = d3.scaleLinear()
						.range([circle_min_size,circle_max_size])

					let bounds = [];
					let min = 0;
					let max = 0;
					let max_issue = 0;
				
					if (language == "it") {					
						if (feature == "size") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_pDim/pg);
							})
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_pDim/pg);
							})
							avg_size = d3.mean(filter_inhabitants, function(d) { 
								return Math.floor(+d.it_pDim);
							})
						}
						else if (feature == "issues") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_aNum/pg);
							})
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_aNum/pg);
							})
							max_issue = d3.max(filter_inhabitants, function(d) { 
								return +d.it_aNum;
							})
						}
						else if (feature == "references") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_bNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_bNum/pg);
							})
						}
						else if (feature == "notes") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_nNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_nNum/pg);
							})
						}
						else if (feature == "monuments") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_mNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_mNum/pg);
							})
						}
						else if (feature == "monuments_size") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_mDim/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.it_mDim/pg);
							})
						}
						else if (feature == "images") {
							min = d3.min(filter_inhabitants, function(d) { 
								images = (+d.it_svg) + (+d.it_jpg) + (+d.it_png) + (+d.it_gif) + (+d.it_tif) + (+d.it_mAltri);
								return Math.sqrt(images/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								images = (+d.it_svg) + (+d.it_jpg) + (+d.it_png) + (+d.it_gif) + (+d.it_tif) + (+d.it_mAltri);
								return Math.sqrt(images/pg);
							})
						}
						else if (feature == "monuments_WLM") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.Beni_WLM/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.Beni_WLM/pg);
							})
						}
					}
					else {	
						if (feature == "size") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_pDim/pg);
							})
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_pDim/pg);
							})

							avg_size = d3.mean(filter_inhabitants, function(d) { 
								return Math.floor(+d.en_pDim);
							})
						}
						else if (feature == "issues") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_aNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_aNum/pg);
							})

							max_issue = d3.max(filter_inhabitants, function(d) { 
								return +d.en_aNum;
							})
						}
						else if (feature == "references") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_bNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_bNum/pg);
							})
						}
						else if (feature == "notes") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_nNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_nNum/pg);
							})
						}
						else if (feature == "monuments") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_mNum/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_mNum/pg);
							})
						}
						else if (feature == "monuments_size") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_mDim/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.en_mDim/pg);
							})
						}
						else if (feature == "images") {
							min = d3.min(filter_inhabitants, function(d) { 
								images = (+d.en_svg) + (+d.en_jpg) + (+d.en_png) + (+d.en_gif) + (+d.en_tif) + (+d.en_mAltri);
								return Math.sqrt(images/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								images = (+d.en_svg) + (+d.en_jpg) + (+d.en_png) + (+d.en_gif) + (+d.en_tif) + (+d.en_mAltri);
								return Math.sqrt(images/pg);
							})
						}
						else if (feature == "monuments_WLM") {
							min = d3.min(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.Beni_WLM/pg);
							})
							
							max = d3.max(filter_inhabitants, function(d) { 
								return Math.sqrt(+d.Beni_WLM/pg);
							})
						}
					}

					scale.domain([min,max]);

					let issue_color_scale = d3.scaleLinear()
						.domain([0,max_issue])
						.range([no_issue_color,issue_color])
					
					dataset.forEach(function (a,b) {

						let lat = a.lat;
						let lon = a.lon;
						let prov = a.Sigla;
						let inhabitants = +a.Popolazione;
						let feature_text;

						if (language == "it") {
							name = a.it_Titolo;
							size = +a.it_pDim;

							issues = +a.it_aNum;
							issue_verifica = +a.it_verifica;
							issues_correggere = +a.it_correggere;
							issues_curiosita = +a.it_curiosita;
							issues_dividere = +a.it_dividere;
							issues_notabile = +a.it_notabile;
							issues_noReferenze = +a.it_noReferenze;
							issues_noNote = +a.it_noNote;
							issues_organizzare = +a.it_organizzare;
							issues_pov = +a.it_pov;
							issues_recentismo = +a.it_recentismo;
							issues_stub = +a.it_stub;
							issues_noFonte = +a.it_noFonte;
							issues_noInfobox = +a.it_noInfobox;
							issues_wikify = +a.it_wikify;

							references = +a.it_bNum;
							notes = +a.it_nNum;
							monuments = +a.it_mNum;
							monuments_size = +a.it_mDim;

							images_svg = +a.it_svg;
							images_jpg = +a.it_jpg;
							images_png = +a.it_png;
							images_gif = +a.it_gif;
							images_tif = +a.it_tif;
							images_oth = +a.it_mAltri;
							images = images_svg + images_jpg + images_png + images_gif + images_tif + images_oth;

							monuments_section = a.it_mSezioni.split("|");

							monumenti_wikidata = +a.Beni_Wikidata;
							WLM = +a.Beni_WLM;
						}
						else {
							name = a.en_Titolo;
							size = +a.en_pDim;
							
							issues = +a.en_aNum;
							issue_verifica = +a.en_verifica;
							issues_correggere = +a.en_correggere;
							issues_curiosita = +a.en_curiosita;
							issues_dividere = +a.en_dividere;
							issues_notabile = +a.en_notabile;
							issues_noReferenze = +a.en_noReferenze;
							issues_noNote = +a.en_noNote;
							issues_organizzare = +a.en_organizzare;
							issues_pov = +a.en_pov;
							issues_recentismo = +a.en_recentismo;
							issues_stub = +a.en_stub;
							issues_noFonte = +a.en_noFonte;
							issues_noInfobox = +a.en_noInfobox;
							issues_wikify = +a.en_wikify;

							references = +a.en_bNum;
							notes = +a.en_nNum;
							monuments = +a.en_mNum;
							monuments_size = +a.en_mDim;

							images_svg = +a.en_svg;
							images_jpg = +a.en_jpg;
							images_png = +a.en_png;
							images_gif = +a.en_gif;
							images_tif = +a.en_tif;
							images_oth = +a.en_mAltri;
							images = images_svg + images_jpg + images_png + images_gif + images_tif + images_oth;

							monuments_section = a.en_mSezioni.split("|");

							monumenti_wikidata = +a.Beni_Wikidata;
							WLM = +a.Beni_WLM;
						}
						// console.log(name, monumenti_wikidata)

						let fill_opacity = 0.3;
						let stroke_opacity = 0.8;

						if (feature == "size"){
							let diff; 
							let sign;
							if (avg_size >= size) {
								diff = avg_size - size
								sign = "-"	
							}
							else {
								diff = size - avg_size;
								sign = "+"	
							}

							let diff100 = Math.round(diff*100/avg_size,1).toLocaleString();

							// size
							feature_text = size.toLocaleString() + " byte";

							feature_text += "<br><table><tr><th clas='label'>" + sign + diff100 + "% rispetto a media italiana<th></tr>"
						}
						else if (feature == "issues") {

							if (issues > 0){
								if (issues == 1){
									feature_text = issues + " avviso:";
								}
								else {
									feature_text = issues + " avvisi:";
								}

								feature_text += "<table>"

								if (issue_verifica > 0){
									feature_text += "<tr><td>" + "- verifica sorgente" + "</td></tr>"
								}
								if (issues_correggere > 0){
									feature_text += "<tr><td>" + "- correggere" + "</td></tr>"
								}
								if (issues_curiosita > 0){
									feature_text += "<tr><td>" + "- curiosità" + "</td></tr>"
								}
								if (issues_dividere > 0){
									feature_text += "<tr><td>" + "- dividere" + "</td></tr>"
								}
								if (issues_notabile > 0){
									feature_text += "<tr><td>" + "- notabilità" + "</td></tr>"
								}
								if (issues_noReferenze > 0){
									feature_text += "<tr><td>" + "- senza referenze" + "</td></tr>"
								}
								if (issues_noNote > 0){
									feature_text += "<tr><td>" + "- senza note" + "</td></tr>" 
								}
								if (issues_organizzare > 0){
									feature_text += "<tr><td>" + "- organizzare" + "</td></tr>"
								}
								if (issues_pov > 0){
									feature_text += "<tr><td>" + "- POV" + "</td></tr>"
								}
								if (issues_recentismo > 0){
									feature_text += "<tr><td>" + "- recentismo" + "</td></tr>"
								}
								if (issues_stub > 0){
									feature_text += "<tr><td>" + "- stub" + "</td></tr>"
								}
								if (issues_noFonte > 0){
									feature_text += "<tr><td>" + "- senza fonte" + "</td></tr>"
								}
								if (issues_noInfobox > 0){
									feature_text += "<tr><td>" + "- necessario infobox" + "</td></tr>"
								}
								if (issues_wikify > 0){
									feature_text += "<tr><td>" + "- wikificare" + "</td></tr>"
								}

								feature_text += "</table>"
							}
							else {
								feature_text = "0 avvisi";
								fill_opacity = 0.2
								stroke_opacity = 0.1
							}
						}
						else if (feature == "references") {
							feature_text = references + " riferimenti bibliografici";
						}
						else if (feature == "notes") {
							feature_text = notes + " note";
						}
						else if (feature == "monuments") {
							if (monuments > 0){

								if (monuments == 1){
									feature_text =  monuments + " sezione monumenti:"
								}
								else {
									feature_text =  monuments + " sezioni monumenti:"
								}	

								feature_text += "<table>" 

								monuments_section.forEach(function (a,b) {
									feature_text += ("<tr><td class='label'>- " + a + "</td></tr>")
								})

								feature_text += "</table>" 
							}
							else {
								feature_text = "0 sezioni monumenti"
							}
						}
						else if (feature == "monuments_size") {
							feature_text = "dimensione delle sezioni monumenti"
							feature_text += "</br>" + monuments_size.toLocaleString() + " byte";
						}
						else if (feature == "images") {
							feature_text = images + " immagini:";

							feature_text += "<table>" 

							if (images_svg > 0){
								feature_text += "<tr><td class='label'>- svg</td>" + "<td class='value'>" + images_svg + "</td>"
							}
							if (images_jpg > 0){
								feature_text += "<tr><td class='label'>- jpg</td>" + "<td class='value'>" + images_jpg + "</td>"
							}
							if (images_png > 0){
								feature_text += "<tr><td class='label'>- png</td>" + "<td class='value'>" + images_png + "</td>"
							}
							if (images_gif > 0){
								feature_text += "<tr><td class='label'>- gif</td>" + "<td class='value'>" + images_gif + "</td>"
							}
							if (images_tif > 0){
								feature_text += "<tr><td class='label'>- tif</td>" + "<td class='value'>" + images_tif + "</td>"
							}
							if (images_oth > 0){
								feature_text += "<tr><td class='label'>- altri formati</td>" + "<td class='value'>" + images_oth + "</td>"
							}

							feature_text += "</table>" 
						}
						else if (feature == "monuments_WLM"){
							WLM_relig = 0;
							if (a.Beni_religiosi_WLM !== ""){
								WLM_relig = +a.Beni_religiosi_WLM
							}
							else {
								WLM_relig = 0
							}
							
							feature_text = monumenti_wikidata + " monumenti su Wikidata"

							if (monumenti_wikidata > 0) {
								feature_text +=  ":<br/><table><tr><td class='label'>- fotografabili" + "<td class='value'>" + WLM + "</td></tr>"

								if (WLM_relig !== 0){
									feature_text += "<tr><td class='label'>- fotografabili religiosi</th>" + "<td class='value'>" + WLM_relig + "</td></th>"
								}

								if ((monumenti_wikidata - WLM) > 0) {
 									feature_text +=  "<tr><td class='label'>- non fotografabili</td>" + "<td class='value'>" + (monumenti_wikidata - WLM) + "</td></tr>"
								}

								feature_text += "</table>"
							}
						}

						let tooltip_text = name + " (" + prov + ")<br/>" + inhabitants.toLocaleString() + " abitanti<br/><br/>" + feature_text;

						let radius;
						if (feature == "size"){
							radius = scale(size/200);
							color = place_color;
						}
						else if (feature == "issues") {
							radius = scale(issues);
							color = issue_color_scale(issues);
						}
						else if (feature == "references"){
							radius = scale(references/3);
							color = place_color;
						}
						else if (feature == "notes"){
							radius = scale(notes/7);
							color = place_color;
						}
						else if (feature == "monuments"){
							radius = scale(monuments/2);
							color = place_color;
						}
						else if (feature == "monuments_size"){
							radius = scale(monuments_size/100);
							color = place_color;
						}
						else if (feature == "images"){
							radius = scale(images/5);
							color = place_color;
						}
						else if (feature == "monuments_WLM"){
							radius = scale(monumenti_wikidata/15); // WLM 3.5 /6
							color = place_color;
							// console.log(WLM,WLM_relig)
						}

						bounds.push([lat,lon])

						let place = L.circleMarker([lat, lon], {
							color: color,
							fillColor: color,							
							fillOpacity: fill_opacity,
							opacity: stroke_opacity,
							radius: radius,
							className: "place",
							id: "place_" + b
						})
					   	.bindTooltip( tooltip_text , {
							permanent: false,
							interactive: true,
							noWrap: true,
							opacity: 0.9
						})
						.addTo(map)
						.on('click', onClick);

						place.on('mouseover', mouseover);
						place.on('mouseout', mouseleave);

						function mouseover() {
							this.openTooltip();
							place.setStyle({opacity: 1, fillOpacity: 0.8});
						}

						function mouseleave() {
							place.setStyle({opacity: 0.8, fillOpacity: 0.5});
						}

						function onClick() {
							let url;
							if (language == "it"){
								url = it_wiki + a.it_Titolo;
							}
							else {
								url = en_wiki + a.en_Titolo;
							}
							window.open(url);
						}
					})

					map.fitBounds(bounds, {
						"padding": [80, 80],
						"animate": true,
					    "duration": 2
					});		
					// console.log(map);
				}

				append_markers(filter_inhabitants, "it", "size");

				$("#region").change(function() {
					region = this.value;
					language =  $("#language option:selected").val();
					inhabitants =  $("#inhabitants option:selected").val();
					feature =  $("#feature option:selected").val();
					// console.log(language, region, inhabitants, feature)

					// filter by region
					if (region !== "all"){
						filter_region = data.filter(function(a,b){ 
							return a.Regione == region
						})
					}
					else {
						filter_region = data
					}

					// filter by inhabitants
					filter_inhabitants = filter_region.filter(function(a,b){ 
						return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
					})

					$(".place").remove();
					append_markers(filter_inhabitants, language, feature);
				});

				$("#inhabitants").change(function() {
					inhabitants = this.value;
					language = $("#language option:selected").val();
					region = $("#region option:selected").val();
					feature =  $("#feature option:selected").val();
					// console.log(language, region, inhabitants, feature)

					// filter by region
					if (region !== "all"){
						filter_region = data.filter(function(a,b){ 
							return a.Regione == region
						})
					}
					else {
						filter_region = data
					}

					// filter by inhabitants
					filter_inhabitants = filter_region.filter(function(a,b){ 
						return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
					})
					
					$(".place").remove();
					append_markers(filter_inhabitants, language, feature);
				});

				$("#feature").change(function() {
					feature = this.value;
					language = $("#language option:selected").val();
					region =  $("#region option:selected").val();
					inhabitants = $("#inhabitants option:selected").val();
					// console.log(language, region, inhabitants, feature)

					// filter by region
					if (region !== "all"){
						filter_region = data.filter(function(a,b){ 
							return a.Regione == region
						})
					}
					else {
						filter_region = data
					}

					// filter by inhabitants
					filter_inhabitants = filter_region.filter(function(a,b){ 
						return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
					})

					$(".place").remove();
					append_markers(filter_inhabitants, language, feature);
				});

				$("#language").change(function() {
					language = this.value;
					region = $("#region option:selected").val();
					inhabitants = $("#inhabitants option:selected").val();
					feature =  $("#feature option:selected").val();
					// console.log(language, region, inhabitants, feature)

					// filter by region
					if (region !== "all"){
						filter_region = data.filter(function(a,b){ 
							return a.Regione == region
						})
					}
					else {
						filter_region = data
					}

					// filter by inhabitants
					filter_inhabitants = filter_region.filter(function(a,b){ 
						return +a.Popolazione >= the_inhabitants(inhabitants)[0] && +a.Popolazione <= the_inhabitants(inhabitants)[1]
					})

					$(".place").remove();
					append_markers(filter_inhabitants, language, feature);
				});

		})

	}

  	// .catch(function(error) {
   //  	console.log("some error occurred")
  	// });

  	load_data(articles_url);
}

$(document).ready(function() {
	dv1();
})

