let this.currentAnswer = "this.currentAnswer answer";
let this.currentDistractors = ["distractor 1", "distractor 2", "distractor 3"];

const assignAnswerChoices = function(this.currentAnswer, this.currentDistractors){
  let value = Math.floor(Math.random()*4);
  console.log(value);
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
