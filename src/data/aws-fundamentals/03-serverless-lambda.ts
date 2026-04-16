import { Module } from "../types";

export const module3: Module = {
  id: "serverless-lambda",
  title: "Serverless: Lambda, API Gateway & Event-Driven Architecture",
  description: "Build serverless applications with Lambda functions, trigger patterns, cold starts, concurrency limits, and event-driven design with SQS and EventBridge",
  lessons: [
    {
      id: "lambda-fundamentals",
      slug: "lambda-fundamentals",
      title: "Lambda: Run Code Without Servers",
      content: `# AWS Lambda: Serverless Compute

Lambda runs your code in response to events — no server provisioning, no capacity planning, billing by millisecond.

---

\`\`\`concept
{
  "title": "The Lambda Execution Model",
  "variant": "how-it-works",
  "content": "When a Lambda is invoked: AWS finds a container running your runtime (or creates one — cold start). Your handler function runs. When done, the container is 'frozen' — AWS may reuse it for the next invocation (warm start) or discard it. The /tmp directory persists between warm invocations. DB connections, loaded models, anything initialized outside the handler persists across warm invocations — initialize expensive things ONCE."
}
\`\`\`

---

## Writing Lambda Functions

\`\`\`python
# handler.py — Python Lambda function
import json
import boto3
import os
from typing import Any

# Initialize outside handler — persists across warm invocations
dynamodb = boto3.resource('dynamodb')
table    = dynamodb.Table(os.environ['TABLE_NAME'])

def handler(event: dict, context: Any) -> dict:
    """
    event: the trigger payload (API Gateway request, S3 event, SQS message, etc.)
    context: Lambda runtime info (function name, timeout remaining, etc.)
    """
    try:
        # For API Gateway proxy integration:
        body = json.loads(event.get('body', '{}'))
        user_id = event['pathParameters']['userId']

        # Query DynamoDB:
        response = table.get_item(Key={'userId': user_id})
        user = response.get('Item')

        if not user:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'User not found'}),
                'headers': {'Content-Type': 'application/json'},
            }

        return {
            'statusCode': 200,
            'body': json.dumps(user, default=str),
            'headers': {'Content-Type': 'application/json'},
        }

    except Exception as e:
        print(f"Error: {e}")    # CloudWatch Logs
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'}),
        }
\`\`\`

\`\`\`yaml
# serverless.yml (Serverless Framework) — deploy Lambda + API Gateway
service: my-api

provider:
  name: aws
  runtime: python3.12
  region: us-east-1
  memorySize: 512      # MB (also affects CPU allocation)
  timeout: 29          # seconds (API Gateway max is 29s)
  environment:
    TABLE_NAME: \${self:service}-users-\${sls:stage}
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:GetItem
            - dynamodb:PutItem
            - dynamodb:UpdateItem
          Resource: !GetAtt UsersTable.Arn

functions:
  getUser:
    handler: handler.handler
    events:
      - httpApi:               # HTTP API (cheaper than REST API)
          path: /users/{userId}
          method: GET

resources:
  Resources:
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: \${self:service}-users-\${sls:stage}
        AttributeDefinitions:
          - AttributeName: userId
            AttributeType: S
        KeySchema:
          - AttributeName: userId
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST
\`\`\`

## Cold Starts & Performance

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Cold Start",
      "icon": "🥶",
      "content": "### Cold Start Latency\\n\\nCold start = Lambda spins up a new container: download code → start runtime → run init code → call handler.\\n\\n**Typical cold start times:**\\n- Python/Node.js: 200-500ms\\n- Java: 1-5 seconds (JVM startup)\\n- Go/Rust: <100ms (pre-compiled)\\n\\n**Mitigation strategies:**\\n1. **Provisioned Concurrency**: Keep N containers always warm (costs \$\$, eliminates cold starts)\\n2. **Lambda SnapStart** (Java): snapshot initialized JVM, restore on invocation\\n3. **Warm package**: minimize deployment size, avoid huge deps\\n4. **Choose fast runtime**: Python/Node > Java for cold-start-sensitive APIs\\n\\n\`\`\`yaml\\n# Provisioned concurrency:\\nfunctions:\\n  getUser:\\n    handler: handler.handler\\n    provisionedConcurrency: 5  # 5 containers always warm\\n\`\`\`"
    },
    {
      "label": "Concurrency",
      "icon": "🔀",
      "content": "### Lambda Concurrency Limits\\n\\n**Concurrency = simultaneous executions in flight.**\\n\\nDefault: 1000 concurrent executions per region (request increase if needed)\\n\\n\`\`\`\\nReserved concurrency: max N for THIS function (protect others)\\nProvisioned concurrency: N pre-warmed containers\\n\`\`\`\\n\\nThrottling (429): when concurrency limit exceeded, Lambda rejects invocations.\\n\\nFor SQS → Lambda: concurrency scales with queue depth. Set reserved concurrency to prevent consuming all regional capacity.\\n\\n**Burst limit**: 3000 immediately, then +500/minute."
    }
  ]
}
\`\`\`

## Event-Driven Architecture with SQS & EventBridge

\`\`\`python
# Pattern: HTTP request → SQS Queue → Lambda processor
# (Async, reliable, handles bursts)

# Producer (API handler):
import boto3

sqs = boto3.client('sqs')

def submit_job(event, context):
    job_data = json.loads(event['body'])
    sqs.send_message(
        QueueUrl=os.environ['QUEUE_URL'],
        MessageBody=json.dumps(job_data),
        MessageAttributes={
            'JobType': {'DataType': 'String', 'StringValue': 'image-resize'},
        }
    )
    return {'statusCode': 202, 'body': json.dumps({'status': 'queued'})}

# Consumer (SQS-triggered Lambda):
def process_job(event, context):
    for record in event['Records']:
        body = json.loads(record['body'])
        # Process job...
        print(f"Processing job: {body}")
        # If we don't raise, SQS deletes the message automatically
        # If we raise, SQS retries (up to maxReceiveCount, then → DLQ)
\`\`\`

\`\`\`takeaways
["Initialize DB connections and models OUTSIDE the handler — persists across warm invocations", "Python/Node cold starts: 200-500ms. Java: 1-5s. Go: <100ms. Match runtime to cold-start requirements.", "API Gateway timeout is 29 seconds — for long tasks, return 202 Accepted + SQS queue", "Reserved concurrency protects other functions; provisioned concurrency eliminates cold starts (costs money)", "SQS → Lambda: failed messages go to DLQ after maxReceiveCount retries — always configure a DLQ", "Lambda billing: requests + duration (GB-seconds). 1M requests/month free tier."]
\`\`\`
`,
    },
  ],
};
