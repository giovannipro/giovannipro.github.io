function sum_range(data){

    var a_1 = 0;
    var a_2 = 0;
    var a_3 = 0;
    var a_4 = 0;
    var a_5 = 0;
    var a_6 = 0;

    var container = document.getElementById("#output");

    $.each(data, function (index, value) {
        
        var img_size = value.img_size
        
        var a = 50000000; //  bite 60000000 - kilobyte 60000
        var b = 40000000;
        var c = 30000000;
        var d = 20000000;
        var e = 10000000;
        var f = 9000000;
        
        if (img_size > a){
            a_1++
        }
        else if (img_size > b && img_size < a){
            a_2++
        }
        else if (img_size > c && img_size < b){
            a_3++
        }
        else if (img_size > d && img_size < c){
            a_4++
        }
        else if (img_size > e && img_size < d){
            a_5++
        }
        else if (img_size < f ) {
            a_6++
        }
        else {
            console.log("error")
        }
    });

    console.log("a_1: ",a_1)
    console.log("a_2: ",a_2)
    console.log("a_3: ",a_3)
    console.log("a_4: ",a_4)
    console.log("a_5: ",a_5)   
    console.log("a_6: ",a_6)     
}

function parsing(){
    //console.log("ok")
    data_location = "assets/data/upload.json"

    $.ajax({
		dataType: "json",
		url: data_location,
        beforeSend: function(){
        },
        success: function(data) {
            //console.log(data)
            sum_range(data)
        },
        fail: function() {
            console.log("error")
        }
    })
}