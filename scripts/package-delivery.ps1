#requires -Version 7.0
<#
Create a source export, then verify every repository/export/ZIP file hash.
The published website and .env are never changed. PowerShell 7 is required.
Examples: pnpm package:delivery
          pwsh -NoProfile -File scripts/package-delivery.ps1 -Revision docs-017
#>
[CmdletBinding()]
param(
    [ValidatePattern('^[a-z0-9]+(?:-[a-z0-9]+)*$')]
    [string]$Revision = ('snapshot-' + [DateTime]::UtcNow.ToString('yyyyMMdd-HHmmss')),
    [switch]$SkipExport
)
$ErrorActionPreference = 'Stop'
$repoRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$workspaceRoot = [IO.Directory]::GetParent($repoRoot).FullName
$deliveryRoot = [IO.Path]::GetFullPath((Join-Path $workspaceRoot 'japanese-craft-jewelry-delivery'))
$sourceRoot = [IO.Path]::GetFullPath((Join-Path $deliveryRoot 'source'))
if ([IO.Directory]::GetParent($deliveryRoot).FullName -ne $workspaceRoot -or [IO.Directory]::GetParent($sourceRoot).FullName -ne $deliveryRoot) { throw 'Unsafe delivery destination' }
function Read-Json([string]$Path) { Get-Content -LiteralPath $Path -Raw -Encoding utf8 | ConvertFrom-Json }
function Invoke-ExportPolicy([string]$Command, [string[]]$Targets = @()) {
    $output = & node scripts/lib/source-export.mjs $Command @Targets
    if ($LASTEXITCODE -ne 0) { throw ('Source export policy failed: ' + $Command) }
    ($output -join "`n") | ConvertFrom-Json
}
Push-Location -LiteralPath $repoRoot
try {
    & node scripts/check-runtime.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Use the supported patched Node runtime before packaging' }
    # This must precede export: a junction at deliveryRoot could otherwise
    # redirect the exporter before checks on the final source directory run.
    $null = Invoke-ExportPolicy 'preflight'
    if (-not $SkipExport) {
        & node scripts/package-source.mjs
        if ($LASTEXITCODE -ne 0) { throw 'Source export failed; no new ZIP is published' }
    }
    # The same inclusion rules enumerate both repository and export. This also
    # catches a newly added repository file omitted from a -SkipExport snapshot.
    $exportCheck = Invoke-ExportPolicy 'check-export'
    $package = Read-Json (Join-Path $repoRoot 'package.json')
    $exportPackage = Read-Json (Join-Path $sourceRoot 'package.json')
    $version = [string]$package.version
    if ($version -notmatch '^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$' -or $exportPackage.version -ne $version) { throw 'Invalid or stale exported version' }
    $catalog = Read-Json (Join-Path $sourceRoot 'src/data/catalog.json')
    $published = @($catalog.products | Where-Object publishStatus -eq 'published')
    $hero = Read-Json (Join-Path $sourceRoot 'src/data/editorial-images.json')
    $detail = Read-Json (Join-Path $sourceRoot 'src/data/product-detail-images.json')
    foreach ($product in $published) {
        foreach ($registry in @($hero, $detail)) {
            $entry = $registry.PSObject.Properties[$product.id].Value
            if (-not $entry -or -not $entry.alt.en -or -not $entry.alt.ja -or $entry.path -notmatch '^images/[a-z0-9-]+\.webp$') { throw ('Missing registered localized image: ' + $product.id) }
            if (-not (Test-Path -LiteralPath (Join-Path $sourceRoot ('public/' + $entry.path)) -PathType Leaf)) { throw ('Missing image file: ' + $product.id) }
        }
    }
    # All content counts come from the source; adding a researched item does not
    # require changing a hard-coded 50-product or 98-image packaging threshold.
    $sourceMap = @{}
    $names = @($exportCheck.files)
    foreach ($name in $names) { $sourceMap[$name] = Join-Path $sourceRoot $name }
    $required = @('README.md','AGENTS.md','.env.example','pnpm-lock.yaml','.github/workflows/deploy.yml','docs/handoff.md','docs/ai-handoff.md','docs/setup.md','docs/editing-guide.md','docs/architecture.md','docs/verification-guide.md','docs/research/sources.json','docs/assets.json','src/lib/schema.ts','scripts/package-delivery.ps1','scripts/lib/source-export.mjs','scripts/check-type-choice-images.mjs','scripts/check-regional-headings.mjs')
    foreach ($name in $required) { if ($names -notcontains $name) { throw ('Required handoff source missing: ' + $name) } }
    $ledger = Read-Json (Join-Path $sourceRoot 'docs/assets.json')
    $retired = @($ledger.assets | Where-Object status -eq 'retired' | ForEach-Object localRetiredPath | Where-Object { $_ })
    foreach ($name in $retired) { if ($names -contains $name) { throw ('Retired image exported: ' + $name) } }
    $baseName = 'japanese-craft-jewelry-source-' + $version + '-' + $Revision
    $zipPath = Join-Path $deliveryRoot ($baseName + '.zip')
    $proofPath = Join-Path $deliveryRoot ('package-verification-' + $version + '-' + $Revision + '.json')
    $candidate = Join-Path $deliveryRoot ($baseName + '.candidate-' + [Guid]::NewGuid().ToString('N') + '.zip')
    $latest = Join-Path $deliveryRoot 'japanese-craft-jewelry-source.zip'
    $backupSuffix = '.backup-' + [DateTime]::UtcNow.ToString('yyyyMMddHHmmssfff') + '-' + [Guid]::NewGuid().ToString('N')
    $zipBackup = $zipPath + $backupSuffix
    $latestBackup = $latest + $backupSuffix
    $proofBackup = $proofPath + $backupSuffix
    # Check leaves as well as ancestors; existing ZIP/proof links must never be
    # followed by Copy-Item or Set-Content. Backups stay in this fixed directory.
    $null = Invoke-ExportPolicy -Command 'check-targets' -Targets @($zipPath, $proofPath, $candidate, $latest, $zipBackup, $latestBackup, $proofBackup)
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [IO.Compression.ZipFile]::CreateFromDirectory($sourceRoot, $candidate, [IO.Compression.CompressionLevel]::Optimal, $false)
    $archive = [IO.Compression.ZipFile]::OpenRead($candidate)
    try {
        $entries = @($archive.Entries | Where-Object { $_.Name -ne '' })
        $zipNames = @($entries | ForEach-Object { $_.FullName.Replace('\', '/') })
        if (@(Compare-Object ($names | Sort-Object) ($zipNames | Sort-Object)).Count -or @($zipNames | Group-Object | Where-Object Count -gt 1).Count) { throw 'ZIP file set differs from source' }
        foreach ($entry in $entries) {
            $stream = $entry.Open()
            $sha = [Security.Cryptography.SHA256]::Create()
            # BitConverter also works on PowerShell 7.0/.NET Core 3.1, unlike
            # Convert.ToHexString (introduced in .NET 5).
            try { $entryHash = [BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-', '') } finally { $stream.Dispose(); $sha.Dispose() }
            if ($entryHash -ne (Get-FileHash -LiteralPath $sourceMap[$entry.FullName.Replace('\', '/')] -Algorithm SHA256).Hash) { throw ('ZIP SHA mismatch: ' + $entry.FullName) }
        }
    } finally { $archive.Dispose() }
    if (Test-Path -LiteralPath $zipPath) { Move-Item -LiteralPath $zipPath -Destination $zipBackup }
    Move-Item -LiteralPath $candidate -Destination $zipPath
    if (Test-Path -LiteralPath $latest) { Copy-Item -LiteralPath $latest -Destination $latestBackup }
    Copy-Item -LiteralPath $zipPath -Destination $latest -Force
    $zipHash = (Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash.ToLowerInvariant()
    if ((Get-FileHash -LiteralPath $latest -Algorithm SHA256).Hash.ToLowerInvariant() -ne $zipHash) { throw 'Latest ZIP copy differs' }
    $record = [ordered]@{
        version=$version; revision=$Revision; checkedAt=[DateTime]::UtcNow.ToString('o'); status='passed';
        sourceDirectory=$sourceRoot; zip=$zipPath; latestZip=$latest; fileCount=$names.Count; zipFileCount=$entries.Count;
        everyRepositoryFileSha256Checks=$exportCheck.everyRepositoryFileSha256Checks; everyFileSha256Checks=$entries.Count;
        repositoryAndExportFileSetsMatch=$exportCheck.repositoryAndExportFileSetsMatch;
        sourceAndZipFileSetsMatch=$true; allFileHashesMatch=$true; forbiddenEntries=@();
        publishedProducts=$published.Count; publicWebpImages=@($names | Where-Object { $_ -match '^public/images/.*\.webp$' }).Count;
        retiredPublicPathsExcluded=$retired.Count; requiredFilesVerified=$required;
        bytes=(Get-Item -LiteralPath $zipPath).Length; sha256=$zipHash;
        limits='File integrity and explicit excluded paths only; not a whole-history credential audit or app/AdSense/legal certification.'
    }
    if (Test-Path -LiteralPath $proofPath) { Copy-Item -LiteralPath $proofPath -Destination $proofBackup }
    $record | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $proofPath -Encoding utf8
    [pscustomobject]$record | Select-Object version,revision,status,fileCount,publicWebpImages,bytes,sha256 | ConvertTo-Json
    Write-Host ('Proof: ' + $proofPath)
} finally { Pop-Location }
