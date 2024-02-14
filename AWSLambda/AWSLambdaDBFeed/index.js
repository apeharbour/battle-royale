const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { gameId, playerAddress, moveHash, secretValue, travelDirection, travelDistance, shotDirection, shotDistance } = JSON.parse(event.body);

    const params = {
        TableName: "BattleRoyalePlayerMoves",
        Item: {
            gameId: parseInt(gameId, 10),
            playerAddress,
            moveHash,
            secretValue,
            travelDirection,
            travelDistance,
            shotDirection,
            shotDistance,
        },
    };

    try {
        await dynamoDb.put(params).promise();
        return { statusCode: 200,
             headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Credentials": true, 
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "OPTIONS,POST" 
        },
         body: JSON.stringify({ message: "Move stored successfully" }) };
    } catch (error) {
        console.error("Error storing move in DynamoDB", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error storing move in DynamoDB" }) };
    }
};
