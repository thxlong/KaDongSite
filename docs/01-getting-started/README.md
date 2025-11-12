# 🚀 Getting Started

**Purpose:** Setup, installation, and troubleshooting guides for new developers

---

## 📚 Documents in This Section

### [SETUP_INSTALLATION.md](SETUP_INSTALLATION.md)
Complete setup guide for development environment
- Prerequisites (Node.js, PostgreSQL, Git)
- Backend setup (dependencies, database, env variables)
- Frontend setup (Vite, Tailwind, dependencies)
- First run instructions
- Common setup issues

### [SHELL_COMMANDS_GUIDE.md](SHELL_COMMANDS_GUIDE.md)
PowerShell vs CMD commands reference
- Cross-platform compatibility
- PowerShell-specific syntax
- Running backend and frontend
- Database commands
- Common pitfalls and solutions

### [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
Common issues and solutions
- Database connection errors
- Port conflicts
- CORS issues
- Environment variable problems
- Migration failures
- Performance issues

---

## 🎯 Quick Start (5 Minutes)

```powershell
# 1. Clone repository
git clone https://github.com/username/KaDongSite.git
cd KaDongSite

# 2. Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials

# 3. Setup database
npm run db:setup

# 4. Run backend
npm run dev

# 5. Setup frontend (new terminal)
cd ../frontend
npm install
npm run dev
```

Visit: http://localhost:3000

---

## 🔗 Related Sections

- **Architecture:** [../02-architecture/](../02-architecture/) - Understand project structure
- **Development:** [../03-development/](../03-development/) - Coding guidelines
- **Operations:** [../05-operations/](../05-operations/) - Deployment and maintenance

---

**Last Updated:** 2025-11-13
