param([Parameter(Mandatory=$true)][ValidatePattern('^(astra-test(?:[1-9]|10)|astra-graduate1|qa-[cs][12])$')][string]$Alias)
$ErrorActionPreference='Stop'
$taskBrowse='C:/Users/bilal/.claude/skills/gstack/browse/dist/browse.exe'
function Invoke-AuditBrowse([string[]]$Arguments) {
  $taskResult=& $taskBrowse @Arguments 2>&1
  if($LASTEXITCODE -ne 0){throw ($taskResult -join "`n")}
  return $taskResult
}
function Find-AuditRef([string]$Role,[string]$Label) {
  $taskSnapshot=Invoke-AuditBrowse @('snapshot','-i')
  $taskMatch=[regex]::Match(($taskSnapshot -join "`n"),'(@e\d+) \['+[regex]::Escape($Role)+'\] "'+[regex]::Escape($Label)+'"')
  if(-not $taskMatch.Success){throw "Missing observed control: $Role $Label"}
  return $taskMatch.Groups[1].Value
}
# Only the authorized synthetic QA browser is used. Do not call on a real account.
$taskCoach=Invoke-AuditBrowse @('js','Boolean(document.querySelector(''input[placeholder="Ask Coach Kairos…"]''))')
if(($taskCoach -join '').Trim() -eq 'true') {
  Invoke-AuditBrowse @('click','button:has(svg.lucide-x)') | Out-Null
}
Invoke-AuditBrowse @('click',(Find-AuditRef 'button' 'Account menu')) | Out-Null
Invoke-AuditBrowse @('click',(Find-AuditRef 'menuitem' 'Sign out')) | Out-Null
Invoke-AuditBrowse @('wait','a:has-text("Sign back in")') | Out-Null
Invoke-AuditBrowse @('goto','https://www.kairoslearn.com/login') | Out-Null
$taskEmailRef=Find-AuditRef 'textbox' 'Email'
Invoke-AuditBrowse @('fill',$taskEmailRef,"bilalhussain.v1+$Alias@gmail.com") | Out-Null
$taskPasswordRef=Find-AuditRef 'textbox' 'Password'
$taskPattern=[regex]::Match((Get-Content -Raw 'C:/Users/bilal/Downloads/grokking/context-update.md'),'Password pattern `([^`]+)`').Groups[1].Value
if(-not $taskPattern){throw 'Synthetic credential pattern unavailable'}
$taskSuffix=$Alias -replace '^qa-',''
Invoke-AuditBrowse @('fill',$taskPasswordRef,$taskPattern.Replace('<suffix>',$taskSuffix)) | Out-Null
Invoke-AuditBrowse @('click',(Find-AuditRef 'button' 'Sign In')) | Out-Null
Invoke-AuditBrowse @('wait','button[aria-label="Account menu"]') | Out-Null
Invoke-AuditBrowse @('wait','--networkidle') | Out-Null
Write-Output "Existing synthetic persona authenticated: $Alias"
Invoke-AuditBrowse @('url')
