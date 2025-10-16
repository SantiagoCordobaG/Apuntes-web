# Script para subir un documento de prueba
$uri = "http://localhost:3001/api/documents"

# Crear el formulario multipart
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

# Leer el archivo
$filePath = "test-document.txt"
$fileName = "test-document.txt"
$fileContent = [System.IO.File]::ReadAllBytes($filePath)
$fileContentBase64 = [System.Convert]::ToBase64String($fileContent)

# Crear el cuerpo del request
$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
    "Content-Type: text/plain",
    "",
    [System.Text.Encoding]::UTF8.GetString($fileContent),
    "--$boundary",
    "Content-Disposition: form-data; name=`"title`"",
    "",
    "Guía de Uso del Sistema",
    "--$boundary",
    "Content-Disposition: form-data; name=`"description`"",
    "",
    "Documento de prueba del sistema de gestión de documentos con funcionalidades completas",
    "--$boundary",
    "Content-Disposition: form-data; name=`"author`"",
    "",
    "Sistema de Pruebas",
    "--$boundary",
    "Content-Disposition: form-data; name=`"tags`"",
    "",
    "prueba,sistema,documentación,guía",
    "--$boundary--",
    ""
) -join $LF

# Enviar el request
try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $bodyLines -ContentType "multipart/form-data; boundary=$boundary"
    Write-Host "✅ Documento subido exitosamente!" -ForegroundColor Green
    Write-Host "ID del documento: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Título: $($response.data.title)" -ForegroundColor Cyan
    Write-Host "Autor: $($response.data.author)" -ForegroundColor Cyan
    Write-Host "Etiquetas: $($response.data.tags -join ', ')" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error subiendo documento:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
