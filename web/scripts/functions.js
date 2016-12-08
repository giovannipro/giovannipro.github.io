function sum_range(data){
    //console.log(data)

    var a_1 = 0;
    var a_2 = 0;
    var a_3 = 0;
    var a_4 = 0;

    var a = 70000000;
    var b = 50000000;
    var c = 5000000;  

    var container = $("#result");

    $.each(data, function (i, v) {
        
        var val = v.img_size
        
        if (val > a){
            a_1++
        }
        else if (val > b && val < a){
            a_2++
        }
        else if (val > c && val < b){
            a_3++
        }
        else if (val < c){
            a_4++
        }
        else {
            console.log("error")
        }
    });

    container.append("a_1: ",a_1 + ",")
    container.append("a_2: ",a_2 + ",")
    container.append("a_3: ",a_3 + ",")
    container.append("a_4: ",a_4)
}

function get_file() {

    var file = document.getElementById("input_file").files[0];
    var func = $("#function").val();

    //console.log(func)

    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            //document.getElementById("result").innerHTML = evt.target.result;

            var value_name = $("#value").val();
            //console.log(value_name)

            data = evt.target.result;
            //json = JSON.stringify(eval(data));
            json = jQuery.parseJSON(data);
            //console.log(json)

            if (func == "sum") {
                sum_range(json)
                //console.log("load")
            }
        }
        reader.onerror = function (evt) {
            //document.getElementById("result").innerHTML = "error reading file";
            console.log("error reading file")
        }
    }
}

function get_random(){
    var tot = document.getElementById("tot_values").value;
    var min = document.getElementById("min").value;
    var max = document.getElementById("max").value;

    console.log(tot)
    var container = $("#result_random");

    data = [];

    for(var i=0; i<tot; i++){
        data.push(
            Math.ceil(Math.random() * (max - min) + min)
        )
    };
    console.log(data)
    container.append(JSON.stringify(data))
}

function rgb2hex(rgb){
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(rgb);
    //console.log(digits)

    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);

    var rgb = blue | (green << 8) | (red << 16);
    var hex =  digits[1] + '#' + rgb.toString(16);
    //console.log(hex)

    var container = $("#result_color");
    container.empty()
    container.append(hex).css("background-color",hex)

}

function hex2rgb(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        rgba = 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
        console.log(rgba)

        var container = $("#result_color");
        container.empty()
        container.append(rgba).css("background-color",rgba)
    }
}

function rgb_to_hex(){
    var rgb = document.getElementById("rgb_color").value;
    //console.log(rgb)

    rgb2hex(rgb);
}

function hex_to_rgb(){
    var hex = document.getElementById("hex_color").value;
    //console.log(hex)

    hex2rgb(hex);
}






