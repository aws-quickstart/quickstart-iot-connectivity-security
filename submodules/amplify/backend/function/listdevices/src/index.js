/* Amplify Params - DO NOT EDIT
    ENV
    REGION
    STORAGE_PRODUCTTABLE_ARN
    STORAGE_PRODUCTTABLE_NAME
Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const iotClient = new AWS.Iot();
let iotData;

const queryParams = (TableName, account) => ({
    TableName,
    IndexName: 'account-index',
    KeyConditionExpression: 'account = :hkey',
    ExpressionAttributeValues: {
        ':hkey': account
    }
});
exports.handler = async (event) => {
    const region = process.env.REGION;
    if (!iotData) {
        const endpoint = await iotClient.describeEndpoint().promise();
        iotData = new AWS.IotData({ endpoint: endpoint.endpointAddress, region });
    }
    const table = process.env.STORAGE_PRODUCTTABLE_NAME;

    let message = "No devices";
    const account = event.requestContext.identity.user.split(":")[0];

    try {
        const res = await documentClient.query(queryParams(table, account)).promise();
        console.log(res);
        if (res.Items) {
            message = res.Items;
        }
        const promises = message.map(async item => {
            const shadow = await iotData.getThingShadow({ thingName: item.serialNumber }).promise();
            item.shadow = JSON.parse(shadow.payload).state;
            return item;
        });
        message = await Promise.all(promises);
    } catch (e) {
        console.log(e);
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