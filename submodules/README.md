# iot-foundational-quickstart

TODO 
1) Complete JITR lambda
2) Deploy multiple projects to single region (lambda custom resource for DD)

## General Overview
This project contains the front and backend for the IoT foundational quickstart.

The front end is accessible to all users in the Cognito user pool with name starting with "iotquickstart".

## Requirements
AWS account
Nodejs

## Getting Started
Steps to deploy the backend and frontend resources in your AWS account

1. Install Amplify CLI
```
npm install -g @aws-amplify/cli
```
2. Configure Amplify
Use the amplify cli to configure your account and AWS IAM user
```
amplify configure
```
3. Setup app in your account
```
amplify init --app {repo url}
```
Do you want ot use an AWS profile? Yes
Select your profile
4. Host public web portal
```
amplify add hosting
```
You have the option to set up website that is updated using the amplify cli (manual deploy) or to set up a CI/CD pipeline that is triggered by commits to your code commit repo.
* Manual Deploy (quick setup)
    1. Select manual deploy
    2. Publish the web portal as a public website 
    ```
    amplify publish -c -y
    ```
    3. Note the url of the website
* CI/CD
    1. Selecting CI/CD will redirect you to the Amplify console.
    2. Copy the github repo to a codecommit repo in your account: [Migrate repo to code commit](https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-migrate-repository-existing.html) 
    3. Follow the Amplify console prompts to link your CI/CD pipeline to the CodeCommit repo that you created. 
    4. Note the url of the website
5. (Optional) Create portal user
* Use a browser to navigate to the url provided by the add hosting step. Create a new user to login to the portal.

6. (Optional) Create a device


## Removing resources
To remove resources
1. 
```
amplify delete
```



___________________________________________
2. Install project dependencies

```bash
$ npm install
```

3. Create backend

```bash
$ amplify init
$ amplify push
```

4. For development and local debugging

```bash
$ npm run serve
```

open http://localhost:8080/

5. To update the live version hosted in S3
```bash
amplify publish -c 
```

6. Obtain UI url
```bash
aws cloudformation describe-stacks --region us-east-1 --query "Stacks[?contains(StackName,'-hostingS3AndCloudFront-')].Outputs | [0][?OutputKey=='WebsiteURL'] | [0].OutputValue"
```

7. Create a Cognito user to be able to login to UI. In Cognito user pools, select pool containing "iotquickstart" in name (use command below to obtain exact name).

```bash
aws cloudformation describe-stacks --region us-east-1 --query "Stacks[?contains(StackName,'-iotquickstart')].Outputs | [0][?OutputKey=='IdentityPoolName'] | [0].OutputValue"
```

Within the "Users and groups" tab, select "Create User" and then fill in details for a new user. New users require an email but not a phone number.

8. amplify configure project

9. amplify env checkout dev