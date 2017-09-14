const app = angular.module('trivia', []);

app.controller('mainController', ['$http', function($http){
  const controller = this;
  this.url = 'http://localhost:3000/';
  this.text = 'poop';
  this.login = function(userPass) {
    $http({
      method: 'POST',
      url: this.url + 'users/login',
      data: { user: { username: userPass.username, password: userPass.password }},
    }).then(function(response){
      console.log(response)
    },function(error){
      console.log(error)
    })
  };
}])
