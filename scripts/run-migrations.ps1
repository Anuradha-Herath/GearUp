<#
Run SQL migration files against the local MySQL database used by this project.

Usage:
  # from repository root
  .\scripts\run-migrations.ps1

Options:
  -MysqlExePath <path>   Optional path to mysql.exe (will try to auto-detect)
  -DbName <name>         Database name (default: autoserve)
  -DbUser <user>         DB user (default: gearup)
  -DbPassword <pass>     DB password (default: gearup_pass)
  -WhatIf                Show what would run without executing

Notes:
  - This script simply runs the .sql files under database/migrations in alphabetical order.
  - It expects MySQL server to be running and accessible.
  - You can also let Spring Boot (dev profile) create/update tables using JPA (spring.jpa.hibernate.ddl-auto=update).
#>

param(
    [string]$MysqlExePath = $null,
    [string]$DbName = 'autoserve',
    [string]$DbUser = 'gearup',
    [string]$DbPassword = 'gearup_pass'
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

$sqlFiles = Get-ChildItem -Path $migrationsPath -Filter '*.sql' | Sort-Object Name
if (-not $sqlFiles) {
    Write-Warning "No .sql files found in $migrationsPath"
    exit 0
}

Write-Host "Using mysql executable: $mysql"
Write-Host "Applying migrations to database '$DbName' as user '$DbUser'..."

foreach ($f in $sqlFiles) {
    Write-Host "Applying $($f.Name) ..."
    # Use mysql --execute to run the SQL file (avoids issues with shell redirection and spaces in paths)
    $executeArg = "SOURCE $($f.FullName);"
    $args = @("-u", $DbUser, "-p$DbPassword", "-D", $DbName, "--execute", $executeArg)
    $result = Start-Process -FilePath $mysql -ArgumentList $args -NoNewWindow -Wait -PassThru
    if ($result.ExitCode -ne 0) {
        Write-Error "Migration $($f.Name) failed with exit code $($result.ExitCode). Check the SQL and MySQL server logs."
        exit $result.ExitCode
    }
}

Write-Host "Migrations applied successfully."
