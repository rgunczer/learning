angular.module('myApp')
    .controller('myController', function($scope) {
        $scope.name = 'Joel';
        
        $scope.brokeOnIe11 = function() {
            var array = [1, 2, 3];
            array.find(function(item) {
                return item === 2;
            });
        };
    });