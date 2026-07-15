$ErrorActionPreference = "Stop"

if (-not (Test-Path "server\.env")) {
    Copy-Item "server\.env.example" "server\.env"
}
if (-not (Test-Path "client\.env")) {
    Copy-Item "client\.env.example" "client\.env"
}

npm install
npm run install:all

Write-Host "\nLocal dependencies installed."
Write-Host "Edit server\.env with MONGODB_URI and JWT_SECRET, then run: npm run dev"
