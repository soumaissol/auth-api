#!/bin/bash

USERPOOLID=$1
CLIENT_ID=$2
USERNAME=$3
PASSWORD=$4
NEW_PASSWORD=$5
echo $USERPOOLID
echo $CLIENT_ID
echo $USERNAME
echo $PASSWORD
echo $NEW_PASSWORD

# Do an initial login
# It will come back wtih a challenge response
AUTH_CHALLENGE_SESSION=`aws cognito-idp initiate-auth \
--profile soumaissol \
--region us-east-1 \
--auth-flow USER_PASSWORD_AUTH \
--auth-parameters "USERNAME=$3,PASSWORD=$4" \
--client-id $2 \
--query "Session" \
--output text`

# # Then respond to the challenge
AUTH_TOKEN=`aws cognito-idp admin-respond-to-auth-challenge \
--profile soumaissol \
--region us-east-1 \
--user-pool-id $USERPOOLID \
--client-id $2 \
--challenge-responses "NEW_PASSWORD=$5,USERNAME=$3" \
--challenge-name NEW_PASSWORD_REQUIRED \
--session $AUTH_CHALLENGE_SESSION \
--query "AuthenticationResult.IdToken" \
--output text`

echo "Logged in ID Auth Token: "
echo $AUTH_TOKEN
