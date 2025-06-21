@echo off
echo.
echo ==============================================
echo SALAME MARKETPLACE DEMO LAUNCHER
echo ==============================================
echo.
echo 1. Mobile App Demo (SALAME)
echo 2. Desktop Website Demo (mercado-latam)
echo 3. Exit
echo.

set /p choice="Select an option (1-3): "

if "%choice%"=="1" (
    cls
    echo.
    echo ==============================================
    echo STARTING MOBILE APP DEMO
    echo ==============================================
    echo.
    echo This will start the Expo development server.
    echo You can view the app in a mobile simulator or on your device.
    echo.
    cd %~dp0
    echo Current directory: %CD%
    echo.
    echo Running: npm run dev (Expo development server)
    echo.
    call npm run dev
) else if "%choice%"=="2" (
    cls
    echo.
    echo ==============================================
    echo STARTING DESKTOP WEB DEMO
    echo ==============================================
    echo.
    echo This will attempt to start the Next.js development server.
    echo.
    
    if exist "..\CascadeProjects\mercado-latam" (
        cd ..\CascadeProjects\mercado-latam
    ) else (
        echo ERROR: Could not find mercado-latam directory
        echo Expected at: %~dp0..\CascadeProjects\mercado-latam
        echo.
        pause
        exit /b
    )
    
    echo Current directory: %CD%
    echo.
    
    if exist "package.json" (
        echo Found package.json
    ) else (
        echo ERROR: package.json not found
        echo Please verify this is the correct mercado-latam project directory.
        pause
        exit /b
    )
    
    echo.
    echo Checking available package managers...
    
    where npm >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo Found npm, using npm commands
        
        REM Check if 'start:web' uses yarn inside it
        findstr /C:"yarn workspace" package.json >nul
        if %ERRORLEVEL% EQU 0 (
            echo Direct npm approach - bypassing yarn dependency
            cd packages\web
            if exist "package.json" (
                echo Running: npm run dev in web package
                call npm run dev
            ) else (
                echo Error: Could not find web package
                pause
                exit /b
            )
        ) else (
            echo Running: npm run start:web
            call npm run start:web
        )
    )
    ) else (
        echo ERROR: npm not found on your system
        echo Please install Node.js and npm then try again
        pause
        exit /b
    )
) else if "%choice%"=="3" (
    echo Goodbye!
    exit /b
) else (
    echo Invalid option. Please try again.
    pause
    cls
    %0
)

pause
