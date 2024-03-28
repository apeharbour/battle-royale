const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const tableName = 'WebSocketConnections';

  const params = {
    TableName: tableName,
    Key: {
      connectionId: connectionId
    }
  };

  try {
    await ddb.delete(params).promise();
    return { statusCode: 200, body: 'Disconnected.' };
  } catch (err) {
    console.error('Error deleting connection:', err);
    return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) };
  }
};
