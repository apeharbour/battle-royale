const AWS = require('aws-sdk');
const eventbridge = new AWS.EventBridge();

exports.handler = async (event) => {
    const { gameId } = JSON.parse(event.body);
    const ruleName = `TriggerContractFunctionForGame_${gameId}`;

    try {
        // Retrieve the current rule configuration
        const rule = await eventbridge.describeRule({ Name: ruleName }).promise();

        // Disable the EventBridge rule while maintaining its existing schedule pattern or cron
        await eventbridge.putRule({
            Name: ruleName,
            ScheduleExpression: rule.ScheduleExpression, // Maintain the original schedule
            EventPattern: rule.EventPattern, // Maintain original pattern if applicable
            State: 'DISABLED' // Disable the rule
        }).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ message: 'EventBridge rule disabled successfully' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ message: 'Error disabling EventBridge rule', error: error.message }),
        };
    }
};
