/* Amplify Params - DO NOT EDIT
    ENV
    REGION
    STORAGE_TELEMETRYDATATABLE_ARN
    STORAGE_TELEMETRYDATATABLE_NAME
Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const queryParams = (TableName, hkey) => ({
    TableName,
    KeyConditionExpression: 'accountSerial = :hkey',
    ExpressionAttributeValues: {
        ':hkey': hkey
    }
});
exports.handler = async (event) => {
    let message = "No data";
    const table = process.env.STORAGE_TELEMETRYDATATABLE_NAME;
    const serial = event.pathParameters.proxy;
    const account = event.requestContext.identity.user.split(":")[0];
    const hkey = `${account}:${serial}`;

    const res = await documentClient.query(queryParams(table, hkey)).promise();
    console.log(res);
    if (res.Items) {
        message = res.Items;
    }

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(message),
    };
    return response;
};
