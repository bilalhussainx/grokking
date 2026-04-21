import { Module } from "../types";

export const gettingStartedModule: Module = {
  id: "getting-started",
  title: "Getting Started with Python",
  description: "Install Python, understand the interpreter, write your first program, and learn how Python code executes.",
  lessons: [
    {
      id: "what-is-python",
      slug: "what-is-python",
      title: "What is Python and Why Learn It?",
      content: `# What is Python and Why Learn It?

Every programmer remembers the moment a computer did exactly what they told it to do for the first time. Python is the language that creates that moment for millions of people each year — and for good reason. Before we write a single line of code, let's understand *what* Python is, *why* it became the world's most popular programming language, and *where* it can take you.

---

## A Language Built for Humans

Most programming languages were designed with computers in mind first, humans second. Python flipped that equation.

\`\`\`concept
{ "title": "Python's Core Philosophy", "variant": "mental-model", "content": "Python was designed to be readable above all else. Its creator, Guido van Rossum, believed that code is read far more often than it is written. So Python uses plain English keywords, meaningful indentation, and minimal punctuation — making it feel less like programming and more like writing instructions in a notebook." }
\`\`\`

When you look at Python code, you can often guess what it does even before you've learned the language:

\`\`\`python
name = "Alice"
age = 30

if age >= 18:
    print(f"Welcome, {name}! You are an adult.")
else:
    print("Sorry, you must be 18 or older.")
\`\`\`

Compare that to an equivalent in C++, which requires type declarations, semicolons, curly braces, and a \`main\` function just to print two lines. Python's readability is not accidental — it is an explicit design goal.

---

## How Python Works: Interpreted vs. Compiled

Before diving into applications, understanding *how* Python runs your code gives you a mental model that will help throughout this course.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Compiled Languages",
      "icon": "🏭",
      "content": "**How they work:** The source code is translated entirely into machine code *before* it runs. A compiler reads your whole program, checks it, and produces an executable file.\\n\\n**Analogy:** Like translating an entire book from French to English before publishing it.\\n\\n**Examples:** C, C++, Rust, Go\\n\\n**Trade-offs:**\\n- Very fast at runtime\\n- Errors caught before execution\\n- Must recompile after every change\\n- Platform-specific binaries"
    },
    {
      "label": "Interpreted Languages",
      "icon": "🎙️",
      "content": "**How they work:** The source code is read and executed *line by line* at runtime by a program called an **interpreter**.\\n\\n**Analogy:** Like a live translator who interprets a speech sentence by sentence.\\n\\n**Examples:** Python, Ruby, JavaScript (partially)\\n\\n**Trade-offs:**\\n- Easier to debug (errors show exact line)\\n- No compile step — run immediately\\n- More flexible and dynamic\\n- Generally slower than compiled for raw computation"
    },
    {
      "label": "Python's Approach",
      "icon": "🐍",
      "content": "Python is **interpreted**, which means:\\n\\n1. You write \`hello.py\`\\n2. The Python interpreter reads it top to bottom\\n3. Each line is executed immediately\\n4. If line 7 has an error, lines 1–6 already ran\\n\\n**The speed myth:** Python *can* be slower than C for raw loops. But for data science and ML, libraries like NumPy and TensorFlow execute their heavy work in compiled C or CUDA code — so Python acts as an elegant control layer on top of fast engines."
    }
  ]
}
\`\`\`

---

## Python's World: Where It Runs Everything

Python is a **general-purpose** language, which means it is not locked to one domain. Here is where you will encounter it in the real world:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Web Development",
      "icon": "🌐",
      "content": "**Frameworks:** Django, Flask, FastAPI\\n\\n**Real-world examples:**\\n- **Instagram** — one of the world's largest Django deployments, serving over 2 billion users\\n- **Pinterest** — backend APIs in Python\\n- **Dropbox** — originally built almost entirely in Python\\n\\n**What Python does here:** Handles HTTP requests, talks to databases, processes user data, and returns responses — the engine behind every web page you interact with."
    },
    {
      "label": "Data Science & ML",
      "icon": "🤖",
      "content": "**Key libraries:** Pandas, NumPy, Matplotlib, Scikit-learn, TensorFlow, PyTorch\\n\\n**Real-world examples:**\\n- **Netflix** recommendation algorithm (what to watch next)\\n- **Spotify** Discover Weekly (music recommendations)\\n- **JPMorgan** — uses Python for quantitative finance and risk modeling\\n\\n**What Python does here:** Analyzes datasets, trains machine learning models, builds neural networks, generates visualizations, and automates reports."
    },
    {
      "label": "Automation & Scripting",
      "icon": "⚙️",
      "content": "**Use cases:** Renaming thousands of files, scraping websites, sending automated emails, monitoring servers, processing spreadsheets\\n\\n**Real-world examples:**\\n- A journalist automating data collection from 500 websites\\n- An accountant who replaced 6 hours of Excel work with a 50-line Python script\\n- DevOps engineers writing deployment scripts that run across Linux, macOS, and Windows without changes\\n\\n**Why Python:** Cross-platform compatibility means one script runs everywhere without modification."
    },
    {
      "label": "Scientific Computing",
      "icon": "🔬",
      "content": "**Libraries:** SciPy, SymPy, AstroPy, BioPython\\n\\n**Real-world examples:**\\n- **NASA** uses Python for mission analysis and data processing\\n- **CERN** — particle physics simulations at the Large Hadron Collider\\n- Bioinformatics researchers analyzing genomic data\\n\\n**Why Python:** The scientific community adopted Python early, building an ecosystem of domain-specific libraries that no other language has matched."
    }
  ]
}
\`\`\`

---

## The Four Properties That Make Python Special

\`\`\`concept
{ "title": "High-Level + Dynamically Typed", "variant": "analogy", "content": "Think of programming languages on a spectrum. At one end, machine code — pure 1s and 0s the CPU understands directly. At the other end, human language. Python sits near the human end. 'High-level' means Python handles memory management, type checking, and other low-level concerns for you.\\n\\nDynamic typing means you never have to declare what kind of data a variable holds — Python figures it out at runtime. In Java you must write \`int age = 30;\`. In Python, just \`age = 30\`. Python sees the number 30 and automatically knows it's an integer." }
\`\`\`

Here is a side-by-side comparison of what dynamic typing looks like in practice:

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Java (statically typed)",
    "code": "// Must declare type for every variable\\nString name = \\"Alice\\";\\nint age = 30;\\ndouble salary = 75000.50;\\nboolean isActive = true;\\n\\n// Changing type requires new variable\\nString ageAsText = Integer.toString(age);"
  },
  "after": {
    "label": "Python (dynamically typed)",
    "code": "# Python infers types automatically\\nname = \\"Alice\\"\\nage = 30\\nsalary = 75000.50\\nis_active = True\\n\\n# Convert directly — no ceremony\\nage_as_text = str(age)"
  }
}
\`\`\`

The four properties working together:

| Property | What It Means | Why It Matters |
|---|---|---|
| **High-level** | Abstracts memory, hardware details | Focus on solving problems, not managing memory |
| **Interpreted** | Runs line by line via interpreter | Instant feedback, easy debugging |
| **Dynamically typed** | Types resolved at runtime | Less boilerplate, faster to write |
| **Multi-paradigm** | Supports OOP, procedural, functional | Use the right tool for each problem |

---

## Busting the Top Myths

Before you go further, let's clear up four beliefs that hold beginners back or scare experienced developers away.

\`\`\`steps
{
  "title": "Debunking Python Myths",
  "steps": [
    {
      "title": "Myth: Python is slow",
      "content": "**The reality:** Python *can* be slower than C for raw CPU loops. But this rarely matters in practice.\\n\\nFor data science and ML, NumPy and TensorFlow execute their heavy computations in optimized C or CUDA code — Python is just the command layer. For web applications, network latency and database queries dominate response time, not Python's execution speed.\\n\\nOrganizations like YouTube and Instagram chose Python precisely because **developer speed** matters more than raw execution speed for most real-world applications."
    },
    {
      "title": "Myth: Python can't handle large projects",
      "content": "**The reality:** Python powers massive codebases at scale.\\n\\n- **YouTube** has run on Python since its founding\\n- **Instagram** serves over 2 billion users with a Django backend\\n- **JPMorgan** uses Python for enterprise-grade financial applications\\n\\nPython's module system, packaging tools (pip, poetry), and type hint support make large-scale development entirely practical."
    },
    {
      "title": "Myth: Python is only for scripting",
      "content": "**The reality:** Python is a general-purpose language first and foremost.\\n\\nYes, it excels at automation and scripting. But it also builds full web applications, trains AI models used in production, processes scientific data at research institutions, and powers game logic. The word 'scripting' undersells what Python can do."
    },
    {
      "title": "Myth: Dynamic typing makes code unreadable",
      "content": "**The reality:** Python 3.5+ includes optional **type hints**, giving you the best of both worlds.\\n\\n\`\`\`python\\n# Without type hints — still clear in context\\ndef greet(name):\\n    return f\\"Hello, {name}\\"\\n\\n# With type hints — explicit contracts\\ndef greet(name: str) -> str:\\n    return f\\"Hello, {name}\\"\\n\`\`\`\\n\\nPython's emphasis on readability means well-written Python is often *more* readable than equivalent statically-typed code."
    }
  ]
}
\`\`\`

---

## Case Study: Python at the Core of Modern AI

The single most transformative application of Python today is artificial intelligence and machine learning.

When a researcher wants to build a neural network that can recognize faces, translate languages, or generate images, they almost certainly reach for Python. Here's why the ecosystem converged on it:

1. **NumPy** gave Python fast array operations that match MATLAB, but open source
2. **Pandas** made tabular data manipulation as intuitive as a spreadsheet
3. **Matplotlib** brought scientific-quality visualization into code
4. **TensorFlow** (Google, 2015) and **PyTorch** (Meta, 2016) used Python as their primary interface, with C++/CUDA doing the heavy lifting

The result: a virtuous cycle. Data scientists chose Python → companies built Python libraries → more data scientists chose Python → better tools. Today, Python is the language of the AI revolution, from academic research labs to products used by billions.

\`\`\`callout
{ "type": "info", "title": "Python's Standard Library", "content": "Python ships with a 'batteries included' philosophy — its standard library contains over 200 modules covering file I/O, networking, regular expressions, JSON parsing, math, testing, and more. You can build a functioning web server in Python with zero external dependencies. This vast built-in toolkit is a major reason Python reduces the gap between idea and working code." }
\`\`\`

---

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Python is described as an 'interpreted' language. What does this mean?",
      "options": [
        "Python translates all code to machine code before running it",
        "Python executes code line by line using an interpreter at runtime",
        "Python requires a virtual machine like Java",
        "Python converts code to C before execution"
      ],
      "answer": 1,
      "explanation": "An interpreted language runs code line by line at runtime. Unlike compiled languages (which translate the whole program before running), Python's interpreter reads and executes each line sequentially — which aids debugging and allows immediate feedback."
    },
    {
      "question": "Instagram, YouTube, and JPMorgan all use Python in production. What does this most directly disprove?",
      "options": [
        "The claim that Python has no standard library",
        "The claim that Python is only for beginners",
        "The claim that Python cannot handle large-scale projects",
        "The claim that Python is dynamically typed"
      ],
      "answer": 2,
      "explanation": "These organizations serve billions of users and handle enterprise-grade workloads. Their use of Python directly contradicts the myth that Python is unsuitable for large projects. Python's modularity and packaging tools make it entirely viable at scale."
    },
    {
      "question": "When Python data science libraries like NumPy or TensorFlow need to perform heavy computation, they:",
      "options": [
        "Use Python's built-in interpreter exclusively",
        "Offload work to compiled C or CUDA code underneath",
        "Convert Python to JavaScript first",
        "Require a separate Java runtime"
      ],
      "answer": 1,
      "explanation": "NumPy and TensorFlow use Python as an interface layer, but their core computations run in optimized C or CUDA code. This is why the 'Python is slow' criticism often misses the mark for data science and ML workloads — the heavy lifting isn't actually done in Python."
    },
    {
      "question": "What does 'dynamically typed' mean in Python?",
      "options": [
        "Python code can only be run on dynamic websites",
        "Variables must be declared with their type before use",
        "Python determines variable types automatically at runtime",
        "Python converts all variables to strings internally"
      ],
      "answer": 2,
      "explanation": "In dynamically typed languages like Python, you don't declare a variable's type — Python infers it from the value assigned. Writing \`age = 30\` is enough; Python recognizes 30 as an integer automatically. This reduces boilerplate compared to statically typed languages like Java or C++."
    },
    {
      "question": "Which of the following best describes Python's multi-paradigm nature?",
      "options": [
        "Python only supports object-oriented programming",
        "Python only supports functional programming",
        "Python supports object-oriented, procedural, and functional programming styles",
        "Python switches paradigms automatically based on hardware"
      ],
      "answer": 2,
      "explanation": "Python is multi-paradigm: you can write object-oriented code with classes, procedural code with functions and loops, or use functional constructs like map, filter, and lambda. This flexibility lets you choose the style that best fits each problem."
    }
  ]
}
\`\`\`

---

## Where This Course Takes You

You now have the mental model of *what* Python is. Over the next nine modules, you will go from understanding Python's philosophy to building real projects.

Here's the journey ahead:

\`\`\`mermaid
flowchart LR
    A[Variables &\\nData Types] --> B[Control Flow\\nif/loops]
    B --> C[Functions]
    C --> D[Data Structures\\nlists/dicts/sets]
    D --> E[OOP\\nClasses]
    E --> F[Real Projects]
    style A fill:#6366f1,color:#fff
    style F fill:#10b981,color:#fff
\`\`\`

Each module builds directly on the last. By the end, you will have written a working data analysis script, a simple web scraper, and a command-line application — all from scratch.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Python is a high-level, interpreted, dynamically typed, general-purpose language designed for readability — code that reads like English is a feature, not a coincidence.",
    "Python's interpreted nature means code runs line by line with no compile step, enabling fast iteration and precise error messages.",
    "Python is not just for scripts: YouTube, Instagram, and JPMorgan use it for large-scale production systems across web, finance, and infrastructure.",
    "Python dominates data science and AI because its ecosystem (NumPy, Pandas, TensorFlow, PyTorch) provides fast, readable access to powerful computation — with C/CUDA doing the heavy lifting underneath.",
    "Common myths — Python is slow, can't scale, or produces unreadable code — are contradicted by real-world evidence and Python's optional type hint system."
  ]
}
\`\`\`

---

\`\`\`callout
{ "type": "tip", "title": "What's Next", "content": "In the next lesson, you will install Python on your machine and run your first program. The interpreter you just learned about will become your constant companion — a tool you can type directly into and get instant responses, like a calculator that understands code." }
\`\`\``,
    },
    {
      id: "installing-python",
      slug: "installing-python",
      title: "Installing Python and Setting Up Your Environment",
      content: `# Installing Python and Setting Up Your Environment

Before you write a single line of code, you need the right tools. Think of this lesson as setting up your workshop — once everything is in place, every lesson that follows becomes smooth and focused on learning, not troubleshooting.

By the end of this lesson you will have Python 3 running on your machine, a professional code editor ready to go, and a clear mental model of how Python actually runs your code.

---

## Why Python? A Quick Reality Check

Python is used by Google, NASA, Instagram, and Netflix — not because it's the newest language, but because it gets things done with less friction than almost anything else. A task that takes 50 lines in Java often takes 5 in Python.

\`\`\`concept
{ "title": "Python's Design Philosophy", "variant": "insight", "content": "Python was designed to be readable first, fast to write second, and performant third. Guido van Rossum (Python's creator) wanted code that reads almost like English. That's why beginners can be productive within hours, not weeks." }
\`\`\`

Real programmers use Python every day to: automate repetitive spreadsheet work, scrape data from websites, build web apps, train machine learning models, and analyse financial datasets. This isn't a toy language — it's the most popular language in the world by multiple rankings.

---

## What You're Actually Installing

Before clicking any download button, understand what Python *is* as a piece of software.

\`\`\`tabs
{ "tabs": [
  { "label": "The Interpreter", "icon": "⚙️", "content": "**Python the interpreter** is a program that reads your Python code and executes it line by line.\\n\\nWhen you type \`python hello.py\`, this interpreter:\\n1. Reads your file\\n2. Translates it to bytecode\\n3. Executes the bytecode\\n\\nThe interpreter is what you're downloading from python.org." },
  { "label": "The Standard Library", "icon": "📚", "content": "Python ships with a massive **standard library** — hundreds of built-in modules you can use immediately.\\n\\nNeed to work with files? \`import os\`. Need to make web requests? \`import urllib\`. Need random numbers? \`import random\`.\\n\\nYou get all of this for free with every Python install." },
  { "label": "pip (Package Manager)", "icon": "📦", "content": "**pip** is Python's package installer, bundled with Python 3.4+.\\n\\nIt lets you install third-party libraries from the Python Package Index (PyPI), which hosts over 450,000 packages.\\n\\n\`\`\`\\npip install requests\\npip install pandas\\npip install flask\\n\`\`\`\\n\\nYou'll use pip constantly as you grow as a developer." },
  { "label": "Python Versions", "icon": "🔢", "content": "Always install **Python 3.x** (currently 3.12+). Python 2 reached end-of-life in 2020 and is no longer supported.\\n\\nIf you see old tutorials referencing \`print 'hello'\` (no parentheses), that's Python 2 — skip it.\\n\\nPython 3 introduced many improvements and is the only version worth learning today." }
] }
\`\`\`

---

## Installing Python 3

\`\`\`steps
{ "title": "Installation Guide", "steps": [
  { "title": "Download from the official source", "content": "Go to **python.org/downloads** — it will detect your operating system and suggest the latest stable release.\\n\\nClick the big yellow **Download Python 3.x.x** button.\\n\\n> Always use python.org directly. Avoid third-party distributors unless you know what you're doing." },
  { "title": "Run the installer (Windows — critical step!)", "content": "On Windows, double-click the downloaded \`.exe\` file.\\n\\n**Before clicking Install Now:**\\n- ✅ Check **\\"Add Python to PATH\\"** at the bottom of the installer window\\n\\nThis single checkbox is the most common mistake beginners make. Without it, Windows won't know where to find Python when you type commands.\\n\\nOn macOS and Linux, PATH is usually configured automatically." },
  { "title": "Verify the installation", "content": "Open your terminal (Command Prompt on Windows, Terminal on macOS/Linux) and run:\\n\\n\`\`\`\\npython --version\\n\`\`\`\\n\\nYou should see something like:\\n\`\`\`\\nPython 3.12.3\\n\`\`\`\\n\\nIf you see \`Python 2.x.x\`, try \`python3 --version\` instead." },
  { "title": "Test pip", "content": "While you're in the terminal, confirm pip is working:\\n\\n\`\`\`\\npip --version\\n\`\`\`\\n\\nExpected output:\\n\`\`\`\\npip 24.0 from /usr/lib/python3/dist-packages/pip (python 3.12)\\n\`\`\`\\n\\nIf pip isn't found, run: \`python -m ensurepip --upgrade\`" }
] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Windows Users: Don't Skip \\"Add to PATH\\"", "content": "If you forget to check \\"Add Python to PATH\\", every command will return \`'python' is not recognized as an internal or external command\`. You'll need to either re-run the installer with that option checked, or manually add Python to your system PATH in Environment Variables." }
\`\`\`

---

## Setting Up VS Code

You *can* write Python in Notepad — but a good editor catches errors before you run your code, colours your syntax for readability, and integrates a terminal. VS Code is free, fast, and what most professional Python developers use day-to-day.

\`\`\`steps
{ "title": "VS Code Setup for Python", "steps": [
  { "title": "Download VS Code", "content": "Go to **code.visualstudio.com** and download for your platform. It's free and open source.\\n\\nInstall it like any normal application." },
  { "title": "Install the Python extension", "content": "1. Open VS Code\\n2. Press \`Ctrl+Shift+X\` (Windows/Linux) or \`Cmd+Shift+X\` (Mac) to open Extensions\\n3. Search for **Python**\\n4. Install the extension by **Microsoft** (the one with millions of downloads)\\n\\nThis extension gives you syntax highlighting, error detection, autocomplete, and debugger support." },
  { "title": "Select your Python interpreter", "content": "1. Press \`Ctrl+Shift+P\` (or \`Cmd+Shift+P\`) to open the command palette\\n2. Type **Python: Select Interpreter**\\n3. Choose the Python 3.x version you just installed\\n\\nVS Code needs to know which Python to use — especially important if you have multiple versions installed." },
  { "title": "Create your first file", "content": "1. Create a new folder anywhere — call it \`python-practice\`\\n2. In VS Code: **File → Open Folder** → select that folder\\n3. Click the **New File** icon and name it \`hello.py\`\\n\\nThe \`.py\` extension tells VS Code (and Python) this is a Python file." }
] }
\`\`\`

---

## The Interpreter vs. Scripts: Two Ways to Run Python

This is one of the most important concepts for beginners to understand early. Python can run code in two completely different modes.

\`\`\`concept
{ "title": "Two Modes of Running Python", "variant": "mental-model", "content": "Think of the Python interpreter like a calculator and a script like a recipe card.\\n\\n**Interactive mode (REPL):** Type one expression, get one answer immediately. Great for experimenting.\\n\\n**Script mode:** Write all your instructions in a file, then hand the whole recipe to Python to execute top to bottom.\\n\\nProfessional code always lives in scripts. The REPL is your scratch pad." }
\`\`\`

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Interactive Mode (REPL)", "code": "# In your terminal, type: python\\n# You enter a live session:\\n\\n>>> 2 + 2\\n4\\n>>> name = 'Alice'\\n>>> print(name)\\nAlice\\n>>> exit()" }, "after": { "label": "Script Mode (.py file)", "code": "# In hello.py:\\nname = 'Alice'\\nprint('Hello,', name)\\nprint('Welcome to Python!')\\n\\n# In terminal:\\n# python hello.py\\n# Output:\\n# Hello, Alice\\n# Welcome to Python!" } }
\`\`\`

**When to use each:**

| Mode | Use it when... |
|------|----------------|
| REPL (\`python\` in terminal) | Testing a quick idea, checking syntax, exploring |
| Script (\`.py\` file) | Building anything real, anything you want to save |

---

## Your First Python Program

Let's write real code. Run this in VS Code — create \`hello.py\`, paste the code below, then press the play button (▶) in the top right, or run \`python hello.py\` in the terminal.

\`\`\`playground
{ "title": "Your First Python Program", "language": "python", "code": "# Lines starting with # are comments — Python ignores them\\n# They're notes for humans reading the code\\n\\n# print() displays text on screen\\nprint('Hello, World!')\\n\\n# Python can do maths too\\nprint(2 + 2)\\nprint(10 * 5)\\n\\n# Strings (text) go in quotes\\nprint('My name is Python')\\nprint('I was created in 1991')", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "success", "title": "You just ran Python!", "content": "If you saw output in the terminal, congratulations — you have a working Python environment. Every complex program you'll ever write starts exactly like this." }
\`\`\`

---

## How Python Actually Executes Your Code

You type code → something happens → output appears. But what happens in between?

\`\`\`concept
{ "title": "Python's Execution Pipeline", "variant": "mental-model", "content": "When you run \`python hello.py\`:\\n\\n1. **Parse** — Python reads your file and checks syntax\\n2. **Compile** — Python converts your code to bytecode (.pyc files)\\n3. **Execute** — The Python Virtual Machine (PVM) runs the bytecode line by line\\n\\nThis is why Python catches syntax errors before running anything — it parses the whole file first." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: .pyc Files and the __pycache__ Folder", "content": "After running a Python script, you may notice a \`__pycache__\` folder appears in your directory. Inside are \`.pyc\` files — the compiled bytecode Python generates.\\n\\nThis is a performance optimisation: if you run the same file twice without changing it, Python skips the compile step and reuses the cached bytecode.\\n\\nYou can safely ignore these files. Never edit them. They're automatically regenerated.\\n\\nAdd \`__pycache__/\` to your \`.gitignore\` file when you start using version control — you don't want to commit them to your repository." }
\`\`\`

---

## Common Setup Problems & Fixes

\`\`\`tabs
{ "tabs": [
  { "label": "'python' not found", "icon": "❌", "content": "**Problem:** Terminal says \`python: command not found\` or \`'python' is not recognized\`\\n\\n**Windows fix:** Re-run the Python installer and check **Add to PATH**\\n\\n**macOS fix:** Try \`python3\` instead of \`python\`. macOS ships with Python 2 pre-installed.\\n\\n**Linux fix:** Run \`sudo apt install python3\` (Ubuntu/Debian) or \`sudo dnf install python3\` (Fedora)" },
  { "label": "Wrong Python version", "icon": "🔢", "content": "**Problem:** \`python --version\` shows Python 2.7.x\\n\\n**Fix:** Use \`python3\` and \`pip3\` commands explicitly, or check that Python 3 is correctly set in your PATH.\\n\\nOn some systems, both Python 2 and 3 coexist. The \`python3\` command always targets the correct version." },
  { "label": "VS Code can't find Python", "icon": "🔍", "content": "**Problem:** VS Code shows a warning like 'Python interpreter not found'\\n\\n**Fix:**\\n1. Open Command Palette (\`Ctrl+Shift+P\`)\\n2. Type **Python: Select Interpreter**\\n3. If your Python isn't listed, click **Enter interpreter path** and browse to the Python executable\\n\\nOn Windows it's usually at \`C:\\\\Users\\\\YourName\\\\AppData\\\\Local\\\\Programs\\\\Python\\\\Python312\\\\python.exe\`" },
  { "label": "Permission errors", "icon": "🔒", "content": "**Problem:** \`pip install\` fails with permission errors\\n\\n**Fix:** Add \`--user\` flag:\\n\`\`\`\\npip install --user requests\\n\`\`\`\\n\\nOr use a virtual environment (covered in a later module). Never use \`sudo pip install\` — it can break your system Python." }
] }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Setting Up Python — Check Your Understanding", "questions": [
  {
    "question": "What is the single most important checkbox to enable when installing Python on Windows?",
    "options": [
      "Install for all users",
      "Add Python to PATH",
      "Install pip",
      "Create shortcuts on Desktop"
    ],
    "answer": 1,
    "explanation": "\\"Add Python to PATH\\" is critical on Windows. Without it, the command line has no idea where to find the Python executable and every python command will return an error."
  },
  {
    "question": "What is the Python REPL best used for?",
    "options": [
      "Writing production applications",
      "Saving code you want to reuse later",
      "Quick experiments and testing small ideas",
      "Running large programs"
    ],
    "answer": 2,
    "explanation": "The REPL (Read-Eval-Print Loop) is like a calculator — great for trying out one-liners and experimenting. Real programs belong in .py script files so you can save, edit, and rerun them."
  },
  {
    "question": "Which of the following is the correct way to verify Python installed successfully?",
    "options": [
      "Open python.org and check the download page",
      "Look for a Python icon on the Desktop",
      "Open a terminal and run \`python --version\`",
      "Check the Control Panel → Programs list"
    ],
    "answer": 2,
    "explanation": "The definitive test is running \`python --version\` (or \`python3 --version\`) in a terminal. If Python is correctly installed and on your PATH, it will print the version number."
  },
  {
    "question": "What does pip do?",
    "options": [
      "Compiles Python code to machine code",
      "Installs third-party Python packages from the internet",
      "Opens the Python interactive interpreter",
      "Formats Python code automatically"
    ],
    "answer": 1,
    "explanation": "pip is Python's package manager. It downloads and installs libraries from PyPI (Python Package Index), which hosts over 450,000 packages. You'll use it constantly — for example: \`pip install requests\` to add HTTP capabilities."
  },
  {
    "question": "When you run \`python hello.py\`, what does Python do FIRST?",
    "options": [
      "Executes the code line by line immediately",
      "Opens an interactive session",
      "Parses the entire file for syntax errors",
      "Uploads the file to PyPI"
    ],
    "answer": 2,
    "explanation": "Python first parses (reads) the entire file to check for syntax errors before executing anything. This is why you get a SyntaxError before any output if you have a typo — Python caught it during the parse phase."
  }
] }
\`\`\`

---

## What You've Accomplished

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Python 3.x is the only version worth installing — always use python.org as your source",
  "On Windows, 'Add Python to PATH' is the single most important installer option",
  "The REPL is for quick experiments; .py script files are for real programs",
  "VS Code + the Microsoft Python extension gives you syntax highlighting, error detection, and autocomplete",
  "Python parses your entire file for syntax errors before executing a single line",
  "pip is your gateway to 450,000+ third-party libraries — it ships with Python 3.4+"
] }
\`\`\`

---

## What's Next

Your environment is ready. In the next lesson, you'll write your first real Python program and understand exactly how Python reads and executes it — line by line, statement by statement. You'll also meet variables, the fundamental building block of every program you'll ever write.

\`\`\`callout
{ "type": "tip", "title": "Practice Before Moving On", "content": "Before the next lesson, try opening the REPL (\`python\` in terminal) and type a few maths expressions: \`100 / 4\`, \`2 ** 10\`, \`(3 + 7) * 5\`. The REPL shows the result instantly. This is Python as a calculator — and it's a great way to get comfortable." }
\`\`\``,
    },
    {
      id: "python-repl",
      slug: "python-repl",
      title: "The Python REPL and Running Scripts",
      content: `# The Python REPL and Running Scripts

Python gives you two distinct ways to talk to the interpreter: **the REPL** (an interactive prompt) and **script files** (\`.py\` files you run from the terminal). Knowing when to use each one is one of the first habits you'll build as a Python programmer.

By the end of this lesson you'll be comfortable firing up the REPL to try one-liners, writing a proper \`.py\` file, and running it from the command line.

---

## What Is the REPL?

\`\`\`concept
{ "title": "The REPL Loop", "variant": "mental-model", "content": "REPL stands for Read–Eval–Print Loop. Python reads what you type, evaluates (runs) it, prints the result, then loops back and waits for more. It's a live conversation with the interpreter — every line executes immediately." }
\`\`\`

Think of it like a calculator that also knows Python. You type an expression, press Enter, and Python answers on the next line — no files, no compiling, no waiting.

---

## Opening the REPL

\`\`\`steps
{ "title": "Starting the Python REPL", "steps": [ { "title": "Open a terminal", "content": "On **macOS/Linux**: open Terminal.\\nOn **Windows**: open PowerShell or Command Prompt (or Windows Terminal)." }, { "title": "Type \`python3\` and press Enter", "content": "\`\`\`\\n$ python3\\nPython 3.12.2 (main, Feb  6 2024, ...)\\nType \\"help\\", \\"copyright\\", \\"credits\\" or \\"license\\" for more information.\\n>>>\\n\`\`\`\\nThe \`>>>\` is the **primary prompt** — Python is ready and waiting for your input.\\n\\n> On Windows you may need \`python\` instead of \`python3\`." }, { "title": "Type an expression and press Enter", "content": "\`\`\`python\\n>>> 2 + 2\\n4\\n>>> \\"Hello, world!\\"\\n'Hello, world!'\\n\`\`\`\\nPython immediately evaluates and prints the result." }, { "title": "Exit when done", "content": "Type \`exit()\` and press Enter, or press **Ctrl+D** (macOS/Linux) / **Ctrl+Z then Enter** (Windows)." } ] }
\`\`\`

---

## Your First REPL Session

The REPL is perfect for quick experiments. Let's walk through what actually happens under the hood when you type a line.

\`\`\`trace
{ "title": "Tracing a REPL Session", "language": "python", "code": ">>> x = 10\\n>>> y = 3\\n>>> x + y\\n>>> x * y\\n>>> x / y", "frames": [ { "line": 1, "vars": {}, "note": "Assign 10 to x. No output — assignment doesn't print.", "stdout": "" }, { "line": 2, "vars": { "x": 10 }, "note": "Assign 3 to y. Still no output.", "stdout": "" }, { "line": 3, "vars": { "x": 10, "y": 3 }, "note": "Evaluate x + y. The result (13) is printed automatically.", "stdout": "13" }, { "line": 4, "vars": { "x": 10, "y": 3 }, "note": "Evaluate x * y. Result printed.", "stdout": "30" }, { "line": 5, "vars": { "x": 10, "y": 3 }, "note": "Evaluate x / y. Python returns a float even for 'clean' division.", "stdout": "3.3333333333333335" } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why does division give a float?", "content": "In Python 3, \`/\` always returns a float (e.g. \`10 / 2\` gives \`5.0\`, not \`5\`). Use \`//\` for integer (floor) division: \`10 // 3\` gives \`3\`." }
\`\`\`

---

## Try It Yourself — REPL Playground

The block below simulates a Python environment. Experiment freely — nothing you type here can break anything.

\`\`\`playground
{ "title": "Experiment in the REPL", "language": "python", "code": "# Try some expressions — change them and re-run!\\nprint(2 + 2)\\nprint(10 / 3)\\nprint(10 // 3)\\nprint(10 % 3)   # modulo — remainder after division\\nprint(2 ** 8)   # exponentiation — 2 to the power of 8\\n\\n# Variables work too\\nname = \\"Ada\\"\\nprint(\\"Hello, \\" + name + \\"!\\")", "runnable": true }
\`\`\`

---

## From REPL to Scripts: Why You Need \`.py\` Files

The REPL is brilliant for exploration, but it has one fatal flaw: **when you close it, everything disappears**. Script files solve that.

\`\`\`concept
{ "title": "Scripts vs. REPL", "variant": "rule", "content": "Use the REPL to explore, prototype, and test single ideas. Use a .py script file for any code you want to save, share, or run again. A script is just a plain text file containing Python statements, executed top-to-bottom." }
\`\`\`

\`\`\`tabs
{ "tabs": [ { "label": "REPL", "icon": "⚡", "content": "**Best for:**\\n- Testing a one-liner quickly\\n- Checking what a function returns\\n- Learning and experimenting\\n- Doing quick calculations\\n\\n**Limitations:**\\n- Code disappears when you exit\\n- Hard to edit multi-line programs\\n- Can't be shared or version-controlled" }, { "label": "Script (.py file)", "icon": "📄", "content": "**Best for:**\\n- Programs you want to run repeatedly\\n- Anything longer than a few lines\\n- Code you'll share with others\\n- Real projects\\n\\n**Limitations:**\\n- Slightly more ceremony to run (save, then execute)\\n- Results don't auto-print — you need \`print()\`" } ] }
\`\`\`

---

## Writing and Running Your First Script

\`\`\`steps
{ "title": "Creating and Running a .py Script", "steps": [ { "title": "Create the file", "content": "Open any text editor (VS Code, Notepad, nano, vim) and create a new file called \`hello.py\`.\\n\\nPaste in this code:\\n\`\`\`python\\n# My first Python script\\nname = \\"World\\"\\nprint(\\"Hello, \\" + name + \\"!\\")\\nprint(\\"2 + 2 =\\", 2 + 2)\\n\`\`\`" }, { "title": "Save it", "content": "Save the file. The \`.py\` extension tells your editor (and Python) that this is a Python file." }, { "title": "Open a terminal in the same folder", "content": "Navigate to the folder containing \`hello.py\`:\\n\`\`\`\\ncd path/to/your/folder\\n\`\`\`\\nVerify the file is there:\\n\`\`\`\\nls        # macOS/Linux\\ndir       # Windows\\n\`\`\`" }, { "title": "Run it with Python", "content": "\`\`\`\\n$ python3 hello.py\\nHello, World!\\n2 + 2 = 4\\n\`\`\`\\nPython reads the file top-to-bottom and executes every statement." } ] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Scripts don't auto-print — use print()", "content": "In the REPL, typing \`2 + 2\` prints \`4\` automatically. In a script, the same line does nothing visible. You must explicitly call \`print(2 + 2)\` to see output. This trips up almost every beginner at least once." }
\`\`\`

---

## Under the Hood: How Python Executes Your Script

When you run \`python3 hello.py\`, several things happen before your output appears.

\`\`\`sysdiag
{ "title": "Python Execution Pipeline", "width": 620, "height": 200, "nodes": [ { "id": "src", "label": "hello.py\\n(source)", "x": 60, "y": 100, "kind": "client" }, { "id": "lex", "label": "Tokenizer\\n& Parser", "x": 200, "y": 100, "kind": "service" }, { "id": "bc", "label": "Bytecode\\n(.pyc)", "x": 360, "y": 100, "kind": "store" }, { "id": "pvm", "label": "Python VM\\n(CPython)", "x": 510, "y": 100, "kind": "service" } ], "edges": [ { "from": "src", "to": "lex", "label": "reads" }, { "from": "lex", "to": "bc", "label": "compiles" }, { "from": "bc", "to": "pvm", "label": "executes" } ], "annotations": { "lex": "Breaks your source text into tokens (words, operators, brackets) then builds a parse tree checking for syntax errors.", "bc": "Compiled bytecode is cached in __pycache__/. On repeat runs Python skips re-compiling if the source hasn't changed.", "pvm": "The virtual machine interprets bytecode instructions one at a time and produces your program's output." } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Syntax errors show up before anything runs", "content": "Because Python parses the entire file before executing, a syntax error on line 50 prevents line 1 from running at all. The error message tells you the file name and line number — read it carefully." }
\`\`\`

---

## The \`print()\` Function in Scripts

In a script, \`print()\` is your main tool for producing output. It's more flexible than it first looks.

\`\`\`playground
{ "title": "print() Patterns", "language": "python", "code": "# Basic string\\nprint(\\"Hello, Python!\\")\\n\\n# Multiple values — print() joins them with a space\\nprint(\\"Score:\\", 42, \\"points\\")\\n\\n# Custom separator\\nprint(\\"2024\\", \\"03\\", \\"15\\", sep=\\"-\\")\\n\\n# Custom end (default is newline \\\\n)\\nprint(\\"Loading\\", end=\\"...\\")\\nprint(\\"done!\\")\\n\\n# Printing nothing prints a blank line\\nprint()\\nprint(\\"After the gap\\")", "runnable": true }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the Script", "prompt": "This script should greet a user by name and print their score. Fill in the two blanks.", "language": "python", "template": "username = \\"Bilal\\"\\nscore = 95\\n___(\\"Hello, \\" + username + \\"!\\")\\nprint(\\"Your score is\\", ___)", "blanks": [ { "answer": "print", "hint": "The built-in function that displays output" }, { "answer": "score", "hint": "The variable holding the number 95" } ] }
\`\`\`

---

## Common Beginner Mistakes

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Mistake — forgetting print() in a script", "code": "# script.py\\nx = 10\\ny = 20\\nx + y        # Does nothing — no output!" }, "after": { "label": "Correct — explicit print()", "code": "# script.py\\nx = 10\\ny = 20\\nprint(x + y)  # Outputs: 30" } }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: What is __pycache__ and can I delete it?", "content": "When you run a \`.py\` file, Python compiles it to **bytecode** and caches the result in a \`__pycache__/\` folder next to your source file. The cached file has a name like \`hello.cpython-312.pyc\`.\\n\\n**Can you delete it?** Yes, safely. Python will just recompile from source on the next run. The cache is purely a performance optimisation — it makes subsequent runs faster by skipping the parse step.\\n\\n**Should you commit it to git?** No. Add \`__pycache__/\` and \`*.pyc\` to your \`.gitignore\`. The bytecode is platform- and version-specific, so it has no value in version control." }
\`\`\`

---

## Quick Reference: REPL vs Script Side-by-Side

| Feature | REPL (\`>>>\`) | Script (\`.py\`) |
|---|---|---|
| Start | \`python3\` in terminal | \`python3 myfile.py\` |
| Auto-print expressions | Yes | No — use \`print()\` |
| Multi-line code | Possible but awkward | Natural |
| Save your work | No | Yes |
| Best for | Experiments, learning | Real programs |
| Exit | \`exit()\` or Ctrl+D | Program ends automatically |

---

## Knowledge Check

\`\`\`quiz
{ "title": "REPL and Scripts Quiz", "questions": [ { "question": "What does REPL stand for?", "options": ["Run, Execute, Print, Loop", "Read–Eval–Print Loop", "Read, Edit, Process, Launch", "Runtime Execution and Print Layer"], "answer": 1, "explanation": "REPL = Read–Eval–Print Loop. Python reads your input, evaluates it, prints the result, then loops back waiting for the next input." }, { "question": "You type \`5 * 7\` in a script file and run it. What is printed?", "options": ["35", "5 * 7", "Nothing — no output is produced", "SyntaxError"], "answer": 2, "explanation": "In a script, expressions are evaluated but not automatically displayed. You need print(5 * 7) to see the result. The REPL auto-prints; scripts do not." }, { "question": "Which command runs a file called \`app.py\` on macOS or Linux?", "options": ["run app.py", "python3 app.py", "execute app.py", "./app"], "answer": 1, "explanation": "python3 app.py passes the filename to the Python interpreter. On Windows you may use \`python app.py\` instead." }, { "question": "You have written 200 lines of code. Where should it live?", "options": ["In the REPL — type it all at the prompt", "In a .py script file", "In a .txt file", "In the __pycache__ folder"], "answer": 1, "explanation": "The REPL is for quick experiments. Anything you want to save, rerun, or share belongs in a .py script file." }, { "question": "Which of the following correctly exits the Python REPL?", "options": ["quit", "exit()", "stop()", "end"], "answer": 1, "explanation": "exit() (or quit()) closes the REPL. You can also press Ctrl+D on macOS/Linux or Ctrl+Z then Enter on Windows." } ] }
\`\`\`

---

## Key Takeaways

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The REPL (started with \`python3\`) lets you run Python one line at a time — great for experiments. Exit with exit() or Ctrl+D.", "Script files (.py) store your code permanently and run top-to-bottom when you execute \`python3 filename.py\`.", "The REPL auto-prints expression results; scripts do not — you must call print() explicitly.", "Python parses the whole file before running anything, so a syntax error anywhere prevents the program from starting.", "Use the REPL to explore; use scripts for anything you want to keep, share, or run again." ] }
\`\`\`

---

**Up next:** Variables and Data Types — how Python stores and names values in memory.`,
      starterCode: `# Exercise: Python REPL vs Script Workflow
#
# In this exercise you will practice the two main ways to run Python:
#   1. The interactive REPL (python3 in your terminal)
#   2. Running a .py script file
#
# INSTRUCTIONS:
# Run each section by typing the commands in your terminal.

# ── PART 1: REPL exploration ─────────────────────────────────────────
# Open your terminal and type: python3
# Then try each of these one line at a time and observe the output.

# TODO 1: In the REPL, type the following and press Enter after each:
#   2 + 3
#   "hello" + " world"
#   type(42)
#   help(len)
# Notice how the REPL immediately shows the result of each expression.

# ── PART 2: Write and run a script ──────────────────────────────────
# Save this file as repl_practice.py, then run it with:
#   python3 repl_practice.py

# TODO 2: Store your name in a variable called \`name\`.
name = None  # replace None with your name as a string

# TODO 3: Store your birth year in a variable called \`birth_year\`.
birth_year = None  # replace None with an integer

# TODO 4: Calculate your approximate age and store it in \`age\`.
#         Use 2026 as the current year.
age = None  # replace None with the calculation

# TODO 5: Print a greeting that uses both variables, e.g.:
#         Hello, Alice! You are approximately 30 years old.
# Hint: use an f-string: f"Hello, {name}!"
print(None)  # replace None with your f-string

# TODO 6: Print the data types of \`name\` and \`age\` using type().
print(None)  # type of name
print(None)  # type of age
`,
      solutionCode: `# Solution: Python REPL vs Script Workflow

# ── PART 1: REPL exploration (no code here — done interactively) ─────
# When you launch the REPL with \`python3\` you see the >>> prompt.
# Every expression you type is evaluated immediately:
#
#   >>> 2 + 3
#   5
#   >>> "hello" + " world"
#   'hello world'
#   >>> type(42)
#   <class 'int'>
#   >>> help(len)        # shows full docs; press q to quit
#
# The REPL is perfect for quick experiments — no file needed.

# ── PART 2: Script ──────────────────────────────────────────────────
# Run this file from the terminal: python3 repl_practice.py
# Unlike the REPL, a script runs top-to-bottom without stopping.

# Store the user's name
name = "Alice"

# Store the birth year
birth_year = 1996

# Calculate approximate age using the current year
age = 2026 - birth_year

# Print a greeting using an f-string (note the escaped braces in content)
print(f"Hello, {name}! You are approximately {age} years old.")

# Show the data types — useful for debugging and REPL-style exploration
print(type(name))   # <class 'str'>
print(type(age))    # <class 'int'>

# ── Key takeaways ────────────────────────────────────────────────────
# REPL  → instant feedback, great for experiments, nothing is saved
# Script → repeatable, shareable, run with \`python3 filename.py\`
`,
    },
    {
      id: "hello-world",
      slug: "hello-world",
      title: "Your First Python Program",
      content: `# Your First Python Program

Every programmer remembers writing their first line of code. In this lesson, you will write yours. By the end, you'll have a working Python program, understand how \`print()\` communicates with the world, know how to leave notes for yourself with comments, and grasp why Python's indentation is not just style — it's the law.

Let's build something real.

---

## What Is a Python Program?

Before writing code, it helps to have the right mental model. A Python program is simply a **text file containing instructions**. Python reads those instructions from top to bottom, one line at a time, and executes them in order. That's it.

\`\`\`concept
{ "title": "A Program Is a Recipe", "variant": "analogy", "content": "Think of a Python program like a recipe. A recipe lists steps in order — chop onions, heat oil, add garlic. The chef (Python interpreter) reads each step from top to bottom and carries it out. Skip a step or put them out of order, and dinner goes wrong. Python works the same way: your instructions, executed in sequence." }
\`\`\`

The file you write is saved with a \`.py\` extension (e.g., \`hello.py\`). When you run it, Python's **interpreter** reads your file and executes every line.

---

## Your First Line: \`print()\`

The very first tool every Python programmer learns is \`print()\`. It tells Python to display text on the screen.

\`\`\`trace
{
  "title": "How Python Executes print()",
  "language": "python",
  "code": "print(\\"Hello, World!\\")\\nprint(\\"I am learning Python.\\")\\nprint(\\"This is line 3.\\")",
  "frames": [
    { "line": 1, "vars": {}, "note": "Python sees the first print() call. It evaluates the string inside the parentheses.", "stdout": "" },
    { "line": 1, "vars": {}, "note": "print() sends the string to the screen and adds a newline at the end.", "stdout": "Hello, World!" },
    { "line": 2, "vars": {}, "note": "Python moves to line 2 and processes the next print() call.", "stdout": "Hello, World!" },
    { "line": 2, "vars": {}, "note": "Output appears below the previous line.", "stdout": "Hello, World!\\nI am learning Python." },
    { "line": 3, "vars": {}, "note": "Python reaches line 3 — the final instruction.", "stdout": "Hello, World!\\nI am learning Python." },
    { "line": 3, "vars": {}, "note": "Program complete. All three lines printed in order.", "stdout": "Hello, World!\\nI am learning Python.\\nThis is line 3." }
  ],
  "speed": 900
}
\`\`\`

Notice the pattern: Python starts at line 1, finishes it, then moves to line 2, and so on. There is no jumping around — execution flows **top to bottom**.

Now run it yourself:

\`\`\`playground
{ "title": "Hello, World!", "language": "python", "code": "print(\\"Hello, World!\\")\\nprint(\\"I am learning Python.\\")\\nprint(\\"This is line 3.\\")", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Try Changing the Text", "content": "Edit the strings inside the quotes and run again. Change \`\\"Hello, World!\\"\` to your name, your city, anything. Breaking and fixing things is one of the fastest ways to learn — experienced developers do it constantly." }
\`\`\`

---

## The Anatomy of \`print()\`

Let's zoom in on the syntax:

\`\`\`
print( "Hello, World!" )
  ^          ^
function   argument (the text to display)
name       wrapped in quotes
\`\`\`

- **\`print\`** — the function name. Python knows what to do when it sees this word.
- **\`()\`** — parentheses tell Python "call this function now."
- **\`"Hello, World!"\`** — the **argument**: the text you want printed. The quotes tell Python this is a text value (called a *string*).

\`\`\`tabs
{ "tabs": [
  { "label": "Double Quotes", "icon": "\\"", "content": "Both double and single quotes work for strings:\\n\\n\`\`\`python\\nprint(\\"Hello, World!\\")\\n\`\`\`\\n\\nUse double quotes when your text contains an apostrophe:\\n\\n\`\`\`python\\nprint(\\"I'm learning Python!\\")\\n\`\`\`" },
  { "label": "Single Quotes", "icon": "'", "content": "Single quotes work exactly the same way:\\n\\n\`\`\`python\\nprint('Hello, World!')\\n\`\`\`\\n\\nUse single quotes when your text contains double quotes:\\n\\n\`\`\`python\\nprint('She said \\"Python is great!\\"')\\n\`\`\`" },
  { "label": "Printing Numbers", "icon": "🔢", "content": "You can print numbers **without** quotes — they don't need them:\\n\\n\`\`\`python\\nprint(42)\\nprint(3.14)\\n\`\`\`\\n\\nOutput:\\n\`\`\`\\n42\\n3.14\\n\`\`\`\\n\\nNumbers are a different *type* than text. We'll explore types in the next module." },
  { "label": "Empty print()", "icon": "↵", "content": "Calling \`print()\` with nothing inside prints a **blank line** — useful for spacing output:\\n\\n\`\`\`python\\nprint(\\"Section 1\\")\\nprint()\\nprint(\\"Section 2\\")\\n\`\`\`\\n\\nOutput:\\n\`\`\`\\nSection 1\\n\\nSection 2\\n\`\`\`" }
] }
\`\`\`

---

## Comments: Notes for Humans

Code is read by two audiences: **Python** (the interpreter) and **humans** (you, future-you, teammates). Comments let you leave notes that Python completely ignores.

A comment starts with a \`#\` character. Everything after \`#\` on that line is invisible to Python.

\`\`\`playground
{ "title": "Comments in Action", "language": "python", "code": "# This is my first Python program\\n# Comments are ignored by Python — they're notes for humans\\n\\nprint(\\"Hello, World!\\")  # This prints a greeting\\n\\n# You can use comments to explain WHY you wrote something:\\n# We print our name so the user knows who wrote this program\\nprint(\\"Written by a Python learner\\")\\n\\n# print(\\"This line is commented out — Python skips it\\")\\nprint(\\"But this line runs fine!\\")", "runnable": true }
\`\`\`

\`\`\`concept
{ "title": "The # Rule", "variant": "rule", "content": "Any line starting with # is a comment — Python skips it entirely. You can also add a comment after code on the same line. Comments never appear in your program's output. Use them to explain your thinking, mark incomplete sections, or temporarily disable a line of code." }
\`\`\`

### Why Comments Matter

As your programs grow, comments become essential:

- **Explain your intent:** *why* you made a decision, not just *what* the code does
- **Mark TODOs:** \`# TODO: add error handling here\`
- **Disable code temporarily:** comment out a line to test without deleting it
- **Help future-you:** code you wrote six months ago can feel like a stranger wrote it

\`\`\`callout
{ "type": "info", "title": "You Don't Need to Memorize Everything", "content": "A common misconception is that programmers memorize every command before building anything. In reality, experienced developers search documentation constantly. What matters is understanding *concepts* — the rest you look up. Comments help you document what you've figured out so you don't have to look it up twice." }
\`\`\`

---

## Indentation: Python's Most Important Rule

In most programming languages, indentation (the spaces or tabs at the start of a line) is just a style choice. **In Python, indentation is part of the syntax.** It defines the structure of your code.

You won't feel its full power until you write \`if\` statements and loops — but you need to understand the rule *now*, so you don't spend hours debugging mysterious errors.

\`\`\`concept
{ "title": "Indentation = Structure", "variant": "mental-model", "content": "Imagine a book with chapters and sections. The chapter heading is at the left margin. The content *inside* that chapter is indented. Python uses the same idea: code that *belongs to* something (a function, a loop, an if-block) is indented consistently. Python uses this visual nesting to determine what runs when." }
\`\`\`

For now, the rule is simple: **don't add unexpected indentation**. Every top-level statement should start at column 1 (no leading spaces).

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "WRONG — unexpected indent", "code": "print(\\"Hello\\")\\n    print(\\"World\\")  # Error! Indented for no reason" }, "after": { "label": "CORRECT — consistent indentation", "code": "print(\\"Hello\\")\\nprint(\\"World\\")  # Both lines start at column 1" } }
\`\`\`

Running the "wrong" version produces:

\`\`\`
IndentationError: unexpected indent
\`\`\`

Python is telling you: "Line 2 is indented, but nothing before it told me to expect that." You'll see *intentional* indentation starting in the very next module when we write \`if\` statements.

\`\`\`callout
{ "type": "warning", "title": "Spaces vs Tabs", "content": "Use **4 spaces** for indentation — never mix spaces and tabs in the same file. Most Python editors (VS Code, PyCharm) automatically insert 4 spaces when you press Tab. Mixing them causes a \`TabError\` that can be very frustrating to diagnose. Pick spaces and stick with them." }
\`\`\`

---

## Putting It Together

Let's write a complete first program that uses everything from this lesson:

\`\`\`playground
{ "title": "Complete First Program", "language": "python", "code": "# My First Python Program\\n# Author: Python Learner\\n# Purpose: Practice print(), comments, and clean formatting\\n\\n# --- Introduction ---\\nprint(\\"==========================\\")\\nprint(\\"  My First Python Program\\")\\nprint(\\"==========================\\")\\nprint()  # blank line for spacing\\n\\n# --- Content ---\\nprint(\\"Hello, World!\\")\\nprint(\\"Python is versatile: web, data, automation, games, and more.\\")\\nprint()\\n\\n# --- Sign off ---\\nprint(\\"Program complete. Goodbye!\\")  # Final message", "runnable": true }
\`\`\`

Clean, readable, well-commented. This is the standard you'll hold yourself to throughout the course.

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Write a print() Statement", "prompt": "Complete the function call to print the text: My name is Python", "language": "python", "template": "___(\\"My name is Python\\")", "blanks": [ { "answer": "print", "hint": "The built-in function that displays output to the screen" } ] }
\`\`\`

\`\`\`fillblank
{ "title": "Add a Comment", "prompt": "Add a comment on the blank line that says: This prints a greeting", "language": "python", "template": "___This prints a greeting\\nprint(\\"Hello!\\")", "blanks": [ { "answer": "#", "hint": "All Python comments start with this character" } ] }
\`\`\`

---

## Check Your Understanding

\`\`\`quiz
{ "title": "Your First Python Program — Quiz", "questions": [
  {
    "question": "What does print() do in Python?",
    "options": [
      "Saves text to a file",
      "Displays text on the screen",
      "Creates a new variable",
      "Runs another Python file"
    ],
    "answer": 1,
    "explanation": "print() sends output to the screen (standard output). It's the most basic way to communicate results from your program to the user."
  },
  {
    "question": "Which of the following is a valid Python comment?",
    "options": [
      "// This is a comment",
      "/* This is a comment */",
      "# This is a comment",
      "-- This is a comment"
    ],
    "answer": 2,
    "explanation": "Python uses # to start a comment. Everything after # on that line is ignored by the interpreter. The other styles (// and /* */) are from languages like JavaScript and C, and -- is from SQL."
  },
  {
    "question": "What error does Python raise when you indent a line for no reason?",
    "options": [
      "SyntaxError",
      "IndentationError",
      "TypeError",
      "NameError"
    ],
    "answer": 1,
    "explanation": "Python raises an IndentationError when it finds unexpected indentation — a line that is indented but doesn't belong to any block (like an if-statement or function). In Python, indentation is part of the syntax, not just style."
  },
  {
    "question": "What is the output of this code?\\n\\nprint(\\"Line 1\\")\\nprint(\\"Line 2\\")\\nprint(\\"Line 3\\")",
    "options": [
      "Line 3 (only the last line prints)",
      "Line 1 Line 2 Line 3 (on one line)",
      "Line 1\\\\nLine 2\\\\nLine 3 (each on its own line)",
      "An error — you can only call print() once"
    ],
    "answer": 2,
    "explanation": "Python executes top to bottom. Each print() call outputs its text followed by a newline, so all three lines appear on separate lines in order: Line 1, then Line 2, then Line 3."
  },
  {
    "question": "Which statement about Python is FALSE?",
    "options": [
      "Python is used in web development, data science, automation, and game development",
      "You must memorize every Python command before writing your first program",
      "Python files are saved with a .py extension",
      "print() can display both text (with quotes) and numbers (without quotes)"
    ],
    "answer": 1,
    "explanation": "It's a misconception that you must memorize everything first. Experienced developers search documentation constantly — what matters is understanding concepts. You can build real programs from day one without memorizing the entire language."
  }
] }
\`\`\`

---

## Where This Takes You

The script you wrote today — a handful of \`print()\` calls and comments — is the same building block used in Python programs that automate thousands of files, send emails, and process spreadsheets. The only difference is scale and logic, not the fundamental tools.

In the next lesson, you'll learn about **variables**: giving names to values so your programs can remember and reuse information. That's when things start to get interesting.

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "print() displays text or numbers to the screen — it's Python's main output tool",
  "Strings (text) go inside quotes; print(42) works without quotes for numbers",
  "Comments start with # — Python ignores them, but humans rely on them",
  "In Python, indentation is syntax: unexpected indentation causes an IndentationError",
  "Python executes your program top to bottom, one line at a time",
  "You don't need to memorize everything — understanding concepts and building things matters more"
] }
\`\`\``,
      starterCode: `# TODO 1: Print a greeting message using print()
# Example: print("Hello, World!")


# TODO 2: Add a single-line comment above the line below explaining what it does
name = "Python Learner"


# TODO 3: Print a message that includes the name variable
# Hint: use print() with the variable directly, e.g. print(name)


# TODO 4: Fix the indentation error in the block below
# (Python requires consistent indentation inside blocks)
if True:
print("Indentation matters in Python!")
`,
      solutionCode: `# Print a classic Hello World greeting
print("Hello, World!")

# Store the learner's name in a variable
name = "Python Learner"

# Print a personalised welcome message using the variable
print(name)

# Demonstrate correct indentation inside an if block
if True:
    print("Indentation matters in Python!")
`,
    },
    {
      id: "how-python-executes",
      slug: "how-python-executes",
      title: "How Python Executes Code",
      content: `# How Python Executes Code

When you type \`python hello.py\` and press Enter, something remarkable happens in milliseconds — your readable English-like code is transformed, analyzed, and ultimately turned into machine instructions your CPU can run. Most tutorials skip this entirely. This lesson won't.

Understanding how Python executes code makes you a better debugger, a more informed developer, and helps you reason about performance. Let's pull back the curtain.

---

## The Big Picture: Python Is a Hybrid

Ask ten developers "Is Python compiled or interpreted?" and you'll likely get ten different answers. Here's the truth:

\`\`\`concept
{ "title": "Python's Hybrid Execution Model", "variant": "mental-model", "content": "Python is neither purely compiled (like C) nor purely interpreted (like early BASIC). It uses a two-phase hybrid model: first, your source code is *compiled* into an intermediate format called bytecode; then, that bytecode is *interpreted* by the Python Virtual Machine (PVM). You get the flexibility of interpretation with some of the efficiency of compilation." }
\`\`\`

This distinction matters. When people say "Python is slow," they're often comparing it to fully compiled languages like C++ — but that comparison ignores the C-powered libraries running underneath Python that make NumPy matrix operations blazingly fast.

---

## The Execution Pipeline

Every time you run a Python script, it passes through four distinct stages. Let's walk through each one.

\`\`\`steps
{ "title": "From Source Code to Running Program", "steps": [ { "title": "Stage 1 — Source Code (.py file)", "content": "It starts with a plain text file you wrote — \`hello.py\`. The Python interpreter reads this file as human-readable characters.\\n\\n\`\`\`python\\n# hello.py\\nname = 'World'\\nprint(f'Hello, {name}!')\\n\`\`\`\\n\\nThis is just text. The CPU has no idea what \`print\` means. Something has to translate it." }, { "title": "Stage 2 — Lexing and Parsing → AST", "content": "The interpreter performs **lexical analysis** (breaking code into tokens like \`name\`, \`=\`, \`'World'\`) and **syntax analysis** (checking the grammar rules). The result is an **Abstract Syntax Tree (AST)** — a tree-shaped data structure representing the logical structure of your code.\\n\\nThink of the AST as a diagram of *what your code means*, not *how it looks*. Comments and whitespace are stripped away. Only meaning remains." }, { "title": "Stage 3 — Bytecode Compilation", "content": "The AST is compiled into **bytecode** — a compact, low-level set of instructions. Bytecode is *not* machine code (it won't run directly on your CPU), but it's much closer than Python source code.\\n\\nThese bytecode instructions are cached in \`.pyc\` files inside a \`__pycache__\` directory. Next time you run the script unchanged, Python skips stages 1–3 and loads the cached bytecode directly — making startup faster." }, { "title": "Stage 4 — Python Virtual Machine (PVM)", "content": "The **PVM** is the engine at the heart of CPython. It reads bytecode instruction by instruction, translates each into machine-level operations, and executes them on your actual CPU — making system calls to the operating system as needed (for file I/O, network access, etc.).\\n\\nThe PVM is a software layer — it's what makes the same Python script run on Windows, macOS, and Linux without changes." } ] }
\`\`\`

---

## Visualizing the Runtime

Here's the full CPython runtime as a system diagram:

\`\`\`sysdiag
{ "title": "CPython Execution Architecture", "width": 620, "height": 340, "nodes": [ { "id": "src", "label": ".py File", "x": 80, "y": 170, "kind": "storage" }, { "id": "lexer", "label": "Lexer + Parser", "x": 210, "y": 100, "kind": "service" }, { "id": "ast", "label": "AST", "x": 340, "y": 100, "kind": "queue" }, { "id": "compiler", "label": "Bytecode Compiler", "x": 340, "y": 220, "kind": "service" }, { "id": "pyc", "label": "__pycache__\\n(.pyc)", "x": 460, "y": 300, "kind": "storage" }, { "id": "pvm", "label": "PVM", "x": 500, "y": 170, "kind": "service" }, { "id": "cpu", "label": "CPU + OS", "x": 580, "y": 80, "kind": "external" } ], "edges": [ { "from": "src", "to": "lexer", "label": "reads" }, { "from": "lexer", "to": "ast", "label": "builds" }, { "from": "ast", "to": "compiler", "label": "compiles" }, { "from": "compiler", "to": "pvm", "label": "bytecode" }, { "from": "compiler", "to": "pyc", "label": "caches" }, { "from": "pyc", "to": "pvm", "label": "on rerun" }, { "from": "pvm", "to": "cpu", "label": "executes" } ], "annotations": { "src": "Your Python source file — human-readable text that the CPU cannot directly execute.", "lexer": "Breaks source into tokens, checks grammar, builds a parse tree. Raises SyntaxError if rules are violated.", "ast": "Abstract Syntax Tree: a tree of objects representing what the code *means*, stripped of whitespace and comments.", "compiler": "Walks the AST and emits bytecode — compact instructions the PVM understands.", "pyc": "Cached compiled bytecode. Python checks if the source has changed (via modification time + hash). If not, skips recompilation.", "pvm": "The Python Virtual Machine — a C-implemented loop that fetches, decodes, and executes bytecode one instruction at a time.", "cpu": "Your actual processor. The PVM makes system calls to the OS here for I/O, memory allocation, threading, etc." } }
\`\`\`

---

## Two Ways to Run Python Code

Python supports two distinct execution modes — each useful in different situations.

\`\`\`tabs
{ "tabs": [ { "label": "Script Mode", "icon": "📄", "content": "**Script mode** runs an entire \`.py\` file from top to bottom.\\n\\n\`\`\`bash\\npython hello.py\\n\`\`\`\\n\\n- The interpreter reads the whole file before executing\\n- Bytecode is compiled and cached in \`__pycache__\`\\n- Execution ends when the last line is reached (or an unhandled error occurs)\\n- Perfect for programs, automation scripts, and anything you want to run repeatedly\\n\\n**When to use it:** Any real program — web servers, data pipelines, scripts, applications." }, { "label": "Interactive Mode (REPL)", "icon": "💬", "content": "**Interactive mode** (the REPL — Read-Eval-Print Loop) executes one statement at a time and immediately shows the result.\\n\\n\`\`\`bash\\n$ python\\n>>> 2 + 2\\n4\\n>>> name = 'Alice'\\n>>> print(f'Hello, {name}!')\\nHello, Alice!\\n\`\`\`\\n\\n- Each line is compiled and executed *immediately*\\n- No \`.pyc\` files are cached\\n- State persists across lines in the same session\\n- Perfect for exploration, debugging, and learning\\n\\n**When to use it:** Testing a quick idea, exploring a library API, doing math, debugging a tricky expression." }, { "label": "Bytecode Inspection", "icon": "🔍", "content": "You can actually *see* the bytecode Python generates using the built-in \`dis\` module:\\n\\n\`\`\`python\\nimport dis\\n\\ndef add(a, b):\\n    return a + b\\n\\ndis.dis(add)\\n\`\`\`\\n\\nOutput:\\n\`\`\`\\n  3           0 RESUME          0\\n\\n  4           2 LOAD_FAST       0 (a)\\n              4 LOAD_FAST       1 (b)\\n              6 BINARY_OP      0 (+)\\n             10 RETURN_VALUE\\n\`\`\`\\n\\nEach row is one bytecode instruction. \`LOAD_FAST\` pushes a variable onto the stack. \`BINARY_OP\` pops two values, adds them. \`RETURN_VALUE\` returns the result. The PVM executes these one by one." } ] }
\`\`\`

---

## Clearing Up Common Misconceptions

These misunderstandings trip up beginners and experienced developers alike.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Common Misconception", "code": "# Python is a purely interpreted language.\\n# Your code runs line-by-line directly.\\n# There is no compilation step.\\n# Python is always slow because it's interpreted.\\n# Python is a new/trendy language." }, "after": { "label": "The Reality", "code": "# Python uses a HYBRID model.\\n# Source code is first COMPILED to bytecode,\\n# then the PVM INTERPRETS that bytecode.\\n#\\n# Performance: NumPy, Pandas, TensorFlow are\\n# C-implemented under the hood. Python is the\\n# 'glue' — often fast enough for the task.\\n#\\n# Age: Python was created in 1991.\\n# It is older than Java (1995)." } }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "What is CPython?", "content": "When you download Python from python.org, you get **CPython** — the reference implementation of Python, written in C. It's the most widely used Python runtime. Other implementations exist (PyPy compiles to native machine code for speed; Jython targets the JVM; MicroPython runs on microcontrollers), but CPython is the standard that all others aim to be compatible with." }
\`\`\`

---

## Real-World Context: Why This Matters for Data Science

Python's execution model directly explains why it dominates data science and machine learning.

A data scientist writes readable, concise Python code using libraries like **Pandas**, **NumPy**, and **TensorFlow**. When that code runs:

1. Python (CPython) orchestrates the computation
2. Library calls drop into **C-implemented extensions** — compiled native code running at full CPU speed
3. Python acts as high-level "glue" connecting optimized components

This is the best of both worlds: **developer productivity** from Python's readable syntax, **execution speed** from C-powered internals. A \`np.dot(A, B)\` matrix multiplication in NumPy runs as optimized BLAS/LAPACK C code, not slow Python loops.

\`\`\`callout
{ "type": "tip", "title": "The __pycache__ Directory", "content": "After running a Python script, look in the same directory — you'll find a \`__pycache__\` folder containing \`.pyc\` files. These are the cached bytecode files. Python checks if the source file has changed (using its modification timestamp and a hash). If it hasn't, the interpreter skips re-compilation and loads the cached bytecode directly, saving startup time. You can safely delete \`__pycache__\` — Python will regenerate it the next time the script runs." }
\`\`\`

---

## Try It Yourself

See the execution model in action by inspecting bytecode:

\`\`\`playground
{ "title": "Inspect Python Bytecode with dis", "language": "python", "code": "import dis\\n\\ndef greet(name):\\n    message = 'Hello, ' + name\\n    return message\\n\\nprint('--- Bytecode for greet() ---')\\ndis.dis(greet)\\n\\nprint('\\\\n--- Running the function ---')\\nresult = greet('World')\\nprint(result)", "runnable": true }
\`\`\`

Look at the bytecode output. You'll see instructions like \`LOAD_FAST\` (load a local variable), \`BINARY_OP\` (perform an operation), and \`RETURN_VALUE\`. These are the exact instructions the PVM executes when your function runs.

---

## Check Your Understanding

\`\`\`quiz
{ "title": "How Python Executes Code", "questions": [ { "question": "Which of the following best describes Python's execution model?", "options": ["Python source code is directly executed by the CPU, line by line", "Python source code is compiled to machine code, then run without a virtual machine", "Python source code is compiled to bytecode, which is then interpreted by the PVM", "Python source code is transpiled to C, which is then compiled and run"], "answer": 2, "explanation": "Python uses a hybrid model: source code is first compiled to bytecode (an intermediate representation), and the Python Virtual Machine (PVM) then interprets and executes that bytecode. It is neither purely compiled nor purely interpreted." }, { "question": "Where does Python store cached bytecode files after compiling a script?", "options": ["In a .pyb file alongside the .py file", "In a __pycache__ directory as .pyc files", "In memory only — they are never written to disk", "In a system-wide registry accessible to all Python programs"], "answer": 1, "explanation": "Python stores compiled bytecode in \`.pyc\` files inside a \`__pycache__\` directory. On subsequent runs, Python checks if the source has changed; if not, it loads the cached bytecode to skip recompilation." }, { "question": "What is the Python Virtual Machine (PVM)?", "options": ["A separate virtual computer you must install to run Python programs", "A cloud service that runs Python code remotely", "A software component within CPython that reads and executes bytecode instructions", "The Python IDE that provides an interactive code editor"], "answer": 2, "explanation": "The PVM is a software component — a C-implemented execution engine — that forms part of the CPython interpreter. It reads bytecode instructions one at a time and translates them into machine-level operations the CPU can perform." }, { "question": "Python was created in 1991. How does this compare to Java?", "options": ["Python and Java were released in the same year", "Python is newer than Java", "Python is older than Java, which was released in 1995", "Python predates Java by more than 20 years"], "answer": 2, "explanation": "Python was created in 1991, making it older than Java which was released in 1995. Python is not a new or trendy language — it has over three decades of history." }, { "question": "Why can Python-based data science libraries like NumPy be fast despite Python's overhead?", "options": ["NumPy uses a special Python syntax that bypasses the PVM", "NumPy's performance-critical operations are implemented in C and run as native machine code", "Python automatically detects NumPy usage and switches to compiled mode", "NumPy sends computations to a remote server that runs faster hardware"], "answer": 1, "explanation": "Libraries like NumPy, Pandas, and TensorFlow are largely implemented in C (or Fortran/CUDA). When Python calls these libraries, execution drops into compiled native code running at full CPU speed. Python acts as high-level 'glue', providing readability while the heavy computation happens in C." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Python uses a **hybrid execution model**: source code is first compiled to bytecode, then the PVM interprets that bytecode — it is not purely compiled or purely interpreted.", "The execution pipeline has four stages: Source Code → Lexer/Parser → AST → Bytecode Compiler → PVM → CPU.", "Compiled bytecode is cached in \`.pyc\` files inside \`__pycache__\`, speeding up subsequent runs by skipping recompilation.", "Python has two execution modes: **script mode** (runs an entire file) and **interactive mode / REPL** (executes one statement at a time immediately).", "The **CPython** runtime (from python.org) is the reference implementation. Other runtimes like PyPy exist but CPython is the standard.", "Python's performance in data science comes from C-implemented libraries like NumPy — Python provides readable 'glue' while the heavy computation runs as native machine code." ] }
\`\`\``,
    },
    {
      id: "getting-started-checkpoint",
      slug: "getting-started-checkpoint",
      title: "Checkpoint: Environment and First Steps",
      content: `# Checkpoint: Environment and First Steps

You've installed Python, opened the interpreter, and written your very first program. Now it's time to **lock in what you've learned** — not by reading more, but by *doing*.

This checkpoint has three goals:
1. Confirm your environment is set up correctly
2. Practice the \`print()\` function with multiple values and separators
3. Run a real Python script from a file (not just the REPL)

Work through each section actively. The interactive exercises below mirror exactly what you'd do in a real terminal.

---

## Part 1 — Your Environment at a Glance

Before writing any code, let's make sure everything is wired up. Here's what a healthy Python setup looks like and how each piece fits together.

\`\`\`sysdiag
{
  "title": "Your Python Environment",
  "width": 620,
  "height": 300,
  "nodes": [
    { "id": "code", "label": "Your .py File", "x": 80, "y": 150, "kind": "client" },
    { "id": "interp", "label": "Python Interpreter", "x": 280, "y": 150, "kind": "service" },
    { "id": "repl", "label": "REPL (Interactive)", "x": 280, "y": 60, "kind": "service" },
    { "id": "out", "label": "Terminal Output", "x": 500, "y": 150, "kind": "database" }
  ],
  "edges": [
    { "from": "code", "to": "interp", "label": "python script.py" },
    { "from": "repl", "to": "interp", "label": "live input" },
    { "from": "interp", "to": "out", "label": "executes & prints" }
  ],
  "annotations": {
    "code": "A plain text file ending in .py — this is where your programs live",
    "interp": "CPython reads your source line-by-line, converts it to bytecode, and runs it",
    "repl": "Read-Eval-Print Loop — type one line, see the result instantly. Great for experimenting.",
    "out": "Anything passed to print() appears here"
  }
}
\`\`\`

\`\`\`concept
{
  "title": "Two Ways to Run Python",
  "variant": "rule",
  "content": "The REPL (type \`python\` in your terminal) is for quick experiments — one line in, one result out. Script mode (type \`python filename.py\`) runs an entire file top to bottom. For anything longer than a few lines, use a file."
}
\`\`\`

---

## Part 2 — The \`print()\` Function, Deeply

You've used \`print("Hello, world!")\`. But \`print()\` has several tricks that make it far more useful. Let's trace through them one by one.

\`\`\`trace
{
  "title": "print() — What Really Happens",
  "language": "python",
  "code": "print(\\"Hello\\")\\nprint(\\"Hello\\", \\"world\\")\\nprint(\\"Hello\\", \\"world\\", sep=\\"-\\")\\nprint(\\"Hello\\", end=\\" \\")\\nprint(\\"world\\")",
  "frames": [
    { "line": 1, "vars": {}, "note": "Single argument — prints the string followed by a newline (\\\\n) by default", "stdout": "Hello" },
    { "line": 2, "vars": {}, "note": "Two arguments — print() inserts a space between them automatically (sep=' ' is the default)", "stdout": "Hello\\nHello world" },
    { "line": 3, "vars": {}, "note": "sep=\\"-\\" overrides the default separator. Any string can go between arguments.", "stdout": "Hello\\nHello world\\nHello-world" },
    { "line": 4, "vars": {}, "note": "end=\\" \\" replaces the trailing newline with a space. The cursor stays on the same line.", "stdout": "Hello\\nHello world\\nHello-world\\nHello " },
    { "line": 5, "vars": {}, "note": "This print() starts where the last one left off — same line!", "stdout": "Hello\\nHello world\\nHello-world\\nHello world" }
  ],
  "speed": 900
}
\`\`\`

\`\`\`callout
{
  "type": "info",
  "title": "sep and end are keyword arguments",
  "content": "You'll learn about keyword arguments properly in the Functions module. For now, remember: \`sep\` controls what goes *between* values, and \`end\` controls what goes *after* the last value. Both default to a space and newline respectively."
}
\`\`\`

---

## Part 3 — Hands-On: Write and Run

Time to write real code. Each playground below is runnable — hit **Run** and check the output matches what you expect.

\`\`\`playground
{
  "title": "Exercise 1 — Print Your Name Tag",
  "language": "python",
  "code": "# A simple name tag program\\n# Change the values to your own name and favourite language\\n\\nname = \\"Alex\\"\\nlanguage = \\"Python\\"\\n\\nprint(\\"Name:\\", name)\\nprint(\\"Favourite language:\\", language)\\nprint(\\"---\\")\\nprint(name, \\"loves\\", language + \\"!\\")",
  "runnable": true
}
\`\`\`

\`\`\`playground
{
  "title": "Exercise 2 — The print() Options",
  "language": "python",
  "code": "# Explore sep and end\\n\\n# Print a date in DD/MM/YYYY format using sep\\nprint(13, 4, 2026, sep=\\"/\\")\\n\\n# Print three words on one line using end\\nprint(\\"Python\\", end=\\" \\")\\nprint(\\"is\\", end=\\" \\")\\nprint(\\"fun\\")\\n\\n# Now try: print the numbers 1 to 5 on one line, separated by commas\\n# Hint: use sep and end together\\nprint(1, 2, 3, 4, 5, sep=\\", \\")",
  "runnable": true
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Try breaking it on purpose",
  "content": "The best way to learn is to **experiment**. Change \`sep=\\"/\\"\` to \`sep=\\"__\\"\` — what happens? Remove the quotes around \`\\"fun\\"\` — what error do you get? Read the error message carefully. Python's error messages are informative once you know what to look for."
}
\`\`\`

---

## Part 4 — Running a Script From a File

The REPL is great for experiments, but real programs live in \`.py\` files. Here's the exact workflow:

\`\`\`steps
{
  "title": "Creating and Running Your First Script",
  "steps": [
    {
      "title": "Create the file",
      "content": "Open any text editor (Notepad, VS Code, PyCharm). Create a new file and save it as \`hello.py\` — the \`.py\` extension tells your computer this is a Python file.\\n\\n\`\`\`python\\n# hello.py\\nprint(\\"Hello from a script!\\")\\nprint(\\"Python version:\\", end=\\" \\")\\nimport sys\\nprint(sys.version)\\n\`\`\`"
    },
    {
      "title": "Open your terminal",
      "content": "**Windows:** Press \`Win + R\`, type \`cmd\`, press Enter.\\n**Mac/Linux:** Open Terminal from Applications or Spotlight.\\n\\nYou should see a prompt like \`C:\\\\Users\\\\yourname>\` or \`~$\`."
    },
    {
      "title": "Navigate to the file's folder",
      "content": "Use \`cd\` (change directory) to get to where you saved \`hello.py\`.\\n\\n\`\`\`bash\\n# Example — adjust to your actual path\\ncd C:\\\\Users\\\\yourname\\\\Documents\\\\python\\n\`\`\`\\n\\nType \`dir\` (Windows) or \`ls\` (Mac/Linux) to confirm \`hello.py\` is there."
    },
    {
      "title": "Run the script",
      "content": "Type the command and press Enter:\\n\\n\`\`\`bash\\npython hello.py\\n\`\`\`\\n\\nYou should see:\\n\`\`\`\\nHello from a script!\\nPython version: 3.x.x ...\\n\`\`\`\\n\\nIf you see \`python: command not found\`, try \`python3 hello.py\` instead."
    },
    {
      "title": "Edit and re-run",
      "content": "Go back to your editor. Change the message inside \`print()\`. Save the file. Run \`python hello.py\` again.\\n\\nThis edit → save → run loop is **the core of all programming**. Every professional developer does exactly this, thousands of times a day."
    }
  ]
}
\`\`\`

---

## Part 5 — Visualising How Python Reads Your Script

When Python runs \`hello.py\`, it doesn't jump around — it reads **top to bottom, line by line**. This is sequential execution, the foundation of all programs.

\`\`\`algoviz
{
  "title": "Sequential Execution — Python Reads Line by Line",
  "type": "array",
  "data": ["# comment", "name = 'Ada'", "age = 36", "print(name)", "print(age)"],
  "frames": [
    { "highlight": [0], "label": "Line 1: Comment — Python sees # and skips this line entirely", "stats": { "line": 1, "action": "skip" } },
    { "highlight": [1], "label": "Line 2: Assignment — Python creates a variable 'name' and stores 'Ada' in memory", "stats": { "line": 2, "action": "store" } },
    { "highlight": [2], "label": "Line 3: Assignment — Python creates a variable 'age' and stores 36 in memory", "stats": { "line": 3, "action": "store" } },
    { "highlight": [3], "label": "Line 4: print(name) — Python looks up 'name', finds 'Ada', sends it to the terminal", "stats": { "line": 4, "action": "output" } },
    { "highlight": [4], "label": "Line 5: print(age) — Python looks up 'age', finds 36, sends it to the terminal. Done!", "stats": { "line": 5, "action": "output" } }
  ],
  "speed": 800
}
\`\`\`

\`\`\`concept
{
  "title": "Python is an Interpreted Language",
  "variant": "mental-model",
  "content": "Unlike compiled languages (like C or Java) that translate your entire program before running it, Python *interprets* your code line by line at runtime. This is why the REPL works — Python can execute a single line immediately. It also means errors only appear when Python reaches the broken line, not before."
}
\`\`\`

---

## Part 6 — Fill in the Blanks

Test your understanding by completing these programs:

\`\`\`fillblank
{
  "title": "Practice 1 — Print with Separator",
  "prompt": "Complete the program so it prints: \`2026/04/13\` — a date in YYYY/MM/DD format using a single print() call.",
  "language": "python",
  "template": "year = 2026\\nmonth = 4\\nday = 13\\n\\nprint(year, month, day, ___=___)",
  "blanks": [
    { "answer": "sep", "hint": "This keyword argument controls what goes between the values" },
    { "answer": "\\"/\\"", "hint": "We want a forward slash between each number — it must be a string" }
  ]
}
\`\`\`

\`\`\`fillblank
{
  "title": "Practice 2 — Same Line Output",
  "prompt": "Fill in the blanks so both print() calls produce output on the **same line**, giving: \`Hello, world!\`",
  "language": "python",
  "template": "print(\\"Hello,\\", ___=___)\\nprint(\\"world!\\")",
  "blanks": [
    { "answer": "end", "hint": "This keyword argument controls what comes after the printed text" },
    { "answer": "\\" \\"", "hint": "We want a single space (not a newline) so the next print starts on the same line" }
  ]
}
\`\`\`

---

## Checkpoint Quiz

\`\`\`quiz
{
  "title": "Module 1 Checkpoint — Environment and First Steps",
  "questions": [
    {
      "question": "What does the Python REPL stand for, and what is it primarily used for?",
      "options": [
        "Run-Execute-Print-Loop — for compiling Python programs into executables",
        "Read-Eval-Print Loop — for executing one line of Python at a time and seeing results immediately",
        "Real-time Execution and Processing Language — for parallel computing",
        "Recursive Evaluation and Parsing Layer — for debugging complex programs"
      ],
      "answer": 1,
      "explanation": "REPL stands for Read-Eval-Print Loop. It reads a line of input, evaluates (runs) it, prints the result, then loops back and waits for the next line. It's ideal for quick experiments and learning."
    },
    {
      "question": "Which command runs a Python script called \`greet.py\` from the terminal?",
      "options": [
        "run greet.py",
        "execute greet.py",
        "python greet.py",
        "start greet.py"
      ],
      "answer": 2,
      "explanation": "You invoke the Python interpreter with \`python\` (or \`python3\` on some systems) followed by the filename. The interpreter reads the file and executes it top to bottom."
    },
    {
      "question": "What will this code print?\\n\\n\`\`\`python\\nprint(\\"a\\", \\"b\\", \\"c\\", sep=\\"-\\")\\n\`\`\`",
      "options": [
        "a b c",
        "a-b-c",
        "abc",
        "a, b, c"
      ],
      "answer": 1,
      "explanation": "The \`sep\` keyword argument replaces the default space separator. With \`sep=\\"-\\"\`, Python inserts a hyphen between each argument, producing \`a-b-c\`."
    },
    {
      "question": "You write a Python script and run it. An error appears on line 7. Lines 1–6 ran fine. What does this tell you about Python's execution model?",
      "options": [
        "Python checks the entire file for errors before running any line",
        "Python executes code sequentially, line by line — earlier lines already ran before the error was hit",
        "Python only runs the line with the error and skips everything else",
        "Python compiles the file first, so all lines must be error-free before any run"
      ],
      "answer": 1,
      "explanation": "Python is an interpreted language that executes code sequentially — top to bottom, line by line. Lines 1–6 already executed successfully before Python reached and failed on line 7. This is different from compiled languages that check the whole file first."
    },
    {
      "question": "What is the purpose of the \`end\` keyword argument in \`print()\`?",
      "options": [
        "It sets the character(s) printed between multiple arguments",
        "It stops the program after the print statement executes",
        "It replaces the default newline character at the end of the printed output",
        "It prints the output at the end of the file instead of inline"
      ],
      "answer": 2,
      "explanation": "By default, \`print()\` adds a newline (\`\\\\n\`) after the output, moving the cursor to the next line. Setting \`end=\\" \\"\` or \`end=\\"\\"\` changes this behaviour, allowing the next print to continue on the same line."
    }
  ]
}
\`\`\`

---

## Wrapping Up

\`\`\`tabs
{
  "tabs": [
    {
      "label": "What You've Practiced",
      "icon": "✅",
      "content": "- Running Python in both **REPL mode** and **script mode**\\n- Using \`print()\` with multiple values, \`sep=\`, and \`end=\`\\n- Understanding **sequential execution** — Python reads top to bottom\\n- Creating a \`.py\` file and running it from the terminal\\n- Reading Python error messages as feedback, not failure"
    },
    {
      "label": "Common Mistakes to Avoid",
      "icon": "⚠️",
      "content": "**Forgetting to save before running** — your terminal runs the saved version of the file, not whatever is open in your editor right now.\\n\\n**Mixing up REPL and script mode** — in the REPL, expressions print automatically. In a script, you must use \`print()\` explicitly.\\n\\n**Wrong working directory** — if you type \`python hello.py\` but you're in the wrong folder, you'll get \`No such file or directory\`. Use \`cd\` to navigate first.\\n\\n**Python 2 vs Python 3** — on some systems \`python\` runs Python 2 (outdated). If things look odd, try \`python3\` instead and check \`python --version\`."
    },
    {
      "label": "What's Next",
      "icon": "🚀",
      "content": "Module 2 starts with **variables and data types** — the building blocks of every Python program.\\n\\nYou'll learn:\\n- How to store numbers, text, and booleans\\n- The difference between \`int\`, \`float\`, and \`str\`\\n- How Python figures out a variable's type automatically\\n- Basic arithmetic and string operations\\n\\nEverything in Module 1 — running files, using \`print()\`, reading errors — will be your constant companion throughout the course."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Python executes scripts sequentially — line 1 runs before line 2, always.",
    "The REPL is for quick experiments; .py files are for real programs you want to save and rerun.",
    "print() accepts multiple arguments separated by commas. Use sep= to control the separator and end= to control what follows the last value.",
    "Errors only surface when Python reaches the broken line — earlier lines already ran successfully.",
    "The edit → save → run loop is the fundamental workflow of all programming."
  ]
}
\`\`\``,
      starterCode: `# Checkpoint: Environment and First Steps
# Practice using print() with multiple values and basic Python programs

# TODO 1: Print a greeting that includes your name and the current year
# Use print() with multiple values separated by commas
# Expected output: Hello, my name is Alex and I started learning Python in 2026


# TODO 2: Print the following three variables on a single line using print()
# Hint: pass all three as separate arguments to print()
language = "Python"
version = 3
is_fun = True
# Expected output: Python 3 True


# TODO 3: Print a separator line, then print three facts about Python
# using print() with the 'sep' keyword argument to separate facts with " | "
fact1 = "Created by Guido van Rossum"
fact2 = "First released in 1991"
fact3 = "Named after Monty Python"
# Expected output: Created by Guido van Rossum | First released in 1991 | Named after Monty Python


# TODO 4: Use print() with the 'end' keyword argument so the output stays
# on the same line, then print a newline after the loop finishes
# Expected output: 1 2 3 4 5 (all on one line)
for i in range(1, 6):
    pass  # replace this with your print() call
`,
      solutionCode: `# Checkpoint: Environment and First Steps
# Practice using print() with multiple values and basic Python programs

# TODO 1: Print a greeting that includes your name and the current year
# Passing multiple values to print() automatically separates them with a space
print("Hello, my name is Alex and I started learning Python in", 2026)

# TODO 2: Print three variables on a single line using print()
language = "Python"
version = 3
is_fun = True
# print() accepts any number of arguments and joins them with a space by default
print(language, version, is_fun)

# TODO 3: Use the 'sep' keyword argument to join values with a custom separator
fact1 = "Created by Guido van Rossum"
fact2 = "First released in 1991"
fact3 = "Named after Monty Python"
print(fact1, fact2, fact3, sep=" | ")

# TODO 4: Use 'end' to keep output on the same line, then print a newline
# By default print() ends with "\\n"; passing end=" " suppresses that
for i in range(1, 6):
    print(i, end=" ")
# Print a blank line so the next output starts cleanly
print()
`,
    },
  ],
};
