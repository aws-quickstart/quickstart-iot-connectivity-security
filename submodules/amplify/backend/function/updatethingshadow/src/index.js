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

const getQueryParams = (TableName, serial) => ({
    TableName,
    KeyConditionExpression: 'serialNumber = :hkey',
    ExpressionAttributeValues: {
        ':hkey': serial
    }
});

const getUpdateParams = (serial, key, value) => ({
    thingName: serial,
    payload: JSON.stringify({
        state: {
            desired: {
                [key]: value
            }
        }
    })
});

exports.handler = async (event) => {
    let message = "Invalid device";
    const table = process.env.STORAGE_PRODUCTTABLE_NAME;
    const region = process.env.REGION;

    const serial = event.pathParameters.proxy;
    const account = event.requestContext.identity.user.split(":")[0];
    const body = JSON.parse(event.body)

    const res = await documentClient.query(getQueryParams(table, serial)).promise();
    if (res.Items[0].account === account) {
        if (!iotData) {
            const endpoint = await iotClient.describeEndpoint().promise();
            iotData = new AWS.IotData({ endpoint: endpoint.endpointAddress, region });
        }
        const updateParams = getUpdateParams(serial, body.key, body.value);
        await iotData.updateThingShadow(updateParams).promise();
        message = "success";
    }

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(message),
    };
    return response;
};
