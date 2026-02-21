# Setup ComfyUI in the directory NoirVision expects (../ComfyUI).
# Run from NoirVision root: .\scripts\setup-comfyui.ps1
# Requires: Git, Python 3.10+

$ErrorActionPreference = "Stop"
$NoirVisionRoot = $PSScriptRoot | Split-Path -Parent
$ComfyUIRoot = Join-Path (Split-Path -Parent $NoirVisionRoot) "ComfyUI"

Write-Host "NoirVision root: $NoirVisionRoot" -ForegroundColor Cyan
Write-Host "ComfyUI target:  $ComfyUIRoot" -ForegroundColor Cyan
Write-Host ""

# Ensure parent directory exists
$parentDir = Split-Path -Parent $ComfyUIRoot
if (-not (Test-Path $parentDir)) {
    Write-Host "Creating parent directory: $parentDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
}

# Clone or update ComfyUI
if (Test-Path $ComfyUIRoot) {
    $isRepo = Test-Path (Join-Path $ComfyUIRoot ".git")
    if ($isRepo) {
        Write-Host "ComfyUI directory already exists. Pulling latest..." -ForegroundColor Yellow
        Set-Location $ComfyUIRoot
        git pull
        if ($LASTEXITCODE -ne 0) { Write-Host "git pull had issues (non-fatal)." -ForegroundColor Yellow }
        Set-Location $NoirVisionRoot
    } else {
        $itemCount = (Get-ChildItem $ComfyUIRoot -Force -ErrorAction SilentlyContinue | Measure-Object).Count
        if ($itemCount -eq 0) {
            Write-Host "ComfyUI path exists but is empty. Removing and cloning..." -ForegroundColor Yellow
            Remove-Item $ComfyUIRoot -Force -Recurse
        } else {
            Write-Host "Path $ComfyUIRoot exists and is not a Git repo. Aborting to avoid overwrite." -ForegroundColor Red
            exit 1
        }
    }
}
if (-not (Test-Path $ComfyUIRoot)) {
    Write-Host "Cloning ComfyUI into $ComfyUIRoot ..." -ForegroundColor Green
    git clone https://github.com/comfyanonymous/ComfyUI.git $ComfyUIRoot
    if ($LASTEXITCODE -ne 0) { exit 1 }
}

# Virtual environment
$venvPath = Join-Path $ComfyUIRoot "venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "Creating Python virtual environment in ComfyUI..." -ForegroundColor Green
    Set-Location $ComfyUIRoot
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create venv. Ensure Python 3.10+ is installed and on PATH." -ForegroundColor Red
        exit 1
    }
    Set-Location $NoirVisionRoot
} else {
    Write-Host "venv already exists at $venvPath" -ForegroundColor Cyan
}

# Install dependencies (activate venv then pip)
$pipExe = Join-Path $venvPath "Scripts\pip.exe"
$activateScript = Join-Path $venvPath "Scripts\Activate.ps1"
if (-not (Test-Path $pipExe)) {
    Write-Host "pip not found in venv. Re-create venv or fix Python install." -ForegroundColor Red
    exit 1
}

Write-Host "Installing ComfyUI requirements (this may take a few minutes)..." -ForegroundColor Green
Set-Location $ComfyUIRoot
& $pipExe install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "pip install failed. You may need to install PyTorch first (see README)." -ForegroundColor Yellow
    Set-Location $NoirVisionRoot
    exit 1
}
Set-Location $NoirVisionRoot

Write-Host ""
Write-Host "ComfyUI is set up at: $ComfyUIRoot" -ForegroundColor Green
Write-Host "To run ComfyUI: cd '$ComfyUIRoot'; .\venv\Scripts\Activate.ps1; python main.py" -ForegroundColor Cyan
Write-Host "Set NOIRVISION_COMFYUI_DIR to this path if different from ../ComfyUI (e.g. in .env.local)." -ForegroundColor Gray
