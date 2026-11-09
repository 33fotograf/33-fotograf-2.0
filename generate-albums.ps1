
$root = Join-Path $PSScriptRoot "zdjecia\Tajfun"

if (!(Test-Path -LiteralPath $root)) {
    Write-Host "Nie znaleziono folderu zdjecia\Tajfun!" -ForegroundColor Red
    Read-Host "Nacisnij Enter"
    exit
}

$albums = @()
$titleCounts = @{}

$folders = Get-ChildItem -LiteralPath $root -Directory | Sort-Object Name

foreach ($folder in $folders) {

    $photos = @(
        Get-ChildItem -LiteralPath $folder.FullName -File |
        Where-Object {
            $_.Extension -match '^\.(jpg|jpeg|png|webp)$'
        } |
        Sort-Object Name
    )

    if ($photos.Count -eq 0) {
        continue
    }

    if ($folder.Name -match '(?i)piknik') {
        $title = "PIKNIK TAJFUNA"
    }
    elseif ($folder.Name -match '(\d{2})\.(\d{2})\.(\d{2,4})') {
        $day = $matches[1]
        $month = $matches[2]
        $year = $matches[3]

        if ($year.Length -eq 2) {
            $year = "20" + $year
        }

        $title = "TAJFUN - $day.$month.$year"
    }
    else {
        $title = "TAJFUN - " + $folder.Name
    }

    if ($titleCounts.ContainsKey($title)) {
        $titleCounts[$title]++
        $title = "$title ($($titleCounts[$title]))"
    }
    else {
        $titleCounts[$title] = 1
    }

    $photoPaths = @(
        foreach ($photo in $photos) {
            "zdjecia/Tajfun/$($folder.Name)/$($photo.Name)"
        }
    )

    $albums += [PSCustomObject]@{
        title  = $title
        folder = $folder.Name
        cover  = $photoPaths[0]
        count  = $photoPaths.Count
        photos = $photoPaths
    }
}

$json = ConvertTo-Json -InputObject $albums -Depth 8

$output = Join-Path $PSScriptRoot "albums.json"

[System.IO.File]::WriteAllText(
    $output,
    $json,
    (New-Object System.Text.UTF8Encoding($false))
)

Write-Host ""
Write-Host "Gotowe! Liczba albumow: $($albums.Count)" -ForegroundColor Green
Write-Host "Plik albums.json zostal zaktualizowany."
Read-Host "Nacisnij Enter, aby zamknac"
