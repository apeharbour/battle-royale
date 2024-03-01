const AWS = require('aws-sdk');
const eventbridge = new AWS.EventBridge();

exports.handler = async (event) => {
    
    const { gameId } = JSON.parse(event.body);  

   
    const ruleName = `TriggerContractFunctionForGame_${gameId}`;

    try {
        // Disable the EventBridge rule
        await eventbridge.putRule({
            Name: ruleName,
            State: 'DISABLED' 
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
            body: JSON.stringify({ message: 'Error disabling EventBridge rule' }),
        };
    }
};
