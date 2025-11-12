# 🔧 Shell Commands Guide - KaDong Tools

## ⚠️ Vấn đề: PowerShell vs CMD

### Lỗi thường gặp:
```powershell
# ❌ FAIL - PowerShell không cho phép & như operator
cd /d c:\Projects\Personal\KaDongSite\backend & npm run dev
# Error: The ampersand (&) character is not allowed

# ❌ FAIL - /d chỉ dùng trong cmd.exe
cd /d c:\Projects\Personal\KaDongSite\backend; npm run dev
```

### ✅ Cách chạy đúng:

## 1️⃣ Dùng npm scripts (Khuyến nghị)

### Chạy Backend:
```bash
npm run dev:backend
```

### Chạy Frontend:
```bash
npm run dev
```

### Chạy cả hai (2 terminals):
**Terminal 1:**
```bash
npm run dev:backend
```

**Terminal 2:**
```bash
npm run dev
```

### Database commands:
```bash
npm run db:setup    # Chạy migrations + seeds
npm run db:migrate  # Chỉ migrations
npm run db:seed     # Chỉ seeds
npm run db:test     # Test connection
```

---

## 2️⃣ PowerShell commands (manual)

```powershell
# ✓ Dùng ; để chain commands
cd backend; npm run dev

# ✓ Hoặc chạy từng lệnh
cd backend
npm run dev

# ✓ Chạy từ root với relative path
cd c:\Projects\Personal\KaDongSite
cd backend; npm run dev
```

---

## 3️⃣ CMD commands (nếu dùng cmd.exe)

```cmd
# ✓ CMD cho phép & và /d
cd /d c:\Projects\Personal\KaDongSite\backend & npm run dev

# ✓ Hoặc dùng &&
cd /d c:\Projects\Personal\KaDongSite\backend && npm run dev
```

---

## 4️⃣ VS Code Tasks (Khuyến nghị cho dev)

Tạo `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run Backend",
      "type": "shell",
      "command": "npm",
      "args": ["run", "dev:backend"],
      "isBackground": true,
      "problemMatcher": {
        "pattern": {
          "regexp": "^(.*)$",
          "file": 1
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": "starting",
          "endsPattern": "Running on"
        }
      }
    },
    {
      "label": "Run Frontend",
      "type": "shell",
      "command": "npm",
      "args": ["run", "dev"],
      "isBackground": true,
      "problemMatcher": {
        "pattern": {
          "regexp": "^(.*)$",
          "file": 1
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": "VITE",
          "endsPattern": "ready in"
        }
      }
    },
    {
      "label": "Run Both (Backend + Frontend)",
      "dependsOn": ["Run Backend", "Run Frontend"],
      "problemMatcher": []
    }
  ]
}
```

Sau đó chạy: `Ctrl+Shift+P` → `Tasks: Run Task` → `Run Both`

---

## 5️⃣ Package concurrently (optional)

Install:
```bash
npm install --save-dev concurrently
```

Thêm vào `package.json`:
```json
{
  "scripts": {
    "dev:all": "concurrently \"npm run dev:backend\" \"npm run dev\""
  }
}
```

Chạy:
```bash
npm run dev:all
```

---

## 📋 Tóm tắt

| Tình huống | Command | Shell |
|------------|---------|-------|
| Chạy backend (khuyến nghị) | `npm run dev:backend` | Any |
| Chạy frontend | `npm run dev` | Any |
| Chạy manual backend | `cd backend; npm run dev` | PowerShell |
| Chạy manual backend | `cd backend && npm run dev` | Bash/npm scripts |
| Database setup | `npm run db:setup` | Any |
| Chạy cả hai | 2 terminals riêng | Any |

---

## 🔍 Tại sao lỗi?

### PowerShell:
- `&` là **call operator** để chạy command/script block
- `&&` không tồn tại trong PowerShell native
- Dùng `;` để chain commands thay vì `&`

### CMD:
- `&` là command separator (giống `;` trong PowerShell)
- `&&` chạy command tiếp theo chỉ khi command trước thành công

### npm scripts:
- npm tự động xử lý cross-platform
- `&&` trong npm scripts hoạt động trên cả Windows/Linux/Mac
- npm dùng `sh` trên Unix và `cmd.exe` trên Windows (với layer compatibility)

---

## ✅ Best Practices

1. **Dùng npm scripts** thay vì chạy command trực tiếp
2. **Tránh hard-code shell-specific commands** trong CI/CD
3. **Test commands trên cả PowerShell và CMD** nếu làm script
4. **Dùng cross-platform tools**: `cross-env`, `concurrently`, `rimraf`
5. **Document commands** trong README.md

---

**Updated**: 2025-11-11  
**Project**: KaDong Tools v1.2.0
