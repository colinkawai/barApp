var AWS = require("aws-sdk");
var fs = require("fs");
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.ACCESS_KEY_SECRET,
  region: "us-west-1",
  // bottom endpoint used for local
  // endpoint: "http://localhost:8000",
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("importing drinks into DynamoDB");

//compare this readFile
var drinks = JSON.parse(fs.readFileSync("drinksData.json", "utf8"));

drinks.forEach(function (drink) {
  console.log(drink);
  var params = {
    TableName: "DrinksTableOne",
    Item: {
      "id": drink.idDrink,
      "strDrink": drink.strDrink,
      "strDrinkAlternate": drink.strDrinkAlternate,
      "strDrinkES": drink.strDrinkES,
      "strDrinkDE": drink.strDrinkDE,
      "strDrinkFR": drink.strDrinkFR,
      "strTags": drink.strTags,
      "strVideo": drink.strVideo,
      "strCategory": drink.strCategory,
      "strIBA": drink.strIBA,
      "strAlcoholic": drink.strAlcoholic,
      "strGlass": drink.strGlass,
      "strInstructions": drink.strInstructions,
      "strInstructionsES": drink.strInstructionsES,
      "strInstructionsDE": drink.strInstructionsDE,
      "strInstructionsFR": drink.strInstructionsFR,
      "strDrinkThumb": drink.strDrinkThumb,
      "strIngredient1": drink.strIngredient1,
      "strIngredient2": drink.strIngredient2,
      "strIngredient3": drink.strIngredient3,
      "strIngredient4": drink.strIngredient4,
      "strIngredient5": drink.strIngredient5,
      "strIngredient6": drink.strIngredient6,
      "strIngredient7": drink.strIngredient7,
      "strIngredient8": drink.strIngredient8,
      "strIngredient9": drink.strIngredient9,
      "strIngredient10": drink.strIngredien10,
      "strIngredient11": drink.strIngredient11,
      "strIngredient12": drink.strIngredient12,
      "strIngredient13": drink.strIngredient13,
      "strIngredient14": drink.strIngredient14,
      "strIngredient15": drink.strIngredient15,
      "strMeasure1": drink.strMeasure1,
      "strMeasure2": drink.strMeasure2,
      "strMeasure3": drink.strMeasure3,
      "strMeasure4": drink.strMeasure4,
      "strMeasure5": drink.strMeasure5,
      "strMeasure6": drink.strMeasure6,
      "strMeasure7": drink.strMeasure7,
      "strMeasure8": drink.strMeasure8,
      "strMeasure9": drink.strMeasure9,
      "strMeasure10": drink.strMeasure10,
      "strMeasure11": drink.strMeasure11,
      "strMeasure12": drink.strMeasure12,
      "strMeasure13": drink.strMeasure13,
      "strMeasure14": drink.strMeasure14,
      "strMeasure15": drink.strMeasure15,
      "strCreativeCommonsConfirmed": drink.strCreativeCommonsConfirmed,
      "dateModified": drink.dateModified,
    },
  };

  docClient.put(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to add drink",
        drink.strDrink,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("PutItem succeeded:", drink.strDrink);
    }
  });
});
