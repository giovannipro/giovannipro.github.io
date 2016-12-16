function img(){
	var img = "assets/img/snail_1924.jpg";
	var	box = "#img_box";

	Caman(box, img, function () {
  		// manipulate image here
  		//this.contrast(0)
  		this.render();
	});
	console.log()
}

function update(contrast){
	Caman("#img_box", function () {
		this.exposure();

		this.newLayer(function () {
			this.setBlendingMode("multiply");
			this.filter.contrast(contrast); //this.contrast(contrast);
		})

		this.clip(10);
		this.render();
		console.log()
 	});
}

function get_data(){

	$(".contrast [type=range]").change(function() {
		contrast = Number($(this).val());
		$("#contrast_value").text(contrast);
		
		update(contrast);
		console.log(contrast)
	})
}

/*
function grafi_js(){
	
	var img = new Image()
  	img.src = "assets/img/snail_1924.jpg";

  	var canvas = document.createElement("canvas");
  	var bright = document.getElementById("bright");

  	canvas.width = img.width
	canvas.height = img.height
	console.log(img)
}
*/
files = [];
old_files = [];

function get_images() {

	var getUrl = window.location;
	var folder =  "assets/img/";
	var fileextension = ".jpg";
	var interval = 1000;
	console.log()

	setInterval(function(){

		var b = window.pageYOffset;
		//console.log(b)

		

		$.ajax({
			url: folder,
			cache: false,
			beforeSend: function(){
				//$("#gallery").fadeIn(100)
		 		//$("#gallery").empty();  
			},
			success: function(data) {
				//console.log(data)
				
				files = $(data).find("a:contains(" + fileextension + ")");
				//console.log(files)
				
				if (old_files.length != files.length){
					$("#gallery").empty(); 

					imgs = [];
					dida = [];
					var items = 0;
					var index = 0;

					files.each(function () {
						var filename = this.href.replace(getUrl,"").replace(folder,"");
						img_src = folder + filename;
						img_file = "<img src='" + img_src + "' alt='" + filename + "' id='" + filename + "' class='g_img'>";

						file = filename.replace(".jpg","");
			   			contrast = Number(file.split("-")[1]);
						brightness = Number(file.split("-")[2])-100;

						if (brightness > 0) {
							brightness = "+" + brightness;
						}

			   			d_ = "<p class='dida'><i class='fa fa-adjust' aria-hidden='true'></i> " + contrast + "x, <i class='fa fa-sun-o' aria-hidden='true'></i> " + brightness + "%</p>";

			   			imgs.push(img_file);
			   			dida.push(d_);
			   		});

			   		imgs.reverse();
			   		dida.reverse();
			   		
			   		if (imgs.lenght < 10){
			   			items = imgs.lenght;
			   		}
			   		else{
			   			items = 10;
			   		}
					for (i = 0; i < items; i++) { 

						var html = "<div class='thumb'>" + (imgs[i]) + (dida[i]) + "</div>";
						$("#gallery").append(html);
					}
					
			   		window.scroll(0, b); // x,y
			   	
			   		old_files = files;
			   		//console.log(old_files)
			   	}
			},
			fail: function() {
				console.log("error")
		   }
		})
	}, interval);
}

$(document).ready(function(){
	//img();
	//get_data();
	get_images();
})
