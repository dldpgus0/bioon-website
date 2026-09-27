@echo off
rem Starts the dev server even when Node.js isn't on this process's PATH yet.
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0.."
npm run dev
