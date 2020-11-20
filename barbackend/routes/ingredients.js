var express = require("express");
var AWS = require("aws-sdk");
var router = express.Router();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.ACCESS_KEY_SECRET,
  region: "us-west-1",
  // bottom endpoint used for local
  // endpoint: "http://localhost:8000",
});

var docClient = new AWS.DynamoDB.DocumentClient();

router.get("/", function (req, res) {
  var params = {
    TableName: "DrinksTableOne",
    ProjectionExpression:
      "#id, #strDrink, #strDrinkAlternate, #strIngredient1, #strIngredient2, #strIngredient3, #strIngredient4,  #strIngredient5,  #strIngredient6, #strIngredient7,      #strIngredient8,     #strIngredient9,      #strIngredient10, #strIngredient11,     #strIngredient12,  #strIngredient13,#strIngredient14, #strIngredient15, #strMeasure1,#strMeasure2,#strMeasure3,#strMeasure4,#strMeasure5,#strMeasure6,#strMeasure7,#strMeasure8, #strMeasure9,#strMeasure10,#strMeasure11,#strMeasure12,#strMeasure13,#strMeasure14,#strMeasure15,#strCreativeCommonsConfirmed,#dateModified",
    ExpressionAttributeNames: {
      "#id": "id",
      "#strDrink": "strDrink",
      "#strDrinkAlternate": "strDrinkAlternate",
      "#strIngredient1": "strIngredient1",
      "#strIngredient2": "strIngredient2",
      "#strIngredient3": "strIngredient3",
      "#strIngredient4": "strIngredient4",
      "#strIngredient5": "strIngredient5",
      "#strIngredient6": "strIngredient6",
      "#strIngredient7": "strIngredient7",
      "#strIngredient8": "strIngredient8",
      "#strIngredient9": "strIngredient9",
      "#strIngredient10": "strIngredien10",
      "#strIngredient11": "strIngredient11",
      "#strIngredient12": "strIngredient12",
      "#strIngredient13": "strIngredient13",
      "#strIngredient14": "strIngredient14",
      "#strIngredient15": "strIngredient15",
      "#strMeasure1": "strMeasure1",
      "#strMeasure2": "strMeasure2",
      "#strMeasure3": "strMeasure3",
      "#strMeasure4": "strMeasure4",
      "#strMeasure5": "strMeasure5",
      "#strMeasure6": "strMeasure6",
      "#strMeasure7": "strMeasure7",
      "#strMeasure8": "strMeasure8",
      "#strMeasure9": "strMeasure9",
      "#strMeasure10": "strMeasure10",
      "#strMeasure11": "strMeasure11",
      "#strMeasure12": "strMeasure12",
      "#strMeasure13": "strMeasure13",
      "#strMeasure14": "strMeasure14",
      "#strMeasure15": "strMeasure15",
      "#strCreativeCommonsConfirmed": "strCreativeCommonsConfirmed",
      "#dateModified": "dateModified",
    },
  };
  console.log("Scanning Drinks table.");
  docClient.scan(params, onScan);
  function onScan(err, data) {
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      res.send(data);
      // print all the Drinks
      console.log("Scan succeeded.");
      /*
      data.Items.forEach(function (ingredient) {
        console.log(
          ingredient.id,
          ingredient.strDrink,
          ingredient.dateModified
        );
      });
      */
      if (typeof data.LastEvaluatedKey != "undefined") {
        console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(params, onScan);
      }
    }
  }
});

router.get("/:ingredientChar", function (req, res) {
  var params = {
    TableName: "DrinksTableOne",
    ProjectionExpression:
      "#id, #strDrink, #strDrinkAlternate, #strDrinkES, #strDrinkDE, #strDrinkFR,#strTags, #strVideo, #strCategory, #strIBA,   #strAlcoholic, #strGlass,   #strInstructions,   #strInstructionsES,  #strInstructionsDE,  #strInstructionsFR, #strDrinkThumb, #strIngredient1, #strIngredient2, #strIngredient3, #strIngredient4,  #strIngredient5,  #strIngredient6, #strIngredient7,      #strIngredient8,     #strIngredient9,      #strIngredient10, #strIngredient11,     #strIngredient12,  #strIngredient13,#strIngredient14, #strIngredient15, #strMeasure1,#strMeasure2,#strMeasure3,#strMeasure4,#strMeasure5,#strMeasure6,#strMeasure7,#strMeasure8, #strMeasure9,#strMeasure10,#strMeasure11,#strMeasure12,#strMeasure13,#strMeasure14,#strMeasure15,#strCreativeCommonsConfirmed,#dateModified",
    FilterExpression:
      "contains(#strIngredient1, :ingredientChar) OR contains(#strIngredient2, :ingredientChar) OR contains(#strIngredient3, :ingredientChar) OR contains(#strIngredient4, :ingredientChar) OR contains(#strIngredient5, :ingredientChar) OR contains(#strIngredient6, :ingredientChar) OR contains(#strIngredient7, :ingredientChar)OR contains(#strIngredient8, :ingredientChar)OR contains(#strIngredient9, :ingredientChar) OR contains(#strIngredient10, :ingredientChar) OR contains(#strIngredient11, :ingredientChar) OR contains(#strIngredient12, :ingredientChar) OR contains(#strIngredient13, :ingredientChar) OR contains(#strIngredient14, :ingredientChar) OR contains(#strIngredient15, :ingredientChar)",
    ExpressionAttributeNames: {
      "#id": "id",
      "#strDrink": "strDrink",
      "#strDrinkAlternate": "strDrinkAlternate",
      "#strDrinkES": "strDrinkES",
      "#strDrinkDE": "strDrinkDE",
      "#strDrinkFR": "strDrinkFR",
      "#strTags": "strTags",
      "#strVideo": "strVideo",
      "#strCategory": "strCategory",
      "#strIBA": "strIBA",
      "#strAlcoholic": "strAlcoholic",
      "#strGlass": "strGlass",
      "#strInstructions": "strInstructions",
      "#strInstructionsES": "strInstructionsES",
      "#strInstructionsDE": "strInstructionsDE",
      "#strInstructionsFR": "strInstructionsFR",
      "#strDrinkThumb": "strDrinkThumb",
      "#strIngredient1": "strIngredient1",
      "#strIngredient2": "strIngredient2",
      "#strIngredient3": "strIngredient3",
      "#strIngredient4": "strIngredient4",
      "#strIngredient5": "strIngredient5",
      "#strIngredient6": "strIngredient6",
      "#strIngredient7": "strIngredient7",
      "#strIngredient8": "strIngredient8",
      "#strIngredient9": "strIngredient9",
      "#strIngredient10": "strIngredien10",
      "#strIngredient11": "strIngredient11",
      "#strIngredient12": "strIngredient12",
      "#strIngredient13": "strIngredient13",
      "#strIngredient14": "strIngredient14",
      "#strIngredient15": "strIngredient15",
      "#strMeasure1": "strMeasure1",
      "#strMeasure2": "strMeasure2",
      "#strMeasure3": "strMeasure3",
      "#strMeasure4": "strMeasure4",
      "#strMeasure5": "strMeasure5",
      "#strMeasure6": "strMeasure6",
      "#strMeasure7": "strMeasure7",
      "#strMeasure8": "strMeasure8",
      "#strMeasure9": "strMeasure9",
      "#strMeasure10": "strMeasure10",
      "#strMeasure11": "strMeasure11",
      "#strMeasure12": "strMeasure12",
      "#strMeasure13": "strMeasure13",
      "#strMeasure14": "strMeasure14",
      "#strMeasure15": "strMeasure15",
      "#strCreativeCommonsConfirmed": "strCreativeCommonsConfirmed",
      "#dateModified": "dateModified",
    },
    ExpressionAttributeValues: {
      ":ingredientChar": req.params.ingredientChar,
    },
  };

  console.log("Scanning DrinksTableOne table");
  docClient.scan(params, onScan);

  function onScan(err, data) {
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      // print all the movies
      console.log("Scan succeeded.");
      res.send(data.Items);
      /*
      data.Items.forEach(function (ingredient) {
        console.log(ingredient);
      });
      */
      // continue scanning if we have more movies, because
      // scan can retrieve a maximum of 1MB of data
      if (typeof data.LastEvaluatedKey != "undefined") {
        console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(params, onScan);
      }
    }
  }
});

module.exports = router;
