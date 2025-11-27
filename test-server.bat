@echo off
set PORT=%PORT%
if "%PORT%"=="" set PORT=8000
python -m http.server %PORT%