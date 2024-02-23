const AWS = require('aws-sdk');
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
                    Input: JSON.stringify({ gameId }) // Pass gameId as input to the target function
                }
            ]
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