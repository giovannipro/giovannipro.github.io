// settings
const articles_url = "../assets/data/articles.tsv";

// make the visualization
function dv2(){
	console.log("start")

	function load_data(url){

		d3.tsv(url)
	  		.then(function(data) {
	  			console.log(data)

	  			let region_articles = [];

	  			let region_group = d3.nest()
					.key(d => d.Regione)
					.entries(data)
				console.log(region_group)

				let the_region = "Sicilia";

				// filter region
				for (const [d,c] of Object.entries(region_group)) {

					if (the_region == "all"){

						if (c.key !== "-"){
							let values = c.Regione

							values.forEach(function (d,i) {
								region_articles.push(d)
							})
						}
					}
					else {
						if (c.key == the_region){
							region_articles = c.values;
						}
					}
				}
				console.log(region_articles);

	  		})

			// .catch(function(error) {
		 //    	console.log("some error occurred")
		 //  	});

	}

	load_data(articles_url);
}

$(document).ready(function() {
	dv2();
})