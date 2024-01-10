const lambdaFunction = require('./index.js'); // Import your Lambda function

// Mock event object - Modify this according to your function's requirements
const event = {};

// Mock context object - AWS Lambda passes this, but usually not needed for basic testing
const context = {};

// Function to simulate the Lambda function invocation
async function invokeLambda() {
    try {
        const result = await lambdaFunction.handler(event, context);
        console.log('Lambda function executed successfully.');
        console.log('Result:', result);
    } catch (error) {
        console.error('Lambda function execution failed.');
        console.error('Error:', error);
    }
}

// Run the test
invokeLambda();
