const app = angular.module('trivia', []);

app.controller('mainController', ['$http', function($http){
  const controller = this;
  this.url = 'http://localhost:3000/';
  this.newUser = {};
  this.loggedUser = {};
  this.users = {};
  this.nextQuestionCategory = '';
  this.nextQuestionDifficulty = '';
  this.currentQuestion = {};
  this.currentQuestionText = '';
  this.currentAnswer = '';
  this.currentDistractors = [];
  this.currentPointValue = 0;
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
    if (this.nextQuestionDifficulty == 'easy'){
      this.currentPointValue = 100;
    } else if (this.nextQuestionDifficulty == 'medium') {
      this.currentPointValue = 200;
    } else {
      this.currentPointValue = 400;
    }
    console.log('current point value is', this.currentPointValue)
    $http({
      method: 'GET',
      url: 'https://opentdb.com/api.php?amount=1&category=' + this.nextQuestionCategory + '&difficulty=' + this.nextQuestionDifficulty + '&type=multiple'
    }).then(function(response){
      controller.currentQuestion = response.data.results[0];
      controller.currentQuestionText = controller.currentQuestion.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
      controller.currentDistractors = controller.currentQuestion.incorrect_answers;
      console.log(controller.currentDistractors, 'distractors');
      for (let i = 0; i < controller.currentDistractors.length; i++){
        controller.currentDistractors[i].replace(/&quot;/g, '"').replace(/&#039/g, "'");
      }
      controller.currentAnswer = controller.currentQuestion.correct_answer.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
    },function(error){
      console.log(error);
    })
  };
  this.assignAnswerChoices = function(){
    value = Math.floor(Math.random()*4);
    console.log(value);
  }
  this.assignAnswerChoices();
}])
