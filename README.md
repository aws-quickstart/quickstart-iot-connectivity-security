# Quickstart IoT Connectivity Security
## Deploy
1. Upload templates/main.template.yaml in the AWS Cloudformation console
This template will setup all backend and front end resources for this project. 

2. When the Cloudformation stack is complete, note the value for "DefaultDomain" under "Outputs".

This setup process will continue after the Cloudformation stack is complete and takes ~10 min to setup the full app using AWS Amplify even after the Cloudformation stack is complete.

To check on status you can login to the AWS Amplify console and select your app

## Teardown
1. Navigate to your app within the AWS Amplify console and select to delete app.
2. Navigate to the Cloudformation stack that you created in the AWS Cloudformation console and select to delete stack. 
