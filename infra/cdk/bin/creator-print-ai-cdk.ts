#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { AiStack } from "../lib/ai-stack.js";
import { CoreStack } from "../lib/core-stack.js";
import { WebStack } from "../lib/web-stack.js";

const app = new App();
const envName = app.node.tryGetContext("envName") ?? process.env.APP_ENV ?? "dev";
const amplifyRepository =
  app.node.tryGetContext("amplifyRepository") ??
  process.env.AMPLIFY_REPOSITORY_URL;
const amplifyAccessTokenSecretId =
  app.node.tryGetContext("amplifyAccessTokenSecretId") ??
  process.env.AMPLIFY_GITHUB_TOKEN_SECRET_ID;

const core = new CoreStack(app, `CreatorPrintCore-${envName}`, { envName });
new AiStack(app, `CreatorPrintAi-${envName}`, { envName });
new WebStack(app, `CreatorPrintWeb-${envName}`, {
  envName,
  userPoolId: core.userPool.userPoolId,
  repository: amplifyRepository,
  accessTokenSecretId: amplifyAccessTokenSecretId,
});
