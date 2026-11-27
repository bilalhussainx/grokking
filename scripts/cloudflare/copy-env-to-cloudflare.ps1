# Copies KairosLearn's settings to the Cloudflare Worker in one run.
#
#   powershell -ExecutionPolicy Bypass -File scripts\cloudflare\copy-env-to-cloudflare.ps1
#
# Where values come from, in order:
#   1. Vercel production settings (the ones Vercel will release).
#   2. Your local .env.local, only for names Vercel lists but will not release ("Sensitive").
#   3. A hidden prompt for OPENROUTER_API_KEY if it is still missing.
#   4. Newly generated random values for ADMIN_SECRET and TEACHER_SECRET_KEY if still missing,
#      saved to a file in your user folder (not printed).
# Nothing here prints a value. The summary lists names only. Temporary files are deleted.
param(
  [string]$VercelDir = 'C:\Users\bilal\Downloads\grokking',
  [string]$LocalEnv  = 'C:\Users\bilal\Downloads\grokking\.env.local',
  [string]$Worker    = 'kairoslearn',
  [switch]$DryRun,                 # test only: report what would happen, upload nothing
  [string]$TestVercelFile = ''     # test only: read this file instead of pulling from Vercel
)
$ErrorActionPreference = 'Stop'
$RepoDir = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

$skip = '^(VERCEL|TURBO_|NX_)'
$notUsed = @('DATA_GOV_API_KEY', 'STRIPE_PUBLISHABLE_KEY')            # never read by the code
$generated = @('ADMIN_SECRET', 'TEACHER_SECRET_KEY')                   # internal passwords, safe to renew
$whereToGet = @{
  'STRIPE_SECRET_KEY'        = 'Stripe dashboard > Developers > API keys (create a new secret key)'
  'STRIPE_WEBHOOK_SECRET'    = 'Stripe dashboard > Developers > Webhooks > your kairoslearn.com endpoint > Signing secret (Reveal)'
  'DEEPGRAM_API_KEY'         = 'console.deepgram.com > API Keys'
  'SARVAM_API_KEY'           = 'dashboard.sarvam.ai > API Keys'
  'GOOGLE_CLOUD_CREDENTIALS' = 'Google Cloud console > IAM > Service accounts > Keys (JSON, pasted as one line)'
  'RESEND_API_KEY'           = 'resend.com/api-keys'
  'RESEND_FROM_EMAIL'        = 'the sender address you verified in Resend, for example hello@kairoslearn.com'
  'OPENROUTER_API_KEY'       = 'openrouter.ai/settings/keys'
}

function Read-EnvFile([string]$path) {
  $map = [ordered]@{}
  if (-not (Test-Path $path)) { return $map }
  foreach ($line in Get-Content -LiteralPath $path) {
    if ($line -match '^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
      $v = $Matches[2].Trim()
      if ($v.Length -ge 2 -and (($v.StartsWith('"') -and $v.EndsWith('"')) -or ($v.StartsWith("'") -and $v.EndsWith("'")))) {
        $v = $v.Substring(1, $v.Length - 2)
      }
      $v = $v -replace '\\n', "`n"
      $map[$Matches[1]] = $v
    }
  }
  return $map
}

$pulled = Join-Path $env:TEMP ("vercel-env-" + [guid]::NewGuid() + ".env")
$upload = Join-Path $env:TEMP ("cf-secrets-" + [guid]::NewGuid() + ".json")
try {
  if ($TestVercelFile) { Copy-Item -LiteralPath $TestVercelFile $pulled }
  else {
    Write-Host "Reading production settings from Vercel..."
    Push-Location $VercelDir
    try { npx vercel env pull $pulled --environment=production --yes | Out-Null } finally { Pop-Location }
    if (-not (Test-Path $pulled)) { throw "Vercel returned nothing. Run 'npx vercel login' in $VercelDir and try again." }
  }

  $vercel = Read-EnvFile $pulled
  $local  = Read-EnvFile $LocalEnv
  $final  = [ordered]@{}
  $fromVercel = @(); $fromLocal = @(); $missing = @(); $skipped = @()

  foreach ($name in $vercel.Keys) {
    if ($name -match $skip) { continue }
    if ($notUsed -contains $name) { $skipped += $name; continue }
    if ($vercel[$name]) { $final[$name] = $vercel[$name]; $fromVercel += $name }
    elseif ($local.Contains($name) -and $local[$name]) { $final[$name] = $local[$name]; $fromLocal += $name }
    else { $missing += $name }
  }

  # OpenRouter: one hidden prompt if neither source had it.
  if ($missing -contains 'OPENROUTER_API_KEY') {
    $secure = Read-Host "Paste your OpenRouter key (the one the portfolio uses) and press Enter" -AsSecureString
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { $k = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr).Trim() } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
    if ($k.StartsWith('sk-or-')) { $final['OPENROUTER_API_KEY'] = $k; $missing = $missing | Where-Object { $_ -ne 'OPENROUTER_API_KEY' }; $fromLocal += 'OPENROUTER_API_KEY (typed)' }
    else { Write-Host "That did not look like an OpenRouter key, so it was skipped." }
    $k = $null
  }

  # Internal admin passwords: renew if missing, keep a copy only on this machine.
  $made = @()
  foreach ($name in $generated) {
    if ($missing -contains $name) {
      $bytes = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
      $final[$name] = ([BitConverter]::ToString($bytes) -replace '-', '').ToLower()
      $missing = $missing | Where-Object { $_ -ne $name }; $made += $name
    }
  }
  if ($made.Count -gt 0 -and -not $DryRun) {
    $keep = Join-Path $env:USERPROFILE 'kairoslearn-admin-secrets.txt'
    ($made | ForEach-Object { "$_=$($final[$_])" }) | Set-Content -LiteralPath $keep -Encoding utf8
  }

  # Stripe mode check (names and mode only, never the key).
  $stripeMode = ''
  if ($final.Contains('STRIPE_SECRET_KEY')) {
    $stripeMode = if ($final['STRIPE_SECRET_KEY'] -like 'sk_live_*' -or $final['STRIPE_SECRET_KEY'] -like 'rk_live_*') { 'live' } elseif ($final['STRIPE_SECRET_KEY'] -like '*_test_*') { 'TEST MODE' } else { 'unknown' }
  }

  # NEXT_PUBLIC_* values are compiled into the site at build time, so they also go in a local file
  # in this repo (.env* is git-ignored).
  $publicLines = $final.Keys | Where-Object { $_ -like 'NEXT_PUBLIC_*' } | ForEach-Object { "$_=$($final[$_])" }

  Write-Host ""
  Write-Host ("From Vercel:      {0}" -f $fromVercel.Count)
  Write-Host ("From .env.local:  {0}  {1}" -f $fromLocal.Count, ($fromLocal -join ', '))
  if ($made)    { Write-Host ("Newly generated:  {0}  (saved to your user folder: kairoslearn-admin-secrets.txt)" -f ($made -join ', ')) }
  if ($stripeMode) { Write-Host ("Stripe key mode:  {0}" -f $stripeMode) }
  if ($skipped) { Write-Host ("Not needed:       {0}" -f ($skipped -join ', ')) }
  if ($missing) {
    Write-Host ("Still missing:    {0}" -f $missing.Count)
    foreach ($m in $missing) { Write-Host ("  - {0}: {1}" -f $m, ($(if ($whereToGet.Contains($m)) { $whereToGet[$m] } else { 'its provider dashboard' }))) }
  }

  if ($DryRun) { Write-Host "`nDry run: nothing uploaded or written."; return }

  [IO.File]::WriteAllText((Join-Path $RepoDir '.env.production.local'), (($publicLines -join "`n") + "`n"), (New-Object Text.UTF8Encoding $false))
  [IO.File]::WriteAllText($upload, ($final | ConvertTo-Json -Depth 3), (New-Object Text.UTF8Encoding $false))
  Write-Host "`nUploading $($final.Count) settings to the Cloudflare Worker '$Worker'..."
  npx wrangler secret bulk $upload --name $Worker | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Cloudflare did not accept the upload." }
  Write-Host "Done. Tell Claude: settings copied."
} finally {
  Remove-Item -LiteralPath $pulled, $upload -Force -ErrorAction SilentlyContinue
}
