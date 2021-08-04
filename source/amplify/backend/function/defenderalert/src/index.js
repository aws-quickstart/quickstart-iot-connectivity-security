/* Amplify Params - DO NOT EDIT
    ENV
    REGION
    STORAGE_PRODUCTTABLE_ARN
    STORAGE_PRODUCTTABLE_NAME
Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const iotClient = new AWS.Iot();

const updateParams = (TableName, serialNumber, state) => ({
    TableName,
    Key: { serialNumber },
    UpdateExpression: 'set state = :state',
    ConditionExpression: 'serialNumber = :serialNumber',
    ExpressionAttributeValues: {
        ':state': state,
        ':serialNumber': serialNumber,
    }
});

const updateThingGroupParams = (thingGroupName, thingName) => ({
    thingGroupName,
    thingName
});

exports.handler = async (event) => {
    console.log(event);
    const serial = event.pathParameters.proxy; //TODO update for device defender sns package

    const table = process.env.STORAGE_PRODUCTTABLE_NAME;
    const activeGroup = process.env.GROUP_ACTIVE;
    const inactiveGroup = process.env.GROUP_INACTIVE;
    const quarantineGroup = process.env.GROUP_QUARANTINE;

    try {
        const removeparamsInactive = updateThingGroupParams(inactiveGroup, serial);
        await iotClient.removeThingFromThingGroup(removeparamsInactive).promise();
        const removeparamsActive = updateThingGroupParams(activeGroup, serial);
        await iotClient.removeThingFromThingGroup(removeparamsActive).promise();
        const addparams = updateThingGroupParams(quarantineGroup, serial);
        await iotClient.addThingToThingGroup(addparams).promise();
        try {
            await documentClient.update(updateParams(table, serial, quarantineGroup)).promise();
        } catch (e) {
            console.log(`Invalid serial: ${serial} for account: ${account}`);
        }
    } catch (e) {
        console.log(`Error adding: ${serial} to group: Active`);
    }

    return;
};