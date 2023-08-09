sam deploy \
--profile soumaissol \
--region us-east-1 \
--stack-name auth-api \
--no-confirm-changeset \
--disable-rollback \
--resolve-s3 \
--s3-prefix auth-api \
--capabilities CAPABILITY_IAM \
--config-file samconfig.toml \
--parameter-overrides ParameterKey=Stage,ParameterValue=production