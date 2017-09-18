const app = angular.module('trivia', []);

app.controller('mainController', ['$http', function($http){
  const controller = this;
  this.url = 'http://localhost:3000/';
  this.newUser = {};
  this.loggedUser = {};
  this.users = {};
  this.nextQuestionCategory = '';
  this.nextQuestionDifficulty = '';
  this.currentQuestionCategory = '';
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
      if (response.data.status == 401) {
        console.log('not a valid user');
      } else {
        controller.loggedUser = response.data.user;
        localStorage.setItem('token', JSON.stringify(response.data.token));
        console.log(controller.loggedUser.username, 'logged user')
      }
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
      controller.currentQuestionText = controller.currentQuestion.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&").replace(/&ntilde;/g, "~");
      controller.currentDistractors = controller.currentQuestion.incorrect_answers;
      for (let i = 0; i < controller.currentDistractors.length; i++){
        controller.currentDistractors[i].replace(/&quot;/g, '"').replace(/&#039/g, "'").replace(/&amp;/g, "&").replace(/&ntilde;/g, "~");
      }
      controller.currentAnswer = controller.currentQuestion.correct_answer.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&").replace(/&ntilde;/g, "~");
      controller.assignAnswerChoices();
    },function(error){
      console.log(error);
    })
  };
  this.assignAnswerChoices = function(){
    let value = Math.floor(Math.random()*4);
    if (value == 0) {
      console.log('A');
      this.assignedChoices[0] = this.currentAnswer;
      this.assignedChoices[1] = this.currentDistractors[0];
      this.assignedChoices[2] = this.currentDistractors[1];
      this.assignedChoices[3] = this.currentDistractors[2];
    } else if (value == 1) {
      console.log('B');
      this.assignedChoices[0] = this.currentDistractors[0];
      this.assignedChoices[1] = this.currentAnswer;
      this.assignedChoices[2] = this.currentDistractors[1];
      this.assignedChoices[3] = this.currentDistractors[2];
    } else if (value == 2) {
      console.log('C');
      this.assignedChoices[0] = this.currentDistractors[0];
      this.assignedChoices[1] = this.currentDistractors[1];
      this.assignedChoices[2] = this.currentAnswer;
      this.assignedChoices[3] = this.currentDistractors[2];
    } else {
      console.log('D');
      this.assignedChoices[0] = this.currentDistractors[0];
      this.assignedChoices[1] = this.currentDistractors[1];
      this.assignedChoices[2] = this.currentDistractors[2];
      this.assignedChoices[3] = this.currentAnswer;
    }
  }
  this.checkAnswer = function(text){
    if (text == this.currentAnswer){
      return true
    } else {
      return false
    }
  };
  this.submitAnswer = function(answer){
    if (this.checkAnswer(answer)){
      //Add current point value to user's total points
      this.loggedUser.total_score += this.currentPointValue;
      //Add 1 to user's correct answers
      this.loggedUser.total_correct += 1;
      //Add 1 to user's correct category answers
      if (this.nextQuestionCategory == 10) {
        this.loggedUser.books_correct += 1;
      } else if (this.nextQuestionCategory == 11) {
        this.loggedUser.film_correct += 1;
      } else if (this.nextQuestionCategory == 12) {
        this.loggedUser.music_correct += 1;
      } else if (this.nextQuestionCategory == 14) {
        this.loggedUser.television_correct +=1 ;
      } else if (this.nextQuestionCategory == 15) {
        this.loggedUser.games_correct += 1;
      } else if (this.nextQuestionCategory == 17) {
        this.loggedUser.nature_correct += 1;
      } else if (this.nextQuestionCategory == 18) {
        this.loggedUser.computers_correct += 1;
      } else if (this.nextQuestionCategory == 23) {
        this.loggedUser.history_correct += 1;
      } else if (this.nextQuestionCategory == 27) {
        this.loggedUser.animals_correct += 1;
      } else {
        this.loggedUser.sports_correct += 1;
      }
    } else {
      //Add 1 to user's total incorrect answers
      this.loggedUser.total_incorrect += 1;
      //Add 1 to user's total incorrect category answers
      if (this.nextQuestionCategory == 10) {
        this.loggedUser.books_incorrect += 1;
      } else if (this.nextQuestionCategory == 11) {
        this.loggedUser.film_incorrect += 1;
      } else if (this.nextQuestionCategory == 12) {
        this.loggedUser.music_incorrect += 1;
      } else if (this.nextQuestionCategory == 14) {
        this.loggedUser.television_incorrect +=1 ;
      } else if (this.nextQuestionCategory == 15) {
        this.loggedUser.games_incorrect += 1;
      } else if (this.nextQuestionCategory == 17) {
        this.loggedUser.nature_incorrect += 1;
      } else if (this.nextQuestionCategory == 18) {
        this.loggedUser.computers_incorrect += 1;
      } else if (this.nextQuestionCategory == 23) {
        this.loggedUser.history_incorrect += 1;
      } else if (this.nextQuestionCategory == 27) {
        this.loggedUser.animals_incorrect += 1;
      } else {
        this.loggedUser.sports_incorrect += 1;
      }
      console.log(this.loggedUser);
    }
    //Send prompt to request user action (another question, logout, change question type)
  }
}])
