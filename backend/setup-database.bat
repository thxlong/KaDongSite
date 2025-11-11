@echo off
echo ========================================
echo   KaDong Tools - Database Setup Script
echo ========================================
echo.

echo Step 1: Checking PostgreSQL installation...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PostgreSQL not found!
    echo.
    echo Please install PostgreSQL first:
    echo https://www.postgresql.org/download/windows/
    echo.
    pause
    exit /b 1
)
echo [OK] PostgreSQL is installed
echo.

echo Step 2: Creating database...
psql -U postgres -c "CREATE DATABASE kadong_tools;" 2>nul
if %errorlevel% equ 0 (
    echo [OK] Database created successfully
) else (
    echo [WARN] Database may already exist, continuing...
)
echo.

echo Step 3: Configuring .env file...
if not exist .env (
    copy .env.example .env >nul
    echo [OK] Created .env from .env.example
    echo [ACTION] Please edit .env and set your PostgreSQL password
    notepad .env
) else (
    echo [OK] .env file already exists
)
echo.

echo Step 4: Installing dependencies...
call npm install
echo [OK] Dependencies installed
echo.

echo Step 5: Running migrations...
node scripts/migrate.js up
if %errorlevel% equ 0 (
    echo [OK] Migrations completed
) else (
    echo [ERROR] Migration failed!
    pause
    exit /b 1
)
echo.

echo Step 6: Testing database connection...
node scripts/test-db.js
if %errorlevel% equ 0 (
    echo [OK] Database connection successful
) else (
    echo [ERROR] Database connection failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo You can now start the server with:
echo   npm run dev
echo.
pause
