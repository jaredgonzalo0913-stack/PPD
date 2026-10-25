@echo off
cd "C:\Users\00805MKT\Downloads\New folder\elco-lms"
start "" cmd /k "npm run dev"
timeout /t 3
start http://localhost:3000
