@echo off
echo ==============================================
echo SALAME MOBILE APP DEMO LAUNCHER
echo ==============================================
echo.
echo Starting the SALAME mobile app demo...
echo This is the mobile application experience for end users.
echo.

cd %~dp0
echo Current directory: %CD%
echo.

echo Running mobile app with direct expo command...
echo.
set EXPO_NO_TELEMETRY=1
call npx expo start

pause
