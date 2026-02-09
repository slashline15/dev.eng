<#
.SYNOPSIS
  Inicia o backend Flask do chat widget.
  Cria venv e instala dependencias se necessario.
#>

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# Check .env
if (-not (Test-Path ".env")) {
    Write-Host "[ERRO] Arquivo .env nao encontrado. Copie .env.example para .env e preencha." -ForegroundColor Red
    exit 1
}

# Create venv if missing
if (-not (Test-Path ".venv\Scripts\python.exe")) {
    Write-Host "[INFO] Criando venv..." -ForegroundColor Cyan
    python -m venv .venv
}

# Activate and install deps
Write-Host "[INFO] Instalando dependencias..." -ForegroundColor Cyan
& .\.venv\Scripts\pip.exe install -q -r requirements.txt

# Run
Write-Host "[INFO] Iniciando backend em http://127.0.0.1:8000" -ForegroundColor Green
& .\.venv\Scripts\python.exe app.py
