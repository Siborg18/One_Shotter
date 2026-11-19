# One Shotter - tiny local web server (no installs needed, uses built-in Windows PowerShell)
# Serves this folder at http://localhost:8080 and opens your browser. Close the window to stop.
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$port = 8080
$mime = @{
  '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8';
  '.json'='application/json'; '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg';
  '.webp'='image/webp'; '.ico'='image/x-icon'; '.txt'='text/plain; charset=utf-8'; '.md'='text/plain; charset=utf-8';
  '.woff'='font/woff'; '.woff2'='font/woff2'
}

$listener = $null
for ($p = $port; $p -lt $port + 20; $p++) {
  try {
    $l = New-Object System.Net.HttpListener
    $l.Prefixes.Add("http://localhost:$p/")
    $l.Start()
    $listener = $l; $port = $p; break
  } catch { }
}
if (-not $listener) { Write-Host "Could not open a port between 8080 and 8099." -ForegroundColor Red; Read-Host "Press Enter to exit"; exit 1 }

$url = "http://localhost:$port/"
Write-Host ""
Write-Host "  One Shotter is running at $url" -ForegroundColor Cyan
Write-Host "  Close this window (or press Ctrl+C) to stop the server."
Write-Host ""
Start-Process $url

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    try {
      $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
      if ([string]::IsNullOrEmpty($rel)) { $rel = 'index.html' }
      $full = [IO.Path]::GetFullPath([IO.Path]::Combine($root, $rel))
      if ((Test-Path $full -PathType Container)) { $full = Join-Path $full 'index.html' }
      if (-not $full.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $full -PathType Leaf)) {
        $res.StatusCode = 404
        $bytes = [Text.Encoding]::UTF8.GetBytes('Not found')
      } else {
        $ext = [IO.Path]::GetExtension($full).ToLower()
        $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
        $res.Headers.Add('Cache-Control', 'no-store')
        $bytes = [IO.File]::ReadAllBytes($full)
      }
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      Write-Host ("  {0} {1} {2}" -f (Get-Date -Format 'HH:mm:ss'), $res.StatusCode, $ctx.Request.Url.AbsolutePath) -ForegroundColor DarkGray
    } catch {
      $res.StatusCode = 500
    } finally {
      $res.OutputStream.Close()
    }
  }
} finally {
  $listener.Stop()
}
