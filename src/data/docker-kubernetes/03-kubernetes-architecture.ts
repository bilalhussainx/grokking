import { Module } from "../types";

export const module3: Module = {
  id: "kubernetes-architecture",
  title: "Kubernetes Architecture & Core Concepts",
  description: "The control plane, nodes, Pods, Services, Deployments, ConfigMaps, and how Kubernetes keeps your app running",
  lessons: [
    {
      id: "k8s-architecture",
      slug: "k8s-architecture",
      title: "How Kubernetes Works: Control Plane to Pod",
      content: `# Kubernetes Architecture

Kubernetes (K8s) is a container orchestration platform. It schedules containers across a cluster of machines, ensures they stay running, and scales them automatically.

---

\`\`\`concept
{
  "title": "The Kubernetes Mental Model",
  "variant": "mental-model",
  "content": "Tell Kubernetes WHAT you want (desired state), not HOW to do it. 'Run 3 replicas of my app.' Kubernetes continuously compares desired state vs actual state and takes action to reconcile them. Container crashes? K8s restarts it. Node dies? K8s reschedules pods elsewhere. You describe outcomes; K8s figures out the mechanics."
}
\`\`\`

---

## The Cluster Architecture

\`\`\`sysdiag
{
  "type": "cluster",
  "title": "Kubernetes Cluster Architecture",
  "control_plane": {
    "label": "Control Plane (Master)",
    "components": [
      { "name": "API Server", "role": "The front door — all communication goes through kubectl → API Server → etcd" },
      { "name": "etcd", "role": "Distributed key-value store — the single source of truth for all cluster state" },
      { "name": "Scheduler", "role": "Assigns Pods to Nodes based on resources, affinity, taints" },
      { "name": "Controller Manager", "role": "Runs controllers: ReplicaSet, Deployment, Node, Service Account..." }
    ]
  },
  "worker_nodes": [
    {
      "label": "Worker Node 1",
      "components": [
        { "name": "kubelet", "role": "Agent on each node — talks to API server, manages Pod lifecycle" },
        { "name": "kube-proxy", "role": "Network proxy — manages iptables rules for Service routing" },
        { "name": "Container Runtime", "role": "containerd or CRI-O — actually runs containers" },
        { "name": "Pods", "role": "Your application containers" }
      ]
    }
  ]
}
\`\`\`

## The Core Objects

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Pod",
      "icon": "🫘",
      "content": "### Pod — The Atomic Unit\\n\\nA Pod is the smallest deployable unit. It wraps one or more containers that share:\\n- Network namespace (same IP, same localhost)\\n- Storage volumes\\n- Lifecycle\\n\\n\`\`\`yaml\\napiVersion: v1\\nkind: Pod\\nmetadata:\\n  name: my-app\\n  labels:\\n    app: my-app\\nspec:\\n  containers:\\n  - name: app\\n    image: my-app:1.0\\n    ports:\\n    - containerPort: 3000\\n    resources:\\n      requests:\\n        cpu: 100m    # 0.1 CPU cores\\n        memory: 128Mi\\n      limits:\\n        cpu: 500m    # 0.5 CPU cores\\n        memory: 256Mi\\n    readinessProbe:\\n      httpGet:\\n        path: /health\\n        port: 3000\\n      initialDelaySeconds: 5\\n      periodSeconds: 10\\n\`\`\`\\n\\nPods are ephemeral — don't deploy bare Pods. Use Deployments which manage Pod replicas."
    },
    {
      "label": "Deployment",
      "icon": "🚀",
      "content": "### Deployment — Managed Replicas\\n\\nA Deployment manages a ReplicaSet which manages Pods. Gives you rolling updates, rollbacks, and scaling.\\n\\n\`\`\`yaml\\napiVersion: apps/v1\\nkind: Deployment\\nmetadata:\\n  name: my-app\\nspec:\\n  replicas: 3\\n  selector:\\n    matchLabels:\\n      app: my-app\\n  strategy:\\n    type: RollingUpdate\\n    rollingUpdate:\\n      maxSurge: 1        # Allow 1 extra Pod during update\\n      maxUnavailable: 0  # Never go below 3 healthy pods\\n  template:\\n    metadata:\\n      labels:\\n        app: my-app\\n    spec:\\n      containers:\\n      - name: app\\n        image: my-app:1.1   # Updating this triggers rolling update\\n        ports:\\n        - containerPort: 3000\\n\`\`\`\\n\\n\`\`\`bash\\n# Scale:\\nkubectl scale deployment my-app --replicas=5\\n# Rollback:\\nkubectl rollout undo deployment/my-app\\n# Status:\\nkubectl rollout status deployment/my-app\\n\`\`\`"
    },
    {
      "label": "Service",
      "icon": "🔌",
      "content": "### Service — Stable Network Endpoint\\n\\nPods are ephemeral — IPs change. A Service gives a stable IP + DNS name that routes to the right Pods via label selectors.\\n\\n\`\`\`yaml\\napiVersion: v1\\nkind: Service\\nmetadata:\\n  name: my-app-service\\nspec:\\n  selector:\\n    app: my-app    # Routes to Pods with this label\\n  ports:\\n  - port: 80          # Service port\\n    targetPort: 3000   # Container port\\n  type: ClusterIP     # Internal only (default)\\n  # type: NodePort    # Expose on each node's IP:port\\n  # type: LoadBalancer # Cloud LB — external traffic\\n\`\`\`\\n\\nService types:\\n- **ClusterIP**: Internal only — for pod-to-pod communication\\n- **NodePort**: Opens a port on each node (30000-32767)\\n- **LoadBalancer**: Provisions a cloud load balancer (AWS ALB, GCP LB)"
    },
    {
      "label": "ConfigMap / Secret",
      "icon": "🔑",
      "content": "### ConfigMap & Secret — Externalize Configuration\\n\\n\`\`\`yaml\\n# ConfigMap — non-sensitive config\\napiVersion: v1\\nkind: ConfigMap\\nmetadata:\\n  name: app-config\\ndata:\\n  DATABASE_HOST: postgres-service\\n  LOG_LEVEL: info\\n  MAX_CONNECTIONS: \\"20\\"\\n---\\n# Secret — sensitive data (base64 encoded, NOT encrypted by default)\\napiVersion: v1\\nkind: Secret\\nmetadata:\\n  name: app-secrets\\ntype: Opaque\\ndata:\\n  DATABASE_PASSWORD: cGFzc3dvcmQ=   # base64 encode('password')\\n  API_KEY: c2VjcmV0a2V5           # base64 encode('secretkey')\\n\`\`\`\\n\\n\`\`\`yaml\\n# Reference in a Pod/Deployment:\\nenv:\\n- name: DB_HOST\\n  valueFrom:\\n    configMapKeyRef:\\n      name: app-config\\n      key: DATABASE_HOST\\n- name: DB_PASSWORD\\n  valueFrom:\\n    secretKeyRef:\\n      name: app-secrets\\n      key: DATABASE_PASSWORD\\n\`\`\`\\n\\n⚠️ Secrets are base64 encoded, NOT encrypted. Use Sealed Secrets, Vault, or cloud KMS for real encryption."
    }
  ]
}
\`\`\`

## Essential kubectl Commands

\`\`\`bash
# Context & cluster info:
kubectl config get-contexts
kubectl config use-context my-cluster
kubectl cluster-info

# Get resources:
kubectl get pods
kubectl get pods -o wide              # Show node assignments
kubectl get pods -w                   # Watch (live updates)
kubectl get all -n my-namespace       # All resources in namespace

# Inspect:
kubectl describe pod my-pod           # Detailed info + events
kubectl logs my-pod                   # Container logs
kubectl logs -f my-pod --tail=100     # Follow + last 100 lines

# Apply configurations:
kubectl apply -f deployment.yaml      # Create or update
kubectl apply -f ./k8s/              # Apply all files in directory
kubectl delete -f deployment.yaml    # Delete what's in the file

# Debug:
kubectl exec -it my-pod -- sh        # Shell into pod
kubectl port-forward service/my-app 8080:80  # Local port → service
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Why should you use a Deployment instead of a bare Pod in production?",
      "options": [
        "Deployments use less memory",
        "Pods can't use environment variables",
        "Deployments manage Pod replicas and provide rolling updates, rollbacks, and automatic restart if a Pod dies",
        "Bare Pods don't support ConfigMaps"
      ],
      "answer": 2,
      "explanation": "A bare Pod is manually managed — if it crashes, it stays down. A Deployment wraps a ReplicaSet that continuously ensures the desired number of Pod replicas are running. If a Pod dies, the ReplicaSet controller creates a new one. Deployments also give you rolling updates (gradually replace old pods with new ones), rollback history, and pause/resume for canary deployments."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "k8s-networking-ingress",
      slug: "k8s-networking-ingress",
      title: "Kubernetes Networking, Ingress & HPA",
      content: `# Kubernetes Networking, Ingress & Autoscaling

## Ingress: HTTP Routing into the Cluster

\`\`\`sysdiag
{
  "type": "flow",
  "title": "Traffic Flow: Internet → Pod",
  "steps": [
    { "step": "Internet (HTTPS)", "detail": "User request" },
    { "step": "Cloud Load Balancer", "detail": "AWS ALB / GCP LB — routes to Ingress Controller" },
    { "step": "Ingress Controller (nginx)", "detail": "Reads Ingress rules, terminates TLS, routes to Services" },
    { "step": "Service (ClusterIP)", "detail": "Stable IP, routes to healthy Pods via selector" },
    { "step": "Pod", "detail": "Your app container" }
  ]
}
\`\`\`

\`\`\`yaml
# Ingress resource — defines HTTP routing rules
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod   # Auto TLS!
spec:
  tls:
  - hosts:
    - api.myapp.com
    secretName: api-tls-cert
  rules:
  - host: api.myapp.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
\`\`\`

## Horizontal Pod Autoscaler (HPA)

\`\`\`yaml
# Automatically scale Pods based on CPU/memory/custom metrics
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70    # Scale when avg CPU > 70%
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
\`\`\`

## Namespaces — Cluster Partitioning

\`\`\`bash
# Namespaces isolate resources within a cluster (like virtual clusters):
kubectl create namespace staging
kubectl create namespace production

# Deploy to a specific namespace:
kubectl apply -f deployment.yaml -n staging

# Set default namespace (avoid typing -n every time):
kubectl config set-context --current --namespace=production

# Common namespace strategy:
# default     — for quick experiments
# kube-system — K8s system components (don't touch)
# monitoring  — Prometheus, Grafana
# staging     — staging environment
# production  — production apps
\`\`\`

\`\`\`takeaways
["Deployment > bare Pod — Deployments ensure desired replica count, enable rolling updates and rollbacks", "Service gives stable DNS (service-name.namespace.svc.cluster.local) even as Pod IPs change", "Ingress Controller handles TLS termination + HTTP routing — cheaper than one LoadBalancer per service", "HPA scales Pod count based on CPU/memory/custom metrics — set resource requests accurately", "Namespaces partition resources — use staging/production namespaces for environment isolation", "kubectl apply is idempotent — run it to create OR update; preferred over kubectl create"]
\`\`\`
`,
    },
  ],
};
