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

  // Schedule future actions with EventBridge using a fixed cron expression
  const ruleName = `TriggerContractFunctionForGame_${gameId}`;
  try {
    console.log(`Setting up EventBridge rule: ${ruleName}`);
    await setupEventBridgeRule(ruleName, gameId);
    console.log('EventBridge rule created/updated successfully');
  } catch (error) {
    console.error('Error creating/updating EventBridge rule:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error with EventBridge setup' }) };
  }

  // Calculate next 6pm countdown end time and broadcast it
  try {
    const endTime = getNext6pm(); 
    console.log(`Calculated endTime: ${endTime} for gameId: ${gameId}`);
    await updateCountdownState(numericGameId, endTime);
    console.log(`Countdown state updated for gameId: ${gameId}`);
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
function getNext6pm() {
  const now = new Date();
  // Get the current time in Europe/Stockholm (formatted as HH:mm:ss)
  const timeString = now.toLocaleTimeString("en-US", { timeZone: "Europe/Stockholm", hour12: false });
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const currentMinutes = hours * 60 + minutes;
  const targetMinutes = 18 * 60; // 6pm in minutes
  let diffMinutes = targetMinutes - currentMinutes;
  if (diffMinutes <= 0) {
    diffMinutes += 24 * 60; // If 6pm has passed, schedule for the next day.
  }
  return now.getTime() + diffMinutes * 60000;
}

async function setupEventBridgeRule(ruleName, gameId) {
  console.log(`Checking if rule ${ruleName} exists...`);
  let ruleExists = false;
  try {
    await eventbridge.describeRule({ Name: ruleName }).promise();
    ruleExists = true;
    console.log(`Rule ${ruleName} exists.`);
  } catch (err) {
    if (err.code !== 'ResourceNotFoundException') {
      console.error(`Error describing rule ${ruleName}:`, err);
      throw err;
    }
    console.log(`Rule ${ruleName} does not exist and will be created.`);
  }

  // If the rule exists, remove existing targets to avoid duplicates.
  if (ruleExists) {
    console.log(`Removing existing targets for rule ${ruleName}...`);
    await eventbridge.removeTargets({
      Rule: ruleName,
      Ids: ['TargetFunction']
    }).promise();
    console.log(`Existing targets removed for rule ${ruleName}.`);
  }

  // Create or update the rule with a fixed cron expression for 6pm European time (Europe/Stockholm)
  console.log(`Creating/updating rule ${ruleName} with fixed cron schedule for 6pm European time`);
  await eventbridge.putRule({
    Name: ruleName,
    ScheduleExpression: `cron(0 16 * * ? *)`, // 16:00 UTC corresponds to 18:00 Stockholm (UTC+2) during summer
    State: 'ENABLED'
  }).promise();  
  console.log(`Rule ${ruleName} created/updated.`);

  // Add the target with the ruleName parameter included in the Input (scheduleRate is removed)
  console.log(`Adding target to rule ${ruleName} with gameId: ${gameId}, ruleName: ${ruleName}`);
  await eventbridge.putTargets({
    Rule: ruleName,
    Targets: [
      {
        Id: 'TargetFunction',
        Arn: 'arn:aws:lambda:eu-north-1:959450033266:function:submitMoveAndUpdateWorldBattleRoyale',
        Input: JSON.stringify({ gameId, ruleName })
      }
    ]
  }).promise();
  console.log(`Target added to rule ${ruleName}.`);

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
