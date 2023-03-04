import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

interface User {
  userId: string;
  name: string;
  email: string;
  password: string;
}

const dynamoDb = new DynamoDB.DocumentClient();
const USER_TABLE_NAME = process.env.TABLE_NAME;


export async function createUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      throw new Error('No body provided in the request');
    }
    
    const body = JSON.parse(event.body);
    const { userId, name, email, password }: User = body;

    const params = {
      TableName: USER_TABLE_NAME,
      Item: { userId, name, email, password },
      ConditionExpression: 'attribute_not_exists(userId)',
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User created successfully' }),
    };
  } catch (error) {
    console.error('Error creating user: ', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error creating user', error: error.message }) };
  }
}
