const app = angular.module('trivia', []);

app.controller('mainController', ['$http', function($http){
  const controller = this;
  this.url = 'http://localhost:3000/';
  this.newUser = {};
  this.loggedUser = {};
  this.users = {};
  this.nextQuestionCategory = '';
  this.nextQuestionDifficulty = '';
  this.createUser = function(){
    $http({
      method: 'POST',
      url: this.url + 'users',
      data: { user: this.newUser },
    }).then(function(response){
      controller.login();
    })
  };
  this.login = function() {
    $http({
      method: 'POST',
      url: this.url + 'users/login',
      data: { user: this.newUser },
    }).then(function(response){
      controller.loggedUser = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
    },function(error){
      console.log(error)
    })
  };
  this.logout = function(){
    localStorage.clear('token');
    location.reload();
  };
  this.getUsers = function(){
    $http({
      url: this.url + '/users',
      method: 'GET',
      headers: {
        Authorization: 'Bearer' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response){
      if (response.data.status == 401){
        console.log('error from main.getUsers');
      } else {
        controller.users=response.data
      }
    })
  };
  this.getNextQuestion = function(){
    $http({
      method: 'GET',
      url: 'https://opentdb.com/api.php?amount=1&category=' + this.nextQuestionCategory + '&difficulty=' + this.nextQuestionDifficulty + '&type=multiple'
    }).then(function(response){
      console.log(response.data.results[0])
    },function(error){
      console.log(error);
    })
  };
}])
