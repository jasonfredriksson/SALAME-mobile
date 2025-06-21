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
    echo STARTING MOBILE APP DEMO (SALAME)
    echo ==============================================
    echo.
    echo This will start the Expo development server for the SALAME mobile app.
    echo.
    cd %~dp0
    echo Current directory: %CD%
    echo.
    echo Running: npm run dev
    call npm run dev
) else if "%choice%"=="2" (
    cls
    echo.
    echo ==============================================
    echo STARTING DESKTOP WEB DEMO (mercado-latam)
    echo ==============================================
    echo.
    echo This will start the Next.js development server for the mercado-latam web app.
    echo.
    
    cd C:\Users\jason\CascadeProjects\mercado-latam
    
    echo Current directory: %CD%
    echo.
    
    if exist "package.json" (
        echo Found package.json in mercado-latam
        
        where npm >nul 2>nul
        if %ERRORLEVEL% EQU 0 (
            echo Found npm, starting web app...
            
            if exist "packages\web" (
                echo Found web package, starting directly...
                cd packages\web
                call npm run dev
            ) else (
                call npm run dev
            )
        ) else (
            echo ERROR: npm not found on your system
            pause
            exit /b
        )
    ) else (
        echo ERROR: package.json not found
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
