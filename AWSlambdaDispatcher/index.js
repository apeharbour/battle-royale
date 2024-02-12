const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const lambda = new AWS.Lambda();

const BUCKET_NAME = 'statemanagementbattleroyale';
const STATE_FILE_KEY = 'lastInvokedFunction.json';

exports.handler = async (event) => {
    try {
        // Fetch the current state from S3
        const currentState = await s3.getObject({
            Bucket: BUCKET_NAME,
            Key: STATE_FILE_KEY
        }).promise();

        const { lastInvokedFunction } = JSON.parse(currentState.Body.toString());
        const nextFunction = lastInvokedFunction === 'battleRoyaleSubmitMoves' ? 'battleRoyale' : 'battleRoyaleSubmitMoves';

        // Invoke the next function
        await lambda.invoke({
            FunctionName: nextFunction, // Function names should exactly match your Lambda function names
            InvocationType: 'Event',
            Payload: JSON.stringify({ gameId: event.gameId })
        }).promise();

        // Update the state in S3
        await s3.putObject({
            Bucket: BUCKET_NAME,
            Key: STATE_FILE_KEY,
            Body: JSON.stringify({ lastInvokedFunction: nextFunction })
        }).promise();

        console.log(`Successfully invoked ${nextFunction} for gameId ${event.gameId}`);
    } catch (error) {
        console.error(`Error in dispatcher function: ${error}`);
        throw error;
    }
};
