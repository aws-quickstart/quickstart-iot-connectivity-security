/* Amplify Params - DO NOT EDIT
    ENV
    REGION
    STORAGE_PRODUCTSTABLE_ARN
    STORAGE_PRODUCTSTABLE_NAME
Amplify Params - DO NOT EDIT */

var AWS = require('aws-sdk');
var forge = require('node-forge');

const documentClient = new AWS.DynamoDB.DocumentClient();
const iotClient = new AWS.Iot();

const putParams = (table, hashKey, serialNumber) => ({
    TableName: table,
    Item: {
        [hashKey]: serialNumber
    },
    ConditionExpression: 'attribute_not_exists(serial)',
});

const updateThingGroupParams = (thingGroupName, thingName) => ({
    thingGroupName,
    thingName
});

exports.handler = async function (event, context, callback) {
    console.log(event);

    const table = process.env.STORAGE_PRODUCTSTABLE_NAME;
    const hashKey = process.env.STORAGE_PRODUCTSTABLE_HASH_KEY;
    const inactiveGroup = process.env.GROUP_INACTIVE;
    const region = process.env.REGION;

    const accountId = event.awsAccountId.toString().trim();
    let serialNumber = "";

    const certificateId = event.certificateId.toString().trim();
    try {
        const data = await iotClient.describeCertificate({ certificateId }).promise();

        const cert = data['certificateDescription']['certificatePem'];
        const cert_obj = forge.pki.certificateFromPem(cert);
        const subject = (cert_obj.subject.attributes);
        for (var i = 0; i < subject.length; i++) {
            if (subject[i]['name'] == 'commonName') {
                serialNumber = subject[i]['value'];
                serialNumber = serialNumber.split('.', 1);
            }
        }

        var dataCreateThing = await iotClient.createThing({ thingName: serialNumber[0] }).promise();
        console.log("device created: ", dataCreateThing);

        const params = putParams(table, hashKey, serialNumber[0]);
        console.log("params", params);
        const dataDDPut = await documentClient.put(params).promise();
        console.log("device registered: ", dataDDPut);

        const certificateARN = `arn:aws:iot:${region}:${accountId}:cert/${certificateId}`;
        const dataattachThingPrincipal = await iotClient.attachThingPrincipal({
            principal: certificateARN,
            thingName: serialNumber[0]
        }).promise();
        console.log("attached thing to principal: ", dataattachThingPrincipal);

        const addparams = updateThingGroupParams(inactiveGroup, serialNumber[0]);
        const dataaddThingToThingGroup = await iotClient.addThingToThingGroup(addparams).promise();
        console.log("attached thing to thing group: ", dataaddThingToThingGroup);

        const addupdateCertificate = await iotClient.updateCertificate({
            certificateId: event.certificateId,
            newStatus: 'ACTIVE'
        }).promise();
        console.log("Updated certificate state to Active ", addupdateCertificate);
    } catch (e) {
        console.log(`Error registering the device: ${serialNumber}`, e);
    }
};