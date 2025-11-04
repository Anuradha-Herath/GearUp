<#
.SYNOPSIS
  Create a local MySQL database, user, apply migrations from database/migrations, and optionally update backend/.env.

.DESCRIPTION
  This helper script is intended for local development. It will:
    - locate mysql.exe (or use -MysqlExePath)
    - create database and user with provided credentials (using a root/admin account)
    - apply .sql migration files from database/migrations in alphabetical order
    - optionally back up and update backend/.env with the chosen DB settings

.NOTES
  - Run this script from the repository root.
  - It requires the mysql client (mysql.exe) to be accessible or provided via -MysqlExePath.
  - Passing passwords on the command line may expose them in the process list; run interactively where possible.
#>

param(
    [string]$MysqlExePath = $null,
    [string]$RootUser = 'root',
    [System.Security.SecureString]$RootPassword,
    [string]$DbName = 'autoserve',
    [string]$DbUser = 'gearup',
    [System.Security.SecureString]$DbPassword,
    [switch]$SkipEnvUpdate,
    [switch]$WhatIf
)

function Find-MySqlExe {
    param($override)
    if ($override -and (Test-Path $override)) { return $override }

    $cmd = Get-Command mysql.exe -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }

    $candidates = @(
        'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe',
        'C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe',
        'C:\Program Files\MySQL\MySQL Workbench 8.0 CE\mysql.exe'
    )
    foreach ($p in $candidates) { if (Test-Path $p) { return $p } }
    return $null
}

if ($WhatIf) { Write-Host "WhatIf mode: no changes will be made" }

# Prompt for sensitive values if they weren't provided
if (-not $RootPassword) {
    $RootPassword = Read-Host -AsSecureString "Enter MySQL root/admin password"
}
if (-not $DbPassword) {
    $DbPassword = Read-Host -AsSecureString "Enter password for new DB user '$DbUser' (will be created if missing)"
}

function SecureToPlain([System.Security.SecureString]$s) {
    if (-not $s) { return $null }
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
    try { [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

$rootPassPlain = SecureToPlain $RootPassword
$dbPassPlain = SecureToPlain $DbPassword

$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$repoRoot = Resolve-Path (Join-Path $scriptDir '..')
$migrationsPath = Join-Path $repoRoot 'database\migrations'

Write-Host "Repository root: $repoRoot"
Write-Host "Migrations dir: $migrationsPath"

$mysql = Find-MySqlExe -override $MysqlExePath
if (-not $mysql) {
    Write-Error "Could not find mysql.exe. Install MySQL client/server or provide -MysqlExePath."
    exit 2
}

if (-not (Test-Path $migrationsPath)) {
    Write-Error "Migrations directory not found: $migrationsPath"
    exit 3
}

Write-Host "Using mysql executable: $mysql"

# Step 1: create database and user
$createSql = "CREATE DATABASE IF NOT EXISTS $DbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER IF NOT EXISTS '$DbUser'@'%' IDENTIFIED BY '$dbPassPlain'; GRANT ALL PRIVILEGES ON $DbName.* TO '$DbUser'@'%'; FLUSH PRIVILEGES;"

Write-Host "Creating database '$DbName' and user '$DbUser' using root credentials '$RootUser'."
if ($WhatIf) { Write-Host "Would run SQL: `n$createSql"; exit 0 }

try {
    # Use the mysql client directly; pass SQL via -e. Wrap the SQL in a single string.
    & $mysql -u $RootUser "-p$rootPassPlain" -e $createSql
    $exit = $LASTEXITCODE
    if ($exit -ne 0) { throw "mysql returned exit code $exit" }
} catch {
    Write-Error "Failed to create DB/user: $_"
    exit 4
}

# Step 2: apply migrations
$sqlFiles = Get-ChildItem -Path $migrationsPath -Filter '*.sql' | Sort-Object Name
if (-not $sqlFiles) { Write-Warning "No .sql files found in $migrationsPath" }

foreach ($f in $sqlFiles) {
    Write-Host "Applying $($f.Name) ..."
    if ($WhatIf) { Write-Host "Would run: $mysql -u $DbUser -p****** $DbName < $($f.FullName)"; continue }
    # Feed the SQL file contents to mysql via stdin
    Get-Content -Raw $f.FullName | & $mysql -u $DbUser "-p$dbPassPlain" $DbName
    $exit = $LASTEXITCODE
    if ($exit -ne 0) {
        Write-Error "Migration $($f.Name) failed with exit code $exit."
        exit $exit
    }
}

# Step 3: update backend/.env (optional)
if (-not $SkipEnvUpdate) {
    $envPath = Join-Path $repoRoot 'backend\.env'
    if (Test-Path $envPath) {
        $timestamp = Get-Date -Format yyyyMMddHHmmss
        $backup = "$envPath.bak.$timestamp"
        Write-Host "Backing up existing .env to $backup"
        Copy-Item -Path $envPath -Destination $backup -Force
    }

    $jdbc = "jdbc:mysql://localhost:3306/$DbName?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
    $envContent = @()
    $envContent += "DATABASE_URL=$jdbc"
    $envContent += "DATABASE_USERNAME=$DbUser"
    $envContent += "DATABASE_PASSWORD=$dbPassPlain"
    $envContent += ""  # newline
    $envContent += "# JWT Configuration - update as needed"
    $envContent += "JWT_SECRET=change_this_dev_secret"
    $envContent += "JWT_EXPIRATION=86400000"
    $envContent += "" 
    $envContent += "# SendGrid (keep secrets out of repo)"
    $envContent += "SENDGRID_API_KEY=your_sendgrid_api_key"
    $envContent += "SENDGRID_FROM_EMAIL=noreply@autoserve.com"
    $envContent += "" 
    $envContent += "# Frontend"
    $envContent += "FRONTEND_BASE_URL=http://localhost:5173"

    Write-Host "Writing new backend/.env (local only)"
    $envContent | Set-Content -Path $envPath -Encoding UTF8
}

Write-Host "Done. Database '$DbName' created (if missing), migrations applied, and backend/.env updated (unless --SkipEnvUpdate)."
