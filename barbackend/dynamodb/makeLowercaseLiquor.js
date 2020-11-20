//make the data inside ingredientsData.json all lowercase with no spaces
//puts that into our database

var AWS = require("aws-sdk");
var fs = require("fs");
var async = require("async");
var await = require("await");
var ingredients = JSON.parse(fs.readFileSync("ingredientsData.json", "utf8"));
let ingredientAll = [];
let obj = {
  ingredientName: [],
};
var i = 1;
const main = async () => {
  for (ingredient of ingredients) {
    // removed duplicates

    let lowerString = await toLowerCase(ingredient.name);
    if (ingredientAll.includes(lowerString) === true) {
      continue;
    }
    ingredientAll.push(lowerString); //pushing them here to check for duplicates
    obj.ingredientName.push({
      "ingredientId": i,
      "type": ingredient.type,
      "name": ingredient.name,
      "nameLower": lowerString,
    });
    i = i + 1;
  }
  await writeToFile();
  console.log(obj.ingredientName);
};

const toLowerCase = async (input) => {
  let newString = input.toLowerCase();
  return newString;
};

const writeToFile = async () => {
  var json = JSON.stringify(obj.ingredientName, null, 2);
  fs.writeFile("ingredientsDataLowerCase.json", json, function (err) {
    if (err) throw err;
  });
  return true;
};

main();

// make all the names lowercase
//
