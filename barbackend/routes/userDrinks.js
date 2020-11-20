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
router.get("/email", ensureAuthenticated, function (req, res, next) {
  let userEmail = req.user.email;
  var params = {
    TableName: "UserDrinksData",
    KeyConditionExpression: "email = :email",

    ExpressionAttributeValues: {
      ":email": userEmail,
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
router.get("/:id", ensureAuthenticated, function (req, res, next) {
  let userEmail = req.user.email;
  let drinkID = req.params.id;
  var params = {
    TableName: "UserDrinksData",
    FilterExpression:
      "contains(email, :userEmail) AND contains(drinkID, :drinkID)",
    ExpressionAttributeValues: {
      ":userEmail": userEmail,
      ":drinkID": drinkID,
    },
  };
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
//add drink with drinkID and userI
router.post("/:id", ensureAuthenticated, function (req, res, next) {
  let userID = parseInt(req.user.id, 10);
  console.log(req.params.id);
  var params = {
    TableName: "UserDrinksData",
    Key: { "email": req.user.email },
    //UpdateExpression: "ADD #drinkID :drinkID",
    UpdateExpression:
      "SET #drinkID = list_append(if_not_exists(#drinkID, :empty_list), :drinkID)",
    ExpressionAttributeNames: { "#drinkID": "drinkID" },
    ConditionExpression: " NOT contains(#drinkID, :drinkID)",
    ExpressionAttributeValues: {
      ":drinkID": [req.params.id],
      ":empty_list": [],
    },
  };

  docClient.update(params, (err, data) => {
    if (err) {
      console.log("error : " + JSON.stringify(err));
    }
  });
});
router.get("/arrayID/", ensureAuthenticated, function (req, res) {
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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("http://localhost:3001/");
}

module.exports = router;
