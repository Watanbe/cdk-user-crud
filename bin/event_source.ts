#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EventSourceStack } from '../lib/event_source-stack';

const app = new cdk.App();
new EventSourceStack(app, 'EventSourceStack');
