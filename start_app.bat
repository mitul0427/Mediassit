@echo off
echo Starting RateMyFlick...
start cmd /k "cd server && npm start"
start cmd /k "cd client && npm run dev"
echo Server and Client started in separate windows.
