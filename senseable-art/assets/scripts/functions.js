function img(){

	$("#img_box").empty();

	var img = document.createElement("img");
	img.src = "assets/img/snail_1924.jpg";

	var src = document.getElementById("img_box");
	src.appendChild(img);
}

function caman(contrast){

	Caman('#img', function () {

		this.contrast(contrast);
		//this.brightness(brightness);
		this.render();

		//console.log(brightness + "," + contrast + "," + saturation)
 	});
}

function get_data(){

	$(".contrast [type=range]").change(function() {
    	contrast = $(this).val();
    	$("#contrast_value").text(contrast);
    	
    	caman(contrast)
    	console.log(contrast)
	})

	$(".brightness [type=range]").change(function() {
    	brightness = $(this).val();
    	$("#contrast_value").text(brightness);
    	
    	//img();
    	caman(contrast);
    	console.log(brightness);
	})

}

$(document).ready(function(){
	get_data();
	//img();
})



