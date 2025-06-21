@echo off
echo ==============================================
echo SALAME MOBILE APP (SIMPLE LAUNCHER)
echo ==============================================
echo.
echo Starting Expo development server...
echo.

cd %~dp0
echo Current directory: %CD%
echo.

echo Running: npx expo
call npx expo

pause
