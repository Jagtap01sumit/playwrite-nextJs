## 🛠 Setup Instructions for Playwright Automation

This project uses **Playwright with Python** to automate browser tasks like opening Google, searching for keywords, and interacting with websites.

---

### 📦 1. Create & Activate Virtual Environment

```bash
# Create Virtual Environment
python -m venv venv
# Activate Virtual Environment
venv\Scripts\activate  # On Windows: venv\Scripts\activate
```

### 🔹 What These Commands Do:

#### ✅ `python -m venv venv`

- Creates a virtual environment named `venv` in your project directory.
- Isolates project dependencies from the global Python installation.
- Ensures version and package consistency across environments.

#### ✅ `source venv/bin/activate`

- Activates the virtual environment.
- Redirects Python and pip commands to use the virtual environment.
- Keeps all installed packages local to the project.

💡 Once activated, your terminal will show `(venv)` to indicate the virtual environment is active.

### ⚠️ Why This Matters:

Using a virtual environment:

- Prevents dependency conflicts
- Keeps your project isolated
- Is required for many deployment platforms and CI/CD pipelines

---

### 📄 2. Install Python Dependencies

Install all required packages listed in `requirements.txt`:

```bash
pip install -r requirement.txt
```

> 🔍 `playwright` is included in this file, so the Python Playwright bindings are installed with the command above.

---

### 🌐 3. Install Playwright Browsers

Even though the Playwright package is installed, you still **must** install the actual browser engines (Chromium, Firefox, WebKit) with this command:

```bash
playwright install
```

📌 **Why this extra step is required:**

When you install Playwright using `pip install playwright` or through `requirements.txt`, it only installs the **Python client library** — not the browsers themselves.  
The `playwright install` command downloads and installs the necessary browser binaries so your automation scripts can run successfully.

You can also install specific browser engines like:

```bash
playwright install chromium
```

---

### ✅ You're Now Ready!

Run your main script using:

```bash
python main.py
```

---

### 📋 Summary: Why Both Are Needed?

| Step                     | Command                  | What It Does                             |
| ------------------------ | ------------------------ | ---------------------------------------- |
| Install Python Bindings  | `pip install playwright` | Installs Playwright’s Python client      |
| Install Browser Binaries | `playwright install`     | Downloads actual Chromium/Firefox/WebKit |

If you skip `playwright install`, you'll likely get errors like:  
`Executable doesn't exist at...` or `Browser not found.`

---

Happy Automating! 🤖
