#!/bin/bash

CLIENT_ID=$1
USERNAME=$2
PASSWORD=$3

aws cognito-idp initiate-auth \
--profile soumaissol \
--region us-east-1 \
--auth-flow USER_PASSWORD_AUTH \
--auth-parameters "USERNAME=$2,PASSWORD=$3" \
--query "AuthenticationResult.IdToken" \
--client-id $1
