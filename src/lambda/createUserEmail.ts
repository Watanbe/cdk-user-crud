import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk-core';
import { DynamoDBStreamEvent, Context } from 'aws-lambda';

const AWSWithXRay = AWSXRay.captureAWS(AWS);

const dynamoDB = new AWSWithXRay.DynamoDB.DocumentClient();
const sns = new AWSWithXRay.SNS();

const { USER_TABLE_NAME, TOPIC_ARN } = process.env;

export async function handler(event: DynamoDBStreamEvent, context: Context) {
  const promises = event.Records.map(async record => {
    if (record.eventName === 'INSERT') {
      const user = record.dynamodb?.NewImage;
      const email = user?.email.S;

      const { Item: createdUser } = await dynamoDB.get({
        TableName: 'UserTable',
        Key: {
          id: user?.id.S
        }
      }).promise();

      await sns.publish({
        TopicArn: TOPIC_ARN,
        Message: `Usuário criado: ${createdUser?.name} (${email})`
      }).promise();
    }
  });

  await Promise.all(promises);

  console.log('Email enviado com sucesso!');

  return {};
}