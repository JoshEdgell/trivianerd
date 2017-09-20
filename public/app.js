const app = angular.module('trivia', []);

app.controller('mainController', ['$http', function($http){
  const controller = this;
  this.url = 'http://localhost:3000/';
  this.newUser = {};
  this.loggedUser = {};
  this.loggedUserBadges = 0;
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
  this.displayLoginModal = true;
  this.displayCreateModal = false;
  this.displayNoMatch = false;
  this.displayLoginFail = false;
  this.displayNewBadgeModal = false;
  this.displayNewTriviaBadgeModal = false;
  this.displayQuestionForm = false;
  this.displayQuestion = false;
  this.displayCorrect = false;
  this.displayIncorrect = false;
  this.displayChart = false;
  this.geekLevel = 1;
  this.wonkLevel = 2;
  this.nerdLevel = 3;
  this.createUser = function(){
    if (this.newUser.password != this.newUser.password2) {
      console.log('no match');
      this.displayNoMatch = true;
      return
    }
    this.displayNoMatch = false;
    this.displayCreateModal = false;
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
        controller.displayLoginFail = true;
      } else {
        controller.displayLoginModal = false;
        controller.displayLoginFail = false;
        controller.loggedUser = response.data.user;
        localStorage.setItem('token', JSON.stringify(response.data.token));
        controller.displayQuestionForm = true;
        controller.logCurrentUser();
      }
    },function(error){
      console.log(error, 'login error')
    })
  };
  this.logCurrentUser = function(){
    $http({
      method: 'GET',
      url: this.url + 'users/' + this.loggedUser.id,
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response){
      controller.loggedUser = response.data;
      controller.loggedUserBadges = response.data.badges.length - 1;
    }, function(error){
      console.log(error, 'error from logging current user')
    })
  };
  this.logout = function(){
    this.postUserData();
    localStorage.clear('token');
    location.reload();
  };
  this.switchLoginModals = function(){
    this.displayLoginModal = false;
    this.displayCreateModal = true;
  };
  this.closeNewBadgeModal = function(){
    this.displayNewBadgeModal = false;
  };
  this.closeNewTriviaBadgeModal = function(){
    this.displayNewTriviaBadgeModal = false;
  };
  this.getUsers = function(){
    $http({
      url: this.url + '/users',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
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
    this.displayQuestionForm = false;
    this.displayCorrect = false;
    this.displayIncorrect = false;
    this.displayQuestion = true;
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
        controller.currentDistractors[i].replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&").replace(/&ntilde;/g, "~");
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
      this.assignedChoices[0] = this.currentAnswer;
      this.assignedChoices[1] = this.currentDistractors[0];
      this.assignedChoices[2] = this.currentDistractors[1];
      this.assignedChoices[3] = this.currentDistractors[2];
    } else if (value == 1) {
      this.assignedChoices[0] = this.currentDistractors[0];
      this.assignedChoices[1] = this.currentAnswer;
      this.assignedChoices[2] = this.currentDistractors[1];
      this.assignedChoices[3] = this.currentDistractors[2];
    } else if (value == 2) {
      this.assignedChoices[0] = this.currentDistractors[0];
      this.assignedChoices[1] = this.currentDistractors[1];
      this.assignedChoices[2] = this.currentAnswer;
      this.assignedChoices[3] = this.currentDistractors[2];
    } else {
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
    this.displayQuestion = false;
    if (this.checkAnswer(answer)){
      this.displayCorrect = true;
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
      this.displayIncorrect = true;
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
    }
    this.assignBadges();
    this.assignTriviaBadges();
  };
  this.postUserData = function(){
    $http({
      method: "PUT",
      url: this.url + 'users/' + this.loggedUser.id,
      data: this.loggedUser,
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response){
      controller.loggedUser = response.data;
      controller.loggedUserBadges = controller.loggedUser.badges.length - 1;
    }, function(error){
      console.log(error);
    })

  };
  this.changeQuestionType = function(){
    this.displayCorrect = false;
    this.displayIncorrect = false;
    this.displayQuestionForm = true;
  };
  this.quit = function(){
    this.logout();
    this.newUser = {};
    this.loggedUser = {};
    this.displayLoginModal = true;
  };
  this.checkForBadge = function(badge){
    for (let i = 0; i < this.loggedUser.badges.length; i++) {
      if (this.loggedUser.badges[i].url == badge) {
        return true;
      }
    }
    return false;
  };
  this.assignBadges = function(){
    this.displayNewBadgeModal = false;
    let badgeEarned = false;
    //Animal Badges
    if (this.loggedUser.animals_correct == this.geekLevel && this.checkForBadge('/images/animal_bronze.png') == false) {
      this.createBadge(1,'/images/animal_bronze.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.animals_correct == this.wonkLevel && this.checkForBadge('/images/animal_silver.png') == false) {
      this.createBadge(2,'/images/animal_silver.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.animals_correct == this.nerdLevel && this.checkForBadge('/images/animal_gold.png') == false) {
      this.createBadge(3,'/images/animal_gold.png');
      this.postUserData();
      badgeEarned = true;
    };
    //Book Badges
    if ((this.loggedUser.books_correct == this.geekLevel) && (this.checkForBadge('/images/book_bronze.png') == false)) {
      this.createBadge(4,'/images/book_bronze.png');
      this.postUserData();
      badgeEarned = true;
    };
    if ((this.loggedUser.books_correct == this.wonkLevel) && (this.checkForBadge('/images/book_silver.png') == false)) {
      this.createBadge(5,'/images/book_silver.png');
      this.postUserData();
      badgeEarned = true;
    };
    if ((this.loggedUser.books_correct == this.nerdLevel) && (this.checkForBadge('/images/book_gold.png') == false)) {
      this.createBadge(6,'/images/book_gold.png');
      this.postUserData();
      badgeEarned = true;
    };
    //Computer Badges
    if (this.loggedUser.computers_correct == this.geekLevel && this.checkForBadge('/images/computer_bronze.png') == false) {
      this.createBadge(7,'/images/computer_bronze.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.computers_correct == this.wonkLevel && this.checkForBadge('/images/computer_silver.png') == false) {
      this.createBadge(8,'/images/computer_silver.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.computers_correct == this.nerdLevel && this.checkForBadge('/images/computer_gold.png') == false) {
      this.createBadge(9,'/images/computer_gold.png');
      this.postUserData();
      badgeEarned = true;
    };
    //Video Games Badges
    if (this.loggedUser.games_correct == this.geekLevel && this.checkForBadge('/images/games_bronze.png') == false) {
      this.createBadge(10,'/images/games_bronze.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.games_correct == this.wonkLevel && this.checkForBadge('/images/games_silver.png') == false) {
      this.createBadge(11,'/images/games_silver.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.games_correct == this.nerdLevel && this.checkForBadge('/images/games_gold.png') == false) {
      this.createBadge(12,'/images/games_gold.png');
      this.postUserData();
      badgeEarned = true;
    };
    //History Badges
    if (this.loggedUser.history_correct == this.geekLevel && this.checkForBadge('/images/history_bronze.png') == false) {
      this.createBadge(13,'/images/history_bronze.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.history_correct == this.wonkLevel && this.checkForBadge('/images/history_silver.png') == false) {
      this.createBadge(14,'/images/history_silver.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.history_correct == this.nerdLevel && this.checkForBadge('/images/history_gold.png') == false) {
      this.createBadge(15,'/images/history_gold.png');
      this.postUserData();
      badgeEarned = true;
    };
    //Film Badges
    if (this.loggedUser.film_correct == this.geekLevel && this.checkForBadge('/images/film_bronze.png') == false) {
      this.createBadge(16,'/images/film_bronze.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.film_correct == this.wonkLevel && this.checkForBadge('/images/film_silver.png') == false) {
      this.createBadge(17,'/images/film_silver.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.film_correct == this.nerdLevel && this.checkForBadge('/images/film_gold.png') == false) {
      this.createBadge(18,'/images/film_gold.png');
      this.postUserData();
      badgeEarned = true;
    };
    //Music Badges
    if (this.loggedUser.music_correct == this.geekLevel && this.checkForBadge('/images/music_bronze.png') == false) {
      this.createBadge(19,'/images/music_bronze.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.music_correct == this.wonkLevel && this.checkForBadge('/images/music_silver.png') == false) {
      this.createBadge(20,'/images/music_silver.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.music_correct == this.nerdLevel && this.checkForBadge('/images/music_gold.png') == false) {
      this.createBadge(21,'/images/music_gold.png');
      this.postUserData();
      badgeEarned = true;
    };
    //Science Badges
    if (this.loggedUser.nature_correct == this.geekLevel && this.checkForBadge('/images/nature_bronze.png') == false) {
      this.createBadge(22,'/images/nature_bronze.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.nature_correct == this.wonkLevel && this.checkForBadge('/images/nature_silver.png') == false) {
      this.createBadge(23, '/images/nature_silver.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.nature_correct == this.nerdLevel && this.checkForBadge('/images/nature_gold.png') == false) {
      this.createBadge(24,'/images/nature_gold.png');
      this.postUserData();
      badgeEarned = true;
    };
    //Sports Badges
    if (this.loggedUser.sports_correct == this.geekLevel && this.checkForBadge('/images/sports_bronze.png') == false) {
      this.createBadge(25,'/images/sports_bronze.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.sports_correct == this.wonkLevel && this.checkForBadge('/images/sports_silver.png') == false) {
      this.createBadge(26,'/images/sports_silver.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.sports_correct == this.nerdLevel && this.checkForBadge('/images/sports_gold.png') == false) {
      this.createBadge(27,'/images/sports_gold.png');
      this.postUserData();
      badgeEarned = true;
    };
    //Television Badges
    if (this.loggedUser.television_correct == this.geekLevel && this.checkForBadge('/images/television_bronze.png') == false) {
      this.createBadge(28,'/images/television_bronze.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.television_correct == this.wonkLevel && this.checkForBadge('/images/television_silver.png') == false) {
      this.createBadge(29,'/images/television_silver.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.television_correct == this.nerdLevel && this.checkForBadge('/images/television_gold.png') == false) {
      this.createBadge(30,'/images/television_gold.png');
      this.postUserData();
      badgeEarned = true;
    }
    if (badgeEarned == true) {
      this.displayNewBadgeModal = true;
    }
  };
  this.assignTriviaBadges = function(){
    //Trivia Badges
    let badgeEarned = false;
    if (this.loggedUser.badges.length == 5) {
      this.createBadge(31, '/images/trivia_bronze.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.badges.length == 13) {
      this.createBadge(32, '/images/trivia_silver.png');
      this.postUserData();
      badgeEarned = true;
    };
    if (this.loggedUser.badges.length == 22) {
      this.createBadge(33, '/images/trivia_gold.png');
      this.postUserData();
      badgeEarned = true;
    }
    if (this.loggedUser.badges.length == 33) {
      this.createBadge(34, '/images/trivia_platinum.png');
      this.postUserData();
      badgeEarned = true;
    }
    if (badgeEarned == true) {
      this.displayNewTriviaBadgeModal = true;
    }
  };
  this.createBadge = function(ach, url){
    $http({
      method: 'POST',
      url: this.url + 'badges',
      data: {
        user_id: this.loggedUser.id,
        achievement_id: ach,
        url: url
      }
    }).then(function(response){

    },function(error){
      console.log(error);
    })
  }
}])
