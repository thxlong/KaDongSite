# 📚 KaDong Tools - Documentation

**Clean, organized, easy-to-navigate documentation for the KaDong Tools project.**

---

## 📂 Documentation Structure

Our documentation is organized into 6 main sections + dev-notes:

### 🚀 [01-getting-started/](01-getting-started/)
Setup, installation, and troubleshooting
- [SETUP_INSTALLATION.md](01-getting-started/SETUP_INSTALLATION.md) - Complete setup guide
- [SHELL_COMMANDS_GUIDE.md](01-getting-started/SHELL_COMMANDS_GUIDE.md) - PowerShell vs CMD
- [TROUBLESHOOTING.md](01-getting-started/TROUBLESHOOTING.md) - Common issues

### 🏗️ [02-architecture/](02-architecture/)
Project structure, database, and API
- [PROJECT_STRUCTURE.md](02-architecture/PROJECT_STRUCTURE.md) - Folder organization
- [BACKEND_STRUCTURE.md](02-architecture/BACKEND_STRUCTURE.md) - Express architecture
- [DATABASE_SCHEMA.md](02-architecture/DATABASE_SCHEMA.md) - Complete schema
- [API_DOCUMENTATION.md](02-architecture/API_DOCUMENTATION.md) - REST API reference

### 💻 [03-development/](03-development/)
Coding guidelines and contribution
- [FRONTEND_GUIDE.md](03-development/FRONTEND_GUIDE.md) - React development
- [CONTRIBUTING.md](03-development/CONTRIBUTING.md) - Contribution guidelines

### ✨ [04-features/](04-features/)
Feature-specific documentation
- [GOLD_FEATURE.md](04-features/GOLD_FEATURE.md) - Gold price tracking
- [WEATHER_TOOL_SETUP.md](04-features/WEATHER_TOOL_SETUP.md) - Weather tool (planned)
- [WEDDING_INVITATION_TOOL.md](04-features/WEDDING_INVITATION_TOOL.md) - Wedding invitations
- [USER_SYSTEM.md](04-features/USER_SYSTEM.md) - User authentication

### � [05-operations/](05-operations/)
Deployment and maintenance
- [DEPLOYMENT_GUIDE.md](05-operations/DEPLOYMENT_GUIDE.md) - Production deployment
- [MAINTENANCE.md](05-operations/MAINTENANCE.md) - Ongoing maintenance

### 🔄 [06-migration/](06-migration/)
Database migrations and changelog
- [MIGRATION_SUMMARY.md](06-migration/MIGRATION_SUMMARY.md) - localStorage → PostgreSQL
- [CHANGELOG.md](06-migration/CHANGELOG.md) - Version history

### 🛠️ [dev-notes/](dev-notes/)
Development tracking and working documents
- [implementations/](dev-notes/implementations/) - NEW feature tracking
- [enhancements/](dev-notes/enhancements/) - Improvements to existing features
- [bugfixes/](dev-notes/bugfixes/) - Bug fix documentation
- [planning/](dev-notes/planning/) - Planning and analysis docs

---

## 🎯 Quick Start (5 Minutes)

```powershell
# 1. Clone and install
git clone https://github.com/username/KaDongSite.git
cd KaDongSite/backend
npm install

# 2. Setup database
cp .env.example .env  # Edit with your credentials
npm run db:setup

# 3. Run backend (Terminal 1)
npm run dev

# 4. Run frontend (Terminal 2)
cd ../frontend
npm install
npm run dev
```

Visit: **http://localhost:3000**

Full instructions: [01-getting-started/SETUP_INSTALLATION.md](01-getting-started/SETUP_INSTALLATION.md)

---

## 📋 Most Accessed Docs

### 🆕 New to the project?
1. [Setup Guide](01-getting-started/SETUP_INSTALLATION.md) - Get started in 5 minutes
2. [Project Structure](02-architecture/PROJECT_STRUCTURE.md) - Understand the codebase
3. [Troubleshooting](01-getting-started/TROUBLESHOOTING.md) - Fix common issues

### 👨‍💻 For Developers
1. [API Reference](02-architecture/API_DOCUMENTATION.md) - All endpoints with examples
2. [Database Schema](02-architecture/DATABASE_SCHEMA.md) - Tables and relationships
3. [Frontend Guide](03-development/FRONTEND_GUIDE.md) - React patterns
4. [Contributing](03-development/CONTRIBUTING.md) - How to contribute

### 🚀 For DevOps
1. [Deployment Guide](05-operations/DEPLOYMENT_GUIDE.md) - Deploy to production
2. [Maintenance](05-operations/MAINTENANCE.md) - Keep it running smoothly

---

## 📖 Documentation Guides

### [DOCUMENTATION_NAMING_GUIDE.md](DOCUMENTATION_NAMING_GUIDE.md)
Learn how we name and organize documentation files
- UPPER_SNAKE_CASE for permanent docs
- kebab-case for dev-notes
- Folder structure conventions
- When to use implementations/ vs enhancements/

---

## 🎨 Features Overview

**8 Tools Implemented:**
1. ✅ **Notes** - Color-coded note taking
2. ✅ **Countdown** - Event countdown timers
3. ✅ **Calendar** - Month view with events
4. ✅ **Currency** - Multi-currency conversion (5 API fallbacks)
5. ✅ **Fashion** - Color matcher for outfits
6. ✅ **Gold Prices** - Real-time gold tracking
7. ✅ **Wishlist** - Product tracking with URL extraction
8. ✅ **Wedding Invitations** - Event management

**Planned:**
- � Weather Tool
- 🚧 Todo List
- 🚧 Pomodoro Timer

See: [04-features/](04-features/) for details

---

## �🔗 External Resources

- **Repository**: [GitHub - KaDongSite](https://github.com/thxlong/KaDongSite)
- **Specs System**: [../specs/](../specs/) - Feature specifications and planning
- **Project Manifest**: [../project_manifest.json](../project_manifest.json) - Configuration reference

---

## 📞 Need Help?

1. ✅ Check [Troubleshooting](01-getting-started/TROUBLESHOOTING.md) first
2. ✅ Search [dev-notes/bugfixes/](dev-notes/bugfixes/) for similar issues
3. ✅ Open GitHub issue with details
4. ✅ Review [Contributing Guide](03-development/CONTRIBUTING.md)

---

## 📊 Documentation Stats

- **6 Main Sections** (numbered folders)
- **13 Permanent Docs** (UPPER_SNAKE_CASE)
- **4 Dev-Notes Categories** (implementations, enhancements, bugfixes, planning)
- **58% Reduction** in root level clutter (19 → 8 items)

---

**Last Updated**: 2025-11-13  
**Version**: 1.4.0  
**Maintained by**: KaDong Team
