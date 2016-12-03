app.controller('main_controller', function($scope,$http) {

    // index
    $http.get("assets/data/notes.json")
    .then(function(response) {
        $scope.notes = response.data;
        console.log(response.data)
    },
    function myError(response) {
        $scope.notes = response.statusText;
        console.log('error to load index')
    });

});