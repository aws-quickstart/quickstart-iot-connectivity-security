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

const updateParams = (TableName, serialNumber, account) => ({
    TableName,
    Key: { serialNumber },
    UpdateExpression: 'set account = :account',
    ConditionExpression: 'serialNumber = :serialNumber and attribute_not_exists(account)',
    ExpressionAttributeValues: {
        ':account': account,
        ':serialNumber': serialNumber,
    }
});

const updateThingGroupParams = (thingGroupName, thingName) => ({
    thingGroupName,
    thingName
});

const updateThingParams = (thingName, account) => ({
    thingName,
    attributePayload: {
        attributes: {
            'account': account,
        },
        merge: true
    }
});

const getUpdateParams = (serial, value) => ({
    thingName: serial,
    payload: JSON.stringify({
        state: {
            reported: {
                account: value
            }
        }
    })
});

exports.handler = async (event) => {
    let message = "Invalid serial number";
    const table = process.env.STORAGE_PRODUCTTABLE_NAME;
    const serial = event.pathParameters.proxy;
    const account = event.requestContext.identity.user.split(":")[0];
    const activeGroup = process.env.GROUP_ACTIVE;
    const inactiveGroup = process.env.GROUP_INACTIVE;
    const region = process.env.REGION;

    try {
        const removeparams = updateThingGroupParams(inactiveGroup, serial);
        await iotClient.removeThingFromThingGroup(removeparams).promise();
        const addparams = updateThingGroupParams(activeGroup, serial);
        await iotClient.addThingToThingGroup(addparams).promise();
        try {
            await documentClient.update(updateParams(table, serial, account)).promise();
            await iotClient.updateThing(updateThingParams(serial, account)).promise();
            message = "device registered";
            if (!iotData) {
                const endpoint = await iotClient.describeEndpoint().promise();
                iotData = new AWS.IotData({ endpoint: endpoint.endpointAddress, region });
            }
            const shadowUpdateParams = getUpdateParams(serial, account);
            await iotData.updateThingShadow(shadowUpdateParams).promise();
        } catch (e) {
            console.log(`Invalid serial: ${serial} for account: ${account}`);
        }
    } catch (e) {
        console.log(`Error adding: ${serial} to group: Active`);
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
