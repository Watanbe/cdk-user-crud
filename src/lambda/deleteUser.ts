import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const USER_TABLE_NAME = process.env.TABLE_NAME;

export const deleteUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.pathParameters?.id;

    if (!userId) {
      throw new Error('User ID not provided in the request');
    }

    const user = await dynamoDB.get({
      TableName: USER_TABLE_NAME,
      Key: { userId },
    }).promise();

    if (!user.Item) {
      throw new Error(`User with ID ${userId} not found`);
    }

    await dynamoDB.delete({
      TableName: USER_TABLE_NAME,
      Key: { userId },
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User with ID ${userId} has been deleted`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error deleting user',
        error: error.message,
      }),
    };
  }
};
