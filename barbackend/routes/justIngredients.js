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
    TableName: "IngredientsTableTwo",
    ProjectionExpression: "#id, #type, #name, #nameLower",
    ExpressionAttributeNames: {
      "#id": "id",
      "#type": "type",
      "#name": "name",
      "#nameLower": "nameLower",
    },
  };

  console.log("scanning IngredientsTable");
  docClient.scan(params, onScan);
  function onScan(err, data) {
    // console.log(data);

    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      res.send(data.Items);
      // print all ingredients
      console.log("Scan succeeded.");
      /*
      data.Items.forEach(function (ingredient) {
        console.log(ingredient);
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
//gets based on type
router.get("/type/:type", function (req, res) {
  var params = {
    TableName: "IngredientsTableTwo",
    ProjectionExpression: "#id, #type, #name, #nameLower",
    FilterExpression: "contains(#type, :type)",
    ExpressionAttributeNames: {
      "#id": "id",
      "#type": "type",
      "#name": "name",
      "#nameLower": "nameLower",
    },
    ExpressionAttributeValues: {
      ":type": req.params.type,
    },
  };
  console.log("scanning IngredientsTable");
  docClient.scan(params, onScan);
  function onScan(err, data) {
    //console.log(data);
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      res.send(data.Items);
      // print all ingredients
      console.log("Scan succeeded.");
      /*
      data.Items.forEach(function (ingredient) {
        console.log(ingredient);
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

router.get("/:type/:ingredientChar", function (req, res) {
  var params = {
    TableName: "IngredientsTableTwo",
    ProjectionExpression: "#id, #type, #name, #nameLower",
    FilterExpression: "contains(#nameLower, :ingredientChar) AND #type = :type",
    ExpressionAttributeNames: {
      "#id": "id",
      "#type": "type",
      "#name": "name",
      "#nameLower": "nameLower",
    },
    ExpressionAttributeValues: {
      ":ingredientChar": req.params.ingredientChar,
      ":type": req.params.type,
    },
  };

  console.log("Scanning IngredientsTableTwo table");
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
      //  console.log(data.Items);
      res.send(data.Items);
      /*
      data.Items.forEach(function (ingredient) {
        console.log(ingredient.nameLower);
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
