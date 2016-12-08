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
