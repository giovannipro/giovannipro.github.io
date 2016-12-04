app.controller("note_controller", function($scope,$http) {

    // index
    $http.get("assets/data/notes.json")
    .then(function(response) {
        $scope.notes = response.notes;
        console.log(response)
    },
    function myError(response) {
        $scope.notes = response.statusText;
        console.log("error to load index")
    });

});