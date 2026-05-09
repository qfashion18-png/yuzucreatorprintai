param(
  [Parameter(Mandatory = $true)]
  [string]$RepositoryUrl,

  [string]$AppId = "dfasxx3um10jb",
  [string]$BranchName = "main",
  [string]$Region = "us-east-1",
  [string]$GitHubTokenSecretId = "",
  [string]$AccessTokenEnvName = "AMPLIFY_GITHUB_ACCESS_TOKEN",
  [switch]$KeepExistingBranch
)

$ErrorActionPreference = "Stop"

function Get-GitHubAccessToken {
  if ($GitHubTokenSecretId) {
    Import-Module AWS.Tools.SecretsManager -ErrorAction Stop
    $secret = Get-SECSecretValue -SecretId $GitHubTokenSecretId -Region $Region
    if (-not $secret.SecretString) {
      throw "Secret '$GitHubTokenSecretId' does not contain SecretString."
    }

    try {
      $json = $secret.SecretString | ConvertFrom-Json
      foreach ($property in @("accessToken", "githubToken", "token")) {
        if ($json.PSObject.Properties.Name -contains $property -and $json.$property) {
          return [string]$json.$property
        }
      }
    } catch {
      return $secret.SecretString
    }

    throw "Secret '$GitHubTokenSecretId' must be a plain token or JSON with accessToken, githubToken, or token."
  }

  $token = [Environment]::GetEnvironmentVariable($AccessTokenEnvName)
  if (-not $token) {
    throw "Set $AccessTokenEnvName for this shell or pass -GitHubTokenSecretId. The token is required to connect Amplify to GitHub."
  }

  return $token
}

Import-Module AWS.Tools.Amplify -ErrorAction Stop

$repo = $RepositoryUrl.Trim()
$token = Get-GitHubAccessToken
$buildSpecPath = Join-Path (Split-Path -Parent $PSScriptRoot) "amplify.yml"
$buildSpec = Get-Content -LiteralPath $buildSpecPath -Raw

Write-Host "Connecting Amplify app '$AppId' branch '$BranchName' to '$repo' in '$Region'."

$existingBranch = Get-AMPBranchList -AppId $AppId -Region $Region |
  Where-Object { $_.BranchName -eq $BranchName } |
  Select-Object -First 1

if ($existingBranch -and -not $KeepExistingBranch) {
  Write-Host "Replacing existing Amplify branch '$BranchName' so the app can switch from manual deploys to Git builds."
  Remove-AMPBranch -AppId $AppId -BranchName $BranchName -Region $Region -Force | Out-Null
}

Update-AMPApp `
  -AppId $AppId `
  -Repository $repo `
  -AccessToken $token `
  -BuildSpec $buildSpec `
  -EnableBranchAutoBuild $true `
  -Region $Region `
  -Force | Out-Null

if ($existingBranch -and $KeepExistingBranch) {
  Update-AMPBranch `
    -AppId $AppId `
    -BranchName $BranchName `
    -Framework "Next.js - SSR" `
    -EnableAutoBuild $true `
    -Region $Region `
    -Force | Out-Null
} else {
  New-AMPBranch `
    -AppId $AppId `
    -BranchName $BranchName `
    -Framework "Next.js - SSR" `
    -Stage "DEVELOPMENT" `
    -EnableAutoBuild $true `
    -Region $Region `
    -Force | Out-Null
}

$job = Start-AMPJob `
  -AppId $AppId `
  -BranchName $BranchName `
  -JobType RELEASE `
  -JobReason "Git-connected CreatorPrint AI deployment" `
  -Region $Region

Write-Host "Started Amplify release job."
$job.JobSummary | Select-Object JobId, JobType, Status, StartTime
