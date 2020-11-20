// a copy of the drinksData but the ingredients are all lowercase
// makes it easier for search and prevent potential duplicates

var AWS = require("aws-sdk");
var fs = require("fs");
var async = require("async");
var await = require("await");

var drinks = JSON.parse(fs.readFileSync("drinksData.json", "utf8"));
let obj = {
  drinksAll: [],
};
const main = async () => {
  //make a copy of the drinks data and writes that file
  // var madeCopy = await makeCopyOfOriginalData();
  for (var drink in drinks) {
    // loop through the ingredients here
    // call lower case
    let key = "strIngredient";
    for (let i = 1; i <= 15; i++) {
      let stringCounter = i.toString();
      let ingredientNumber = "strIngredient" + stringCounter;
      let input = drinks[drink][ingredientNumber];
      if (input === null) {
        break;
      }
      let loweredIngredient = await toLowerCase(input);

      drinks[drink][ingredientNumber] = loweredIngredient;
      await writeToFile();
    }
  }
};

const writeToFile = async () => {
  fs.writeFile(
    "drinksDataLowerCase.json",
    JSON.stringify(drinks, null, 2),
    function writeJSON(err) {
      if (err) return console.log(err);
      console.log(JSON.stringify(drinks));
      console.log("writing to drinks");
    }
  );
};

const makeCopyOfOriginalData = async () => {
  fs.copyFile("drinksData.json", "drinksDataLowerCase.json", (err) => {
    if (err) throw err;
    console.log("file copied");
  });

  return true;
};

const toLowerCase = async (input) => {
  let newString = input.toLowerCase();
  return newString;
};
main();
