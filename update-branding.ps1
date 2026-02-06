# PowerShell script to update all HTML files with MACHA branding

$files = Get-ChildItem -Path "." -Filter "*.html"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Replace Excellence Academy with MACHA
    $content = $content -replace 'Excellence Academy', 'MACHA'
    $content = $content -replace 'excellence academy', 'MACHA'
    
    # Update contact information
    $content = $content -replace '123 Education Drive', 'Kilgoris, Narok County'
    $content = $content -replace 'City, State 12345', 'Kenya, East Africa'
    $content = $content -replace '\(555\) 123-4567', '+254 (0) 712 345 678'
    $content = $content -replace 'info@excellenceacademy\.edu', 'info@macha.ac.ke'
    
    # Save the file
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    
    Write-Host "Updated: $($file.Name)"
}

Write-Host "`nAll files updated successfully!"
