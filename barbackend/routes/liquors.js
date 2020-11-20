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

//returns all the liquors
router.get("/", function (req, res) {
  var params = {
    TableName: "DrinksTableOne",
    ProjectionExpression: "#id, #strDrink, #strDrinkAlternate, #strIngredient1",
    ExpressionAttributeNames: {
      "#id": "id",
      "#strDrink": "strDrink",
      "#strDrinkAlternate": "strDrinkAlternate",
      "#strIngredient1": "strIngredient1",
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
      data.Items.forEach(function (liquor) {
        console.log(liquor.id, liquor.strDrink, liquor.strIngredient1);
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

router.get("/:liquorChar", function (req, res) {
  var params = {
    TableName: "DrinksTableOne",
    ProjectionExpression: "#id, #strDrink, #strDrinkAlternate, #strIngredient1",
    FilterExpression: "contains(#strIngredient1, :liquorChar)",
    ExpressionAttributeNames: {
      "#id": "id",
      "#strDrink": "strDrink",
      "#strDrinkAlternate": "strDrinkAlternate",
      "#strIngredient1": "strIngredient1",
    },
    ExpressionAttributeValues: {
      ":liquorChar": req.params.liquorChar,
    },
  };

  console.log("Scanning DrinksTableOne and on liquor branch");
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
      data.Items.forEach(function (liquor) {
        console.log(liquor);
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
