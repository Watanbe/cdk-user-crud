import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Stack } from 'aws-cdk-lib';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { UserTableStack } from './user_table_stack';

export class UserApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const restApi = new RestApi(this, 'UserApi');

    const userTableStack = new UserTableStack(this, 'UserTableStack');
    this.addDependency(userTableStack);

    const createUserFn = new NodejsFunction(this, 'CreateUserFunction', {
      entry: 'src/lambda/createUser.ts',
      handler: 'createUser',
      environment: {
        TABLE_NAME: userTableStack.userTable.tableName,
      },
    });

    const readUserFn = new NodejsFunction(this, 'ReadUserFunction', {
      entry: 'src/lambda/readUser.ts',
      handler: 'readUser',
      environment: {
        TABLE_NAME: userTableStack.userTable.tableName,
      },
    });

    const updateUserFn = new NodejsFunction(this, 'UpdateUserFunction', {
      entry: 'src/lambda/updateUser.ts',
      handler: 'updateUser',
      environment: {
        TABLE_NAME: userTableStack.userTable.tableName,
      },
    });

    const deleteUserFn = new NodejsFunction(this, 'DeleteUserFunction', {
      entry: 'src/lambda/deleteUser.ts',
      handler: 'deleteUser',
      environment: {
        TABLE_NAME: userTableStack.userTable.tableName,
      },
    });

    const createUserIntegration = new LambdaIntegration(createUserFn);
    const readUserIntegration = new LambdaIntegration(readUserFn);
    const updateUserIntegration = new LambdaIntegration(updateUserFn);
    const deleteUserIntegration = new LambdaIntegration(deleteUserFn);

    const resourcePost = restApi.root.addResource('users');
    resourcePost.addMethod('POST', createUserIntegration);

    const resourceId = resourcePost.addResource('{id}');

    resourceId.addMethod('GET', readUserIntegration);
    resourceId.addMethod('PUT', updateUserIntegration);
    resourceId.addMethod('DELETE', deleteUserIntegration);

    userTableStack.userTable.grantReadWriteData(createUserFn);
    userTableStack.userTable.grantReadWriteData(readUserFn);
    userTableStack.userTable.grantReadWriteData(updateUserFn);
    userTableStack.userTable.grantReadWriteData(deleteUserFn);
  }
}
