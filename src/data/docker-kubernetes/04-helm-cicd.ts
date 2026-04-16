import { Module } from "../types";

export const module4: Module = {
  id: "helm-cicd",
  title: "Helm, CI/CD & Production Operations",
  description: "Package Kubernetes apps with Helm, build CI/CD pipelines, configure resource limits, probes, and operate K8s in production",
  lessons: [
    {
      id: "helm-charts",
      slug: "helm-charts",
      title: "Helm: The Kubernetes Package Manager",
      content: `# Helm — Kubernetes Package Manager

Raw YAML gets repetitive fast. Helm adds templating, versioning, and release management to Kubernetes manifests.

---

\`\`\`concept
{
  "title": "What Helm Does",
  "variant": "how-it-works",
  "content": "Helm packages Kubernetes YAML into reusable Charts. A Chart is a directory of templates + default values. 'helm install' renders templates with your values and applies them. 'helm upgrade' updates a release. 'helm rollback' reverts it. Think: npm for Kubernetes configurations."
}
\`\`\`

---

## Helm Chart Structure

\`\`\`bash
my-app/
├── Chart.yaml           # Chart metadata (name, version, description)
├── values.yaml          # Default values (overridable at install time)
├── templates/
│   ├── deployment.yaml  # K8s Deployment template
│   ├── service.yaml     # K8s Service template
│   ├── ingress.yaml     # K8s Ingress template
│   ├── hpa.yaml         # HPA template
│   ├── configmap.yaml   # ConfigMap template
│   └── _helpers.tpl     # Shared template helpers (like partials)
└── .helmignore          # Patterns to ignore (like .gitignore)
\`\`\`

## Values & Templates

\`\`\`yaml
# values.yaml — defaults (override with -f custom-values.yaml or --set)
replicaCount: 2

image:
  repository: my-app
  tag: "1.0.0"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  host: api.myapp.com

resources:
  limits:
    cpu: 500m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
\`\`\`

\`\`\`yaml
# templates/deployment.yaml — Helm template syntax
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-app.fullname" . }}
  labels:
    {{- include "my-app.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "my-app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "my-app.selectorLabels" . | nindent 8 }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - containerPort: 3000
        resources:
          {{- toYaml .Values.resources | nindent 10 }}
\`\`\`

## Helm Commands

\`\`\`bash
# Install a chart:
helm install my-release ./my-app/                    # from local chart
helm install my-release my-repo/my-app               # from repo
helm install my-release ./my-app -f prod-values.yaml # override values
helm install my-release ./my-app --set image.tag=2.0 # set single value

# Upgrade (update release):
helm upgrade my-release ./my-app --set image.tag=2.1
helm upgrade --install my-release ./my-app  # create if not exists (idempotent)

# List releases:
helm list
helm list -n production

# Rollback to previous version:
helm rollback my-release 1   # rollback to revision 1
helm history my-release      # see all revisions

# Debug (render templates without applying):
helm template my-release ./my-app -f values.yaml

# Uninstall:
helm uninstall my-release
\`\`\`

## CI/CD with GitHub Actions + Kubernetes

\`\`\`yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: \${{ env.REGISTRY }}
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}
        cache-from: type=gha      # GitHub Actions cache for Docker layers
        cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Set up kubectl
      uses: azure/setup-kubectl@v3

    - name: Configure kubeconfig
      run: echo "\${{ secrets.KUBECONFIG }}" | base64 -d > ~/.kube/config

    - name: Helm deploy
      run: |
        helm upgrade --install my-app ./helm/my-app \\
          --set image.tag=\${{ github.sha }} \\
          --set image.repository=\${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }} \\
          --namespace production \\
          --wait                   # Wait for rollout to complete
          --timeout 5m
\`\`\`

## Production Health Checks

\`\`\`yaml
# Probes tell Kubernetes when a container is ready/alive:
containers:
- name: app
  image: my-app:1.0

  # Liveness probe — is the container alive? Restart if fails.
  livenessProbe:
    httpGet:
      path: /healthz
      port: 3000
    initialDelaySeconds: 30    # Wait 30s before first check
    periodSeconds: 10
    failureThreshold: 3        # Restart after 3 consecutive failures

  # Readiness probe — is the container ready to serve traffic?
  # Remove from Service endpoints if fails (don't restart)
  readinessProbe:
    httpGet:
      path: /ready
      port: 3000
    initialDelaySeconds: 5
    periodSeconds: 5

  # Startup probe — for slow-starting apps (v1.18+)
  # Disables liveness until startup succeeds
  startupProbe:
    httpGet:
      path: /healthz
      port: 3000
    failureThreshold: 30
    periodSeconds: 10          # 30 * 10s = 5 minutes to start
\`\`\`

\`\`\`takeaways
["Helm = package manager for K8s — charts template YAML, values.yaml sets defaults overridable at install", "helm upgrade --install is idempotent — safe to run in CI (create if missing, upgrade if exists)", "Liveness probe restarts unhealthy containers; readiness probe removes them from load balancing", "GitHub Actions: build image → push to registry → helm upgrade with new image tag", "Use --wait in helm upgrade to ensure rollout completes before pipeline succeeds", "helm rollback is your emergency brake — every helm upgrade stores revision history"]
\`\`\`
`,
    },
  ],
};
