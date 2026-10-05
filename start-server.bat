@echo off
title Raushan Kumar Portfolio - Auto Code Sync Engine
echo ============================================================
echo   RAUSHAN KUMAR PORTFOLIO - AUTO-CODE UPDATE SERVER
echo ============================================================
echo  Admin Panel:  http://127.0.0.1:5000/admin.html
echo  Public Site:  http://127.0.0.1:5000/index.html
echo.
echo  Jab tak yeh window open rahegi, Admin Panel me password,
echo  photos, projects, skills jo bhi update karoge, wo direct
echo  code files (data/portfolio-data.js) me auto-save hoga!
echo ============================================================
timeout /t 1 >nul
start http://127.0.0.1:5000/admin.html
python server.py
pause
