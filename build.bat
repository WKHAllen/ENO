@echo off

rem Check if backend only
if "%1"=="backend" goto :backend

rem Build frontend
:frontend
cd webui
cmd /c npm run build
cd ..
xcopy /s /i /y webui\dist\eno build\web

rem Check if frontend only
if "%1"=="frontend" goto :eof

rem Build backend
:backend
cmd /c go build -o build

rem End of file
:eof
