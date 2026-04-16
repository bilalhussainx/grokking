import { Module } from "../types";

export const module1: Module = {
  id: "iam-core-services",
  title: "IAM, EC2 & S3: AWS Core Services",
  description: "Identity and Access Management from first principles, EC2 instance types, S3 storage classes, and the AWS shared responsibility model",
  lessons: [
    {
      id: "aws-iam",
      slug: "aws-iam",
      title: "IAM: Identity and Access Management",
      content: `# AWS IAM: Who Can Do What

IAM is the security backbone of AWS. Every action in AWS passes through IAM. Get it wrong and you have either a security breach or a broken application.

---

\`\`\`concept
{
  "title": "The Shared Responsibility Model",
  "variant": "mental-model",
  "content": "AWS is responsible for security OF the cloud (hardware, data centers, hypervisors). YOU are responsible for security IN the cloud (IAM policies, encryption keys, VPC configuration, data classification, patching your OS on EC2). Never confuse 'AWS is secure' with 'your AWS deployment is secure.'"
}
\`\`\`

---

## The IAM Building Blocks

\`\`\`compare
{
  "title": "IAM Core Concepts",
  "items": [
    {
      "name": "User",
      "description": "A person or application with long-term credentials (access key + secret). Best practice: human users → SSO/Identity Center, not IAM users. Only create IAM users for programmatic access when unavoidable."
    },
    {
      "name": "Group",
      "description": "Collection of users. Attach policies to groups, not individuals. Groups cannot contain other groups. User inherits all group policies."
    },
    {
      "name": "Role",
      "description": "Temporary credentials assumed by services, users, or external identities. EC2 instances, Lambda functions, and ECS tasks should ALL use roles, not access keys. Roles are the secure, scalable way to grant AWS service permissions."
    },
    {
      "name": "Policy",
      "description": "JSON document defining allow/deny permissions. Attached to users, groups, or roles. Evaluated: explicit deny wins over explicit allow. No explicit allow = implicit deny."
    }
  ]
}
\`\`\`

## Writing IAM Policies

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadOnBucket",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:GetObjectVersion"
      ],
      "Resource": [
        "arn:aws:s3:::my-bucket",
        "arn:aws:s3:::my-bucket/*"
      ],
      "Condition": {
        "StringEquals": {
          "s3:prefix": "uploads/"
        }
      }
    },
    {
      "Sid": "DenyDeleteAll",
      "Effect": "Deny",
      "Action": "s3:DeleteObject",
      "Resource": "*"
    }
  ]
}
\`\`\`

**Policy evaluation logic:**
1. Start: implicitly DENY everything
2. Evaluate all applicable policies
3. Any explicit DENY → final DENY (cannot be overridden)
4. Any explicit ALLOW without DENY → ALLOW
5. No explicit ALLOW → DENY

## EC2: Elastic Compute Cloud

\`\`\`bash
# AWS CLI — Launch an EC2 instance:
aws ec2 run-instances \\
  --image-id ami-0c02fb55956c7d316 \\
  --instance-type t3.micro \\
  --key-name my-key-pair \\
  --security-group-ids sg-12345678 \\
  --subnet-id subnet-12345678 \\
  --iam-instance-profile Name=my-ec2-role \\
  --user-data file://startup.sh \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=my-server}]'
\`\`\`

\`\`\`compare
{
  "title": "EC2 Instance Families",
  "items": [
    {
      "name": "General Purpose (t3, m6i)",
      "description": "Balanced CPU/memory. t3: burstable (credits) — good for dev/staging with variable load. m6i: steady workloads, web servers, app servers."
    },
    {
      "name": "Compute Optimized (c6i, c6g)",
      "description": "High CPU-to-memory ratio. Batch processing, video encoding, gaming servers, high-traffic web frontends."
    },
    {
      "name": "Memory Optimized (r6i, x2gd)",
      "description": "High memory-to-CPU ratio. In-memory databases (Redis, SAP HANA), real-time analytics, large dataset caching."
    },
    {
      "name": "Storage Optimized (i3, d3)",
      "description": "High-speed local NVMe storage. OLTP databases, Elasticsearch, data warehouses needing low-latency disk I/O."
    },
    {
      "name": "GPU (p4, g5)",
      "description": "NVIDIA A100/A10G GPUs. ML training (p4), ML inference (g5), video transcoding, 3D rendering."
    }
  ]
}
\`\`\`

## S3: Object Storage

\`\`\`bash
# S3 fundamentals via CLI:

# Create bucket:
aws s3 mb s3://my-unique-bucket --region us-east-1

# Upload file:
aws s3 cp local-file.txt s3://my-bucket/uploads/local-file.txt
aws s3 sync ./local-dir/ s3://my-bucket/remote-dir/   # Sync directory

# Download:
aws s3 cp s3://my-bucket/uploads/file.txt ./file.txt

# List:
aws s3 ls s3://my-bucket/ --recursive --human-readable

# Presigned URL (temp access, no AWS credentials needed):
aws s3 presign s3://my-bucket/private-file.pdf --expires-in 3600
\`\`\`

\`\`\`compare
{
  "title": "S3 Storage Classes",
  "items": [
    {
      "name": "S3 Standard",
      "description": "Frequently accessed data. 99.99% availability, 3 AZ redundancy. Most expensive storage. Use for active data."
    },
    {
      "name": "S3 Infrequent Access (IA)",
      "description": "Accessed a few times/month. 40% cheaper storage, retrieval fee. Minimum 30-day retention. Use for backups, DR copies."
    },
    {
      "name": "S3 Glacier Instant Retrieval",
      "description": "Archival data accessed quarterly. 68% cheaper than Standard, millisecond retrieval. Minimum 90-day retention."
    },
    {
      "name": "S3 Intelligent-Tiering",
      "description": "Automatically moves objects between tiers based on access patterns. Small monthly monitoring fee. Best when access patterns are unknown."
    }
  ]
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "An EC2 instance needs to read from an S3 bucket. What is the correct way to grant this permission?",
      "options": [
        "Hardcode AWS access keys in the application code",
        "Create an IAM User, generate access keys, and set them as environment variables on the EC2 instance",
        "Create an IAM Role with S3 read permissions, attach it to the EC2 instance profile — the instance gets temporary credentials automatically",
        "Make the S3 bucket public"
      ],
      "answer": 2,
      "explanation": "IAM Roles are the correct solution. Never use long-term access keys on EC2. Instance profiles attach a role to EC2 — the instance metadata service provides temporary, auto-rotating credentials. Your app uses the SDK (boto3, AWS SDK) without hardcoding any credentials. The SDK automatically retrieves credentials from the metadata service (http://169.254.169.254/latest/meta-data/iam/)."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
