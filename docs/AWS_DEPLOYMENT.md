# AWS Deployment

AWS MCP documentation checks were used for S3 security best practices, Cognito, DynamoDB, Step Functions, Bedrock, and Amplify monorepo deployment guidance.

CDK stacks:

- `CoreStack`: KMS, private S3 buckets, DynamoDB tables, Cognito User Pool/groups, Secrets Manager, EventBridge, SQS queues, Step Functions skeleton.
- `AiStack`: Bedrock and Rekognition IAM policy placeholder for workers.
- `WebStack`: Amplify Hosting placeholder using pnpm monorepo settings.

Before deployment:

```bash
aws sts get-caller-identity
aws configure list
pnpm cdk:synth
pnpm cdk:diff
```

Only deploy once the target AWS account, region, permissions, and environment name are confirmed.

## Git-Connected Amplify Builds

This app is a Next.js SSR app using route handlers, so Amplify should build it from a connected Git repository. AWS Amplify manual deploys do not support SSR apps.

The CDK `WebStack` can optionally connect Amplify to GitHub when both values are provided:

```bash
pnpm cdk:deploy -- \
  -c amplifyRepository=https://github.com/qfashion18-png/yuzucreatorprintai.git \
  -c amplifyAccessTokenSecretId=creatorprint/amplify/github
```

The Secrets Manager secret must contain JSON like:

```json
{ "accessToken": "github_pat_or_classic_token" }
```

For the already-created Amplify app, use the safe helper script after the source repository exists:

```powershell
$env:AMPLIFY_GITHUB_ACCESS_TOKEN = "<token for this shell only>"
pnpm amplify:connect -- -RepositoryUrl "https://github.com/qfashion18-png/yuzucreatorprintai.git"
```

Or read the token from Secrets Manager:

```powershell
pnpm amplify:connect -- -RepositoryUrl "https://github.com/qfashion18-png/yuzucreatorprintai.git" -GitHubTokenSecretId "creatorprint/amplify/github"
```

The script updates the Amplify app repository, replaces any existing manual `main` branch, enables auto-build on the new Git-backed branch, and starts a `RELEASE` job without printing the token. Pass `-KeepExistingBranch` only if the branch is already Git-backed.

The GitHub repository stores this project in the `creator-print-ai/` folder, so Amplify uses `creator-print-ai/apps/web` as `AMPLIFY_MONOREPO_APP_ROOT`.

Current deployed infrastructure:

- AWS account: `374587466106`
- Region: `us-east-1`
- Amplify app ID: `dfasxx3um10jb`
- Amplify branch: `main`
- Branch URL: `https://main.dfasxx3um10jb.amplifyapp.com`
