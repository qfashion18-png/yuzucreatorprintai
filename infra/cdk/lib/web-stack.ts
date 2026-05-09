import {
  Stack,
  aws_amplify as amplify,
  type StackProps,
} from "aws-cdk-lib";
import type { Construct } from "constructs";

export type WebStackProps = StackProps & {
  envName: string;
  userPoolId: string;
  repository?: string;
  accessTokenSecretId?: string;
};

export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id, props);

    const hasGitConnection = Boolean(props.repository && props.accessTokenSecretId);
    const accessToken = props.accessTokenSecretId
      ? `{{resolve:secretsmanager:${props.accessTokenSecretId}:SecretString:accessToken}}`
      : undefined;

    const amplifyApp = new amplify.CfnApp(this, "AmplifyApp", {
      name: `CreatorPrint AI ${props.envName}`,
      platform: "WEB_COMPUTE",
      ...(hasGitConnection
        ? { repository: props.repository, accessToken }
        : {}),
      buildSpec: amplifyBuildSpec(props.envName, props.userPoolId),
      environmentVariables: [
        { name: "AMPLIFY_MONOREPO_APP_ROOT", value: "apps/web" },
        { name: "APP_ENV", value: props.envName },
        { name: "PRINT_PROVIDER", value: "mock" },
        { name: "AI_PROVIDER", value: "mock" },
      ],
    });

    new amplify.CfnBranch(this, "MainBranch", {
      appId: amplifyApp.attrAppId,
      branchName: "main",
      framework: "Next.js - SSR",
      stage: props.envName === "prod" ? "PRODUCTION" : "DEVELOPMENT",
      enableAutoBuild: hasGitConnection,
    });
  }
}

function amplifyBuildSpec(envName: string, userPoolId: string): string {
  return `version: 1
applications:
  - appRoot: apps/web
    frontend:
      buildPath: /
      phases:
        preBuild:
          commands:
            - npm install -g pnpm@11.0.9
            - pnpm install --frozen-lockfile
        build:
          commands:
            - pnpm --filter web build
            - bash scripts/prepare-amplify-runtime.sh
      artifacts:
        baseDirectory: apps/web/.next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - apps/web/node_modules/**/*
    environment:
      variables:
        APP_ENV: ${envName}
        NEXT_PUBLIC_COGNITO_USER_POOL_ID: ${userPoolId}
`;
}
