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

router.get("/:id", function (req, res, next) {
  var params = {
    TableName: "DrinksTableOne",
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames: {
      "#id": "id",
    },
    ExpressionAttributeValues: {
      ":id": req.params.id,
    },
  };
  docClient.query(params, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("Query succeeded.");
      res.send(data.Items);
      /*
      data.Items.forEach(function (drink) {
        console.log(drink.id, drink.strDrink, drink.dateModified);
      });
      */
    }
  });
});

router.get("/arrayID/:drink", ensureAuthenticated, function (req, res) {
  console.log("here");
  var drinkValues = req.query.someArray;

  var drinkObject = {};
  var index = 0;
  drinkValues.forEach(function (value) {
    index++;
    var drinkKey = ":drink" + index;
    drinkObject[drinkKey.toString()] = value;
  });
  var params = {
    TableName: "DrinksTableOne",
    ProjectionExpression:
      "#id, #strDrink, #strDrinkAlternate, #strDrinkES, #strDrinkDE, #strDrinkFR,#strTags, #strVideo, #strCategory, #strIBA,   #strAlcoholic, #strGlass,   #strInstructions,   #strInstructionsES,  #strInstructionsDE,  #strInstructionsFR, #strDrinkThumb, #strIngredient1, #strIngredient2, #strIngredient3, #strIngredient4,  #strIngredient5,  #strIngredient6, #strIngredient7,      #strIngredient8,     #strIngredient9,      #strIngredient10, #strIngredient11,     #strIngredient12,  #strIngredient13,#strIngredient14, #strIngredient15, #strMeasure1,#strMeasure2,#strMeasure3,#strMeasure4,#strMeasure5,#strMeasure6,#strMeasure7,#strMeasure8, #strMeasure9,#strMeasure10,#strMeasure11,#strMeasure12,#strMeasure13,#strMeasure14,#strMeasure15,#strCreativeCommonsConfirmed,#dateModified",
    FilterExpression: "id IN (" + Object.keys(drinkObject).toString() + ")",
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
    ExpressionAttributeValues: drinkObject,
  };
  console.log("Scanning for matching IDS");
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
      console.log("Self Drink Scan succeeded.");
      /*
       data.Items.forEach(function (drink) {
         console.log(drink.id, drink.strDrink, drink.dateModified);
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

router.get("/filter/:ingredients", function (req, res) {
  var drinkValues = req.query.array;
  console.log(drinkValues);
  console.log(drinkValues.length);

  var drinkObject = {};
  var index = 0;

  drinkValues.forEach(function (value) {
    index++;
    var drinkKey = ":drink" + index;
    drinkObject[drinkKey.toString()] = value;
  });
  var params = {
    TableName: "DrinksTableOneLower",
    ProjectionExpression:
      "#id, #strDrink, #strDrinkAlternate, #strDrinkES, #strDrinkDE, #strDrinkFR,#strTags, #strVideo, #strCategory, #strIBA,   #strAlcoholic, #strGlass,   #strInstructions,   #strInstructionsES,  #strInstructionsDE,  #strInstructionsFR, #strDrinkThumb, #strIngredient1, #strIngredient2, #strIngredient3, #strIngredient4,  #strIngredient5,  #strIngredient6, #strIngredient7,      #strIngredient8,     #strIngredient9,      #strIngredient10, #strIngredient11,     #strIngredient12,  #strIngredient13,#strIngredient14, #strIngredient15, #strMeasure1,#strMeasure2,#strMeasure3,#strMeasure4,#strMeasure5,#strMeasure6,#strMeasure7,#strMeasure8, #strMeasure9,#strMeasure10,#strMeasure11,#strMeasure12,#strMeasure13,#strMeasure14,#strMeasure15,#strCreativeCommonsConfirmed,#dateModified",
    FilterExpression:
      //"contains(#strIngredient1, :ingredientNames) OR contains(#strIngredient2, :ingredientNames) OR contains(#strIngredient3, :ingredientNames) OR contains(#strIngredient4, :ingredientNames) OR contains(#strIngredient5, :ingredientNames) OR contains(#strIngredient6, :ingredientNames) OR contains(#strIngredient7, :ingredientNames) OR contains(#strIngredient8, :ingredientNames) OR contains(#strIngredient9, :ingredientNames) OR contains(#strIngredient10, :ingredientNames) OR contains(#strIngredient11, :ingredientNames) OR contains(#strIngredient12, :ingredientNames)OR contains(#strIngredient13, :ingredientNames)OR contains(#strIngredient14, :ingredientNames) OR contains(#strIngredient15, :ingredientNames) ",
      "strIngredient1 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredient2 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredient3 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredinet4 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredient5 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredient6 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredient7 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredient8 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredient9 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredient10 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredient11 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredient12 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredient13 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredient14 IN (" +
      Object.keys(drinkObject).toString() +
      ") OR strIngredient15 IN (" +
      Object.keys(drinkObject).toString() +
      ")",

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
    ExpressionAttributeValues: drinkObject,
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

      console.log("Scan succeeded.");
      /*
      data.Items.forEach(function (drink) {
        console.log(drink.id, drink.strDrink, drink.dateModified);
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

router.get("/", function (req, res) {
  var params = {
    TableName: "DrinksTableOne",
    ProjectionExpression:
      "#id, #strDrink, #strDrinkAlternate, #strDrinkES, #strDrinkDE, #strDrinkFR,#strTags, #strVideo, #strCategory, #strIBA,   #strAlcoholic, #strGlass,   #strInstructions,   #strInstructionsES,  #strInstructionsDE,  #strInstructionsFR, #strDrinkThumb, #strIngredient1, #strIngredient2, #strIngredient3, #strIngredient4,  #strIngredient5,  #strIngredient6, #strIngredient7,      #strIngredient8,     #strIngredient9,      #strIngredient10, #strIngredient11,     #strIngredient12,  #strIngredient13,#strIngredient14, #strIngredient15, #strMeasure1,#strMeasure2,#strMeasure3,#strMeasure4,#strMeasure5,#strMeasure6,#strMeasure7,#strMeasure8, #strMeasure9,#strMeasure10,#strMeasure11,#strMeasure12,#strMeasure13,#strMeasure14,#strMeasure15,#strCreativeCommonsConfirmed,#dateModified",
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
      data.Items.forEach(function (drink) {
        console.log(drink.id, drink.strDrink, drink.dateModified);
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
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("http://localhost:3001/");
}

module.exports = router;
