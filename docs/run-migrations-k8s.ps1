#!/usr/bin/env pwsh
# Run all database migrations on Kubernetes MySQL pod

$namespace = "gearup"
$mysqlPod = "mysql-f5cccb4db-vhjnr"
$dbName = "gearup"
$dbUser = "gearup_user"
$dbPassword = "Anu@2001"

# Migration files in order
$migrations = @(
    "V1__Create_users_table.sql",
    "V2__Create_services_table.sql",
    "V3__Create_vehicles_and_appointments_tables.sql",
    "V3a__Create_projects_table.sql",
    "V4__Create_time_logs_table.sql",
    "V4__seed_services.sql",
    "V5__Fix_time_logs_foreign_key.sql",
    "V5__seed_domain_data.sql",
    "V6__Add_missing_user_columns.sql",
    "V6__seed_domain_data_fix.sql",
    "V7__Add_created_at_to_appointments.sql",
    "V7__seed_users_and_domain.sql",
    "V8__fix_owners_and_insert_remaining.sql",
    "V9__insert_time_logs_and_appointments.sql",
    "V10__Create_feedbacks_table.sql"
)

$migrationDir = "c:\Users\Anuradha\Downloads\Moratuwa Academic\Projects\V-Track 2\GearUp\database\migrations"

Write-Host "[*] Starting database migrations..." -ForegroundColor Cyan
Write-Host "[*] Pod: $mysqlPod" -ForegroundColor Yellow
Write-Host "[*] Database: $dbName" -ForegroundColor Yellow

# Create a combined SQL file
$combinedSql = ""
foreach ($migration in $migrations) {
    $filePath = Join-Path $migrationDir $migration
    if (Test-Path $filePath) {
        Write-Host "[+] Reading: $migration" -ForegroundColor Green
        $content = Get-Content $filePath -Raw
        $combinedSql += "`n-- =============== $migration ===============`n"
        $combinedSql += $content
    } else {
        Write-Host "[!] File not found: $filePath" -ForegroundColor Yellow
    }
}

# Save combined SQL to temp file
$tempSqlFile = "$env:TEMP\migrations_combined.sql"
Set-Content -Path $tempSqlFile -Value $combinedSql

Write-Host "`n[*] Executing migrations..." -ForegroundColor Cyan

# Copy SQL file to pod
Write-Host "[*] Copying SQL file to pod..." -ForegroundColor Cyan
kubectl cp $tempSqlFile "$namespace/$($mysqlPod):/tmp/migrations.sql"

# Execute SQL in MySQL
Write-Host "[*] Running SQL migrations..." -ForegroundColor Cyan
Get-Content $tempSqlFile | kubectl exec -i "$namespace/$mysqlPod" -- mysql -u $dbUser -p"$dbPassword" $dbName

Write-Host "`n[OK] Migrations completed!" -ForegroundColor Green

# Verify tables were created
Write-Host "`n[*] Verifying tables..." -ForegroundColor Cyan
kubectl exec -it "$namespace/$mysqlPod" -- mysql -u $dbUser -p"$dbPassword" $dbName -e "SHOW TABLES;"

# Cleanup
Remove-Item $tempSqlFile -Force -ErrorAction SilentlyContinue

Write-Host "`n[SUCCESS] Database migration complete!" -ForegroundColor Green
