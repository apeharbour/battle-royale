const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Assuming the gameId is passed as a query string parameter
  const gameId = event.queryStringParameters.gameId;

  try {
    const result = await dynamoDb
      .get({
        TableName: "InGameTimer",
        Key: { gameId: gameId },
      })
      .promise();

    // Check if the item was found
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Game not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify({ nextUpdateTime: result.Item.nextUpdateTime }),
    };
  } catch (error) {
    console.error("Error fetching timer data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching timer data" }),
    };
  }
};
