const AWS = require('aws-sdk');
const eventbridge = new AWS.EventBridge();
const ddb = new AWS.DynamoDB.DocumentClient();

// Initialize ApiGatewayManagementApi with your WebSocket URL
const apiGwManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint: "https://dm2d6wt8a5.execute-api.eu-north-1.amazonaws.com/production"
  });

exports.handler = async (event) => {
    const { gameId, scheduleRate } = JSON.parse(event.body);
    const numericGameId = Number(gameId);

    if (isNaN(numericGameId)) {
      console.error(`Invalid gameId: ${gameId}`);
      return { 
          statusCode: 400, 
          body: JSON.stringify({ message: 'Invalid gameId provided.' }) 
      };
  }

  // Schedule future actions with EventBridge as before
  const ruleName = `TriggerContractFunctionForGame_${gameId}`;
  try {
    await setupEventBridgeRule(ruleName, scheduleRate, gameId);
    console.log('EventBridge rule created/updated successfully');
  } catch (error) {
    console.error('Error creating/updating EventBridge rule:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error with EventBridge setup' }) };
  }

  // Calculate initial countdown end time and broadcast it
  try {
    const endTime = getEndTime(scheduleRate); 
    await updateCountdownState(numericGameId, endTime);
    await broadcastInitialCountdown(endTime, gameId);
    console.log('Initial countdown broadcasted successfully');
  } catch (error) {
    console.error('Error broadcasting initial countdown:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error broadcasting initial countdown' }) };
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: JSON.stringify({ message: 'EventBridge setup and initial countdown broadcasted successfully' }),
  };
};

function getEndTime(scheduleRate) {
    // Example assumes scheduleRate is like "5 minutes"
    const durationInMinutes = parseInt(scheduleRate.split(" ")[0], 10);
    return new Date(new Date().getTime() + durationInMinutes * 60000).getTime();
  }
  

  async function setupEventBridgeRule(ruleName, scheduleRate, gameId) {
    // Convert scheduleRate to a cron or rate expression as needed
    // Example uses rate expression directly
    await eventbridge.putRule({
      Name: ruleName,
      ScheduleExpression: `rate(${scheduleRate})`,
      State: 'ENABLED'
    }).promise();
  
    // Set the target as your smart contract interaction Lambda function
    await eventbridge.putTargets({
        Rule: ruleName,
            Targets: [
                {
                    Id: 'TargetFunction',
                    Arn: 'arn:aws:lambda:eu-north-1:959450033266:function:submitMoveAndUpdateWorldBattleRoyale',
                    Input: JSON.stringify({ gameId, scheduleRate })
                }
            ]
        }).promise();
  }
  
  async function broadcastInitialCountdown(endTime, gameId) {
    const connectionData = await ddb.scan({ TableName: "WebSocketConnections" }).promise();
  
    const postCalls = connectionData.Items.map(async ({ connectionId }) => {
      try {
        await apiGwManagementApi.postToConnection({
          ConnectionId: connectionId,
          Data: JSON.stringify({ action: 'startInitialCountdown', endTime, gameId }),
        }).promise();
      } catch (e) {
        if (e.statusCode === 410) {
          console.log(`Stale connection, deleting ${connectionId}`);
          // Optionally delete stale connection IDs from DynamoDB here
        } else {
          throw e;
        }
      }
    });
  
    await Promise.all(postCalls);
  }


  async function updateCountdownState(gameId, endTime) {
    const params = {
      TableName: "GameCountdowns",
      Item: {
        gameId: gameId,
        endTime: endTime
      }
    };
  
    try {
      await ddb.put(params).promise();
      console.log(`Countdown state updated for game ${gameId}`);
    } catch (error) {
      console.error(`Error updating countdown state for game ${gameId}:`, error);
    }
  }
  