const fs = require("fs");
const data = require("../data");
const PATH_TO_QUESTION_FILE = "tasks/data/questions.csv";

// Read the csv file
const questionsCSV = fs.readFileSync(PATH_TO_QUESTION_FILE, "utf8");

// Split the csv file into an array of lines
const lines = questionsCSV.split("\n");

// Split each line into an array of columns
const questionArray = lines.map((line) => line.split(","));

const questions = [];

// Create an array of objects with the question and answer
for (let i = 1; i < questionArray.length; i++) {
  const question = questionArray[i][0];
  const options = [
    questionArray[i][1].trim(),
    questionArray[i][2].trim(),
    questionArray[i][3].trim() || null,
    questionArray[i][4].trim() || null,
  ];
  const answer = questionArray[i][5].trim();
  const hasImage = questionArray[i][6].trim().toLowerCase() === "true";
  let image = null;
  if (hasImage) {
    image = questionArray[i][7].trim();
  }
  const difficulty = questionArray[i][8].trim();
  const questionObj = {
    question,
    options,
    answer,
    hasImage,
    imageMeta: {
      ref: image,
    },
    difficulty,
  };

  questions.push(questionObj);
}

const addQuestionToDatabase = async (questions) => {
  for (const question of questions) {
    try {
      const add = await data.questions.addQuestionToDatabase(question);
      console.log(add);
    } catch (error) {
      console.log(error);
    }
  }

  return true;
};

async function main() {
  const finished = await addQuestionToDatabase(questions);

  if (finished) {
    console.log("Finished adding questions to database");
    process.exit(0);
  }
}

main();
