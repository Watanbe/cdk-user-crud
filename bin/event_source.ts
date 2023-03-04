#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { UserTableStack } from '../lib/user_table_stack';
import { UserApiStack } from '../lib/user_api_stack';

const app = new cdk.App();
new UserTableStack(app, 'UserTableStack');
new UserApiStack(app, 'UserApiStack');
