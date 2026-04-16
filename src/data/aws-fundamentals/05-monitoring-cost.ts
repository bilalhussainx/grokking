import { Module } from "../types";

export const module5: Module = {
  id: "monitoring-cost",
  title: "CloudWatch, Cost Optimization & AWS Architecture Patterns",
  description: "Monitor with CloudWatch, set up alarms and dashboards, optimize costs with Reserved Instances and Spot, and apply the AWS Well-Architected Framework",
  lessons: [
    {
      id: "cloudwatch-cost",
      slug: "cloudwatch-cost",
      title: "CloudWatch Monitoring & AWS Cost Optimization",
      content: `# CloudWatch & Cost Optimization

Visibility and cost control are two sides of the same coin: you can't optimize what you can't see.

---

## CloudWatch: Metrics, Logs & Alarms

\`\`\`python
# Emit custom metrics from your app:
import boto3
cloudwatch = boto3.client('cloudwatch', region_name='us-east-1')

def record_metric(name: str, value: float, unit: str = 'Count'):
    cloudwatch.put_metric_data(
        Namespace='MyApp/Production',
        MetricData=[{
            'MetricName': name,
            'Value': value,
            'Unit': unit,
            'Dimensions': [
                {'Name': 'Environment', 'Value': 'production'},
                {'Name': 'Service', 'Value': 'api'},
            ],
        }]
    )

# Usage:
record_metric('OrdersProcessed', 1)
record_metric('ResponseTime', 245.6, 'Milliseconds')
record_metric('ErrorRate', 0.02, 'Percent')
\`\`\`

\`\`\`yaml
# CloudFormation: Create alarm + SNS notification
ApiErrorAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: !Sub '\${Environment}-api-5xx-high'
    AlarmDescription: 'API 5xx error rate exceeds threshold'
    MetricName: 5XXError
    Namespace: AWS/ApplicationELB
    Statistic: Sum
    Period: 300        # 5 minute window
    EvaluationPeriods: 2
    Threshold: 10
    ComparisonOperator: GreaterThanThreshold
    AlarmActions:
      - !Ref AlertTopic    # SNS → PagerDuty/Slack
    OKActions:
      - !Ref AlertTopic
    TreatMissingData: notBreaching
    Dimensions:
      - Name: LoadBalancer
        Value: !GetAtt AppALB.LoadBalancerFullName

# CloudWatch Insights query (in console or CLI):
# fields @timestamp, @message
# | filter @message like /ERROR/
# | stats count(*) as errorCount by bin(5m)
# | sort errorCount desc
\`\`\`

## AWS Cost Optimization

\`\`\`compare
{
  "title": "EC2 Pricing Models",
  "items": [
    {
      "name": "On-Demand",
      "description": "Pay by hour/second, no commitment. Most expensive. Use for: unpredictable workloads, dev/test, short-term. Baseline for comparison."
    },
    {
      "name": "Reserved Instances (1-3yr)",
      "description": "1-year: 40% discount. 3-year: 60%+ discount. Use for: steady-state production workloads you KNOW will run for 1+ years. Commit to instance family (Standard) or flexibility (Convertible)."
    },
    {
      "name": "Savings Plans",
      "description": "Commit to $/hour compute spend (not specific instance type). More flexible than RIs. Covers EC2, Lambda, Fargate. Recommended over RIs for most teams."
    },
    {
      "name": "Spot Instances",
      "description": "Up to 90% discount. AWS can reclaim with 2-min notice. Use for: batch processing, ML training, fault-tolerant stateless web servers. NEVER for databases or stateful primary systems."
    }
  ]
}
\`\`\`

## The Well-Architected Framework

\`\`\`sysdiag
{
  "type": "pillars",
  "title": "AWS Well-Architected Framework — 6 Pillars",
  "pillars": [
    { "name": "Operational Excellence", "focus": "Automate operations, learn from failures, make frequent small improvements" },
    { "name": "Security", "focus": "Defense in depth, least privilege, encrypt data at rest and in transit, audit logs" },
    { "name": "Reliability", "focus": "Multi-AZ, auto-scaling, health checks, chaos engineering, graceful degradation" },
    { "name": "Performance Efficiency", "focus": "Right-size instances, serverless where possible, CDN for static assets, caching" },
    { "name": "Cost Optimization", "focus": "Reserved/Savings Plans, Spot for batch, rightsize, delete unused resources" },
    { "name": "Sustainability", "focus": "Maximize utilization, use managed services (more efficient infra sharing)" }
  ]
}
\`\`\`

## AWS Architecture Patterns Assessment

\`\`\`quiz
{
  "questions": [
    {
      "q": "Your application has steady traffic of 10 requests/sec 24/7, plus spikes to 100 req/sec for 1 hour each day during business hours. What EC2 pricing combination is optimal?",
      "options": [
        "100% On-Demand for simplicity",
        "Reserved Instances for the baseline steady 10 req/sec capacity, On-Demand or Spot for the spike capacity",
        "100% Spot Instances for maximum savings",
        "Reserved Instances for 100% of peak capacity"
      ],
      "answer": 1,
      "explanation": "This is a classic base + burst pattern. Reserve instances for the predictable baseline (10 req/sec) to get 40-60% discount on steady-state cost. Use On-Demand or Spot for the burst capacity (10→100 req/sec for 1hr/day). Running Spot for bursts saves 70-90% on that burst capacity. Over-reserving for peak wastes money on idle capacity 23 hours/day."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Custom CloudWatch metrics let you alarm on business KPIs (orders processed, error rate, p99 latency)", "Savings Plans > Reserved Instances for most teams — same discount, but works across instance families", "Spot Instances: 90% cheaper, 2-minute eviction notice. Perfect for batch ML training, stateless auto-scaling groups.", "Multi-AZ is not optional for production — a single-AZ database is a single point of failure", "Use AWS Cost Explorer to find top 5 cost drivers monthly — unattached EBS volumes and old snapshots are common waste", "The Well-Architected Tool in AWS console runs free reviews against all 6 pillars"]
\`\`\`
`,
    },
  ],
};
