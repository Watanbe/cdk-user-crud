import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const USER_TABLE_NAME = process.env.TABLE_NAME;

interface User {
    userId: string;
    name: string;
    email: string;
    password: string;
}

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {

    if (!event.body) {
        throw new Error('No body provided in the request');
    }

    const userId = event.pathParameters?.id;
    const body = JSON.parse(event.body) as Partial<User>;

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

    const updatedUser = { ...user.Item, ...body };

    await dynamoDB.put({
      TableName: USER_TABLE_NAME,
      Item: updatedUser,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(updatedUser),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error updating user',
        error: error.message,
      }),
    };
  }
};
