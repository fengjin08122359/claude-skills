# 报告质量检查脚本 (PowerShell)
# 用法: .\check-report.ps1 <report-file.md>

param(
    [Parameter(Mandatory=$true)]
    [string]$ReportFile
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $ReportFile)) {
    Write-Host "❌ 文件不存在: $ReportFile" -ForegroundColor Red
    exit 1
}

Write-Host "[CHECK] Starting report check: $ReportFile" -ForegroundColor Cyan
Write-Host ""

# Check 1: File is not empty
$fileSize = (Get-Item $ReportFile).Length
if ($fileSize -eq 0) {
    Write-Host "[ERROR] File is empty" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] File is not empty ($fileSize bytes)" -ForegroundColor Green

# Check 2: Has H1 title
$content = Get-Content $ReportFile -Raw
if ($content -notmatch "^# ") {
    Write-Host "[ERROR] Missing H1 title" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Contains H1 title" -ForegroundColor Green

# Check 3: Has executive summary
if ($content -notmatch "## .*执行摘要") {
    Write-Host "[WARN] Executive summary section not found" -ForegroundColor Yellow
} else {
    Write-Host "[OK] Contains executive summary" -ForegroundColor Green
}

# Statistics
$lines = (Get-Content $ReportFile).Count
$words = $content.Split(" `t`n`r").Where({$_ -ne ""}).Count
$fileSizeKB = [math]::Round($fileSize / 1KB, 2)

Write-Host ""
Write-Host "[DONE] Check completed!" -ForegroundColor Green
Write-Host ""
Write-Host "[SUMMARY] Report Statistics:" -ForegroundColor Cyan
Write-Host "  - File: $ReportFile"
Write-Host "  - Lines: $lines"
Write-Host "  - Words: $words"
Write-Host "  - Size: ${fileSizeKB} KB"
