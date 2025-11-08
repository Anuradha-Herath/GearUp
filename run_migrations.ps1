#!/usr/bin/env pwsh

$migrationDir = "c:\Users\Anuradha\Downloads\Moratuwa Academic\Projects\V-Track 2\GearUp\database\migrations"
$containerName = "gearup-mysql-dev"
$dbUser = "root"
$dbPass = "Anu@2001"
$dbName = "gearup"

# Get all V* migrations in order
$migrations = @(
    "V1__Create_users_table.sql"
    "V2__Create_services_table.sql"
    "V3__Create_vehicles_and_appointments_tables.sql"
    "V3a__Create_projects_table.sql"
    "V4__Create_time_logs_table.sql"
    "V4__seed_services.sql"
    "V5__Fix_time_logs_foreign_key.sql"
    "V5__seed_domain_data.sql"
    "V6__Add_missing_user_columns.sql"
    "V6__seed_domain_data_fix.sql"
    "V7__Add_created_at_to_appointments.sql"
    "V7__seed_users_and_domain.sql"
    "V8__fix_owners_and_insert_remaining.sql"
    "V9__insert_time_logs_and_appointments.sql"
    "V10__Create_feedbacks_table.sql"
)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Running Database Migrations" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

foreach ($migration in $migrations) {
    $filePath = Join-Path $migrationDir $migration
    if (Test-Path $filePath) {
        Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] Running: $migration" -ForegroundColor Yellow
        
        # Read SQL file and execute
        $sql = Get-Content -Path $filePath -Raw
        
        # Use docker exec with mysql -u flag
        $sql | docker exec -i $containerName mysql -uroot -pAnu@2001 $dbName 2>&1 | Where-Object { $_ -like "*Error*" -or $_ -like "*error*" } | ForEach-Object { Write-Host "❌ $_" -ForegroundColor Red }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Success" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Exit code: $LASTEXITCODE" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  File not found: $filePath" -ForegroundColor Yellow
    }
}

Write-Host "`n======================================" -ForegroundColor Cyan
Write-Host "Migration Complete" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Verify tables were created
Write-Host "`nVerifying tables..." -ForegroundColor Cyan
$output = docker exec $containerName mysql -uroot -pAnu@2001 $dbName -e "SHOW TABLES;" 2>&1
$output | Where-Object { $_ -notmatch "Warning" } | ForEach-Object { Write-Host $_ }
