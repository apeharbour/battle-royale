const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("Received event:", event.body); 
    let data;
    try {
        data = JSON.parse(event.body);
    } catch (error) {
        console.error("Error parsing event body:", error);
        return response(400, "Invalid JSON format in request body");
    }

    const { gameId, playerAddress, moveHash, secretValue, travelDirection, travelDistance, shotDirection, shotDistance } = data;

    // Validate required fields
    if (!gameId || !playerAddress || !moveHash || secretValue == null || travelDirection == null || travelDistance == null || shotDirection == null || shotDistance == null) {
        console.error("Missing required fields", data);
        return response(400, "Missing one or more required fields");
    }

    const params = {
        TableName: "BattleRoyalePlayerMoves",
        Item: {
            gameId: parseInt(gameId, 10),  
            playerAddress: playerAddress.toString(), 
            moveHash,
            secretValue: Number(secretValue),  
            travelDirection: Number(travelDirection),
            travelDistance: Number(travelDistance),
            shotDirection: Number(shotDirection),
            shotDistance: Number(shotDistance),
        },
    };

    try {
        await dynamoDb.put(params).promise();
        return response(200, "Move stored successfully");
    } catch (error) {
        console.error("Error storing move in DynamoDB", error);
        return response(500, "Error storing move in DynamoDB: " + error.message);
    }
};

function response(statusCode, message) {
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify({ message: message })
    };
}
