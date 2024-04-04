const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // Extracting gameId from the pathParameters and converting it to a Number
    const gameId = parseInt(event.pathParameters.gameId, 10);

    // Ensure gameId is a valid number before proceeding
    if (isNaN(gameId)) {
        return {
            statusCode: 400,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ message: 'Invalid gameId provided.' })
        };
    }

    const params = {
        TableName: 'GameCountdowns',
        Key: { gameId: gameId } // Using the numeric gameId here
    };

    try {
        const data = await ddb.get(params).promise();
        
        if (data.Item) {
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
                body: JSON.stringify({ endTime: data.Item.endTime })
            };
        } else {
            return {
                statusCode: 404,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
                body: JSON.stringify({ message: 'Game countdown not found.' })
            };
        }
    } catch (error) {
        console.error('Error fetching game countdown:', error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ message: 'Failed to fetch game countdown.' })
        };
    }
};
