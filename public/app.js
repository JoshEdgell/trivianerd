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
  this.assignedChoices = [];
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
    $http({
      method: 'GET',
      url: 'https://opentdb.com/api.php?amount=1&category=' + this.nextQuestionCategory + '&difficulty=' + this.nextQuestionDifficulty + '&type=multiple'
    }).then(function(response){
      controller.currentQuestion = response.data.results[0];
      controller.currentQuestionText = controller.currentQuestion.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
      controller.currentDistractors = controller.currentQuestion.incorrect_answers;
      controller.assignAnswerChoices();
      for (let i = 0; i < controller.currentDistractors.length; i++){
        console.log(controller.currentDistractors[i], 'before change')
        controller.currentDistractors[i].replace(/&quot;/g, '"').replace(/&#039/g, "'");
        console.log(controller.currentDistractors[i], 'after change')
      }
      controller.currentAnswer = controller.currentQuestion.correct_answer.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
    },function(error){
      console.log(error);
    })
  };
  this.assignAnswerChoices = function(){
    let value = Math.floor(Math.random()*4);
    if (value == 0) {
      this.assignedChoices[0] = this.currentAnswer;
      this.assignedChoices[1] = this.currentDistractors[0];
      this.assignedChoices[2] = this.currentDistractors[1];
      this.assignedChoices[3] = this.currentDistractors[2];
    } else if (value == 1) {
      this.assignedChoices[1] = this.currentAnswer;
      this.assignedChoices[0] = this.currentDistractors[0];
      this.assignedChoices[2] = this.currentDistractors[1];
      this.assignedChoices[3] = this.currentDistractors[2];
    } else if (value == 2) {
      this.assignedChoices[2] = this.currentAnswer;
      this.assignedChoices[1] = this.currentDistractors[0];
      this.assignedChoices[0] = this.currentDistractors[1];
      this.assignedChoices[3] = this.currentDistractors[2];
    } else {
      this.assignedChoices[3] = this.currentAnswer;
      this.assignedChoices[1] = this.currentDistractors[0];
      this.assignedChoices[2] = this.currentDistractors[1];
      this.assignedChoices[0] = this.currentDistractors[2];
    }
  }
  this.checkAnswer = function(text){
    if (text == this.currentAnswer){
      console.log('correct answer');
    } else {
      console.log('incorrect answer');
    }
  };
  this.submitAnswer = function(answer){
    if (this.checkAnswer(answer)){
      //Add current point value to user's total points
      //Add 1 to user's correct answers
      //Add 1 to user's correct category answers
    } else {
      //Add 1 to user's total incorrect answers
      //Add 1 to user's total incorrect category answers
    }
    //Send prompt to request user action (another question, logout, change question type)
  }
}])
