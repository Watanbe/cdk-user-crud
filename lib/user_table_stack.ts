import * as cdk from "aws-cdk-lib";
import { Construct } from 'constructs';
import { Stack } from "aws-cdk-lib";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";

export class UserTableStack extends Stack {
  public readonly userTable: Table;
  public static readonly USER_TABLE_NAME = 'UserTable';

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.userTable = new Table(this, "UserTable", {
      partitionKey: { name: "userId", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }
}