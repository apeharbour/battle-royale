const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'eu-north-1' });

exports.handler = async (event) => {
    console.log("Event: ", event);

    // Extract the connection ID and message body
    const connectionId = event.requestContext.connectionId;
    const body = JSON.parse(event.body);
    
    // Handle the incoming action
    switch (body.action) {
        case 'setGameId':
            return await setGameId(connectionId, body.gameId);
        default:
            return { statusCode: 400, body: 'Unrecognized action' };
    }
};

async function setGameId(connectionId, gameId) {
    const params = {
        TableName: 'WebSocketConnections', // Ensure this matches your actual table name
        Key: {
            connectionId: connectionId,
        },
        UpdateExpression: 'set gameId = :gameId',
        ExpressionAttributeValues: {
            ':gameId': gameId,
        },
    };

    try {
        await ddb.update(params).promise();
        return { statusCode: 200, body: 'Game ID set successfully' };
    } catch (err) {
        console.error('Error updating DynamoDB:', err);
        return { statusCode: 500, body: 'Failed to set game ID' };
    }
}
