const AWS = require('aws-sdk');
const eventbridge = new AWS.EventBridge();

exports.handler = async (event) => {
    const { gameId, scheduleTime } = JSON.parse(event.body);  // Extract 'scheduleTime' in cron format

    const dispatcherFunctionArn = 'arn:aws:lambda:eu-north-1:959450033266:function:dispatcherLambdaBattleRoyale';

    try {
        // Set up EventBridge rules to trigger the dispatcher Lambda function every 30 minutes
        await setupEventBridgeRule(`DispatcherRule_${gameId}`, scheduleTime, dispatcherFunctionArn, gameId);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ message: 'EventBridge rule for dispatcherLambdaBattleRoyale created/updated successfully' }),
        };
    } catch (error) {
        console.error('Error setting up EventBridge rules:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ message: 'Error creating/updating EventBridge rule' }),
        };
    }
};

async function setupEventBridgeRule(ruleName, scheduleTime, dispatcherFunctionArn, gameId) {
    // Create or Update the EventBridge rule
    await eventbridge.putRule({
        Name: ruleName,
        ScheduleExpression: `cron(${scheduleTime})`,  // Ensure 'scheduleTime' is in the correct cron format
        State: 'ENABLED',
    }).promise();

    // Set the dispatcher Lambda function as the target for this rule
    await eventbridge.putTargets({
        Rule: ruleName,
        Targets: [
            {
                Id: `${ruleName}_Target`,
                Arn: dispatcherFunctionArn,
                Input: JSON.stringify({ gameId })  // Pass gameId to the dispatcher
            }
        ]
    }).promise();
}
