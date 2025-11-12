# 💻 Development

**Purpose:** Guides for building features, testing, and contributing

---

## 📚 Documents in This Section

### [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md)
React frontend development guide
- Component structure and conventions
- State management patterns
- Routing with react-router-dom
- Styling with Tailwind CSS
- Animations with Framer Motion
- API integration best practices
- PropTypes validation

### [CONTRIBUTING.md](CONTRIBUTING.md)
Contribution guidelines
- Git workflow (branches, commits)
- Code style (ESLint, Prettier)
- Pull request process
- Code review checklist
- Testing requirements
- Documentation standards

---

## 🎯 Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/feature-name
```

### 2. Follow Conventions
- **Files:** kebab-case.js
- **Components:** PascalCase.jsx
- **Variables:** camelCase
- **Database:** snake_case
- **Commits:** Conventional Commits (feat/fix/docs/etc.)

### 3. Write Tests
- Unit tests for functions
- Integration tests for APIs
- Component tests for UI
- Minimum 80% coverage

### 4. Update Documentation
- API_DOCUMENTATION.md for new endpoints
- DATABASE_SCHEMA.md for DB changes
- README.md for major features
- Create dev-notes for tracking

### 5. Create Pull Request
- Clear description
- Link related issues
- Screenshots for UI changes
- Pass all checks

---

## 🔗 Related Sections

- **Architecture:** [../02-architecture/](../02-architecture/) - Understand structure first
- **Features:** [../04-features/](../04-features/) - See examples
- **Dev-Notes:** [../dev-notes/](../dev-notes/) - Track your progress

---

**Last Updated:** 2025-11-13
