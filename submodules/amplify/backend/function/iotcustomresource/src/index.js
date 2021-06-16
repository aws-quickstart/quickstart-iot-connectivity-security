const response = require('cfn-response');
const AWS = require('aws-sdk');
const iotClient = new AWS.Iot();

const createThingGroups = async () => {
    const active = process.env.GroupActive;
    const inactive = process.env.GroupInactive;
    const quarantine = process.env.GroupQuarantine;
    const troubleshooting = process.env.GroupTroubleshooting;
    const policyActive = process.env.PolicyActive;
    const policyInactive = process.env.PolicyInactive;
    const policyQuarantine = process.env.PolicyQuarantine;
    const policyTroubleshooting = process.env.PolicyTroubleshooting;

    const groups = [
        { 'name': active, 'policy': policyActive },
        { 'name': inactive, 'policy': policyInactive },
        { 'name': quarantine, 'policy': policyQuarantine },
        { 'name': troubleshooting, 'policy': policyTroubleshooting }
    ];

    for (const group of groups) {
        try {
            const thinggroup = await iotClient.createThingGroup({ thingGroupName: group.name }).promise();
            await iotClient.attachPolicy({ policyName: group.policy, target: thinggroup.thingGroupArn }).promise();
        } catch (e) {
            console.log('error creating thing group');
        }
    }
};
const delay = ms => new Promise(res => setTimeout(res, ms));


exports.handler = async (event, context) => {
    console.log(event);
    const responseData = {};
    try {
        const type = event.RequestType;
        if (type === 'Create') {
            await createThingGroups();
        } else if (type === 'Update') {
            console.log('update');
        } else {
            console.log('delete');
        }
    } catch (e) {
        console.log(e);
    }
    response.send(event, context, response.SUCCESS, responseData);
    await delay(5000);
};
