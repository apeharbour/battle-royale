const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const gameId = event.queryStringParameters ? event.queryStringParameters.gameId : null;
  const tableName = 'WebSocketConnections';

  const params = {
    TableName: tableName,
    Item: {
      connectionId: connectionId,
      gameId: gameId
    }
  };

  try {
    await ddb.put(params).promise();
    return { statusCode: 200, body: 'Connected.' };
  } catch (err) {
    console.error('Error saving connection:', err);
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }
};
