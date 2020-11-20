var inquirer = require("inquirer");
var fs = require("fs");
var async = require("async");
var await = require("await");
var _ = require("lodash");

let masterArray = [];
let obj = {
  ingredients: [],
};
let ingredientsAmount = 15;
var drinks = JSON.parse(fs.readFileSync("drinksData.json", "utf8"));

const main = async () => {
  for (var drink in drinks) {
    for (let i = 1; i <= ingredientsAmount; i++) {
      let stringCounter = i.toString();
      let ingredientNumber = "strIngredient" + stringCounter;
      let input = drinks[drink][ingredientNumber];
      if (input === null) {
        break;
      }
      // check for duplciate
      // dont ask question if there is a duplicate
      if (masterArray.includes(input) === true) {
        continue;
      }
      //
      //i = parseInt(stringCounter);

      let answer = await getData(input);
      if (answer.ingredient === "liquor") {
        obj.ingredients.push({ "type": "liquor", "name": input.toString() });
        console.log(obj.ingredients);
      } else if (answer.ingredient === "liquid") {
        obj.ingredients.push({ "type": "liquid", "name": input.toString() });
        console.log(obj.ingredients);
      } else if (answer.ingredient === "herb") {
        obj.ingredients.push({ "type": "herb", "name": input.toString() });
        console.log(obj.ingredients);
      } else if (answer.ingredient === "dry") {
        obj.ingredients.push({ "type": "dry", "name": input.toString() });
        console.log(obj.ingredients);
      } else if (answer.ingredient === "fruit") {
        obj.ingredients.push({ "type": "fruit", "name": input.toString() });
        console.log(obj.ingredients);
      } else if (answer.ingredient === "other") {
        obj.ingredients.push({ "type": "other", "name": input.toString() });
        console.log(obj.ingredients);
      }
      // put ingredients in here no matter what
      // check inside for duplicates
      masterArray.push(input.toString());
    }
    let isSuccess = await writeToFile();
  }
  console.log(masterArray);
};
const writeToFile = async () => {
  var json = JSON.stringify(obj.ingredients);
  fs.writeFile("ingredientsData.json", json, function (err) {
    if (err) throw err;
  });
  return true;
};

const getData = async (input) => {
  const prompts = [
    {
      type: "rawlist",
      name: "ingredient",
      message: "What is this ingredient:" + input + "?",
      choices: ["liquor", "liquid", "herb", "dry", "fruit", "other"],
      default: "liquor",
    },
  ];

  const answer = await inquirer.prompt(prompts);
  return answer;
};

main();
