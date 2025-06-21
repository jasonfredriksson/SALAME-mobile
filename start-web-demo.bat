@echo off
echo.
echo ==============================================
echo MERCADO-LATAM WEB DEMO LAUNCHER
echo ==============================================
echo.
echo This script will attempt to start the Next.js development server
echo for the desktop web experience.
echo.

if exist "C:\Users\jason\CascadeProjects\mercado-latam\packages\web" (
    echo Found web package directory
    cd C:\Users\jason\CascadeProjects\mercado-latam\packages\web
) else (
    echo ERROR: Could not find mercado-latam web package directory
    echo Expected at: C:\Users\jason\CascadeProjects\mercado-latam\packages\web
    echo.
    pause
    exit /b
)

echo Current directory: %CD%
echo.

if exist "package.json" (
    echo Found package.json in web package
) else (
    echo ERROR: package.json not found in web package
    echo Please verify the project structure is correct
    pause
    exit /b
)

where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Found npm, using npm commands
    echo Running: npm run dev in web package
    call npm run dev
) else (
    echo ERROR: npm not found on your system
    echo Please install Node.js and npm then try again
    pause
    exit /b
)

pause
