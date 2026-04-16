import { Module } from "../types";

export const module2: Module = {
  id: "networking-databases",
  title: "VPC Networking & Managed Databases",
  description: "Design VPCs with public/private subnets, security groups, NACLs, route tables, and choose between RDS, DynamoDB, ElastiCache, and Aurora",
  lessons: [
    {
      id: "vpc-networking",
      slug: "vpc-networking",
      title: "VPC: Building Your Network on AWS",
      content: `# AWS VPC: Your Private Cloud Network

VPC (Virtual Private Cloud) is your isolated section of AWS. Every resource you deploy lives inside a VPC. Understanding VPC is essential for security and connectivity.

---

## VPC Architecture

\`\`\`sysdiag
{
  "type": "network",
  "title": "Three-Tier VPC Architecture",
  "tiers": [
    {
      "name": "Public Subnets (2 AZs)",
      "cidr": "10.0.1.0/24, 10.0.2.0/24",
      "resources": ["ALB (Load Balancer)", "NAT Gateway", "Bastion Host"],
      "route": "0.0.0.0/0 → Internet Gateway"
    },
    {
      "name": "Private Subnets (2 AZs)",
      "cidr": "10.0.3.0/24, 10.0.4.0/24",
      "resources": ["EC2 App Servers", "ECS/EKS Pods"],
      "route": "0.0.0.0/0 → NAT Gateway (outbound only)"
    },
    {
      "name": "Database Subnets (2 AZs)",
      "cidr": "10.0.5.0/24, 10.0.6.0/24",
      "resources": ["RDS Multi-AZ", "ElastiCache"],
      "route": "No internet route (isolated)"
    }
  ]
}
\`\`\`

## Security Groups vs NACLs

\`\`\`compare
{
  "title": "Security Groups vs Network ACLs",
  "items": [
    {
      "name": "Security Groups",
      "description": "Stateful — if you allow inbound port 80, the return traffic is automatically allowed. Applied to ENI (instances, load balancers). Rules: ALLOW only. Default: deny all inbound, allow all outbound. Can reference other security groups as sources."
    },
    {
      "name": "Network ACLs",
      "description": "Stateless — must explicitly allow both inbound AND outbound (ephemeral ports 1024-65535 for return traffic). Applied to subnets — affects all resources in subnet. Rules: numbered, evaluated in order, support DENY. Rarely needed if security groups are configured correctly."
    }
  ]
}
\`\`\`

\`\`\`bash
# Create VPC via CLI:
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=prod-vpc}]' \
  --query 'Vpc.VpcId' --output text)

# Create public subnet (us-east-1a):
SUBNET_PUB=$(aws ec2 create-subnet \\
  --vpc-id \$VPC_ID \\
  --cidr-block 10.0.1.0/24 \\
  --availability-zone us-east-1a \\
  --query 'Subnet.SubnetId' --output text)

# Enable auto-assign public IP on public subnet:
aws ec2 modify-subnet-attribute --subnet-id \$SUBNET_PUB \\
  --map-public-ip-on-launch

# Internet Gateway:
IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --vpc-id \$VPC_ID --internet-gateway-id \$IGW_ID

# Route table for public subnet:
RT_ID=$(aws ec2 create-route-table --vpc-id \$VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id \$RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id \$IGW_ID
aws ec2 associate-route-table --route-table-id \$RT_ID --subnet-id \$SUBNET_PUB
\`\`\`

## Managed Databases

\`\`\`tabs
{
  "tabs": [
    {
      "label": "RDS",
      "icon": "🗄️",
      "content": "### RDS: Managed Relational Databases\\n\\nSupports: PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, Aurora\\n\\n\`\`\`bash\\n# Create RDS PostgreSQL instance:\\naws rds create-db-instance \\\\\\n  --db-instance-identifier prod-postgres \\\\\\n  --db-instance-class db.t3.medium \\\\\\n  --engine postgres \\\\\\n  --engine-version 16.1 \\\\\\n  --allocated-storage 100 \\\\\\n  --storage-type gp3 \\\\\\n  --storage-encrypted \\\\\\n  --multi-az \\\\\\n  --db-subnet-group-name my-db-subnet-group \\\\\\n  --vpc-security-group-ids sg-12345678 \\\\\\n  --master-username admin \\\\\\n  --manage-master-user-password   # Stores in Secrets Manager\\n\`\`\`\\n\\n**Multi-AZ**: synchronous replication to standby. Automatic failover in ~60s. Zero data loss. Use for production.\\n\\n**Read Replicas**: asynchronous replication. Scale read traffic. Can promote to master. Can be in different regions."
    },
    {
      "label": "DynamoDB",
      "icon": "⚡",
      "content": "### DynamoDB: Serverless NoSQL\\n\\nKey-value + document. Single-digit millisecond latency at any scale. No capacity planning in on-demand mode.\\n\\n\`\`\`python\\nimport boto3\\n\\ndynamodb = boto3.resource('dynamodb', region_name='us-east-1')\\ntable = dynamodb.Table('users')\\n\\n# Put item:\\ntable.put_item(Item={\\n    'userId': 'user-123',    # Partition key\\n    'email': 'alice@example.com',\\n    'createdAt': '2026-01-01T00:00:00Z',\\n    'profile': {'name': 'Alice', 'age': 30}\\n})\\n\\n# Get item (by primary key — O(1)):\\nresponse = table.get_item(Key={'userId': 'user-123'})\\n\\n# Query (all items with same partition key):\\nresponse = table.query(\\n    KeyConditionExpression='userId = :uid',\\n    ExpressionAttributeValues={':uid': 'user-123'}\\n)\\n\`\`\`\\n\\nWhen to use: session storage, user profiles, gaming leaderboards, IoT data, anything needing <10ms at scale."
    },
    {
      "label": "ElastiCache",
      "icon": "🚀",
      "content": "### ElastiCache: In-Memory Caching\\n\\nManaged Redis or Memcached. Sub-millisecond latency.\\n\\n\`\`\`python\\nimport redis\\n\\n# Connect to ElastiCache Redis:\\nr = redis.Redis(\\n    host='my-cluster.abc123.cache.amazonaws.com',\\n    port=6379,\\n    ssl=True,\\n    decode_responses=True,\\n)\\n\\n# Cache database query results:\\ndef get_user(user_id: str):\\n    cache_key = f'user:{user_id}'\\n    cached = r.get(cache_key)\\n    if cached:\\n        return json.loads(cached)\\n    \\n    user = db.query_user(user_id)  # Slow DB query\\n    r.setex(cache_key, 300, json.dumps(user))  # Cache 5 min\\n    return user\\n\`\`\`\\n\\nUse cases: API response caching, session storage, rate limiting, pub/sub, leaderboards."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Public subnets: route to Internet Gateway. Private subnets: route to NAT Gateway (outbound only). DB subnets: no internet route.", "Security Groups are stateful — return traffic auto-allowed. NACLs are stateless — need explicit allow for both directions.", "RDS Multi-AZ: synchronous replication, auto failover ~60s. Read Replicas: async, scale reads, can promote.", "DynamoDB: use partition key design carefully — hot partitions kill performance. All reads/writes go to one partition.", "Never put database credentials in code. Use AWS Secrets Manager and retrieve at runtime.", "ElastiCache Redis sits in front of RDS — reduces DB load by 90%+ for read-heavy workloads"]
\`\`\`
`,
    },
  ],
};
