const AWS = require('aws-sdk');
const eventbridge = new AWS.EventBridge();
const ddb = new AWS.DynamoDB.DocumentClient();

// Initialize ApiGatewayManagementApi with your WebSocket URL
const apiGwManagementApi = new AWS.ApiGatewayManagementApi({
  endpoint: "https://dm2d6wt8a5.execute-api.eu-north-1.amazonaws.com/production"
});

exports.handler = async (event) => {
  // Only extract gameId; scheduleRate is no longer passed from the event body.
  const { gameId } = JSON.parse(event.body);
  const numericGameId = Number(gameId);

  if (isNaN(numericGameId)) {
    console.error(`Invalid gameId: ${gameId}`);
    return { 
      statusCode: 400, 
      body: JSON.stringify({ message: 'Invalid gameId provided.' }) 
    };
  }

  const scheduleRate = "2 minutes";

  // Schedule future actions with EventBridge using a fixed cron expression
  const ruleName = `TriggerContractFunctionForGame_${gameId}`;
  try {
    console.log(`Setting up EventBridge rule: ${ruleName}`);
    await setupEventBridgeRule(ruleName, scheduleRate ,gameId);
    console.log('EventBridge rule created/updated successfully');
  } catch (error) {
    console.error('Error creating/updating EventBridge rule:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error with EventBridge setup' }) };
  }

  // Calculate next 6pm countdown end time and broadcast it
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
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: JSON.stringify({ message: 'EventBridge setup and initial countdown broadcasted successfully' }),
  };
};

// This function calculates the timestamp for the next occurrence of 6pm in Europe/Stockholm.
function getEndTime(scheduleRate) {
  // Example assumes scheduleRate is like "5 minutes"
  const durationInMinutes = parseInt(scheduleRate.split(" ")[0], 10);
  return new Date(new Date().getTime() + durationInMinutes * 60000).getTime();







}


async function setupEventBridgeRule(ruleName, scheduleRate, gameId) {
  // Check if rule exists
  let ruleExists = false;
  try {
    await eventbridge.describeRule({ Name: ruleName }).promise();
    ruleExists = true;
  } catch (err) {
    // If the error is that the rule doesn't exist, continue to create it.
    if (err.code !== 'ResourceNotFoundException') {
      throw err;
    }
  }

  // If the rule exists, remove existing targets to avoid duplicates.
  if (ruleExists) {
    await eventbridge.removeTargets({
      Rule: ruleName,
      Ids: ['TargetFunction']
    }).promise();
  }

  // Create or update the rule.
  await eventbridge.putRule({
    Name: ruleName,
    ScheduleExpression: `rate(${scheduleRate})`,
    State: 'ENABLED'
  }).promise();

  // Add the target.
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

  await logCurrentTargets(ruleName);
}

async function logCurrentTargets(ruleName) {
  const targets = await eventbridge.listTargetsByRule({ Rule: ruleName }).promise();
  console.log(`Current targets for rule ${ruleName}:`, JSON.stringify(targets, null, 2));
}

async function broadcastInitialCountdown(endTime, gameId) {
  console.log(`Broadcasting initial countdown for gameId: ${gameId} with endTime: ${endTime}`);
  const connectionData = await ddb.scan({ TableName: "WebSocketConnections" }).promise();

  console.log("Broadcasting to active connections:", connectionData.Items);

  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      await apiGwManagementApi.postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify({ action: 'startInitialCountdown', endTime, gameId }),
      }).promise();
      console.log(`Posted to connection ${connectionId} successfully.`);
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Stale connection, deleting ${connectionId}`);
        // Optionally delete stale connection IDs from DynamoDB here
      } else {
        console.error(`Error posting to connection ${connectionId}:`, e);
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
