@echo off
echo.
echo ==============================================
echo SALAME MOBILE APP DEMO LAUNCHER
echo ==============================================
echo.
echo Starting Expo development server for mobile app demo...
echo.

cd %~dp0
echo Current directory: %CD%
echo.

echo Running: npm run dev
call npm run dev

pause
