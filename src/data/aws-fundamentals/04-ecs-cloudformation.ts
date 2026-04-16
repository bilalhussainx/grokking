import { Module } from "../types";

export const module4: Module = {
  id: "ecs-cloudformation",
  title: "ECS, CloudFormation & Infrastructure as Code",
  description: "Run containers on ECS Fargate, manage infrastructure with CloudFormation and CDK, and deploy complete stacks with CI/CD",
  lessons: [
    {
      id: "ecs-fargate",
      slug: "ecs-fargate",
      title: "ECS Fargate & CloudFormation: Containers Without Servers",
      content: `# ECS Fargate & CloudFormation

ECS (Elastic Container Service) runs Docker containers. Fargate removes the need to manage EC2 instances — you specify CPU/memory and AWS handles the rest.

---

## ECS Architecture

\`\`\`sysdiag
{
  "type": "hierarchy",
  "title": "ECS Concepts",
  "nodes": [
    {
      "name": "Cluster",
      "description": "Logical grouping of services and tasks. Can span multiple AZs.",
      "children": [
        {
          "name": "Service",
          "description": "Maintains desired task count, handles rolling deploys, registers with ALB",
          "children": [
            {
              "name": "Task",
              "description": "Running instance of a Task Definition — one or more containers"
            }
          ]
        }
      ]
    },
    {
      "name": "Task Definition",
      "description": "Blueprint: which images, CPU/memory, environment variables, IAM role, log group"
    }
  ]
}
\`\`\`

## CloudFormation: Infrastructure as Code

\`\`\`yaml
# cloudformation/app-stack.yml — Full ECS Fargate deployment
AWSTemplateFormatVersion: '2010-09-09'
Description: 'ECS Fargate Application Stack'

Parameters:
  ImageTag:
    Type: String
    Default: latest
  Environment:
    Type: String
    AllowedValues: [dev, staging, prod]

Resources:
  # --- ECS Cluster ---
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: !Sub '\${Environment}-cluster'
      CapacityProviders: [FARGATE, FARGATE_SPOT]
      DefaultCapacityProviderStrategy:
        - CapacityProvider: FARGATE
          Weight: 1
          Base: 2             # At least 2 FARGATE tasks (not SPOT)
        - CapacityProvider: FARGATE_SPOT
          Weight: 4           # 4x as many SPOT tasks (80% cheaper!)

  # --- Task Definition ---
  AppTaskDef:
    Type: AWS::ECS::TaskDefinition
    Properties:
      Family: !Sub '\${Environment}-app'
      Cpu: 512            # 0.5 vCPU
      Memory: 1024        # 1 GB
      NetworkMode: awsvpc # Required for Fargate
      RequiresCompatibilities: [FARGATE]
      ExecutionRoleArn: !GetAtt ECSExecutionRole.Arn  # Pull images, write logs
      TaskRoleArn: !GetAtt AppTaskRole.Arn             # App permissions (S3, DynamoDB)
      ContainerDefinitions:
        - Name: app
          Image: !Sub '\${AWS::AccountId}.dkr.ecr.\${AWS::Region}.amazonaws.com/my-app:\${ImageTag}'
          PortMappings:
            - ContainerPort: 3000
          Environment:
            - Name: NODE_ENV
              Value: !Ref Environment
          Secrets:
            - Name: DATABASE_URL
              ValueFrom: !Sub 'arn:aws:secretsmanager:\${AWS::Region}:\${AWS::AccountId}:secret:db-url'
          LogConfiguration:
            LogDriver: awslogs
            Options:
              awslogs-group: !Ref AppLogGroup
              awslogs-region: !Ref AWS::Region
              awslogs-stream-prefix: app
          HealthCheck:
            Command: ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"]
            Interval: 30
            Timeout: 5
            Retries: 3

  # --- ECS Service ---
  AppService:
    Type: AWS::ECS::Service
    Properties:
      Cluster: !Ref ECSCluster
      TaskDefinition: !Ref AppTaskDef
      LaunchType: FARGATE
      DesiredCount: 2
      DeploymentConfiguration:
        MaximumPercent: 200
        MinimumHealthyPercent: 100   # Rolling update: add new before removing old
        DeploymentCircuitBreaker:
          Enable: true               # Auto-rollback on failed deployment
          Rollback: true
      NetworkConfiguration:
        AwsvpcConfiguration:
          Subnets:
            - !ImportValue PrivateSubnet1
            - !ImportValue PrivateSubnet2
          SecurityGroups:
            - !Ref AppSecurityGroup
          AssignPublicIp: DISABLED
      LoadBalancers:
        - ContainerName: app
          ContainerPort: 3000
          TargetGroupArn: !Ref AppTargetGroup

  # --- Auto Scaling ---
  ScalingTarget:
    Type: AWS::ApplicationAutoScaling::ScalableTarget
    Properties:
      ServiceNamespace: ecs
      ResourceId: !Sub 'service/\${ECSCluster}/\${AppService.Name}'
      ScalableDimension: ecs:service:DesiredCount
      MinCapacity: 2
      MaxCapacity: 20

  ScalingPolicy:
    Type: AWS::ApplicationAutoScaling::ScalingPolicy
    Properties:
      PolicyName: cpu-scaling
      PolicyType: TargetTrackingScaling
      ScalingTargetId: !Ref ScalingTarget
      TargetTrackingScalingPolicyConfiguration:
        PredefinedMetricSpecification:
          PredefinedMetricType: ECSServiceAverageCPUUtilization
        TargetValue: 70.0    # Scale when avg CPU > 70%

  AppLogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub '/ecs/\${Environment}-app'
      RetentionInDays: 30

Outputs:
  ALBDNSName:
    Value: !GetAtt AppALB.DNSName
    Export:
      Name: !Sub '\${Environment}-alb-dns'
\`\`\`

## Deploying with CloudFormation

\`\`\`bash
# Validate template:
aws cloudformation validate-template --template-body file://app-stack.yml

# Deploy (create or update — idempotent):
aws cloudformation deploy \\
  --template-file app-stack.yml \\
  --stack-name prod-app \\
  --parameter-overrides ImageTag=v1.2.3 Environment=prod \\
  --capabilities CAPABILITY_IAM \\
  --no-fail-on-empty-changeset

# Check stack events (useful for debugging failed deploys):
aws cloudformation describe-stack-events --stack-name prod-app \\
  --query 'StackEvents[?ResourceStatus==\`CREATE_FAILED\`]'

# Delete stack (tears down everything!):
aws cloudformation delete-stack --stack-name prod-app
\`\`\`

\`\`\`takeaways
["FARGATE_SPOT is 70% cheaper than FARGATE — use it for fault-tolerant workloads (web servers handle interruptions)", "DeploymentCircuitBreaker: Enable=true means ECS automatically rolls back if new tasks fail health checks", "ExecutionRole: pulls images + writes logs. TaskRole: what your app can access (S3, DynamoDB, Secrets Manager).", "Secrets in task definition via ValueFrom: fetches from Secrets Manager at task start — never in environment vars", "CloudFormation deploy is idempotent — safe to run in CI/CD on every push", "!ImportValue uses exported values from other stacks — separates VPC stack from app stack cleanly"]
\`\`\`
`,
    },
  ],
};
