@echo off
echo ========================================
echo  SHAVUOT-EDU LMS - Starting Server
echo ========================================
echo.

REM Check if PHP is installed locally
if exist "php\php.exe" (
    echo Using local PHP installation...
    set PHP_CMD=php\php.exe
) else (
    echo Using system PHP...
    set PHP_CMD=php
)

REM Check if PHP is available
%PHP_CMD% --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: PHP is not installed!
    echo.
    echo Please run: install-php.bat
    echo.
    pause
    exit /b 1
)

echo.
echo PHP Version:
%PHP_CMD% --version
echo.
echo ========================================
echo  Server starting at: http://localhost:8080
echo ========================================
echo.
echo Login credentials:
echo   Admin:   admin@shavuot.edu / Password123!
echo   Teacher: teacher1@shavuot.edu / Password123!
echo   Student: student1@shavuot.edu / Password123!
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start PHP built-in server
%PHP_CMD% -S localhost:8080

pause