<#
.SYNOPSIS
  Inicia o Cloudflare Tunnel para expor o backend local.
  Requer cloudflared instalado e configurado.
#>

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# Check cloudflared
if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] cloudflared nao encontrado. Instale: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/" -ForegroundColor Red
    exit 1
}

# Use named tunnel if config exists, otherwise quick tunnel
$ConfigPath = "$env:USERPROFILE\.cloudflared\config.yml"

if (Test-Path $ConfigPath) {
    Write-Host "[INFO] Iniciando tunnel com config existente..." -ForegroundColor Green
    cloudflared tunnel run
} else {
    Write-Host "[INFO] Iniciando quick tunnel (temporario) para http://localhost:8000" -ForegroundColor Yellow
    Write-Host "[DICA] Para tunnel permanente, configure: cloudflared tunnel create <nome>" -ForegroundColor Cyan
    cloudflared tunnel --url http://localhost:8000
}
