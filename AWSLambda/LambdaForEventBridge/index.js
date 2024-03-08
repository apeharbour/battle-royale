const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const eventbridge = new AWS.EventBridge();

exports.handler = async (event) => {
    const { gameId, scheduleRate } = JSON.parse(event.body);  // Extract 'scheduleTime' in cron format

     // Construct a unique name for the rule based on gameId or other unique identifier
     const ruleName = `TriggerContractFunctionForGame_${gameId}`;

      // Set up the rule to trigger at the specified time
    try {
        // Create or Update the EventBridge rule
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

        // Calculate next update time based on scheduleRate
        const nextUpdateTime = calculateNextUpdateTime(scheduleRate);

        console.log('Next update time:', nextUpdateTime);

        // Store gameId, scheduleRate, and nextUpdateTime in DynamoDB
        await dynamoDb.put({
            TableName: 'InGameTimer',
            Item: {
                gameId: gameId,
                scheduleRate: scheduleRate,
                nextUpdateTime: nextUpdateTime,
            }
        }).promise();

        return {
            statusCode: 200,
  headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ message: 'EventBridge rule created/updated successfully' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error creating/updating EventBridge rule' }),
        };
    }

};

function calculateNextUpdateTime(scheduleRate) {
    // Extract the number of minutes from the scheduleRate string
    const minutesToAdd = parseInt(scheduleRate.split(' ')[0], 10); // '10 Minutes' => 10
    const now = new Date();

    // Add the extracted minutes to the current time
    now.setMinutes(now.getMinutes() + minutesToAdd);

    // Return the next update time in ISO format
    return now.toISOString();
}
