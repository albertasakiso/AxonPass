/* ===================================================================
   ANOXPASS — AWS Certified Solutions Architect Associate (SAA-C03)
   =================================================================== */

import type { CertificationCourse } from '../../types/course';

export const AWS_SAA_COURSE: CertificationCourse = {
  certId: 'aws-saa-c03',
  certCode: 'SAA-C03',
  title: 'AWS Certified Solutions Architect – Associate (SAA-C03)',
  provider: 'AWS',
  tier: 2,
  tagline: 'Architect secure, resilient, high-performing, and cost-optimized AWS cloud systems.',
  estimatedTotalHours: 80,
  passingScore: '720 / 1000',
  domains: [
    {
      id: 'saa-d1',
      domainNumber: 1,
      title: 'Design Secure Architectures',
      examWeightPercent: 30,
      overview: 'Master IAM Roles, SCPs, VPC Security Groups vs NACLs, KMS, Secrets Manager, and PrivateLink.',
      lessons: [
        {
          id: 'saa-d1-l1',
          title: 'IAM Least Privilege, VPC Isolation & KMS Encryption',
          estimatedMinutes: 45,
          summary: 'Eliminate hardcoded credentials with IAM Roles, enforce multi-account guardrails with AWS Organizations SCPs, and lock down VPC traffic.',
          learningObjectives: [
            'Use IAM Roles (STS temporary credentials) instead of static access keys on EC2/Lambda',
            'Differentiate Security Groups (stateful, allow-only, instance-level) vs NACLs (stateless, allow+deny, subnet-level)',
            'Select VPC Gateway Endpoints (S3/DynamoDB — free) vs Interface Endpoints (PrivateLink)',
          ],
          coreConcepts: [
            {
              heading: 'Security Groups vs NACLs',
              explanation:
                'Security Groups are stateful (return traffic automatically allowed), support ALLOW rules only, and attach to ENIs. NACLs are stateless (must allow both inbound and ephemeral outbound), support ALLOW & DENY (great for blocking a specific malicious IP), and attach to subnets.',
              mentalModel: 'Security Group = Smart bodyguard at the server door; NACL = Strict checklist at the subnet gate.',
            },
          ],
          realWorldScenario: {
            title: 'Private EC2 Accessing S3 Without Internet',
            situation: 'Compliance forbids private-subnet EC2 instances from routing S3 traffic over the public internet or paying NAT Gateway data fees.',
            analysis: 'Deploy a VPC Gateway Endpoint for S3 and attach an IAM Instance Profile with least-privilege S3 permissions.',
            takeaway: 'S3 & DynamoDB Gateway Endpoints are FREE and keep traffic 100% on the AWS backbone.',
          },
          examTraps: [
            'Explicit DENY in an IAM policy or SCP ALWAYS overrides any ALLOW.',
            'AWS Secrets Manager supports automatic credential rotation for RDS; SSM Parameter Store does not rotate secrets natively.',
          ],
          keyTerms: [
            { term: 'SCP', definition: 'Service Control Policy in AWS Organizations—sets maximum permission boundaries across member accounts.' },
            { term: 'KMS CMK', definition: 'Customer Managed Key in AWS KMS supporting automatic annual rotation and granular key policies.' },
          ],
          conceptChecks: [
            {
              id: 'saa-d1-l1-q1',
              question: 'An application on EC2 in a private subnet must read from S3 with zero internet exposure and lowest cost. What should you configure?',
              options: ['NAT Gateway + IAM User keys', 'VPC Gateway Endpoint for S3 + IAM Role', 'Internet Gateway + Security Group', 'VPC Interface Endpoint + Static Keys'],
              correctIndex: 1,
              rationale: 'A VPC Gateway Endpoint for S3 is free, private, and IAM Roles provide temporary STS credentials.',
            },
          ],
          practicalDrill: {
            title: 'Multi-Tier VPC Security Blueprint',
            prompt: 'Design SG chaining for ALB -> App Tier -> RDS PostgreSQL in private subnets.',
            steps: ['ALB SG allows 443 from 0.0.0.0/0.', 'App SG allows 8080 ONLY from ALB SG.', 'RDS SG allows 5432 ONLY from App SG.'],
            successCriteria: 'Zero public exposure of App or RDS tiers.',
          },
          flashcards: [
            { front: 'Security Group vs NACL?', back: 'SG = stateful, allow-only, ENI-level. NACL = stateless, allow+deny, subnet-level.', tag: 'AWS-SAA-D1' },
          ],
          sourceRefs: ['my_documents/aws-csaa/', 'my_documents/AWS-Certified-Solutions-Architect-Associate-Study-Guide-main/'],
        },
      ],
    },
    {
      id: 'saa-d2',
      domainNumber: 2,
      title: 'Design Resilient, High-Performing & Cost-Optimized Architectures',
      examWeightPercent: 70,
      overview: 'Master Multi-AZ/Multi-Region DR, SQS/SNS decoupling, S3 storage classes, RDS/Aurora/DynamoDB, and serverless cost optimization.',
      lessons: [
        {
          id: 'saa-d2-l1',
          title: 'Decoupling (SQS/SNS), Storage/Database Selection & Cost Optimization',
          estimatedMinutes: 50,
          summary: 'Choose the exact AWS compute, storage, database, and DR pattern that satisfies latency, RPO/RTO, and cost constraints.',
          learningObjectives: [
            'Decouple spiky workloads with SQS (pull queue) and fan-out with SNS + SQS',
            'Select S3 Intelligent-Tiering / Glacier Deep Archive, EFS (shared Linux NFS), or FSx for Windows',
            'Compare RDS Multi-AZ (HA failover) vs Read Replicas (read scaling) vs DynamoDB (single-digit ms NoSQL)',
          ],
          coreConcepts: [
            {
              heading: 'AWS DR Strategies (Cheapest -> Fastest)',
              explanation:
                '1. Backup & Restore (hours RTO/RPO, cheapest). 2. Pilot Light (core DB replicated, compute off). 3. Warm Standby (scaled-down live copy). 4. Multi-Site Active-Active (near-zero RTO/RPO, highest cost).',
              mentalModel: 'Pilot Light = DB warm, servers cold; Warm Standby = Mini-me running; Active-Active = Twin running.',
            },
          ],
          realWorldScenario: {
            title: 'Unpredictable Image Processing Spikes',
            situation: 'An e-commerce app experiences 10x traffic spikes during flash sales, overwhelming EC2 image processors.',
            analysis: 'Decouple uploads to S3 -> SQS queue -> Auto Scaling Group scaling on SQS `ApproximateNumberOfMessagesVisible` using Spot Instances for 70%+ cost savings.',
            takeaway: 'SQS + Auto Scaling + Spot Instances is the classic SAA-C03 resilient & cost-optimized pattern.',
          },
          examTraps: [
            'RDS Multi-AZ is for High Availability (automatic failover), NOT read scaling—use Read Replicas for read-heavy workloads.',
            'S3 Intelligent-Tiering is the default answer when access patterns are UNKNOWN or unpredictable.',
          ],
          keyTerms: [
            { term: 'SQS FIFO', definition: 'Exactly-once processing and strict message ordering.' },
            { term: 'CloudFront + OAC', definition: 'Global CDN caching static/dynamic content at edge locations while locking S3 bucket access via Origin Access Control.' },
          ],
          conceptChecks: [
            {
              id: 'saa-d2-l1-q1',
              question: 'A reporting team runs heavy read queries against a production RDS MySQL database, slowing down customer checkouts. What is the BEST solution?',
              options: ['Enable RDS Multi-AZ', 'Create an RDS Read Replica and point reporting to it', 'Move to S3 Glacier', 'Add a NAT Gateway'],
              correctIndex: 1,
              rationale: 'Read Replicas offload read-heavy analytical/reporting traffic from the primary writer instance.',
            },
          ],
          practicalDrill: {
            title: 'AWS Database Selector Matrix',
            prompt: 'Match 4 workloads to RDS Aurora, DynamoDB, ElastiCache Redis, or Redshift.',
            steps: ['OLTP SQL -> Aurora', 'Key-value ms scale -> DynamoDB', 'Sub-ms session cache -> ElastiCache', 'Petabyte OLAP -> Redshift.'],
            successCriteria: '100% accurate service selection.',
          },
          flashcards: [
            { front: 'RDS Multi-AZ vs Read Replica?', back: 'Multi-AZ = High Availability / failover (synchronous). Read Replica = Read scaling (asynchronous).', tag: 'AWS-SAA-D2' },
          ],
          sourceRefs: ['my_documents/aws-csaa/', 'my_documents/AWS-Certified-Solutions-Architect-Associate-Study-Guide-main/'],
        },
      ],
    },
  ],
  capstone: {
    title: 'Global Resilient SaaS Architecture on AWS',
    scenario: 'Architect a multi-region web platform with unpredictable spikes, strict data encryption, sub-100ms global asset delivery, and minimal operational overhead.',
    tasks: [
      'Design edge + compute + async decoupling.',
      'Select database, caching, and S3 lifecycle tiering.',
      'Specify IAM, KMS, and VPC Endpoint security.',
    ],
    modelSolution: 'Route 53 -> CloudFront (OAC) + WAF -> S3 static + API Gateway/ALB -> ECS Fargate/Lambda -> SQS -> Aurora Global Database + ElastiCache, secured with KMS CMKs, Secrets Manager, and VPC Endpoints.',
  },
  examStrategy: {
    examFormat: '65 scenario-based questions, 130 minutes, scaled score 720/1000.',
    timeManagementPlan: '2 minutes per question. Read the LAST sentence of the question first to spot the exact constraint ("MOST cost-effective", "LEAST operational overhead", "HIGHEST availability").',
    mindsetRules: [
      'Prefer managed/serverless services (Lambda, Fargate, DynamoDB, SQS) when "least operational overhead" is requested.',
      'Never choose self-managed EC2 databases when RDS/Aurora fits.',
    ],
    finalWeekChecklist: [
      'Review Well-Architected Framework 6 pillars',
      'Memorize S3 storage classes and DR strategy trade-offs',
      'Score >= 82% on 3 full 65-question timed mocks',
    ],
  },
};
