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

console.log("importing ingredinets into DynamoDB");

var ingredients = JSON.parse(
  fs.readFileSync("ingredientsDataLowerCase.json", "utf8")
);

ingredients.forEach(function (ingredient) {
  console.log(ingredient);
  var params = {
    TableName: "IngredientsTableTwo",
    Item: {
      "id": ingredient.ingredientId,
      "type": ingredient.type,
      "name": ingredient.name,
      "nameLower": ingredient.nameLower,
    },
  };

  docClient.put(params, function (err, data) {
    if (err) {
      console.error(
        "unable to add ingredient",
        ingredient.name,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("PutItem succeeded:", ingredient.name);
    }
  });
});
