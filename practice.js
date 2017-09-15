let correct = "correct answer";
let incorrect = ["distractor 1", "distractor 2", "distractor 3"];

const assignAnswerChoices = function(correct, incorrect){
  let array = [];
  let value = Math.floor(Math.random()*4);
  console.log(value);
  if (value == 0) {
    array[0] = correct;
    array[1] = incorrect[0];
    array[2] = incorrect[1];
    array[3] = incorrect[2];
  } else if (value == 1) {
    array[1] = correct;
    array[0] = incorrect[0];
    array[2] = incorrect[1];
    array[3] = incorrect[2];
  } else if (value == 2) {
    array[2] = correct;
    array[1] = incorrect[0];
    array[0] = incorrect[1];
    array[3] = incorrect[2];
  } else {
    array[3] = correct;
    array[1] = incorrect[0];
    array[2] = incorrect[1];
    array[0] = incorrect[2];
  }
  return array;
}


console.log(assignAnswerChoices(correct,incorrect));
