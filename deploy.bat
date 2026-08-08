@echo off
setlocal
cd /d "%~dp0"
where bash >nul 2>&1
if %errorlevel%==0 (
  bash deploy.sh %*
) else (
  echo 未找到 bash，请在 Git Bash 中运行: bash deploy.sh
  pause
)
endlocal
