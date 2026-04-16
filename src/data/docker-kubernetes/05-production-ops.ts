import { Module } from "../types";

export const module5: Module = {
  id: "production-ops",
  title: "Production Operations, Security & Observability",
  description: "Resource management, RBAC security, network policies, Prometheus monitoring, distributed tracing, and cluster cost optimization",
  lessons: [
    {
      id: "k8s-security",
      slug: "k8s-security",
      title: "Kubernetes Security: RBAC, Network Policies & Pod Security",
      content: `# Kubernetes Security

Security in Kubernetes is layered. Get each layer right and you have defense-in-depth.

---

\`\`\`concept
{
  "title": "The Security Layers",
  "variant": "mental-model",
  "content": "K8s security is: who can DO things (RBAC) + what can reach WHAT (Network Policies) + what can a Pod DO (Pod Security Standards). Miss any layer and the others are weakened. A container shouldn't run as root AND shouldn't be reachable from unrelated services AND operators shouldn't have cluster-admin they don't need."
}
\`\`\`

---

## RBAC: Role-Based Access Control

\`\`\`yaml
# Role — what actions on what resources (namespace-scoped)
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer
  namespace: staging
rules:
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list", "watch", "create", "update", "patch"]
- apiGroups: [""]
  resources: ["pods", "pods/log", "services", "configmaps"]
  verbs: ["get", "list", "watch"]
- apiGroups: [""]
  resources: ["pods/exec"]
  verbs: []   # No exec access in staging
---
# RoleBinding — attach Role to a user/group/ServiceAccount
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: developer-binding
  namespace: staging
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: developer
subjects:
- kind: User
  name: alice@company.com
  apiGroup: rbac.authorization.k8s.io
- kind: Group
  name: engineering-team
\`\`\`

## Network Policies — Container Firewall

\`\`\`yaml
# By default: all pods can talk to all other pods.
# Network Policies add iptables rules to restrict this.

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-isolation
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api            # Apply to 'api' pods
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: production   # Only from same namespace
    - podSelector:
        matchLabels:
          app: nginx          # And only from nginx pods
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres      # api can only reach postgres
    ports:
    - protocol: TCP
      port: 5432
  - to: []    # Allow DNS
    ports:
    - protocol: UDP
      port: 53
\`\`\`

## Pod Security Standards

\`\`\`yaml
# Enforce security at the namespace level (K8s 1.23+):
# Label namespaces with enforce/warn/audit:

# kubectl label namespace production pod-security.kubernetes.io/enforce=restricted

# Or per-Pod security context:
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: my-app:1.0
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true    # App can't write to container FS
      capabilities:
        drop: ["ALL"]                 # Drop all Linux capabilities
    volumeMounts:
    - name: tmp                      # Writable /tmp since rootFS is readonly
      mountPath: /tmp
  volumes:
  - name: tmp
    emptyDir: {}
\`\`\`

## Observability: Prometheus + Grafana

\`\`\`bash
# Install kube-prometheus-stack (Prometheus + Grafana + AlertManager + exporters):
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack \\
  --namespace monitoring \\
  --create-namespace \\
  --set grafana.adminPassword=yourpassword
\`\`\`

\`\`\`yaml
# Expose metrics from your app (Prometheus ServiceMonitor):
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-app-monitor
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
  - port: metrics     # Your app's /metrics endpoint
    interval: 30s
    path: /metrics
\`\`\`

## Resource Optimization

\`\`\`compare
{
  "title": "K8s Resource Management",
  "items": [
    {
      "name": "requests",
      "description": "Minimum guaranteed resources. Scheduler uses this to place Pods. If you set request=100m CPU, the Pod will always get 100m even under cluster load."
    },
    {
      "name": "limits",
      "description": "Maximum allowed. CPU: throttled if exceeded. Memory: OOMKilled if exceeded. Set memory limit = request (prevent OOM cascades). CPU limit: controversial — many skip it to allow bursting."
    },
    {
      "name": "VPA (Vertical Pod Autoscaler)",
      "description": "Automatically adjusts resource requests based on actual usage history. Run VPA in 'Off' mode first to see recommendations without applying them."
    }
  ]
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What happens when a container exceeds its memory limit in Kubernetes?",
      "options": [
        "The Pod is throttled",
        "The container is OOMKilled (killed by the OS out-of-memory killer) and Kubernetes restarts it",
        "The Pod is rescheduled to a larger node",
        "The limit is automatically increased"
      ],
      "answer": 1,
      "explanation": "Memory limits are hard limits enforced by the Linux OOM killer. If a container uses more memory than its limit, the kernel sends SIGKILL. Kubernetes detects the OOMKilled exit code and restarts the container (subject to CrashLoopBackOff if it keeps happening). CPU limits are different — they throttle (reduce scheduling priority) without killing. Many teams skip CPU limits and rely on requests for scheduling."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "docker-k8s-assessment",
      slug: "docker-k8s-assessment",
      title: "Docker & Kubernetes: Interview Questions & Mastery",
      content: `# Docker & Kubernetes Mastery

## Q1: What happens when you run \`docker build\`?

\`\`\`trace
{
  "title": "docker build . Execution Trace",
  "steps": [
    { "step": 1, "action": "Parse Dockerfile", "detail": "Docker daemon reads Dockerfile top to bottom" },
    { "step": 2, "action": "Send build context", "detail": "Everything in '.' sent to daemon (minus .dockerignore)" },
    { "step": 3, "action": "Process each instruction", "detail": "Each RUN/COPY/ADD creates a new layer" },
    { "step": 4, "action": "Layer cache check", "detail": "If layer hash matches a cached layer, reuse it (skip step)" },
    { "step": 5, "action": "Execute RUN commands", "detail": "Spin up temp container, run command, snapshot result as layer" },
    { "step": 6, "action": "Commit final image", "detail": "Stack all layers, write image manifest with metadata" },
    { "step": 7, "action": "Tag image", "detail": "Apply name:tag to the image ID" }
  ]
}
\`\`\`

## Q2: Explain the Pod restart policy and CrashLoopBackOff

\`\`\`yaml
# restartPolicy options (Pod-level):
spec:
  restartPolicy: Always    # Always restart (default for Deployments)
  # restartPolicy: OnFailure  # Only on non-zero exit code (for Jobs)
  # restartPolicy: Never      # Never restart (for debugging)
\`\`\`

**CrashLoopBackOff** progression:
1. Container crashes → immediate restart
2. Crashes again → wait 10s
3. Crashes again → wait 20s, 40s, 80s... up to 5 minutes
4. Status shows **CrashLoopBackOff**

**Diagnose it:**
\`\`\`bash
kubectl describe pod my-pod    # Look at Events section
kubectl logs my-pod --previous # Logs from the PREVIOUS (crashed) instance
\`\`\`

## Q3: How does Kubernetes service discovery work?

\`\`\`typescript
// Every Service gets a DNS entry in CoreDNS:
// <service-name>.<namespace>.svc.cluster.local

// From inside a Pod in the SAME namespace:
const response = await fetch('http://api-service/users');

// From inside a Pod in a DIFFERENT namespace:
const response = await fetch('http://api-service.production.svc.cluster.local/users');

// Environment variables (auto-injected):
// MY_SERVICE_SERVICE_HOST=10.96.0.1
// MY_SERVICE_SERVICE_PORT=80
// (Legacy mechanism — prefer DNS)
\`\`\`

## Q4: StatefulSet vs Deployment — when to use which?

\`\`\`compare
{
  "title": "Deployment vs StatefulSet",
  "items": [
    {
      "name": "Deployment",
      "description": "Stateless apps. Pods are interchangeable — any Pod can handle any request. Random Pod names (my-app-7d9f4b-xkzq9). Pods deleted/created in any order. Shared PVC or no persistent storage."
    },
    {
      "name": "StatefulSet",
      "description": "Stateful apps (databases, Kafka, Elasticsearch). Pods have stable identities: pod-0, pod-1, pod-2. Each Pod gets its own PVC that follows it on reschedule. Ordered creation (pod-0 before pod-1) and deletion (reverse order). Stable network identity."
    }
  ]
}
\`\`\`

## Q5: How do you debug a Pod that won't start?

\`\`\`bash
# Step 1: Check Pod status
kubectl get pods

# NAME        READY   STATUS             RESTARTS   AGE
# my-pod-x    0/1     ImagePullBackOff   0          2m
# my-pod-y    0/1     CrashLoopBackOff   5          10m

# Step 2: Describe for Events
kubectl describe pod my-pod-x
# Events section at bottom shows: Failed to pull image "my-app:latest": ...

# Step 3: Check logs (if container at least started)
kubectl logs my-pod-y
kubectl logs my-pod-y --previous   # Previous crashed instance

# Step 4: Run interactively to debug
kubectl run debug --image=my-app:latest --rm -it -- sh

# Common status meanings:
# ImagePullBackOff  → Wrong image name/tag, or registry auth missing
# CrashLoopBackOff  → App crashes on startup — check logs --previous
# Pending           → No Node has enough resources, or PVC not bound
# OOMKilled         → Memory limit exceeded — increase limit or fix leak
# CreateContainerConfigError → Bad secret/configmap reference
\`\`\`

\`\`\`takeaways
["Multi-stage builds: compile in fat image, copy artifacts to slim image — 5-10x size reduction", "RBAC: principle of least privilege — Roles + RoleBindings, never give cluster-admin unnecessarily", "Network Policies are deny-by-default once you add any policy — explicitly allow what you need", "StatefulSets for databases (stable identity + per-pod PVCs), Deployments for stateless apps", "Prometheus + Grafana: the standard K8s observability stack — install via kube-prometheus-stack helm chart", "Debug toolkit: kubectl describe (events), kubectl logs --previous, kubectl exec, port-forward"]
\`\`\`
`,
    },
  ],
};
