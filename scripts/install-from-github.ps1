param(
  [Parameter(Mandatory = $true)][string]$Repo,
  [string]$Serial,
  [string]$RunId
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw "GitHub CLI is required." }
if (-not (Get-Command adb -ErrorAction SilentlyContinue)) { throw "Android Platform Tools (adb) are required." }
gh auth status | Out-Null

if (-not $RunId) {
  $RunId = gh run list --repo $Repo --workflow android.yml --status success --limit 1 --json databaseId --jq '.[0].databaseId'
}
if (-not $RunId -or $RunId -eq "null") { throw "No successful Android workflow was found for $Repo." }

$DownloadDir = Join-Path ([System.IO.Path]::GetTempPath()) ("salah-screen-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $DownloadDir | Out-Null
gh run download $RunId --repo $Repo --name salah-screen-debug-apk --dir $DownloadDir

$Apk = Get-ChildItem -Path $DownloadDir -Filter *.apk | Select-Object -First 1
if (-not $Apk) { throw "The downloaded artifact did not contain an APK. Files remain at $DownloadDir." }

$ChecksumFile = Join-Path $DownloadDir "SHA256SUMS.txt"
if (Test-Path $ChecksumFile) {
  $Expected = ((Get-Content $ChecksumFile -First 1) -split '\s+')[0].ToLowerInvariant()
  $Actual = (Get-FileHash -Algorithm SHA256 $Apk.FullName).Hash.ToLowerInvariant()
  if ($Expected -ne $Actual) { throw "APK checksum verification failed." }
}

$Target = @()
if ($Serial) { $Target = @("-s", $Serial) }
$Model = (& adb @Target shell getprop ro.product.model).Trim()
$Sdk = (& adb @Target shell getprop ro.build.version.sdk).Trim()
Write-Host "Target: $Model, Android API $Sdk"
& adb @Target install -r $Apk.FullName
& adb @Target shell am force-stop com.abdulosama.salahscreen
& adb @Target shell am start -n com.abdulosama.salahscreen/.MainActivity
Write-Host "Installed and launched Salah Screen. Artifact kept at $DownloadDir"
