import {
  Stack,
  aws_iam as iam,
  type StackProps,
} from "aws-cdk-lib";
import type { Construct } from "constructs";

export type AiStackProps = StackProps & {
  envName: string;
};

export class AiStack extends Stack {
  constructor(scope: Construct, id: string, props: AiStackProps) {
    super(scope, id, props);

    new iam.ManagedPolicy(this, "AiWorkerPolicy", {
      managedPolicyName: `creatorprint-ai-worker-${props.envName}`,
      description: "Least-privilege placeholder policy for Bedrock and Rekognition AI workers.",
      statements: [
        new iam.PolicyStatement({
          actions: ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream", "bedrock:Converse", "bedrock:ApplyGuardrail"],
          resources: ["*"],
        }),
        new iam.PolicyStatement({
          actions: ["rekognition:DetectModerationLabels"],
          resources: ["*"],
        }),
      ],
    });
  }
}
