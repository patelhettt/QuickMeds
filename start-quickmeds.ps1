Start-Process powershell -ArgumentList "cd frontend; npm start" -NoNewWindow
Start-Process powershell -ArgumentList "cd backend; node --watch index.js" -NoNewWindow
