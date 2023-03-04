import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const USER_TABLE_NAME = process.env.TABLE_NAME;

export const readUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.pathParameters?.id;

    if (!userId) {
      throw new Error('User ID not provided in the request');
    }

    const result = await dynamoDB.get({
      TableName: USER_TABLE_NAME,
      Key: { userId },
    }).promise();

    if (!result.Item) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error reading user',
        error: error.message,
      }),
    };
  }
};
