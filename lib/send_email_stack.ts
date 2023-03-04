import * as cdk from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface SendEmailStackProps extends cdk.StackProps {
  userTable: dynamodb.Table;
}

export class SendEmailStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SendEmailStackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'UserCreatedTopic');

    topic.addSubscription(new subscriptions.EmailSubscription('YOUR_EMAIL_ADDRESS'));

    const handler = new lambda.Function(this, 'SendEmailHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/createUserEmail'),
      handler: 'createUserEmail.handler',
      environment: {
        TOPIC_ARN: topic.topicArn
      }
    });

    handler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:GetItem'],
        resources: [props.userTable.tableArn]
      })
    );
    handler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['sns:Publish'],
        resources: [topic.topicArn]
      })
    );
  }
}
