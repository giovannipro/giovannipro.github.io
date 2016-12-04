app.controller("main_controller", function($scope,$http) {

    // index
    $http.get("assets/data/data.json")
    .then(function(response) {
        $scope.data = response.data;
        //console.log(response.data)
    },
    function myError(response) {
        $scope.data = response.statusText;
        console.log("error to load index")
    });

});