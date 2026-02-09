<#
.SYNOPSIS
  Testa os endpoints do backend chat.
#>

$ErrorActionPreference = "Continue"
$BaseUrl = if ($args[0]) { $args[0] } else { "http://127.0.0.1:8000" }
$Passed = 0
$Failed = 0

function Test-Endpoint {
    param([string]$Name, [scriptblock]$Test)
    Write-Host -NoNewline "  $Name ... "
    try {
        $result = & $Test
        if ($result) {
            Write-Host "OK" -ForegroundColor Green
            $script:Passed++
        } else {
            Write-Host "FAIL" -ForegroundColor Red
            $script:Failed++
        }
    } catch {
        Write-Host "FAIL ($_)" -ForegroundColor Red
        $script:Failed++
    }
}

Write-Host "=== Healthcheck: $BaseUrl ===" -ForegroundColor Cyan
Write-Host ""

# 1) GET /health
Test-Endpoint "GET /health -> 200 + ok:true" {
    $r = Invoke-RestMethod -Uri "$BaseUrl/health" -Method Get
    $r.ok -eq $true
}

# 2) OPTIONS /chat -> 204
Test-Endpoint "OPTIONS /chat -> 204" {
    $r = Invoke-WebRequest -Uri "$BaseUrl/chat" -Method Options -UseBasicParsing
    $r.StatusCode -eq 204
}

# 3) OPTIONS /chat CORS headers
Test-Endpoint "OPTIONS /chat -> CORS headers presentes" {
    $r = Invoke-WebRequest -Uri "$BaseUrl/chat" -Method Options -Headers @{Origin="https://engdaniel.org"} -UseBasicParsing
    $r.Headers["Access-Control-Allow-Origin"] -eq "https://engdaniel.org" -and
    $r.Headers["Access-Control-Allow-Methods"] -match "POST"
}

# 4) POST /chat with empty message -> 400
Test-Endpoint "POST /chat empty -> 400" {
    try {
        $body = '{"message":""}'
        $r = Invoke-WebRequest -Uri "$BaseUrl/chat" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
        $false
    } catch {
        $_.Exception.Response.StatusCode.value__ -eq 400
    }
}

Write-Host ""
Write-Host "=== Resultado: $Passed passed, $Failed failed ===" -ForegroundColor $(if ($Failed -eq 0) { "Green" } else { "Red" })
