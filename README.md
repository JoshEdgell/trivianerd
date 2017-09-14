Trivia Nerd

User Stories ---------------------------------------
- A user can request and receive a random trivia question
- If a user answers a question correctly, points are added to the user's total score
- A user can choose a trivia category and receive a question from that category
- If a user answers a given number of questions in a category, he receives a "category master" badge
- If a user's score reaches a certain level, he will rank-up in his level of trivia mastery
- A user can earn earn badges based on the total number of questions he has answered
- Questions can be reviewed, updated, and deleted by an admin account
- Admin accounts must be limited to only a few admins (or, not available at all - can have backup index.html to create questions myself)

(maybe)
- A user can submit a new trivia question and answer to add to the database

Project Planning -------------------------------------
- Rails backend to house all trivia questions
- Will need Question, User, and Category tables with relevant data
- User authentication - will need to get this up and running quickly so it'll be out of the way early
- Frontend - build page to add trivia questions to database
- Continually add questions to database during free time
- Maybe push mobile version of question getter to heroku to incorporate questions more conveniently?
- Build actual site (target finish date: 9/20 - leave remainder of week to optimize for mobile)


Completion goal: 9/22

Features ---------------------------------------------
- A user will not see the same question multiple times

APIs to Pull From ------------------------------------
https://opentdb.com/api_config.php - questions are categorized, can choose multiple choice and varying difficulty
http://jservice.io/
http://trivia.propernerd.com/

Ideas ------------------------------------------------
- Rather than worry about having a table for all of the badges a user can earn, have an array of badges.  When the user answers questions, run a function to to check to see if the player qualifies for any badges ( if (playerScore >= 500 && (some way to check to see that "trivia newbie" badge is not in the player's badges array)) {player.badges.push(trivia newbie badge)} )
- Badges are really just going to be image urls (in public folder) to be pushed into player's array and displayed on player's homepage
