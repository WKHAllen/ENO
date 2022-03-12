@echo off

rem Check if debug mode requested
if "%1"=="debug" goto :builddebug

:run
cd build
eno.exe
cd ..
goto :eof

rem Build for debug
:builddebug
cmd /c go-winres simply --icon webui/src/favicon.ico --manifest gui
cmd /c go build -o build
goto :run

rem Build for release
:buildrelease
cmd /c go-winres simply --icon webui/src/favicon.ico --manifest gui
cmd /c go build -o build -ldflags "-H windowsgui"
goto :eof

rem End of file
:eof
if "%1"=="debug" goto :buildrelease
