const AWS = require('aws-sdk');
const eventbridge = new AWS.EventBridge();
const lambda = new AWS.Lambda();

exports.handler = async (event) => {
    const { gameId, scheduleTime } = JSON.parse(event.body); // adjust parsing based on your input format

    // Construct a unique name for the rule based on gameId or other unique identifier
    const ruleName = `TriggerContractFunctionForGame_${gameId}`;

    // Set up the rule to trigger at the specified time
    try {
        // Create or Update the EventBridge rule
        await eventbridge.putRule({
            Name: ruleName,
            ScheduleExpression: `cron(${scheduleTime})`, // Ensure 'scheduleTime' is in cron format
            State: 'ENABLED'
        }).promise();

        // Set the target as your smart contract interaction Lambda function
        await eventbridge.putTargets({
            Rule: ruleName,
            Targets: [
                {
                    Id: 'TargetFunction',
                    Arn: 'arn:aws:lambda:eu-north-1:959450033266:function:battleRoyale',
                    Input: JSON.stringify({ gameId }) // Pass gameId as input to the target function
                }
            ]
        }).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
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
