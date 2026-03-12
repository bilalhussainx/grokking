import { Module } from "../types";

export const gitModule: Module = {
  id: "git-github",
  title: "Git & GitHub",
  description:
    "Learn version control with Git: basic commands, branching workflows, and collaboration through GitHub.",
  lessons: [
    {
      id: "git-basics",
      slug: "git-basics",
      title: "Git Basics",
      content: `## Git Basics

**Git** is a distributed version control system that tracks changes in your code. It lets you save snapshots of your project, revert to previous states, and collaborate with others.

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Repository** | A project tracked by Git |
| **Commit** | A snapshot of your project at a point in time |
| **Staging area** | Where you prepare changes before committing |
| **Branch** | A parallel line of development |
| **Remote** | A copy of the repo on a server (e.g., GitHub) |

### Essential Commands

\`\`\`bash
# Initialize and configure
git init                    # Create a new repo
git config user.name "You"  # Set your name
git config user.email "you@email.com"

# Daily workflow
git status                  # See what has changed
git add file.txt            # Stage a file
git add .                   # Stage all changes
git commit -m "message"     # Commit staged changes
git log --oneline           # View commit history

# Undo
git checkout -- file.txt    # Discard changes to a file
git reset HEAD file.txt     # Unstage a file
git revert <commit-hash>    # Create a new commit that undoes a previous one
\`\`\`

### The Three States

1. **Working directory** — Your actual files
2. **Staging area** (index) — What will be in the next commit
3. **Repository** (.git) — Committed snapshots

### Problem

Practice the Git workflow by writing the commands for common scenarios.`,
      starterCode: `# Git Basics Exercise
# Write the git commands for each scenario below.
# (This is a conceptual exercise - write commands as comments)

# Scenario 1: Starting a new project
# - Initialize a git repository
# - Create a file called index.html
# - Stage the file
# - Make your first commit with message "Initial commit"

# Write your commands:
# git ___
# git ___
# git ___

# Scenario 2: Making changes
# - You edited style.css and app.js
# - Check what files changed
# - Stage only style.css
# - Commit with message "Update styles"
# - Then stage and commit app.js separately

# Write your commands:
# git ___
# git ___
# git ___
# git ___
# git ___

# Scenario 3: Viewing history
# - View the last 5 commits in one line each
# - View the detailed changes in the last commit
# - View who changed each line of index.html

# Write your commands:
# git ___
# git ___
# git ___
`,
      solutionCode: `# Git Basics Exercise - Solutions

# Scenario 1: Starting a new project
git init
touch index.html
git add index.html
git commit -m "Initial commit"

# Scenario 2: Making changes
git status
git add style.css
git commit -m "Update styles"
git add app.js
git commit -m "Update app logic"

# Scenario 3: Viewing history
git log --oneline -5
git show HEAD
git blame index.html
`,
    },
    {
      id: "git-branching",
      slug: "git-branching",
      title: "Branching & Merging",
      content: `## Git Branching & Merging

Branches let you work on features, fixes, or experiments **in isolation** from the main codebase.

### Branch Commands

\`\`\`bash
git branch                    # List branches
git branch feature-login      # Create a new branch
git checkout feature-login    # Switch to branch
git checkout -b feature-login # Create and switch (shortcut)
git branch -d feature-login   # Delete branch (after merge)
\`\`\`

### Merging

\`\`\`bash
git checkout main             # Switch to target branch
git merge feature-login       # Merge feature into main
\`\`\`

### Merge Conflicts

When two branches modify the same lines, Git cannot merge automatically:

\`\`\`
<<<<<<< HEAD
console.log("main version");
=======
console.log("feature version");
>>>>>>> feature-login
\`\`\`

**Resolution**: Edit the file to keep the correct code, remove the markers, then:

\`\`\`bash
git add conflicted-file.js
git commit -m "Resolve merge conflict"
\`\`\`

### Common Branching Strategies

| Strategy | Description |
|----------|-------------|
| **Feature branches** | One branch per feature |
| **Git Flow** | main + develop + feature + release + hotfix |
| **Trunk-based** | Short-lived branches, frequent merges |

### Problem

Practice branching workflow commands for a feature development scenario.`,
      starterCode: `# Branching Exercise
# Write the git commands for the following workflow:

# Step 1: You are on 'main' branch
# - Create and switch to a new branch called 'feature/user-auth'

# Write your command:
# git ___

# Step 2: You made 3 commits on the feature branch
# - Now switch back to main
# - Merge the feature branch into main

# Write your commands:
# git ___
# git ___

# Step 3: There is a merge conflict in auth.js
# The conflict looks like:
# <<<<<<< HEAD
# const API_URL = "/api/v1";
# =======
# const API_URL = "/api/v2";
# >>>>>>> feature/user-auth
#
# You want to keep the v2 URL
# Write the resolved content and the commands to finish the merge:

# Resolved content:
# ___

# Commands to complete the merge:
# git ___
# git ___

# Step 4: Clean up
# - Delete the merged feature branch
# - Push main to remote

# Write your commands:
# git ___
# git ___

# Bonus: View the branch graph
# git ___
`,
      solutionCode: `# Branching Exercise - Solutions

# Step 1: Create and switch to feature branch
git checkout -b feature/user-auth

# Step 2: Merge feature into main
git checkout main
git merge feature/user-auth

# Step 3: Resolve merge conflict
# Resolved content (keep v2):
# const API_URL = "/api/v2";

# Commands to complete the merge:
git add auth.js
git commit -m "Resolve merge conflict: use API v2 URL"

# Step 4: Clean up
git branch -d feature/user-auth
git push origin main

# Bonus: View branch graph
git log --oneline --graph --all
`,
    },
    {
      id: "git-collaboration",
      slug: "git-collaboration",
      title: "Collaboration with GitHub",
      content: `## Collaboration with GitHub

**GitHub** is a platform for hosting Git repositories and collaborating with others.

### Remote Repository Commands

\`\`\`bash
git remote add origin https://github.com/user/repo.git
git push -u origin main         # Push and set upstream
git pull origin main             # Fetch + merge
git fetch origin                 # Download without merging
git clone https://github.com/user/repo.git  # Copy a repo
\`\`\`

### Pull Request Workflow

1. **Fork** the repository (creates your copy)
2. **Clone** your fork locally
3. **Create a branch** for your changes
4. **Push** the branch to your fork
5. **Open a Pull Request** on GitHub
6. **Code review** — team reviews your changes
7. **Merge** — maintainer merges your PR

### .gitignore

Specify files Git should ignore:

\`\`\`
# .gitignore
node_modules/
.env
*.log
dist/
.DS_Store
\`\`\`

### Best Practices

| Practice | Why |
|----------|-----|
| Write descriptive commit messages | Others (and future you) can understand changes |
| Commit often, push regularly | Reduce merge conflicts, avoid losing work |
| Never commit secrets | .env files, API keys, passwords |
| Review before committing | \`git diff\` to check what you changed |
| Use branches | Keep main stable and deployable |

### Problem

Practice the full collaboration workflow: fork, clone, branch, commit, push, and create a PR.`,
      starterCode: `# Collaboration Exercise
# Write the git/GitHub commands for the following workflow:

# Step 1: Starting a collaborative project
# - Clone a repository from GitHub
# - Check what remote is configured
# - Create a new branch for your feature

# Write your commands:
# git ___
# git ___
# git ___

# Step 2: Create a .gitignore file
# List the patterns to ignore:
# - node_modules directory
# - .env files
# - log files (*.log)
# - dist directory
# - OS files (.DS_Store, Thumbs.db)

# Write the .gitignore contents:
# ___
# ___
# ___
# ___
# ___

# Step 3: Make changes, commit, and push
# - Stage all changes
# - Commit with a descriptive message
# - Push your branch to the remote

# Write your commands:
# git ___
# git ___
# git ___

# Step 4: After your PR is merged
# - Switch back to main
# - Pull the latest changes
# - Delete your local feature branch

# Write your commands:
# git ___
# git ___
# git ___
`,
      solutionCode: `# Collaboration Exercise - Solutions

# Step 1: Starting a collaborative project
git clone https://github.com/team/project.git
git remote -v
git checkout -b feature/add-search

# Step 2: .gitignore contents
# node_modules/
# .env
# *.log
# dist/
# .DS_Store
# Thumbs.db

# Step 3: Make changes, commit, and push
git add .
git commit -m "Add search functionality with autocomplete"
git push -u origin feature/add-search

# Step 4: After PR is merged
git checkout main
git pull origin main
git branch -d feature/add-search
`,
    },
  ],
};
