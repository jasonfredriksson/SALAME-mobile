@echo off
echo ==============================================
echo MERCADO LATAM DESKTOP WEB DEMO LAUNCHER
echo ==============================================
echo.
echo Starting the mercado-latam web demo...
echo This is the desktop website experience for professional sellers.
echo.

if exist "C:\Users\jason\CascadeProjects\mercado-latam" (
    cd C:\Users\jason\CascadeProjects\mercado-latam
    echo Changed to directory: %CD%
    echo.
    
    if exist "packages\web" (
        cd packages\web
        echo Found web package, starting directly from: %CD%
        echo.
        echo Running web app with: npm run dev
        call npm run dev
    ) else (
        echo Running web app with: npm run dev
        call npm run dev
    )
) else (
    echo ERROR: mercado-latam directory not found at C:\Users\jason\CascadeProjects\mercado-latam
    echo Please check the path and try again.
)

pause
