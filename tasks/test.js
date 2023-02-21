const error = require("../errors");
const data = require("../data");
const services = require("../services");
const qs = require("./questions");
const quiz = require("./quiz");

const testQuestionSchema = async () => {
  try {
    const add = await data.questions.addQuestionToDatabase(qs);
    console.log(add);
  } catch (error) {
    console.log(error);
  }
};

const fetchRandomQuestionsTest = async (limit, difficulty) => {
  try {
    const q = await data.questions.getBunchOfQuestions(limit, difficulty);
    console.log(q);
  } catch (error) {
    console.log(error);
  }
};

const testQuizSchema = () => {
  try {
    error.checkSchema(quiz, "quizSchema");
  } catch (error) {
    console.log(error);
  }
};

const testSubmitQuiz = async (quiz) => {
  try {
    const submit = await data.quiz.submitQuiz(quiz);
    console.log(submit);
  } catch (error) {
    console.log(error);
  }
};
// fetchRandomQuestionsTest(1, "hellllo");

testQuestionSchema();
testSubmitQuiz(quiz);
// fetchRandomQuestionsTest(1);
