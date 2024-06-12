const AWS = require('aws-sdk');
const eventbridge = new AWS.EventBridge();

exports.handler = async (event) => {
    const { gameId } = JSON.parse(event.body);
    const ruleName = `TriggerContractFunctionForGame_${gameId}`;

    try {
        // Retrieve the targets associated with the rule
        const targets = await eventbridge.listTargetsByRule({ Rule: ruleName }).promise();

        // Remove all targets from the rule
        if (targets.Targets.length > 0) {
            await eventbridge.removeTargets({
                Rule: ruleName,
                Ids: targets.Targets.map(target => target.Id)
            }).promise();
        }

        // Delete the EventBridge rule
        await eventbridge.deleteRule({
            Name: ruleName
        }).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ message: 'EventBridge rule deleted successfully' }),
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
            body: JSON.stringify({ message: 'Error deleting EventBridge rule', error: error.message }),
        };
    }
};
