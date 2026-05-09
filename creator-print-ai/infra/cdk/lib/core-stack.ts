import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  type StackProps,
  aws_cognito as cognito,
  aws_dynamodb as dynamodb,
  aws_events as events,
  aws_kms as kms,
  aws_s3 as s3,
  aws_secretsmanager as secretsmanager,
  aws_sqs as sqs,
  aws_stepfunctions as sfn,
} from "aws-cdk-lib";
import type { Construct } from "constructs";

export type CreatorPrintStackProps = StackProps & {
  envName: string;
};

const bucketNames = [
  "creatorprint-user-uploads",
  "creatorprint-generated-assets",
  "creatorprint-template-assets",
  "creatorprint-proofs",
  "creatorprint-print-ready",
  "creatorprint-order-archive",
] as const;

const tableNames = [
  "CreatorPrintUsers",
  "CreatorPrintDesigns",
  "CreatorPrintTemplates",
  "CreatorPrintProducts",
  "CreatorPrintOrders",
  "CreatorPrintProviderEvents",
  "CreatorPrintAgentSessions",
] as const;

export class CoreStack extends Stack {
  readonly userPool: cognito.UserPool;

  constructor(scope: Construct, id: string, props: CreatorPrintStackProps) {
    super(scope, id, props);

    const key = new kms.Key(this, "CreatorPrintKey", {
      alias: `alias/creatorprint-${props.envName}`,
      enableKeyRotation: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    for (const baseName of bucketNames) {
      const bucket = new s3.Bucket(this, bucketId(baseName), {
        bucketName: `${baseName}-${props.envName}`,
        encryption: s3.BucketEncryption.KMS,
        encryptionKey: key,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        enforceSSL: true,
        versioned: true,
        removalPolicy: RemovalPolicy.RETAIN,
        lifecycleRules: [
          {
            abortIncompleteMultipartUploadAfter: Duration.days(7),
            noncurrentVersionExpiration: Duration.days(30),
          },
        ],
      });

      new CfnOutput(this, `${bucketId(baseName)}Name`, { value: bucket.bucketName });
    }

    for (const tableName of tableNames) {
      new dynamodb.Table(this, tableName, {
        tableName: `${tableName}-${props.envName}`,
        partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
        sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        encryption: dynamodb.TableEncryption.AWS_MANAGED,
        pointInTimeRecoverySpecification: {
          pointInTimeRecoveryEnabled: true,
        },
        removalPolicy: RemovalPolicy.RETAIN,
      });
    }

    new secretsmanager.Secret(this, "FourOverSecret", {
      secretName: `creatorprint/4over/${props.envName}`,
      description: "4over API credentials for CreatorPrint AI. Do not store these in source control.",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ baseUrl: "", accountId: "" }),
        generateStringKey: "apiKey",
      },
    });

    this.userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: `creatorprint-users-${props.envName}`,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      standardAttributes: {
        email: { required: true, mutable: true },
      },
      passwordPolicy: {
        minLength: 12,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: false,
      },
      removalPolicy: RemovalPolicy.RETAIN,
    });

    this.userPool.addClient("WebClient", {
      userPoolClientName: `creatorprint-web-${props.envName}`,
      authFlows: { userSrp: true, userPassword: true },
      preventUserExistenceErrors: true,
    });

    new cognito.CfnUserPoolGroup(this, "AdminGroup", {
      groupName: "Admins",
      userPoolId: this.userPool.userPoolId,
      description: "CreatorPrint AI administrators",
    });

    new cognito.CfnUserPoolGroup(this, "CreatorGroup", {
      groupName: "Creators",
      userPoolId: this.userPool.userPoolId,
      description: "CreatorPrint AI customers",
    });

    new events.EventBus(this, "EventBus", {
      eventBusName: `creatorprint-${props.envName}`,
    });

    const renderDlq = new sqs.Queue(this, "RenderDlq", {
      queueName: `creatorprint-render-dlq-${props.envName}`,
      retentionPeriod: Duration.days(14),
      encryption: sqs.QueueEncryption.KMS,
      encryptionMasterKey: key,
    });

    const renderQueue = new sqs.Queue(this, "RenderQueue", {
      queueName: `creatorprint-render-${props.envName}`,
      visibilityTimeout: Duration.minutes(10),
      encryption: sqs.QueueEncryption.KMS,
      encryptionMasterKey: key,
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: renderDlq,
      },
    });

    const providerDlq = new sqs.Queue(this, "ProviderSubmissionDlq", {
      queueName: `creatorprint-provider-dlq-${props.envName}`,
      retentionPeriod: Duration.days(14),
      encryption: sqs.QueueEncryption.KMS,
      encryptionMasterKey: key,
    });

    const providerQueue = new sqs.Queue(this, "ProviderSubmissionQueue", {
      queueName: `creatorprint-provider-submit-${props.envName}`,
      visibilityTimeout: Duration.minutes(10),
      encryption: sqs.QueueEncryption.KMS,
      encryptionMasterKey: key,
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: providerDlq,
      },
    });

    const workflow = new sfn.StateMachine(this, "OrderWorkflow", {
      stateMachineName: `creatorprint-order-workflow-${props.envName}`,
      definitionBody: sfn.DefinitionBody.fromChainable(
        sfn.Chain.start(new sfn.Pass(this, "PreflightPending"))
          .next(new sfn.Pass(this, "RenderProofPlaceholder"))
          .next(new sfn.Pass(this, "ProviderSubmissionPlaceholder")),
      ),
      tracingEnabled: true,
    });

    new CfnOutput(this, "RenderQueueUrl", { value: renderQueue.queueUrl });
    new CfnOutput(this, "ProviderQueueUrl", { value: providerQueue.queueUrl });
    new CfnOutput(this, "OrderWorkflowArn", { value: workflow.stateMachineArn });
    new CfnOutput(this, "UserPoolId", { value: this.userPool.userPoolId });
  }
}

function bucketId(baseName: string): string {
  return baseName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}
