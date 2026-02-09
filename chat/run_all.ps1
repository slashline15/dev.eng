<#
.SYNOPSIS
  Inicia backend + tunnel em paralelo (dois jobs do PowerShell).
  Use Ctrl+C para encerrar ambos.
#>

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "=== Iniciando Backend + Tunnel ===" -ForegroundColor Green

# Start backend as a job
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:ScriptDir
    & .\run_backend.ps1
}
Write-Host "[JOB] Backend iniciado (Job ID: $($backendJob.Id))" -ForegroundColor Cyan

# Wait for backend to start
Start-Sleep -Seconds 3

# Start tunnel as a job
$tunnelJob = Start-Job -ScriptBlock {
    Set-Location $using:ScriptDir
    & .\run_tunnel.ps1
}
Write-Host "[JOB] Tunnel iniciado (Job ID: $($tunnelJob.Id))" -ForegroundColor Cyan

Write-Host ""
Write-Host "Backend e tunnel rodando em background." -ForegroundColor Green
Write-Host "Para ver logs:   Receive-Job -Id <ID>" -ForegroundColor Yellow
Write-Host "Para parar:      Stop-Job -Id $($backendJob.Id),$($tunnelJob.Id); Remove-Job -Id $($backendJob.Id),$($tunnelJob.Id)" -ForegroundColor Yellow
Write-Host ""

# Keep alive and stream output
try {
    while ($true) {
        # Check if jobs are still running
        $bState = (Get-Job -Id $backendJob.Id).State
        $tState = (Get-Job -Id $tunnelJob.Id).State

        if ($bState -ne "Running" -and $bState -ne "NotStarted") {
            Write-Host "[WARN] Backend parou ($bState). Logs:" -ForegroundColor Red
            Receive-Job -Id $backendJob.Id
        }
        if ($tState -ne "Running" -and $tState -ne "NotStarted") {
            Write-Host "[WARN] Tunnel parou ($tState). Logs:" -ForegroundColor Red
            Receive-Job -Id $tunnelJob.Id
        }

        Receive-Job -Id $backendJob.Id -ErrorAction SilentlyContinue 2>$null
        Receive-Job -Id $tunnelJob.Id -ErrorAction SilentlyContinue 2>$null

        Start-Sleep -Seconds 5
    }
} finally {
    Write-Host "`nEncerrando jobs..." -ForegroundColor Yellow
    Stop-Job -Id $backendJob.Id -ErrorAction SilentlyContinue
    Stop-Job -Id $tunnelJob.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $backendJob.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $tunnelJob.Id -ErrorAction SilentlyContinue
    Write-Host "Encerrado." -ForegroundColor Green
}
